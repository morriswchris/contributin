FROM octohost/nodejs

ENV PORT 3000

ADD . /srv/www

WORKDIR /srv/www

RUN npm install --unsafe-perm

EXPOSE 3000

CMD ./bin/contributin --coc "$GITHUB_COC" --port $PORT $REPO_NAME $GITHUB_API_TOKEN
