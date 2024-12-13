import type { NextFunction, Request, Response } from "express";
import type { Logger } from "../Logger";

export function expressHttpLogger(logger: Logger) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body, headers, ip } = req;
    const startTime = Date.now();
    const content = {};

    res.on("finish", () => {
      const time = Date.now() - startTime;
      logger.access.info({
        time: `${time}ms`,
        method,
        url,
        ip,
        headers,
        query,
        body,
      });
    });

    next();
  };
}
