const fastify = require("fastify");
const cors = require("@fastify/cors");
const cookie = require("@fastify/cookie");
const concerts = require("./routes/concerts");
const authentication = require("./routes/authentication");

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

server.register(cors, { credentials: true, origin: "http://localhost:1234" });

server.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest",
  parseOptions: {},
});

server.register(concerts);

server.register(authentication);

module.exports = server;
