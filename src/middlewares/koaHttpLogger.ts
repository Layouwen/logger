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

    await next();

    const time = Date.now() - startTime;
      logger.access.info({
        time: `${time}ms`,
        method,
        url,
        ip,
        headers,
        query,
        body: (ctx.request as any).body,
      });
  };
}
