
module.exports = function (cls) {

  const logger = {};
  ['debug', 'log', 'info', 'warn', 'error'].forEach(fn => {
    logger[fn] = function (...args) {
      console[fn].apply(null, [
        `${new Date().toUTCString()}  [${fn.toUpperCase()}] ${cls} :`
      ].concat(args));
    };
  });

  return logger;
};
