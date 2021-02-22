import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import bCrypt from 'bcrypt-nodejs';
import { db } from '../models';
dotenv.config();

function tokenForUser(user: any) {
  const timestamp = new Date().getTime();
  const expiration = Math.round(Date.now() / 1000 + 5 * 60 * 60);
  return jwt.encode(
    { sub: user.id, iat: timestamp, exp: expiration },
    process.env.PASSPORT_SECRET
  );
}

export const signin = (req: Request, res: Response) => {
  db.User.findOne({
    where: {
      email: req.body.email,
    },
    attributes: ['id', 'email', 'displayName', 'admin'],
  })
    .then((result: any) => {
      const user = result.dataValues;
      res.status(200).send({ token: tokenForUser(req.user.dataValues), user });
    })
    .catch((error: any) => {
      console.log(error);
    });
  // User has already had their email and password auth'd
  // We just need to give them a token
  // res.send({ token: tokenForUser(req.user.dataValues) });
};

export const register = (req: Request, res: Response) => {
  db.User.update(
    {
      admin: false,
      displayName: req.body.displayName,
    },
    {
      where: {
        id: req.user.dataValues.id,
      },
    }
  )
    .then((result: any) => {
      console.log('NEW USER ADMIN? ---->');
      console.log(req.user.dataValues);
      res.status(200).send({ newUser: result });
    })
    .catch((error: any) => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

// admin create user
export const createUser = (req: Request, res: Response) => {
  const newUser = req.body;
  // See if a user with the given email exists
  db.User.findOne({
    where: {
      email: newUser.email,
    },
  })
    .then(function (existingUser: any) {
      // If a user with email does exist, return an error
      if (existingUser) {
        return res.status(422).send({ error: 'Email is in use' });
      }
      let generateHash = function (password: string) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
      };
      let hashedPassword = generateHash(newUser.password);
      // If a user with email does NOT exist, create and save user record
      db.User.create({
        email: newUser.email,
        password: hashedPassword,
        admin: newUser.admin,
      }).then((user: any) => {
        if (!user) {
          console.log('Error creating user.');
          res.status(400).send('something went wrong');
        }

        if (user) {
          console.log('User created.');
          console.log(user);
          res.status(201).send('User created');
        }
      });
    })
    .catch((error: any) => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

export const getCurrentUser = (req: Request, res: Response) => {
  const token = req.body.token;
  const decoded = jwt.decode(token, process.env.PASSPORT_SECRET);
  db.User.findOne({
    where: {
      id: decoded.sub,
    },
    attributes: ['id', 'email', 'displayName', 'admin'],
  })
    .then((result: any) => {
      const user = result.dataValues;
      res.json({ currentUser: user });
    })
    .catch((error: any) => {
      console.log(error);
      res.json({ currentUser: '' });
    });
};

export const getAllUsers = (req: Request, res: Response) => {
  db.User.findAll({
    attributes: ['id', 'email', 'displayName', 'admin'],
  })
    .then((result: any) => {
      res.json({ allUsers: result });
    })
    .catch((error: any) => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;
  let generateHash = function (password: string) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
  };
  const data = req.body;
  let userData = {};
  // hash password if updating password
  if (data.password && data.password !== '') {
    let hashedPassword = generateHash(data.password);
    data.password = hashedPassword;
  }
  db.User.update(data, {
    where: {
      id: id,
    },
  })
    .then((updatedRows: any) => {
      console.log('user updated');
      res.status(200).send('User updated');
    })
    .catch((error: any) => {
      console.log(error);
      console.log('Error updating user');
      res.status(400).send('something went wrong');
    });
};

export const updateUserPassword = (req: Request, res: Response) => {
  let generateHash = function (password: string) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
  };
  const data = req.body.data;
  let userData: any = {};
  // hash password if updating password
  if (data.password && data.password !== '') {
    let hashedPassword = generateHash(data.password);
    userData.password = hashedPassword;
  }
  if (data.admin !== '') {
    console.log('update admin');
    userData.admin = data.admin;
  }
  db.User.findOne({
    where: {
      // id: decoded.sub
      id: req.body.data.id,
    },
  })
    .then((user: any) => {
      if (user) {
        user
          .update(userData)
          .then((result: any) => {
            console.log('user updated');
            console.log(result);
            res.status(200).send('User updated');
          })
          .catch((error: any) => {
            console.log(error);
            console.log('error updating user');
            res.status(400).send('something went wrong');
          });
      }
    })
    .catch((error: any) => {
      res.status(400).send('something went wrong');
    });
};

export const deleteUser = (req: Request, res: Response) => {
  const user = req.body;
  db.User.destroy({
    where: {
      id: user.id,
    },
  })
    .then((result: any) => {
      console.log('User deleted');
      console.log(result);
      res.status(200).send('User has been deleted');
    })
    .catch((error: any) => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};
