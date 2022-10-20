const mongoist = require("mongoist");

const db = mongoist(process.env.MONGO_URL);

db.runCommand({ ping: 1 });

db.on("connect", () => {
  console.info("Database connected");
});

db.on("error", (error) => {
  console.error("Database not connected", error);
});

module.exports = db;
