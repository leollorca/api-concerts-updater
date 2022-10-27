const server = require("./server");

function start() {
  server
    .listen({ port: 8070 })
    .then(() => {
      console.info("Server is running");
    })
    .catch((error) => {
      console.error("Server is not running", error);
    });
}

start();
