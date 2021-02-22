import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface VehicleImageAttributes {
  id?: number;
  file_type: string;
  file_url: string;
}

export interface VehicleImageModel
  extends Model<VehicleImageAttributes>,
    VehicleImageAttributes {}
export class VehicleImage extends Model<
  VehicleImageModel,
  VehicleImageAttributes
> {}

export type VehicleImageStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): VehicleImageModel;
};

export function VehicleImageFactory(sequelize: Sequelize): VehicleImageStatic {
  return <VehicleImageStatic>sequelize.define('Vehicle_Image', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    file_type: {
      type: DataTypes.STRING,
      defaultValue: 'image',
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
