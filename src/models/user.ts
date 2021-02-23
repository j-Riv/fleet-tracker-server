import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
  id?: number;
  googleId?: string;
  displayName?: string;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  password?: string;
  admin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
    },
    accessToken: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      // allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
}
