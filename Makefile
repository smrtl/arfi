.PHONY: dev
dev:
	@npx next dev

.PHONY: build
build:
	@npx next build

.PHONY: serve
serve: build
	@npx next start

.PHONY: test
test:
	@npx ava

.PHONY: watch
watch:
	@npx ava --watch tests/*$(ONLY)*.js

.PHONY: clean
clean:
	rm -rf .next node_modules package.lock.json

.PHONY: install
install:
	@npm i