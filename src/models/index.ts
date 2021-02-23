import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { UserFactory, UserStatic } from './user';
import { VehicleFactory, VehicleStatic } from './vehicle';
import { VehicleImageFactory, VehicleImageStatic } from './vehicle_images';
import { RepairsFactory, RepairsStatic } from './repairs';
import { MaintenanceFactory, MaintenanceStatic } from './maintenance';
import { RepairFileFactory, RepairFileStatic } from './repair_file';
import {
  MaintenanceFileFactory,
  MaintenanceFileStatic,
} from './maintenance_file';
dotenv.config();

export interface DB {
  sequelize: Sequelize;
  User: UserStatic;
  Vehicle: VehicleStatic;
  Vehicle_Image: VehicleImageStatic;
  Repairs: RepairsStatic;
  Maintenance: MaintenanceStatic;
  Repair_File: RepairFileStatic;
  Maintenance_File: MaintenanceFileStatic;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: Number(process.env.DB_PORT) || 3306, // 54320
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
      min: 0,
      max: 5,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// SOMETHING VERY IMPORTANT them Factory functions expect a
// sequelize instance as parameter give them `sequelize`

const User = UserFactory(sequelize);
const Vehicle = VehicleFactory(sequelize);
const Vehicle_Image = VehicleImageFactory(sequelize);
const Repairs = RepairsFactory(sequelize);
const Maintenance = MaintenanceFactory(sequelize);
const Repair_File = RepairFileFactory(sequelize);
const Maintenance_File = MaintenanceFileFactory(sequelize);

// Create the relationships

Vehicle_Image.belongsTo(Vehicle, {
  foreignKey: 'vehicle_id',
  targetKey: 'id',
});
Vehicle.hasMany(Vehicle_Image, {
  as: 'Images',
  foreignKey: 'vehicle_id',
  sourceKey: 'id',
  onDelete: 'cascade',
  hooks: true,
});
Repairs.belongsTo(Vehicle, {
  foreignKey: 'vehicle_id',
  targetKey: 'id',
});
Vehicle.hasMany(Repairs, {
  as: 'Repairs',
  foreignKey: 'vehicle_id',
  sourceKey: 'id',
  onDelete: 'cascade',
  hooks: true,
});
Maintenance.belongsTo(Vehicle, {
  foreignKey: 'vehicle_id',
  targetKey: 'id',
});
Vehicle.hasMany(Maintenance, {
  as: 'Maintenance',
  foreignKey: 'vehicle_id',
  sourceKey: 'id',
  onDelete: 'cascade',
  hooks: true,
});
Repair_File.belongsTo(Repairs, {
  foreignKey: 'repair_id',
  targetKey: 'id',
});
Repairs.hasMany(Repair_File, {
  as: 'Repair_Files',
  foreignKey: 'repair_id',
  sourceKey: 'id',
  onDelete: 'cascade',
  hooks: true,
});
Maintenance_File.belongsTo(Maintenance, {
  foreignKey: 'maintenance_id',
  targetKey: 'id',
});
Maintenance.hasMany(Maintenance_File, {
  as: 'Maintenance_Files',
  foreignKey: 'maintenance_id',
  sourceKey: 'id',
  onDelete: 'cascade',
  hooks: true,
});

export const db: DB = {
  sequelize,
  User,
  Vehicle,
  Vehicle_Image,
  Repairs,
  Maintenance,
  Repair_File,
  Maintenance_File,
};

export default db;
