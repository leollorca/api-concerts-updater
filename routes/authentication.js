const authentication = require("../services/authentication");

module.exports = function (server, options, done) {
  server.post("/login", async (request, reply) => {
    const { email, password } = request.body;
    const areCredentialsValid = authentication.checkCredentials(
      email,
      password
    );
    if (!areCredentialsValid) {
      return reply.code(400).send();
    }
    try {
      const sessionId = await authentication.createSession();
      authentication.setCookie(reply, sessionId);
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send();
    }
  });

  server.get("/logout", async (request, reply) => {
    try {
      await authentication.deleteSession(request);
      authentication.unsetCookie(reply);
    } catch (error) {
      reply.code(500).send();
    }
  });

  server.get(
    "/verify-session",
    { preHandler: [authentication.verifySession] },
    (request, reply) => {
      reply.code(204).send();
    }
  );

  done();
};
