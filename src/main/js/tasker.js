const express = require('express'),
  bodyParser = require('body-parser');
  logger = require('../js/logger');

class Tasker {

  constructor() {
    const app = express();
    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    
    app.post('/api/process', (request, response) => {
      const { path } = request.body;

      response.json({
        success: true
      });
    });

    app.listen(process.env.PORT || 8000, () =>
      Tasker.LOG.info(`running on port ${process.env.PORT || 8000}`));
  }

}
Tasker.LOG = logger('Tasker');

module.exports = Tasker;