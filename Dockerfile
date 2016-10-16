FROM octohost/nodejs

ENV PORT 3000

ADD . /srv/www

WORKDIR /srv/www

RUN npm install --unsafe-perm

EXPOSE 3000

CMD ./bin/slackin --coc "$GITHUB_COC" --port $PORT $SLACK_SUBDOMAIN $SLACK_API_TOKEN
