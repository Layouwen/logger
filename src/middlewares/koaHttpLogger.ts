import type { Logger } from "../Logger";
import type { Context, Next } from "koa";

export function koaHttpLogger(logger: Logger) {
  return async function (ctx: Context, next: Next) {
    const { method, url, query, body, headers, ip } = ctx;
    const startTime = Date.now();
    const content = {
      headers,
      query,
      body,
    };

    await next();

    const time = Date.now() - startTime;
    logger.daily.info(`${time}ms`, method, url, ip, content);
  };
}
