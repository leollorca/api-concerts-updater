const mongoist = require("mongoist");
const db = require("../services/db");
const authentication = require("../services/authentication");

module.exports = function (server, options, done) {
  server.get("/", (request, reply) => {
    reply.send("Welcome to the Concerts Updater's API !");
  });

  server.post(
    "/concerts",
    { preHandler: [authentication.verifySession] },
    async (request, reply) => {
      const concert = request.body;
      concert.date = new Date(concert.date);
      try {
        await db.concerts.insert(concert);
      } catch (error) {
        reply.code(500).send();
      }
    }
  );

  server.get("/concerts", async (request, reply) => {
    const limitDate = new Date();
    limitDate.setUTCHours(0, 0, 0, 0);
    try {
      const concerts = await db.concerts.find({ date: { $gte: limitDate } });
      reply.code(200).send(concerts);
    } catch (error) {
      reply.code(500).send();
    }
  });

  server.put(
    "/concerts/:id",
    { preHandler: [authentication.verifySession] },
    async (request, reply) => {
      const concertId = request.params.id;
      const concert = request.body;
      try {
        await db.concerts.update(
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
        );
      } catch (error) {
        reply.code(500).send();
      }
    }
  );

  server.delete(
    "/concerts/:id",
    { preHandler: [authentication.verifySession] },
    async (request, reply) => {
      const concertId = request.params.id;
      try {
        await db.concerts.remove({ _id: mongoist.ObjectId(concertId) });
      } catch (error) {
        reply.code(500).send();
      }
    }
  );

  done();
};
