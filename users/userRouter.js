const express = require("express");

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  console.log("New User request route activated");
  console.log(req.body.name);
  Users.insert({ name: req.body.name })
    .then((newUser) => res.status(201).json(newUser))
    .catch(() =>
      res
        .status(500)
        .json({ message: "There was an error inserting the new user" })
    );
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postObj = {
    text: req.body.text,
    user_id: req.params.id,
  };
  Posts.insert(postObj)
    .then((newPost) => {
      res.status(201).json(newPost);
    })
    .catch(() => {
      res.status(500).json({ message: "Internal error." });
    });
});

router.get("/", (req, res) => {
  console.log("Success to the user route");
  res.status(200).json({ message: "Hello!" });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  console.log("Validate User ID Middleware activated");
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = user;
        next();
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "internal error." });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing request body" });
  } else {
    if (!req.body.name) {
      res.status(400).json({ message: "Missing Required field: name" });
    } else {
      next();
    }
  }
}

function validatePost(req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing post data" });
  } else {
    if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  }
}

module.exports = router;
