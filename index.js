const server = require("./server");

function start() {
  server
    .listen({ port: 8070 || process.env.PORT })
    .then(() => {
      console.info("Server is running");
    })
    .catch((error) => {
      console.error("Server is not running", error);
    });
}

start();
