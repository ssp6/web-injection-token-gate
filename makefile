.PHONY: install
install:
	cd packages/site-injection-app && yarn && cd ../api && yarn && cd ../notion-nextjs && yarn

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

.PHONY: notion_dev
notion_dev:
	cd packages/notion-nextjs && yarn dev

.PHONY: test
test:
	cd packages/api && yarn tsc && yarn test && cd ../site-injection-app && yarn tsc
