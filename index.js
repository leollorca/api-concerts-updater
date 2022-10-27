const server = require("./server");

function start() {
  server
    .listen(process.env.PORT, "0.0.0.0")
    .then(() => {
      console.info("Server is running");
    })
    .catch((error) => {
      console.error("Server is not running", error);
    });
}

start();
