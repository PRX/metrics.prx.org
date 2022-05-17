# metrics.prx.org
PRX Metrics Frontend App

This app is used to view podcast metrics.

## Local Development

See [CONTRIBUTING](/PRX/metrics.prx.org/blob/master/CONTRIBUTING.md) for information on installing and configuring this project's dependencies, such as [ID](https://github.com/PRX/id.prx.org/) and [CMS](https://github.com/PRX/cms.prx.org/).

Once you have satisfied those dependencies and your `.env` file is configured to match, the following will help you get Metrics running. This assumes your development environment follows the standard PRX guidelines (asdf, puma-dev, etc).

``` sh
# First run only
make dev-init

# Start dev server
make dev-start
open https://metrics.prx.test

# run tests in Chrome
yarn test
```
