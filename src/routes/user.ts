import express, { Request, Response, NextFunction } from 'express';
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
