import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface RepairsAttributes {
  id?: number;
  type: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  event_url: string;
  active: boolean;
  archive: boolean;
  vehicle_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RepairsModel
  extends Model<RepairsAttributes>,
    RepairsAttributes {}
export class Repairs extends Model<RepairsModel, RepairsAttributes> {}

export type RepairsStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RepairsModel;
};

export function RepairsFactory(sequelize: Sequelize): RepairsStatic {
  return <RepairsStatic>sequelize.define('Repairs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
}
