# Contributing
Public GitHub contributing made easy

## Mission
After trying out the Open Sourcing workflow provided by GitHub, I found it to be very one sided. While an individual might have an excellent
improvement to make to an existing repository, it is at the initial creator(s) (or current maintainer(s)) discretion as to whether or not that
change will make it to the repo. Open Source should be driven by the community, and as such Contributin allows anyone to be added as a collaborator
to a repository, given them the ability to merge.

## What you get
* A landing page you can point users to fill in their
  GitHub username and receive an invite through the [GitHub Api](https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator) (`https://contribute.yourdomain.com`)
* A SVG badge that works well from static mediums
  (like GitHub README pages) [https://contribute.yourdomain.com/badge.svg]

## Setup

### Deploy to Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/morriswchris/contributin/tree/master)

### Deploy yourself

```
$ npm install -g contributin
$ REPO_NAME="<repo_owner>/<repo_name>" GITHUB_API_TOKEN=<github token> contributin
```

## Contributing

Join the repo at: [![Contributin](https://contributin.herokuapp.com/button.svg)](https://contributin.herokuapp.com/)

### Running Locally
Once you've cloned the repo, you can run contributin locally through
```
$ gulp
$ REPO_NAME="<repo_owner>/<repo_name>" GITHUB_API_TOKEN=<github token> bin/contributin
```

## Credits

- [@rauchg](https://github.com/rauchg) for the idea to use a heroku deployable service to grant access using a single click. Checkout [slackin](https://github.com/rauchg/slackin) for more information.

## License

MIT
