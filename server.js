require("dotenv").config();

const express = require("express");

const userRoutes = require("./users/userRouter");
const postRoutes = require("./posts/postRouter");

const server = express();

const port = process.env.PORT;

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

server.use(logger);
server.use("/api/users", userRoutes);
server.use("/api/posts", postRoutes);

server.listen(port, () => console.log(`Blog API running on port ${port}.`));

module.exports = server;
