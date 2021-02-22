import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface RepairFileAttributes {
  id?: number;
  file_type: string;
  file_url: string;
}

export interface RepairFileModel
  extends Model<RepairFileAttributes>,
    RepairFileAttributes {}
export class RepairFile extends Model<RepairFileModel, RepairFileAttributes> {}

export type RepairFileStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RepairFileModel;
};

export function RepairFileFactory(sequelize: Sequelize): RepairFileStatic {
  return <RepairFileStatic>sequelize.define('Repair_File', {
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
