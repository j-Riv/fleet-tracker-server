import express, { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
import dotenv from 'dotenv';
dotenv.config();
// controller
import * as User from '../controllers/user';
// auth dependencies
import '../services/passport';
const passport = require('passport');
const requireAuth = passport.authenticate('jwt-login', { session: false });
const requireSignin = passport.authenticate('local-login', { session: false });
const requireSignup = passport.authenticate('local-signup', { session: false });
const googleAuth = passport.authenticate('google', {
  session: true,
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
  ],
  accessType: 'offline',
  approvalPrompt: 'force',
});

export default (app: express.Application) => {
  // app.get('/', (req: Request, res: Response) => {
  //     res.send('Hello, friend...');
  // });
  app.post('/api/signin', requireSignin, User.signin);
  app.post('/api/register', requireSignup, User.register);
  app.post('/api/user', requireAuth, User.getCurrentUser);

  app.post('/api/user/create', requireAuth, User.createUser);

  app.get('/api/users/all', requireAuth, User.getAllUsers);
  app.post('/api/user/update/:id', requireAuth, User.updateUser);
  app.post('/api/user/update-password', requireAuth, User.updateUserPassword);
  app.post('/api/user/delete', requireAuth, User.deleteUser);

  // google
  app.get('/auth/google', googleAuth);

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req: Request, res: Response) {
      res.redirect('/user/dashboard');
    }
  );

  app.get('/user/dashboard', authCheck, function (req: Request, res: Response) {
    res.json(req.user);
  });

  app.get('/user/calendar', authCheck, function (req: Request, res: Response) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });
    google.options({ auth: oauth2Client });
    const calendar = google.calendar({ version: 'v3' });
    calendar.events.list(
      {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      },
      (error: any, result: any) => {
        if (error) return console.log('The API returned an error: ' + error);
        const eventsResult = result.data.items;
        if (eventsResult.length) {
          console.log('Upcoming 10 events:');
          let events = 'Upcoming 10 events: ';
          eventsResult.map((event: any, i: any) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
            events = events + `${start} - ${event.summary}, `;
          });
          res.send(events);
        } else {
          console.log('No upcoming events found.');
          res.send('No Upcoming events found.');
        }
      }
    );
  });
};

function authCheck(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/auth/google');
  } else {
    // if logged in
    next();
  }
}

function getOAuthClient() {
  return new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/auth/google/callback'
  );
}
