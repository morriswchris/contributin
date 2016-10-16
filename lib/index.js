// es6 runtime requirements
import "babel-polyfill";

// their code
import express from "express";
import sockets from "socket.io";
import { json } from "body-parser";
import { Server as http } from "http";
// import remail from "email-regex";
import dom from "vd";
import cors from "cors";

// our code
import GitHub from "./github";
// import invite from "./slack-invite";
// import badge from "./badge";
import splash from "./splash";
// import iframe from "./iframe";
import log from "./log";

export default function contributin ({
  token,
  interval = 5000, // jshint ignore:line
  owner,
  repo,
  css,
  coc,
  cors: useCors = false,
  path="/",
  silent = false // jshint ignore:line,
}){
  // must haves
  if (!token) {
    throw new Error("Must provide a `token`.");
  }
  if (!owner) {
    throw new Error("Must provide an `owner`.");
  }
  if (!repo) {
    throw new Error("Must provide a `repo`.");
  }

  // setup app
  let app = express();
  let srv = http(app);
  srv.app = app;

  let assets = __dirname + "/assets";

  // fetch data
  let github = new GitHub({ token, interval, owner, repo });
  // slack.setMaxListeners(Infinity);

  // capture stats
  log(github, silent);

  // middleware for waiting for slack
  app.use((req, res, next) => {
    if (github.ready) {
      return next();
    }
    github.once("ready", next);
  });

  if (useCors) {
    app.options("*", cors());
    app.use(cors());
  }

  // splash page
  app.get("/", (req, res) => {
    let repo = github.repo;
    let repo_name = repo.full_name;
    let logo = repo.owner.avatar_url;
    let stars = repo.stargazers_count;
    let forks = repo.forks;
    let owner = repo.owner.login;
    if (!repo) {
      return res.send(404);
    }
    let page = dom("html",
      dom("head",
        dom("title",
          "Join ", repo_name, " on GitHub!"
        ),
        dom("meta name=viewport content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0,user-scalable=no\""),
        dom("link rel=\"shortcut icon\" href=https://slack.global.ssl.fastly.net/272a/img/icons/favicon-32.png"),
        css && dom("link rel=stylesheet", { href: css })
      ),
      splash({ coc, path, css, repo_name, owner, logo, stars, forks })
    );
    res.type("html");
    res.send(page.toHTML());
  });

  app.get("/data", (req, res) => {
    let repo = github.repo;
    res.send(repo);
  });

  // static files
  app.use("/assets", express.static(assets));

  // invite endpoint
  app.post("/invite", json(), (req, res, next) => {

    let username = req.body.username;

    if (!username) {
      return res
      .status(400)
      .json({ msg: "No username provided" });
    }

    if (coc && "1" !== req.body.coc) {
      return res
      .status(400)
      .json({ msg: "Agreement to CoC is mandatory" });
    }
    github.authenticate();
    github.github.repos.addCollaborator({owner, repo, collabuser: username}, (err, result) => {
      if (err) {
        return res
        .status(400)
        .json({ msg: err.message });
      }

      res
      .status(200)
      .json({ msg: "WOOT. Welcome to the team!" });
    });
  });
  //
  // // iframe
  // app.get("/iframe", (req, res) => {
  //   let large = "large" in req.query;
  //   let { active, total } = slack.users;
  //   res.type("html");
  //   res.send(iframe({ path, active, total, large }).toHTML());
  // });
  //
  // app.get("/iframe/dialog", (req, res) => {
  //   let large = "large" in req.query;
  //   let { name } = slack.owner;
  //   let { active, total } = slack.users;
  //   if (!name) {
  //     return res.send(404);
  //   }
  //   let dom = splash({ coc, path, name, owner, active, total, large, iframe: true });
  //   res.type("html");
  //   res.send(dom.toHTML());
  // });
  //
  // app.get("/.well-known/acme-challenge/:id", (req, res) => {
  //   res.send(process.env.LETSENCRYPT_CHALLENGE);
  // });
  //
  // // badge js
  // app.use("/slackin.js", express.static(assets + "/badge.js"));
  //
  // // badge rendering
  // app.get("/badge.svg", (req, res) => {
  //   res.type("svg");
  //   res.set("Cache-Control", "max-age=0, no-cache");
  //   res.set("Pragma", "no-cache");
  //   res.send(badge(slack.users).toHTML());
  // });
  //
  // realtime
  sockets(srv).on("connection", socket => {
    socket.emit("data", github.users);
    let change = (key, val) => socket.emit(key, val);
    github.on("change", change);
    socket.on("disconnect", () => {
      github.removeListener("change", change);
    });
  });

  return srv;
}
