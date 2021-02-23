import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface MaintenanceAttributes {
  id?: string;
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

export interface MaintenanceModel
  extends Model<MaintenanceAttributes>,
    MaintenanceAttributes {}
export class Maintenace extends Model<
  MaintenanceModel,
  MaintenanceAttributes
> {}

export type MaintenanceStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MaintenanceModel;
};

export function MaintenanceFactory(sequelize: Sequelize): MaintenanceStatic {
  return <MaintenanceStatic>sequelize.define('Maintenance', {
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
