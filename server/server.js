var express = require('express');
var User = require('./user.js');
var Link = require('./link.js');
var Comment = require('./comment.js');
var http = require('http');
var io = require('socket.io');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

var logger = function(req, res, next) {
    console.log(req.method + " " + req.url);
    next();
}

var app = express();
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '2234567890QWERTY'}));
app.use(logger);
app.use(app.router);


function checkAuth(req, res, next) {
    if (typeof(req.session.user_id) == "number") {
        next();
    } else {
        res.send('You are not authorized!');
    }
}

var entries = [];
var users = [];
var comments = [];

// Default entries
entries.push(new Link(0, "Namics Headbang", "jonas", "http://www.namics.ch/"));
entries.push(new Link(1, "Arduino", "chrigi", "http://www.namics.ch/"));
entries.push(new Link(2, "30th Chaos Communication Congress", "danilo", "https://events.ccc.de/congress/2013/wiki/Main_Page"));

// Default comments
var comment = new Comment(0, "Naaaaja...", "chrigi");
comments.push(comment);
entries[0].comments.push(comment);

// Default users
users.push(new User(0, "chrigi", "foobar") );
users.push(new User(1, "danilo", "foo") );
users.push(new User(2, "jonas", "bar") );

// Default votes
entries[0].rating._down(0)
entries[1].rating._up(2)
entries[1].rating._up(1)

function findUser(name)
{
    for (var i in users)
    {
       var user = users[i];
       if (user.name == name) {
           return user;
       }
    }
    return null;
}

function returnIndex(res, id, array) {
    if (array.length <= id || id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No entry found');
    }
    return res.json(array[id]);
}

app.get('/', function(req, res) {
  res.type('text/plain');
  res.json(entries);
});

// TODO this endpoint makes no sense, can we remove it?
app.get('/login', function (req, res) {
    if (typeof (req.session.user_id) == "number") {
        res.json(users[req.session.user_id].name);
        return;
    }
    res.json(null);
});

app.post('/login', function (req, res) {
    var post = req.body;
    var user = findUser(post.name);
    if (!!user && post.password == user.password)
    {
        req.session.user_id = user.id;
        res.json(true);
        return;
    }
    res.json(false);
});

app.post('/register', function(req, res) {
    var post = req.body;

    if (typeof(post.name) != "string" || typeof(post.password) != "string") {
        res.json(false);
        return;
    }

    if (findUser(post.name)) {
        res.json(false);
        return;
    }
    users.push(new User(users.length, post.name, post.password));
    res.json(true);
});

app.get('/users', function (req, res) {
    res.json(users);
});

app.get('/entries', function (req, res) {
    res.json(entries);
});

app.post('/entries', function(req, res) {
    var newLink = new Link(entries.length, req.body.title, users[req.session.user_id].name, req.body.url);
    entries.push(newLink);
    res.json(newLink);
    io.sockets.emit('message', { action: "AddLink" });
});

app.get('/entries/:id', function(req, res) {
   returnIndex(res,  req.params.id, entries);
});

app.post('/entries/:id/up', checkAuth, function (req, res) {
    res.json(entries[req.params.id].rating._up(req.session.user_id));
    io.sockets.emit('message', { action: "Rated" });
});

app.post('/entries/:id/down', checkAuth, function (req, res) {
    res.json(entries[req.params.id].rating._down(req.session.user_id));
    io.sockets.emit('message', { action: "Rated" });
});

app.post('/entries/:id/comments', checkAuth, function (req, res) {
    var newComment = new Comment(comments.length, req.body.text, users[req.session.user_id].name);
    comments.push(newComment);

    var entry = entries[req.params.id];
    entry.comments.push(newComment);
    res.json(newComment);
    io.sockets.emit('message', { action: "AddComment" });
});

app.post('/comments/:id/', checkAuth, function (req, res) {
    var newComment = new Comment(comments.length, req.body.text, users[req.session.user_id].name);
    comments.push(newComment);

    var comment = comments[req.params.id];
    comment.comments.push(newComment);
    res.json(newComment);
    io.sockets.emit('message', { action: "AddComment" });
});

app.post('/comments/:id/up', checkAuth, function (req, res) {
    res.json(comments[req.params.id].rating._up(req.session.user_id));
    io.sockets.emit('message', { action: "Rated" });
});

app.post('/comments/:id/down', checkAuth, function (req, res) {
    res.json(comments[req.params.id].rating._down(req.session.user_id));
    io.sockets.emit('message', { action: "Rated" });
});

app.post('/logout', function (req, res) {
    req.session.user_id = null;
    res.json(true);
});

app.use('/', express.static(__dirname + '/../client/'));


// Socket

io = io.listen(app.listen(process.env.PORT || 8000));

io.sockets.on('connection', function (socket) {
    io.sockets.emit('usercount', { count: io.sockets.clients().length });

    socket.on('disconnect', function () {
        setTimeout(function() {
            io.sockets.emit('usercount', { count: io.sockets.clients().length });
        }, 100); // Wait for connection to actually end
    });
});
