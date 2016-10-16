import dbg from "debug";
const debug = dbg("githubin");

export default function log (github, silent){
  // keep track of elapsed time
  let last;

  function out (...args){
    if (args) {
      args[0] = `${new Date()} – ${args[0]}`;
    }

    if (silent) {
      return debug(...args);
    }
    console.log(...args);
  }

  out("fetching");

  // attach events
  github.on("ready", () => out("ready"));
  github.on("retry", () => out("retrying"));

  github.on("fetch", () => {
    last = new Date();
    out("fetching");
  });

  // print out errors and warnings
  if (!silent) {
    github.on("error", (err) => {
      console.error("%s – " + err.stack, new Date());
    });

    github.on("ready", () => {
      if (!github.repo.owner.avatar_url && !silent) {
        console.warn("\u001b[92mWARN: no logo configured\u001b[39m");
      }
    });
  }
}
