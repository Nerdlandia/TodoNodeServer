/**
 * Created by Ed on 6/1/2015.
 */
var Hapi = require('hapi');
var groups = require('./groups');
var tasks = require('./tasks');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000,
	  routes: {
    cors: {
      origin: ['*']
    }
  }
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {
        reply('hello world');
    }
});

groups.setRoutes(server);
tasks.setRoutes(server);

// Start the server
server.start();