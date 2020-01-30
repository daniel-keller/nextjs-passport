require('dotenv').config();
const express = require('express');
const http = require('http');
const next = require('next');
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const uid = require('uid-safe');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  dir: './src'
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 2 - Session setup
  const sessionConfig = {
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000 // 24 hours in milliseconds
    },
    resave: false,
    saveUninitialized: true
  };
  server.use(session(sessionConfig));

  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json());

  // 3 - configuring Passport LocalStrategy
  passport.use(
    new LocalStrategy(
      (username, password, done) => {
        return done(null, username);
      }
    )
  );

  // 4 - configuring Passport
  passport.serializeUser((user, done) => (done(null, user)));
  passport.deserializeUser((user, done) => (done(null, user)));

  // 5 - adding Passport and authentication routes
  server.use(passport.initialize());
  server.use(passport.session());

  // method to check passport authentication
  const isAuthenticated = (req, res, next) => {
    console.log(req.url, ': ', req.user);
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  }

  // restricted page routes
  server.use('/profile', isAuthenticated);

  // API routes
  server.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/profile');
  });

  server.get("/api/thoughts", (req, res) => {
    res.send([
      { _id: 456, message: "I'm watching Netflix.", author: "unknown" }
    ]);
  });

  server.get("/api/protected/thoughts", isAuthenticated, (req, res) => {
    res.send([
      { _id: 123, message: "I love pepperoni pizza!", author: "unknown" },
    ]);
  });

  // all other page routes
  server.get('*', handle);

  http.createServer(server).listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
});
