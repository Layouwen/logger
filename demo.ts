import { Logger } from "./src";

const logger = new Logger();

logger.access.info('access log');
logger.daily.info("daily log");
logger.error.error("error log", new Error());
logger.debug.info("debug log", { a: 1 });
logger.access.info({
  time: '32m',
  method: "GET",
  url: "/",
  ip: "127.0.0.1",
  body: "hello",
  headers: {
    "content-type": "application/json",
  },
  query: {
    a: 1,
  },
});

