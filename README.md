# Logger

A logger for Node.js.

[![Version npm](https://img.shields.io/npm/v/@avanlan/logger.svg?style=flat-square)](https://www.npmjs.com/package/@avanlan/logger)
[![NPM Downloads](https://img.shields.io/npm/dw/%40avanlan%2Flogger)](https://www.npmjs.com/package/@avanlan/logger)

[![NPM](https://nodei.co/npm/@avanlan/logger.png?downloads=true&downloadRank=true)](https://nodei.co/npm/@avanlan/logger/)

## Install

```bash
pnpm i @avanlan/logger
```

## Usage

```ts
import { Logger } from '@avanlan/logger';

const logger = new Logger();

logger.access.info("access log")
logger.daily.info("daily log")
logger.error.error("error log")
logger.debug.info("debug log")

// output
// [2024-08-08 16:37:24] [main-app] [INFO]: access log
// [2024-08-08 16:37:24] [main-app] [INFO]: daily log
// [2024-08-08 16:37:24] [main-app] [ERROR]: error log
// [2024-08-08 16:37:24] [main-app] [INFO]: debug log
```

## Configuration

### Project

Specify the project name.

```ts
import { Logger } from '@avanlan/logger';

const logger = new Logger({
  projectName: "auth-service",
});

logger.daily.info("info log")

// output daily log
// [2024-08-08 16:37:24] [auth-service] [INFO]: info log
```

## Output Logger File

```
project
├── logger
│   ├── access
│   │   └── access.YYYY-MM-DD.log
│   ├── daily
│   │   └── daily.YYYY-MM-DD.log
│   ├── error
│   │   └── error.YYYY-MM-DD.log
│   └── debug.log
```

## Logger Middleware

### Koa

```ts
import { Logger, koaHttpLogger } from "@avanlan/logger";
import { bodyParser } from '@koa/bodyparser';

const logger = new Logger();

app.use(bodyparser());
app.use(koaHttpLogger(logger));

// output access log
// [2024-08-08 17:34:20] [main-app] [INFO]: 2ms GET / ::1 {"headers":{"host":"localhost:8044","user-agent":"curl/8.6.0","accept":"*/*"},"query":{},"body":{}}
```

### Express

```ts
import { Logger, expressHttpLogger } from "@avanlan/logger";
import bodyParser from 'body-parser';

const logger = new Logger();

app.use(bodyParser.json());
app.use(expressHttpLogger(logger));

// output access log
// [2024-08-08 17:47:55] [main-app] [INFO]: 0ms GET / ::1 {"headers":{"host":"localhost:5834","user-agent":"curl/8.6.0","accept":"*/*"},"query":{}}
```
