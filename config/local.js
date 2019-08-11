/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

var session = require('express-session');
var MySQLSessionStore = require('express-mysql-session')(session);

var sessionOptions = {
  name: 'test',

  user: 'root',
  password: 'Gmail@123',
  database: 'Comment_System',
  host: '127.0.0.1',
  port: 3306,

  // user: 'root',
  // password: 'Gmail123',
  // database: 'Ticket_Booking',
  // host: 'database-1.coh0hs2zwmxd.us-east-2.rds.amazonaws.com',
  // port: 3306,

  secret: 'eg[isfd-8yF9-7w2315df',

  cookie: {
    httpOnly: true,
    maxAge: 2 * 365 * 24 * 60 * 60 * 1000, // 1 year
    secure: false
  },
};

module.exports = {

  datastores: {
    default: {
      user: sessionOptions.user,
      password: sessionOptions.password,
      database: sessionOptions.database,
      dialect: 'mysql',
      options: {
        dialect: 'mysql',
        host: sessionOptions.host,
        port: sessionOptions.port,
        logging: true
      }
    }
  },

  sockets: {
    onlyAllowOrigins: [
      'http://localhost:1337'
    ]
  },

  session: {
    secret: 'eg[iasdf-dferew-7w2315df',
    name: 'test',
    cookie: {
      // secure: false,
      maxAge: 2 * 365 * 24 * 60 * 60 * 1000, // 1 year
    },

  },

  http: {
    middleware: {

      /***************************************************************************
       *                                                                          *
       * The order in which middleware should be run for HTTP requests.           *
       * (This Sails app's routes are handled by the "router" middleware below.)  *
       *                                                                          *
       ***************************************************************************/

      order: [
        'cookieParser',
        'session',
        // 'passportInit',
        // 'passportSession',
        'bodyParser',
        'compress',
        'poweredBy',
        'router',
        'www',
      ],

      bodyParser: (function _configureBodyParser() {
        var skipper = require('skipper');
        var middlewareFn = skipper({
          strict: true,
          maxTimeToBuffer: 100000
        });
        // ... more Skipper options here ...
        return middlewareFn;
      })(),

      session: (function _configureSession() {
        var store = new MySQLSessionStore({
          host: sessionOptions.host,
          port: sessionOptions.port,
          user: sessionOptions.user,
          password: sessionOptions.password,
          database: sessionOptions.database,
          resave: sessionOptions.resave,
          checkExpirationInterval: sessionOptions.checkExpirationInterval
        });

        sessionOptions.store = store;

        return session(sessionOptions);
      })(),

    }
  },

  uploads: {

    /***************************************************************************
     *                                                                          *
     * Configure a production filesystem adapter:                               *
     *                                                                          *
     * 1. Choose an adapter:                                                    *
     *    https://sailsjs.com/plugins/uploads                                   *
     *                                                                          *
     * 2. Install it as a dependency of your Sails app.                         *
     *    (For example:  npm install skipper-s3 --save)                         *
     *                                                                          *
     * 3. Then pass it in, with any other config.                               *
     *    (See https://sailsjs.com/config/uploads for help.)                    *
     *                                                                          *
     ***************************************************************************/
    //--------------------------------------------------------------------------
    //  /\   To avoid checking them in to version control, you might opt to set
    //  ||   sensitive credentials like `s3Secret` using an environment variable.
    //
    //  For example:
    //  ```
    //  sails_uploads__key=AB2g1939eaGAdeAdamdaio38103onaDs
    //  ```
    //
    //  To additionally allow file uploads to be viewed by the public, add:
    //  ```
    //  headers: { 'x-amz-acl': 'public-read' }
    //  ```
    //--------------------------------------------------------------------------

  },

};
