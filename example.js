var express = require("express");
var session = require("express-session");
var DetaBaseStore = require("./lib/connect-deta")(session);

var app = express();

app.use(
  session({
    store: new DetaBaseStore({
      detaProjectKey: "", // your deta base project id
      detaBaseName: "my_sessions", // optional table name, defaults to "session"
      prefix: "test:", // options prefix for session id
    }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 10000, // this will set the expiresAt field in Deta base
    },
  })
);

function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else next("route");
}

app.get("/", isAuthenticated, function (req, res) {
  // this is only called when there is an authentication user due to isAuthenticated
  res.send(
    "hello, " + req.session.user + "!" + ' <a href="/logout">Logout</a>'
  );
});

app.get("/", function (req, res) {
  res.send(
    '<form action="/login" method="post">' +
      'Username: <input name="user"><br>' +
      'Password: <input name="pass" type="password"><br>' +
      '<input type="submit" text="Login"></form>'
  );
});

app.post(
  "/login",
  express.urlencoded({ extended: false }),
  function (req, res) {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);

      // store user information in session, typically a user id
      req.session.user = req.body.user;

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  }
);

app.get("/logout", function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/");
    });
  });
});

app.listen(3000);
