const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
let { User } = require("../models/users");

const SECRET = "this is a secret phrase";
var token;

router.post("/addUser", (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    let userList = new User(req.body);

    bcrypt.hash(userList.password, saltRounds, (err, hash) => {
      let hashUser = new User({ ...req.body, password: hash });
      hashUser
        .save()
        .then((doc) => {
          res.send(doc);
        })
        .catch((err) => {
          res.send(err);
        });
    });
  } else {
    res.send("please fill in the body");
  }
});

router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.send("No Users Found");
      } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            token = jwt.sign(
              {
                username: req.body.username,
              },
              SECRET,
              { expiresIn: "1h" }
            );
            res.json({
              token: token,
            });
          } else {
            res.send("Incorrect password");
          }
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

const checkToken = (req, res, next) => {
  //const token = req.query.token || req.headers.token || req.cookies.token;
  //we make sure the url required for requesting a token is not protected
  if (req.url.indexOf("/tokens") !== -1) return next();
  if (!token) {
    return next("No token provided");
  }
  jwt.verify(token, SECRET, function (err, decoded) {
    if (err) {
      return next(err);
    }
    req.username = decoded.username;
    next();
  });
};

router.get("/checkToken", checkToken, (req, res) => {
  res.sendStatus(200);
});

module.exports = {
  router: router,
  checkToken: checkToken
};
