/**
 * Created by Ed on 6/1/2015.
 */
var Joi = require('joi');
var pg = require('pg');
var db = require('./database');

exports.setRoutes = function (server){
// Agent methods

    server.route({
        method: 'GET',
        path:'/tasks/hello',
        handler: function (request, reply) {
            reply('hello tasks api')
        }
    });

    server.route({
        method: 'GET',
        path:'/tasks/{id}',
        handler: function (request, reply) {

            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('SELECT * from tasks where group_id = ($1)', [request.params.id], function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        reply('error running query');
                    } else {
                        reply(result.rows);
                    }

                });
            });
        }

    });

    server.route({
        method: 'POST',
        path:'/tasks/{id}',
        handler: function (request, reply) {
            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('INSERT into tasks(name, complete, group_id) values($1, $2, $3)', [request.payload.name, request.payload.complete, request.params.id], function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        reply('error running query');
                    } else {
                        reply(result);
                    }

                });
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    complete: Joi.boolean()
                }
            }
        }

    });

    server.route({
        method: 'PUT',
        path:'/tasks/{id}',
        handler: function (request, reply) {
            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('UPDATE tasks set name = ($1), complete = ($2) where id = ($3)', [request.payload.name, request.payload.complete, request.params.id], function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        reply('error running query');
                    } else {
                        reply(result);
                    }

                });
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    complete: Joi.boolean()
                }
            }
        }

    });

    server.route({
        method: 'DELETE',
        path:'/tasks/{id}',
        handler: function (request, reply) {
            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('DELETE from tasks where id = ($1)', [request.params.id], function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        reply('error running query');
                    } else {
                        reply(result);
                    }

                });
            });
        }

    });
};