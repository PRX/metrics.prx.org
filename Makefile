run:
	npm run serve

build:
	npm run build

test:
	npm run testonce

clean:
	rm -rf node_modules

install:
	yarn install

all: clean install build

lint:
	npm run lint

check: lint test

dev-init:
	asdf install
	npm install -g npm@latest
	npm install -g yarn@latest
	yarn install
	echo 4202 > ~/.puma-dev/metrics.prx

dev-start:
	yarn start

.PHONY: run build test clean install all check lint dev-init dev-start
