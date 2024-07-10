const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'requestLogs.txt');

// const logRequests = (req, res, next) => {
//   const logEntry = `${new Date().toISOString()} - ${req.method} - ${req.originalUrl}\n`;

//   fs.appendFile(logFilePath, logEntry, (err) => {
//     if (err) {
//       console.error('Error logging request:', err);
//     }
//   });

//   next();
// };
const logRequests = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} - ${req.originalUrl}\n`;
  
    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error reading log file:', err);
        next();
        return;
      }
  
      let logEntries = data ? data.split('\n').filter(line => !line.startsWith('Total Requests:') && line.trim() !== '') : [];
      const logCount = logEntries.length;
  
      logEntries.push(logEntry.trim());
  
      fs.writeFile(logFilePath, logEntries.join('\n') + `\nTotal Requests: ${logCount + 1}\n`, (err) => {
        if (err) {
          console.error('Error logging request:', err);
        }
      });
  
      next();
    });
  };

module.exports = logRequests;