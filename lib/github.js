import { EventEmitter } from "events";
import GitHubApi from "github";
import bluebird from "bluebird";

export default class GitHubData extends EventEmitter {

  constructor ({ token, interval, owner, repo, org: host }){
    super();
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.ready = false;
    this.github = new GitHubApi({
      // optional args
      debug: true,
      protocol: "https",
      host: "api.github.com", // should be api.github.com for GitHub
      pathPrefix: "", // for some GHEs; none for GitHub
      headers: {
          "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
      },
      Promise: bluebird,
      followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
      timeout: 5000
    });
    this.authenticate();

    // do some initial API work
    this.init();
  }

  authenticate () {
    this.github.authenticate({
      type: "token",
      token: this.token,
    });
  }

  init (){
    return this.fetch();
  }

  fetch (){
    return this.github.repos.get({
      owner: this.owner,
      repo: this.repo
    }).then((repo) => {
      this.onres(null, repo);
    }).error((err) => {
      this.onres(err);
    });
  }

  onres (err, res){
    if (err) {
      this.emit("error", err);
      console.log("fetch error", err);
    }
    // console.log(res);
    this.repo = res;
    if (!this.ready) {
      this.ready = true;
      this.emit("ready");
    }
  }
}
