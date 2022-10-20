const db = require("../db");
const mongoist = require("mongoist");

const maxAge = 86400000; /* 1 day */
const cookieName = "session";

function checkCredentials(email, password) {
  return email === process.env.EMAIL && password === process.env.PASSWORD;
}

async function createSession() {
  const session = {
    endDate: new Date(Date.now() + maxAge),
  };
  try {
    const response = await db.sessions.insert(session);
    return response._id.toString();
  } catch (error) {
    throw error;
  }
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
  reply.cookie(cookieName, sessionId, options);
}

function getCookie(request) {
  if (!request.cookies.session) {
    return { valid: false, renew: true };
  }
  return request.unsignCookie(request.cookies.session);
}

async function checkSession(request) {
  const { valid, renew, value: sessionId } = getCookie(request);
  if (!valid || renew) {
    return false;
  }
  try {
    const session = await db.sessions.findOne({
      _id: mongoist.ObjectId(sessionId),
    });
    if (session && session.endDate > new Date()) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

async function verifySession(request, reply, done) {
  try {
    const isValidSession = await checkSession(request);
    if (!isValidSession) {
      return reply.code(401).send();
    }
    done();
  } catch {
    reply.code(500).send();
  }
}

async function deleteSession(request) {
  const { value: sessionId } = getCookie(request);
  try {
    await db.sessions.remove({ _id: mongoist.ObjectId(sessionId) });
  } catch (error) {
    throw error;
  }
}

function unsetCookie(reply) {
  reply.clearCookie(cookieName, { path: "/" });
}

module.exports = {
  checkCredentials,
  createSession,
  setCookie,
  verifySession,
  deleteSession,
  unsetCookie,
};
