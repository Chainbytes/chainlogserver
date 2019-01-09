'use strict'
import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser';
import {logger, expressLogger} from './helper/logging.js'
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')),
    router = express.Router(),
    app = express(),
    PORT = process.env.port || 3667,
    routes = require('./routes/log.route.js').default(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(PORT, err => {
    if (err) {
        throw err;
    } else {
        //logger.debug("Test")
        logger.info(`
      Server running on port: ${PORT}
      Version: + ${pkg.version}
      ---
    `)
    }
});
app.use('/api', router);
app.use(expressLogger);