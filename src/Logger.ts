import type { Logger as WinstonLogger } from "winston";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { SPLAT } from "triple-beam";

export interface LoggerConfig {
  projectName?: string;
}

export class Logger {
  public error: WinstonLogger;
  public access: WinstonLogger;
  public daily: WinstonLogger;
  public debug: WinstonLogger;

  constructor(private config: LoggerConfig = {}) {
    const defaultConfig = {
      projectName: "main-app",
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
          // maxSize: '20m',
          // maxFiles: '14d',
        }),
        new transports.Console(),
      ],
    });

    this.access = createLogger({
      level: "debug",
      defaultMeta: { service: this.config.projectName },
      format: this.getBaseFormat(),
      transports: [
        new DailyRotateFile({
          level: "debug",
          dirname: "logs/access",
          filename: "access.%DATE%.log",
          datePattern: "YYYY-MM-DD",
        }),
        new transports.Console(),
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
        }),
        new transports.Console(),
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
        }),
        new transports.Console(),
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

  private getPrintfFormat() {
    return format.printf(({ level, service, timestamp, message, ...rest }) => {
      const parseMessage = (message: any) => {
        return typeof message === "object" ? JSON.stringify(message) : message;
      };

      let result = `[${timestamp}] [${service}] [${level.toUpperCase()}]: ${parseMessage(message)}`;

      const splat = rest[SPLAT];
      if (splat?.length) {
        splat.forEach((i: any) => {
          result += ` ${parseMessage(i)}`;
        });
      }

      return result;
    });
  }

  private getBaseFormat() {
    return format.combine(
      this.getTimestampFormat(),
      this.getErrorsFormat(),
      this.getPrintfFormat(),
    );
  }
}
