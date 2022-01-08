.PHONY: app_build
build_watch:
	cd packages/site-injection-app && yarn build:watch

.PHONY: app_build_prod
build_watch:
	cd packages/site-injection-app && yarn build:prod

.PHONY: api_start
api_start:
	cd packages/api && yarn start
