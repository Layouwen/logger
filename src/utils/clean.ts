import path from "path";
import fs from "fs";

function cleanLog(maxFiles: number | string, maxSize: number) {
  const logsDir = path.join(process.cwd(), "logs");
  const logDirs = ["access", "daily", "error"];
  const datePattern = /\d{4}-\d{2}-\d{2}/;

  const debugLogPath = path.join(logsDir, "debug.log");
  if (fs.existsSync(debugLogPath)) {
    const stats = fs.statSync(debugLogPath);
    if (stats.size > maxSize) {
      fs.unlinkSync(debugLogPath);
    }
  }

  for (const dir of logDirs) {
    const dirPath = path.join(logsDir, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath)
      .filter(file => datePattern.test(file))
      .map(file => ({
        name: file,
        path: path.join(dirPath, file),
        date: new Date(datePattern.exec(file)![0])
      }));

    files.sort((a, b) => b.date.getTime() - a.date.getTime());

    if (typeof maxFiles === 'string') {
      const match = maxFiles.match(/^(\d+)d$/);
      if (!match) {
        console.error('Invalid maxFiles format. Should be like "7d"');
      } else {
        const days = parseInt(match[1]);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filesToDelete = files.filter(file => file.date < cutoffDate);
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
        }
      }
    } else if (typeof maxFiles === 'number') {
      const filesToDelete = files.slice(maxFiles);
      for (const file of filesToDelete) {
        fs.unlinkSync(file.path);
      }
    } else {
      console.error('maxFiles must be a number or a string with format like "7d"');
    }

    for (const file of files) {
      const stats = fs.statSync(file.path);
      if (stats.size > maxSize) {
        fs.unlinkSync(file.path);
      }
    }
  }

  console.info("[Logger] clean log success");
}


const INTERVAL = 1000 * 60 * 60 * 24;

export function cleanLogExec(maxFiles: number | string, maxSize: number) {
  cleanLog(maxFiles, maxSize);

  setInterval(() => {
    cleanLog(maxFiles, maxSize);
  }, INTERVAL);
}
