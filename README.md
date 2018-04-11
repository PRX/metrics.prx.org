# metrics.prx.org
PRX Metrics Frontend App

This app is used to view podcast metrics.

# Install

## API and Backend Dependencies

### Use defaults
To set-up environment custom values, start with these defaults in your `.env` file:
``` sh
cp env-example .env
vim .env
```
Metrics will connect to id-staging.prx.org, cms-staging.prx.tech, and your local Castle server.

### Use local `cms`
To run cms locally, change the `CMS_HOST` in `.env` to `CMS_HOST=cms.prx.dev`.

###  Use local `id`
To run id locally, change the `AUTH_HOST` in `.env` to `AUTH_HOST=id.prx.dev`.

### AUTH_CLIENT_ID for environment
Next, you will need to create a client application set up, this is easiest to do from the ID console:
``` ruby
ssh to an instance running ID
# connect to ID's docker container
docker exec -it <container_id> /bin/ash
# start a console for ID
./bin/application console

# in the console, save a new client application
client = Client.create(
  :url => "http://metrics.prx.dev",
  :callback_url => "http://metrics.prx.dev/assets/callback.html",
  :support_url => "http://metrics.prx.dev",
  :image_url => "http://s3.amazonaws.com/production.mediajoint.prx.org/public/comatose_files/4625/prx-logo_large.png",
  :description => "metrics.prx.dev",
  :template_name => "prx_beta",
  :user_id =>8,
  :name => "metrics.prx.dev",
  :auto_grant =>true
)
client.key = SecureRandom.hex(40)[0..39]
client.secret = SecureRandom.hex(40)[0..39]
client.save

# get the client.key and set it as AUTH_CLIENT_ID
puts "Add this to .env"
puts "AUTH_CLIENT_ID=#{client.key}"
```

Enter in the client id in `.env`, setting `AUTH_CLIENT_ID` to the value from above.

## Local Install

Make sure you're running the node version in `.nvmrc`, and you're off!!

Note: you may need to install puma-dev proxy (see https://github.com/puma/puma-dev). Note that you can use the
`-install-port` option to run on a port other than 80 if you have other services using that port (eg. Apache).

``` sh
# install dependencies (https://yarnpkg.com/en/docs/install)
yarn install

echo 4202 > ~/.puma-dev/metrics.prx

# dev server
npm start
open http://metrics.prx.dev

# run tests in Chrome
npm test
```

## Docker Install

 Or if you really want to, you can develop via docker-compose.
 This guide assumes you already have docker and dinghy installed.

 ``` sh
 # build a docker image
 docker-compose build

 # make sure your AUTH_CLIENT_ID is the .docker one
 vim .env

 # run the dev server
 docker-compose up
 
 # open up a browser to view
 open http://metrics.prx.docker
