install:
	npm ci

build:
	npm run build

test:
	npm run test:unit
	npm run test:performance
	npm run test:simulation
	npm run test:filesizes
	npm run test:format

clean:
	npm run clean
