.PHONY: dev
dev:
	@npm run dev

.PHONY: build
build:
	@npm run build

.PHONY: serve
serve: build
	@npm start

.PHONY: test
test:
	@npm run test:ci

.PHONY: watch
watch:
	@npm run test

.PHONY: clean
clean:
	rm -rf .next node_modules package-lock.json

.PHONY: install
install:
	@npm i