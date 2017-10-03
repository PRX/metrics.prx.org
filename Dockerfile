FROM mhart/alpine-node:8.0.0

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"

# install git, aws-cli
RUN apk --no-cache add git ca-certificates \
    python py-pip py-setuptools groff less && \
    pip --no-cache-dir install awscli

# install PRX aws-secrets scripts
RUN git clone -o github https://github.com/PRX/aws-secrets
RUN cp ./aws-secrets/bin/* /usr/local/bin

ENV TINI_VERSION v0.9.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

ENV APP_HOME /app
ENV PHANTOM true
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
EXPOSE 4202

ENTRYPOINT [ "/tini", "--", "./bin/application" ]
CMD [ "serve" ]

ADD ./package.json ./
ADD ./yarn.lock ./
RUN apk --update add curl git && \
  curl -Ls "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C / && \
  npm install yarn --global && \
  yarn install --no-progress --silent && \
  apk del curl && \
  yarn cache clean && \
  rm -rf /usr/share/man /tmp/* /var/tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ADD . ./
RUN npm run build
