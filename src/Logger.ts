import type { Logger as WinstonLogger } from "winston";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { SPLAT } from "triple-beam";
import { chalk } from "./utils";
import { LevelColorMap } from "./LevelColorMap";
import { LoggerLevel } from "./types";

type stringOrNumber = string | number;

interface DailyRotateFileConfig {
  maxSize?: stringOrNumber;
  maxFiles?: stringOrNumber;
}

interface TransportsFileConfig {
  maxsize?: number;
  maxFiles?: number;
}

function isHttpLogger(params: any): params is {
  time: string;
  method: string;
  url: string;
  ip: string;
  headers: any;
  query: any;
  body: any;
} {
  if (typeof params !== "object" || params === null) {
    return false;
  }
  const keys = ["time", "method", "url", "ip", "headers", "query", "body"];
  return keys.every((key) => key in params);
}

function safeStringify(value: any) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return value;
  }
}

export interface LoggerConfig {
  projectName?: string;
  dailyRotateFile?: DailyRotateFileConfig;
  transportsFile?: TransportsFileConfig;
}

export class Logger {
  public error: WinstonLogger;
  public access: WinstonLogger;
  public daily: WinstonLogger;
  public debug: WinstonLogger;

  constructor(private config: LoggerConfig = {}) {
    const defaultConfig: LoggerConfig = {
      projectName: "main-app",
      dailyRotateFile: {},
      transportsFile: {},
    };

    this.config = Object.assign(defaultConfig, config);

    this.error = createLogger({
      level: "debug",
      defaultMeta: { service: this.config.projectName },
      format: this.getBaseFormat(),
      transports: [
        new DailyRotateFile({
          level: "debug",
          dirname: "logs/error",
          filename: "error.%DATE%.log",
          datePattern: "YYYY-MM-DD",
          ...this.config.dailyRotateFile,
        }),
      ],
    });

    this.access = createLogger({
      level: "debug",
      defaultMeta: { service: this.config.projectName },
      format: this.getBaseFormat({ type: "access" }),
      transports: [
        new DailyRotateFile({
          level: "debug",
          dirname: "logs/access",
          filename: "access.%DATE%.log",
          datePattern: "YYYY-MM-DD",
          ...this.config.dailyRotateFile,
        }),
      ],
    });

    this.daily = createLogger({
      level: "debug",
      defaultMeta: { service: this.config.projectName },
      format: this.getBaseFormat(),
      transports: [
        new DailyRotateFile({
          level: "debug",
          dirname: "logs/daily",
          filename: "daily.%DATE%.log",
          datePattern: "YYYY-MM-DD",
          ...this.config.dailyRotateFile,
        }),
      ],
    });

    this.debug = createLogger({
      level: "debug",
      defaultMeta: { service: this.config.projectName },
      format: this.getBaseFormat(),
      transports: [
        new transports.File({
          level: "debug",
          dirname: "logs",
          filename: "debug.log",
          ...this.config.transportsFile,
        }),
      ],
    });
  }

  private getTimestampFormat() {
    return format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    });
  }

  private getErrorsFormat() {
    return format.errors({ stack: true });
  }

  private getPrintfFormat(options?: { type: "access" }) {
    return format.printf(({ level, service, timestamp, message, ..._rest }) => {
      const rest = [message];
      if (_rest && _rest[SPLAT]) {
        (_rest[SPLAT] as any[]).forEach((i: any) => {
          rest.push(i);
        });
      }
      function parseMessage(message: any) {
        if (message instanceof Error) {
          return `${message.name} ${message.message} ${message.stack}`;
        }
        return typeof message === "object" ? safeStringify(message) : message;
      }

      function genResult(_options?: { color: boolean }) {
        const headerArr = [timestamp, service, level.toUpperCase()] as string[];
        const headerColorMap = [chalk.gray, chalk.green, new LevelColorMap()];
        const header = headerArr
          .map((i, index) => {
            if (_options?.color) {
              if (headerColorMap[index] instanceof LevelColorMap) {
                const level = headerArr[index] as LoggerLevel;
                return headerColorMap[index][level](`[${i}]`);
              }
              return headerColorMap[index](`[${i}]`);
            }
            return `[${i}]`;
          })
          .join(" ");

        let result = `${header}:`;
        if (options?.type === "access" && rest[0] && isHttpLogger(rest[0])) {
          const { time, method, url, ip, headers, query, body } = rest[0];
          if (_options?.color) {
            result += ` ${chalk.green(`${time}`)} ${chalk.cyan(method)} ${chalk.blue(url)} ${chalk.yellow(ip)} ${chalk.magenta('headers:')} ${chalk.gray(safeStringify(headers))} ${chalk.magenta('query:')} ${chalk.gray(safeStringify(query))} ${chalk.magenta('body:')} ${chalk.gray(safeStringify(body))}`;
          } else {
            result += ` ${time} ${method} ${url} ${ip} headers: ${safeStringify(headers)} query: ${safeStringify(query)} body: ${safeStringify(body)}`;
          }
        } else {
          if (rest?.length) {
            rest.forEach((i: any) => {
              result += ` ${parseMessage(i)}`;
            });
          }
        }

        return result;
      }

      console.log(genResult({ color: true }));

      return genResult();
    });
  }

  private getBaseFormat(options?: { type: "access" }) {
    return format.combine(
      this.getTimestampFormat(),
      this.getErrorsFormat(),
      this.getPrintfFormat(options)
    );
  }
}
