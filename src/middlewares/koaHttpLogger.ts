import type { Logger } from "../Logger";
import type { Context, Next } from "koa";

export interface KoaHttpLoggerConfig {}

export function koaHttpLogger(
  logger: Logger,
  config: KoaHttpLoggerConfig = {},
) {
  return async function (ctx: Context, next: Next) {
    const { method, url, query, headers, ip } = ctx;

    const startTime = Date.now();
    const content = {
      headers,
      query,
      body: (ctx.request as any).body,
    };

    await next();

    const time = Date.now() - startTime;
    logger.access.info(`${time}ms`, method, url, ip, content);
  };
}
