.PHONY: app_build
app_build:
	cd packages/site-injection-app && yarn build:watch

.PHONY: app_build_prod
app_build_prod:
	cd packages/site-injection-app && yarn build:prod

.PHONY: api_start
api_start:
	cd packages/api && yarn start


.PHONY: api_deploy
api_deploy:
	cd packages/api && yarn deploy
