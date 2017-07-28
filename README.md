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

Next, you will need to create a client application set up, this is easiest to do from the prx.org console:
``` ruby
# start a console for prx.org
cd prx.org
./script/console

# in the console, save a new client application
client = ClientApplication.create(
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

# get the client.key and set it as AUTH_CLIENT_ID
puts "Add this to .env"
puts "AUTH_CLIENT_ID=#{client.key}"
```

Enter in the client id in `.env`, setting `AUTH_CLIENT_ID` to the value from above.

## Local Install

Make sure you're running the node version in `.nvmrc`, and you're off!

``` sh
# install dependencies (https://yarnpkg.com/en/docs/install)
yarn install

# setup pow proxy (see http://pow.cx/)
echo 4202 > ~/.pow/metrics.prx

# dev server
npm start
open http://metrics.prx.dev

# run tests in Chrome
npm test
```
