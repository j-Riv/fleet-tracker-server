import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface VehicleAttributes {
  id?: number;
  type: string;
  year: string;
  owner?: string;
  name: string;
  make: string;
  model: string;
  license_plate: string;
  vin: string;
  color: string;
  non_op: boolean;
  registration_exp: string;
  insurance_exp: string;
  image: string;
  active: boolean;
  archive: boolean;
  note: string;
  pink_slip: string;
  use: string;
  key_number: string;
  location: string;
  building?: string;
  address?: string;
  city?: string;
  zip?: string;
  cost_new?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleModel
  extends Model<VehicleAttributes>,
    VehicleAttributes {}
export class Vehicle extends Model<VehicleModel, VehicleAttributes> {}

export type VehicleStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): VehicleModel;
};

export function VehicleFactory(sequelize: Sequelize): VehicleStatic {
  return <VehicleStatic>sequelize.define('Vehicle', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.STRING,
      defaultValue: 'N/A',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    non_op: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    registration_exp: {
      type: DataTypes.STRING,
      defaultValue: 'N/A',
    },
    insurance_exp: {
      type: DataTypes.STRING,
      defaultValue: 'N/A',
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'no-photo-available.jpg',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // new
    pink_slip: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    use: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    key_number: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    building: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A',
    },
    cost_new: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/As',
    },
  });
}
