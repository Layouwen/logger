import type { NextFunction, Request, Response } from "express";
import type { Logger } from "../Logger";

export function expressHttpLogger(logger: Logger) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body, headers, ip } = req;
    const startTime = Date.now();
    const content = {
      headers,
      query,
      body,
    };

    res.on("finish", () => {
      const time = Date.now() - startTime;
      logger.daily.info(`${time}ms`, method, url, ip, content);
    });

    next();
  };
}
