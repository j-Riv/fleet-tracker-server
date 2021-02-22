import dotenv from 'dotenv';
import passport from 'passport';
import { db } from '../models';
// const JwtStrategy = require('passport-jwt').Strategy;
import { Strategy as JwtStrategy } from 'passport-jwt';
// const ExtractJwt = require('passport-jwt').ExtractJwt;
import { ExtractJwt } from 'passport-jwt';
// const LocalStrategy = require('passport-local').Strategy;
import { Strategy as LocalStrategy } from 'passport-local';
import bCrypt from 'bcrypt-nodejs';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(
  localOptions,
  function (email, password, done) {
    // Verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false
    const isValidPassword = function (userpass, password) {
      return bCrypt.compareSync(password, userpass);
    };
    db.User.findOne({
      where: {
        email: email,
      },
    })
      .then(function (user) {
        if (!user) {
          return done(null, false);
        }

        // compare passwords - is `password` equal to user.password?
        if (!isValidPassword(user.password, password)) {
          return done(null, false);
        }

        return done(null, user);
      })
      .catch(function (error) {
        return done(error);
      });
  }
);

const localSignup = new LocalStrategy(
  localOptions,
  function (email, password, done) {
    // Verify this email doesnt exist
    // if it does not create the user and call done with the user
    // otherwise, call done with false
    let generateHash = function (password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    };

    if (!email || !password) {
      // return res.status(422).send({ error: 'You must provide email and password' });
      return done(null, false, {
        message: 'You must provide email and password',
      });
    }
    // See if a user with the given email exists
    db.User.findOne({
      where: {
        email: email,
      },
    })
      .then(function (existingUser) {
        // If a user with email does exist, return an error
        if (existingUser) {
          // return res.status(422).send({ error: 'Email is in use' });
          return done(null, false, { message: 'Email is in use' });
        }
        // If a user with email does NOT exist, create and save user record
        let hashedPassword = generateHash(password);
        db.User.create({
          email: email,
          password: hashedPassword,
        }).then(function (user) {
          if (!user) {
            return done(null, false);
          }

          if (user) {
            return done(null, user);
          }
        });
      })
      .catch(function (error) {
        return done(null, false);
      });
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.PASSPORT_SECRET,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  db.User.findOne({
    where: {
      id: payload.sub,
    },
  })
    .then(function (user) {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(function (error) {
      done(error, false);
    });
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
// const google = new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:3000/auth/google/callback",
//   passReqToCallback: true
// },
//   function (req, accessToken, refreshToken, params, profile, done) {
//     // console.log('REQ');
//     // console.log(req);
//     // console.log('PARAMS');
//     // console.log(params);
//     // console.log('ACCESS TOKEN');
//     // console.log(accessToken);
//     // console.log('REFRESH TOKEN');
//     // console.log(refreshToken);
//     // console.log('USER PROFILE =====>');
//     // console.log(profile);

//     // db.User.findOrCreate({ where: { googleId: profile.id } }).then(function (user) {
//     //   console.log('USER FIND OR CREATE');
//     //   console.log(user[0].dataValues);
//     //   return done(null, user[0].dataValues);
//     //   // return done(null, { profile: user[0].dataValues, token: accessToken });
//     // });

//     // See if a user with the given email exists
//     db.User.findOne({
//       where: {
//         googleId: profile.id
//       }
//     }).then(function (existingUser) {
//       // If a user with googleId does exist, return an error
//       if (existingUser) {
//         console.log('Found User!');
//         existingUser.update({
//           accessToken: accessToken,
//           refreshToken: refreshToken
//         }).then(function (result){
//           console.log('Updated User');
//           console.log(result)
//           return done(null, result);
//         });
//       }else{
//         console.log('Did not find User lets create them');
//         // If a user with that googleID does NOT exist, create and save user record
//         db.User.create({
//           googleId: profile.id,
//           displayName: profile.displayName,
//           accessToken: accessToken,
//           refreshToken: refreshToken
//         }).then(function (user, created) {
//           if (!user) {
//             return done(null, false);
//           }

//           if (user) {
//             console.log('Created User!');
//             console.log(user);
//             return done(null, user);
//           }
//         });
//       }
//     }).catch(function (error) {
//       return done(null, false);
//     });
//   }
// );

// this one is working

const google = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  function (accessToken, refreshToken, profile, cb) {
    // console.log('REQ');
    // console.log(req);
    // console.log('PARAMS');
    // console.log(params);
    console.log('ACCESS TOKEN');
    console.log(accessToken);
    console.log('REFRESH TOKEN');
    console.log(refreshToken);
    // console.log('USER PROFILE =====>');
    // console.log(profile);

    // db.User.findOrCreate({ where: { googleId: profile.id } }).then(function (user) {
    //   console.log('USER FIND OR CREATE');
    //   console.log(user[0].dataValues);
    //   return done(null, user[0].dataValues);
    //   // return done(null, { profile: user[0].dataValues, token: accessToken });
    // });

    // See if a user with the given email exists
    db.User.findOne({
      where: {
        googleId: profile.id,
      },
    })
      .then(function (existingUser) {
        // If a user with googleId does exist, return an error
        if (existingUser) {
          console.log('Found User!');
          existingUser
            .update({
              accessToken: accessToken,
              refreshToken: refreshToken,
            })
            .then(function (result) {
              console.log('Updated User');
              console.log(result);
              return cb(null, result);
            });
        } else {
          console.log('Did not find User lets create them');
          // If a user with that googleID does NOT exist, create and save user record
          db.User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            accessToken: accessToken,
            refreshToken: refreshToken,
          }).then(function (user) {
            if (!user) {
              return cb(null, false);
            }

            if (user) {
              console.log('Created User!');
              console.log(user);
              return cb(null, user);
            }
          });
        }
      })
      .catch(function (error) {
        return cb(null, false);
      });
  }
);

// serialize
passport.serializeUser(function (user: any, done) {
  console.log('SERIALIZED USER');
  console.log(user.id);
  done(null, user.id);
});
// deserialize user
passport.deserializeUser(function (id: string, done) {
  console.log('DESERIALIZED USER');
  console.log('id: ' + id);
  db.User.findOne({
    where: {
      id: id,
    },
  }).then(function (user: any) {
    console.log(user);
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

// Tell passport to use this strategy
passport.use('jwt-login', jwtLogin);
passport.use('local-login', localLogin);
passport.use('local-signup', localSignup);
passport.use('google', google);
