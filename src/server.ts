import dotenv from 'dotenv';
// import 'babel-polyfill';
import express, { Request, Response } from 'express';
import Session from 'express-session';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import rfs from 'rotating-file-stream';
import passport from 'passport';

// routes
// import auth from './routes/oauth';
import user from './routes/user';
import vehicles from './routes/vehicle';

import models from './models';

const PORT = process.env.PORT || 3000;
const app = express();
app.set('trust proxy', true);
dotenv.config();

app.use(
  Session({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    // saveUninitalized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define middleware here
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  express.json({
    limit: '50mb',
    // extended: true,
    verify: function (req: Request, res: Response, buf: Buffer, encoding: any) {
      if (req.url.startsWith('/api/')) {
        if (buf && buf.length) {
          req.rawBody = buf.toString(encoding || 'utf8');
        }
      }
    },
  })
);
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../vehicle-tracker/dist/')));
}
app.use('/public', express.static(path.join(__dirname, '../public')));
// App Setup
// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname + '/../', 'logs'),
});
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());

// Define API routes here
user(app);
vehicles(app);
// Send every other request to the Vue app
// Define any API routes before this runs
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../vehicle-tracker/dist/index.html'));
});

const syncOptions = { force: false };
// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true;
}

models.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT
    );
  });
});
