import { chalk } from "./utils";
import { LoggerLevel } from "./types";

export class LevelColorMap {
  public [LoggerLevel.DEBUG] = chalk.yellow;
  public [LoggerLevel.INFO] = chalk.blue;
  public [LoggerLevel.WARN] = chalk.yellow;
  public [LoggerLevel.ERROR] = chalk.red;
}

