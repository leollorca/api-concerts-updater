const server = require("./server");

function start() {
  server
    .listen({ port: process.env.PORT })
    .then(() => {
      console.info("Server is running");
    })
    .catch((error) => {
      console.error("Server is not running", error);
    });
}

start();
