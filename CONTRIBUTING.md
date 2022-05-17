
## API and Backend Dependencies

Metrics relies on several other applications to run, such as ID, and Castle. Depending on the nature of your work, you may be able to use the deployed staging versions of those apps, or you may need to be running local copies of one or more of them.

You can define this configuration in a `.env` file (see `env-example` for available environment variables). For example:

```
CASTLE_HOST=castle.prx.test # for a local copy, or castle.staging.prx.tech for staging
AUTH_HOST=id.prx.test # for a local copy, or id.staging.prx.tech for staging
```

### GOOGLE_API_KEY

You will need to get a Google API key for your .env for use with Google Geochart.
You can add one for your development environment under the project in the Google Cloud Platform API -> Credentials.

### GOOGLE_CLIENT_ID

You will need a Google Client Id for your .env for use with Google Sheets.
You can access this client id from the project in the Google Cloud Platform API -> Credentials.


### AUTH_CLIENT_ID for environment

> **NOTE: THIS IS LIKELY TO BE INACCURATE**

You will need to create a client application set up, this is easiest to do from the ID console:

``` ruby
ssh to an instance running ID
# connect to ID's docker container
docker exec -it <container_id> /bin/ash
# start a console for ID
./bin/application console

# in the console, save a new client application
client = Client.create(
  :url => "https://metrics.prx.test",
  :callback_url => "https://metrics.prx.test/assets/callback.html",
  :support_url => "https://metrics.prx.test",
  :image_url => "http://s3.amazonaws.com/production.mediajoint.prx.org/public/comatose_files/4625/prx-logo_large.png",
  :description => "metrics.prx.dev",
  :template_name => "prx_beta",
  :user_id => 8,
  :name => "metrics.prx.test",
  :auto_grant => true
)
client.key = SecureRandom.hex(40)[0..39]
client.secret = SecureRandom.hex(40)[0..39]
client.save
```

The `client.key` value would then be used as the `AUTH_CLIENT_ID` in your `.env` file. If you are hitting staging, this client ID may already exist.
