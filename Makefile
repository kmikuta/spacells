install:
	cd wasm && cargo build --verbose
	npm ci

build:
	cd wasm && wasm-pack build --target bundler
	npm run build

test:
	npm run test:unit
	npm run test:performance
	npm run test:filesizes
	npm run test:format

publish:
	npm ci
	npm run build
	npm publish --access public

clean:
	cd wasm && cargo clean && rm -rf pkg
	npm run clean
