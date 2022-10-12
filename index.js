const fastify = require("fastify");
const cors = require("@fastify/cors");
const cookie = require("@fastify/cookie");
const mongoist = require("mongoist");
const db = require("./services/db");
const authentication = require("./services/authentication");

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
server.register(cors);
server.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest",
  parseOptions: {},
});

function start() {
  server
    .listen(8070)
    .then(function () {
      console.log("Server is running");
    })
    .catch(function (err) {
      console.log("Server is not running", err);
    });
}
start();

server.get("/", (request, reply) => {
  reply.send("Welcome on Alain Llorca's concerts API !");
});

server.post("/concerts", (request, reply) => {
  const concert = request.body;
  concert.date = new Date(concert.date);
  db.concerts
    .insert(concert)
    .then(() => {
      reply.code(201).send();
    })
    .catch((error) => {
      console.log(error);
      reply.code(500).send();
    });
});

server.get("/concerts", (request, reply) => {
  const limitDate = new Date();
  limitDate.setUTCHours(0, 0, 0, 0);
  db.concerts
    .find({ date: { $gte: limitDate } })
    .then((res) => {
      reply.send(res);
    })
    .catch(() => {
      reply.code(500).send();
    });
});

server.put("/concerts/:id", (request, reply) => {
  const concertId = request.params.id;
  const concert = request.body;
  db.concerts
    .update(
      { _id: mongoist.ObjectId(concertId) },
      {
        $set: {
          date: new Date(concert.date),
          city: concert.city,
          depNum: concert.depNum,
          place: concert.place,
          ticketsLink: concert.ticketsLink,
        },
      }
    )
    .then(() => {
      reply.code(204).send();
    })
    .catch((error) => {
      console.log(error);
      reply.code(500).send();
    });
});

server.delete("/concerts/:id", (request, reply) => {
  const concertId = request.params.id;
  db.concerts
    .remove({ _id: mongoist.ObjectId(concertId) })
    .then(() => {
      reply.code(204).send();
    })
    .catch((error) => {
      console.log(error);
      reply.code(500).send();
    });
});

server.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  console.log(email, password);
  const areCredentialsValid = authentication.checkCredentials(email, password);
  if (!areCredentialsValid) {
    return reply.code(400).send();
  }
  const sessionId = await authentication.createSession();
  authentication.setCookie(reply, sessionId);
  reply.code(204).send();
});
