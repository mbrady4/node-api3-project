const express = require("express");

const userRoutes = require("./users/userRouter");

const server = express();

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

server.use(logger);
server.use('/api/users', userRoutes);

server.listen(8000, () => console.log("Blog API running on port 8000."));

module.exports = server;
