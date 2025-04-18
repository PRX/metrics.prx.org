FROM node:16.16.0-alpine

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"
LABEL org.prx.spire.publish.ecr="WEB_SERVER"

# install git, aws-cli
RUN apk --no-cache add git ca-certificates \
    groff less aws-cli

ENV APP_HOME /app
ENV PORT 4202
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
EXPOSE 4202

ENTRYPOINT [ "./bin/application" ]
CMD [ "serve" ]

ADD ./package.json ./
ADD ./yarn.lock ./
RUN apk --no-cache add curl fontconfig && \
  yarn install

ADD . ./
RUN npm run build
