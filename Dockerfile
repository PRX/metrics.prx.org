FROM mhart/alpine-node:10.15.3

MAINTAINER PRX <sysadmin@prx.org>
LABEL org.prx.app="yes"

# install git, aws-cli
RUN apk --no-cache add git ca-certificates \
    python py-pip py-setuptools groff less && \
    pip --no-cache-dir install awscli

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
