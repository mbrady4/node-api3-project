const express = require("express");

const Posts = require("./postDb");

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  Posts.get()
    .then((allPosts) => res.status(200).json(allPosts))
    .catch(() => res.status(500).json({ message: "Failed to retrieve posts" }));
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.post.id)
    .then((num) =>
      res
        .status(201)
        .json({ message: `${num} user deleted (id: ${req.post.id}).` })
    )
    .catch(() =>
      res.status.json({ error: "There was an error deleting the user." })
    );
});

router.put("/:id", validatePostId, (req, res) => {
  const postObj = { text: req.body.text };
  Posts.update(req.params.id, postObj)
    .then((count) => {
      if (count === 1) {
        Posts.getById(req.params.id)
          .then((post) => res.status(201).json(post))
          .catch(() =>
            res.status(400).json({ message: "error fetching updated post" })
          );
      } else {
        res.status(400).json({ message: "Did not find post to update" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to modify the user" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  console.log("Validate Post ID Middleware");
  Posts.getById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(400).json({ message: "invalid post id" });
      } else {
        req.post = post;
        next();
      }
    })
    .catch(() => res.status(500).json({ message: "internal error." }));
}

module.exports = router;
