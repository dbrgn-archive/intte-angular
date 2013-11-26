Has Gläse – Client
==================

HSR IntTe Clientprojekt.

Setup
-----

    <packagemanager> install nodejs
    cd server
    npm install

Start app
---------

    node server/server.js
    chromium http://localhost:8000/

Server
------

Endpoints:

    / GET
    /login GET POST
    /logout GET POST
    /register POST
    /users GET
    /entries GET POST
    /entries/:id GET
    /entries/:id/up POST
    /entries/:id/down POST
    /entries/:id/comment POST
    /comments/:id POST
    /comments/:id/up POST
    /comments/:id/down POST

Users:

    chrigi / foobar
    danilo / foo
    jonas / bar

Login:

    jQuery.post('/login', {name: 'chrigi', password: 'foobar'})
