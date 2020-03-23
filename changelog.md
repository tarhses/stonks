# Changelog

## v1.2.1 (2020/03/23)

Changes in this version are mostly about code refactoring.

### Added

* Added `browserslist` field to package.json to give target hints to Babel.
* Created "src/server/states/index.js" and "src/server/states/transitions/index.js".
* Fixed cyclic dependencies in states and transitions by adding `Room.setState()`.

### Changed

* Using preact instead of react: build size reduced from 255.9 ko to 135.6 ko!
* A new coding style has been adopted, [standard.js](https://standardjs.com/), and eslint has been configured to respect it.
* CommonJS is used instead of ES6 modules in the server as node's support concerning modules is still too experimental (and unreliable).
* Renamed `Status` to `State` in the server's code.
* Turned "src/common/signals.js" into a json file.
* Scripts in package.json has been refactored.

### Removed

* Removed every remaining `console.log` from the client.
* Removed `todo.md`.

### Fixed

* Room re-creation while in lobby used to crash the server.

### Security

* Node version updated to v12.16.1.
* External libraries updated.
