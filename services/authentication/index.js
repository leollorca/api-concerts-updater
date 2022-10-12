const db = require("../db");

const maxAge = 86400000; /* 1 day */
const cookieName = "session";

function checkCredentials(email, password) {
  return email === process.env.EMAIL && password === process.env.PASSWORD;
}

async function createSession() {
  const session = {
    endDate: new Date(Date.now() + maxAge),
  };
  const response = await db.sessions.insert(session);
  console.log("auth service", response._id);
  return response._id.toString();
}

function setCookie(reply, sessionId) {
  const options = {
    secure: true,
    path: "/",
    expires: new Date(Date.now() + maxAge),
    signed: true,
    httpOnly: true,
    sameSite: "None",
  };
  console.log(typeof sessionId);
  reply.cookie(cookieName, sessionId, options);
}

module.exports = { checkCredentials, createSession, setCookie };
