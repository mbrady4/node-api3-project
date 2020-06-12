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
  Users.get()
    .then((allUsers) => {
      res.status(200).json(allUsers);
    })
    .catch(() => res.status(500).json({ message: "An error occurred." }));
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then((posts) => {
      console.log(posts);
      res.status(200).json(posts);
    })
    .catch(() =>
      res.status(500).json({ error: "An internal server error occured." })
    );
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.user.id)
    .then((num) => res.status(201).json({ message: `${num} user deleted` }))
    .catch(() =>
      res.status(500).json({ errror: "There was an error deleting the user." })
    );
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const userObj = {
    name: req.body.name,
  };
  Users.update(req.params.id, userObj)
    .then((count) => {
      if (count === 1) {
        Users.getById(req.params.id)
          .then((user) => res.status(201).json(user))
          .catch(() =>
            res.status(400).json({ message: "Error fetching updated user" })
          );
      } else {
        res.status(400).json({ message: "Did not find user to update" });
      }
    })
    .catch(() =>
      res.status(500).json({ message: "Unable to modify the user" })
    );
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
