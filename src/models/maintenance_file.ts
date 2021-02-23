import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface MaintenanceFileAttributes {
  id?: number;
  file_type: string;
  file_url: string;
  maintenance_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MaintenanceFileModel
  extends Model<MaintenanceFileAttributes>,
    MaintenanceFileAttributes {}
export class MaintenanceFile extends Model<
  MaintenanceFileModel,
  MaintenanceFileAttributes
> {}

export type MaintenanceFileStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MaintenanceFileModel;
};

export function MaintenanceFileFactory(
  sequelize: Sequelize
): MaintenanceFileStatic {
  return <MaintenanceFileStatic>sequelize.define('Maintenance_File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
