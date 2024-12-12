import { Logger } from "./src";

const logger = new Logger();

logger.access.info("access log")
logger.daily.info("daily log")
logger.error.error("error log", new Error())
logger.debug.info("debug log", { a: 1 })