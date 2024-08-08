# Logger

A logger for Node.js.

## Install

```bash
pnpm i @avan/logger
```

## Usage

```ts
const logger = new Logger();

logger.daily.info("info log")
logger.error.error("error log")
logger.debug.info("error log")

// output
// [2024-08-08 16:37:24] [main-app] [INFO]: info log
// [2024-08-08 16:37:24] [main-app] [ERROR]: error log
// [2024-08-08 16:37:24] [main-app] [INFO]: error log
```

## Configuration

### Project

Specify the project name.

```ts
const logger = new Logger({
  project: "auth-service",
});

logger.daily.info("info log")

// output
// [2024-08-08 16:37:24] [auth-service] [INFO]: info log
```

## Output logger file

```
project
├── logger
│   ├── daily
│   │   └── daily.YYYY-MM-DD.log
│   ├── error
│   │   └── error.YYYY-MM-DD.log
│   └── debug.log
```
