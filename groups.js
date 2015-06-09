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
        path:'/groups/hello',
        handler: function (request, reply) {
            reply('hello groups api')
        }
    });

    server.route({
        method: 'GET',
        path:'/groups',
        handler: function (request, reply) {

            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('SELECT * from groups', [], function(err, result) {
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
        path:'/groups',
        handler: function (request, reply) {
            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('INSERT into groups(name) values($1)', [request.payload.name], function(err, result) {
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
                    name: Joi.string().required()
                }
            }
        }

    });

    server.route({
        method: 'DELETE',
        path:'/groups/{id}',
        handler: function (request, reply) {
            pg.connect(db.connectionString, function(err, client, done) {
                if(err) {
                    reply('error fetching client from pool');
                    return;
                }
                client.query('DELETE from groups where id = ($1)', [request.params.id], function(err, result) {
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