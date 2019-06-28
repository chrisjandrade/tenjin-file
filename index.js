const cluster = require('cluster'),
  NODE_ENV = process.NODE_ENV || 'development',
  NUM_CPUS = require('os').cpus().length,
  logger = require('./src/main/js/logger'),
  Tasker = require('./src/main/js/tasker');

class Main {

  constructor() {
    if (!NODE_ENV.match(/development/i)) {
      if (cluster.isMaster) {
        for (let i = 0; i < NUM_CPUS; i++) {
          this.spawnWorker();
        }
      } else {
        new Tasker();
      }
    } else {
      new Tasker();
    }
  }

  spawnWorker() {
    const worker = cluster.fork();

    worker.once('exit', (code, signal) => {
      if (signal) {
        Main.LOG.warn(`Server worker ${worker.id} was terminated with signal ${signal}, replacing worker`);
        this.spawnWorker();
      } else if (code !== 0) {
        Main.LOG.warn(`Server worker ${worker.id} terminated with error code ${code}, replacing worker`);
        this.spawnWorker();
      }
    });
  }

}
Main.LOG = logger('Tenjin-File');

new Main();

// const cluster = require('cluster'),
//   _ = require('lodash'),
//   App = require('./app'),
//   config = require('./config'),
//   NODE_ENV = process.env.NODE_ENV || 'development',
//   NUM_CPUS = require('os').cpus().length,
//   logger = require('./logger');

// function spawnWorker() {
//   const worker = cluster.fork();

//   worker.once('exit', function (code, signal) {
//     if (signal) {
//       logger.info(`Server worker ${worker.id} was terminated with signal ${signal}, attempting to replace worker`);
//       spawnWorker();
//     } else if (code !== 0) {
//       logger.info(`Server worker ${worker.id} terminated with error code ${code}, attempting to replace worker`);
//       spawnWorker();
//     }
//   });
// }

// if (!!NODE_ENV.match(/development/i)) {
//   config.SERVER_PORT = config.DEV_SERVER_PORT;

//   App(_.extend(config, { logger }));
//   logger.info(`Server is running in ${NODE_ENV} mode`);
// } else {
//   config.SERVER_PORT = config.PROD_SERVER_PORT;

//   if (cluster.isMaster) {
//     logger.info(`Server is running in production mode, attempting to start ${NUM_CPUS} workers`);
//     _.times(NUM_CPUS, () => spawnWorker());
//   } else {
//     App(_.extend(config, { logger }));
//     logger.info(`Server started worker ${cluster.worker.id}`);
//   }
// }