const mongoist = require("mongoist");
const db = mongoist(process.env.MONGO_URL);
db.runCommand({ ping: 1 });
db.on("connect", () => {
  console.info("Database connected");
});
db.on("error", (err) => {
  console.error("Database not connected", err);
});

module.exports = db;
