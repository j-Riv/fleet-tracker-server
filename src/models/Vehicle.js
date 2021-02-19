module.exports = function (sequelize, DataTypes) {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.STRING,
      defaultValue: 'N/A'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    non_op: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    registration_exp: {
      type: DataTypes.STRING,
      defaultValue: 'N/A'
    },
    insurance_exp: {
      type: DataTypes.STRING,
      defaultValue: 'N/A'
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'no-photo-available.jpg'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // new
    pink_slip: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    use: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    key_number: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    building: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A'
    },
    cost_new: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/As'
    }
  });

  Vehicle.associate = function(models) {
    Vehicle.hasMany(models.Vehicle_Image, {
      as: 'Images',
      foreignKey: 'vehicle_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true
    });

    Vehicle.hasMany(models.Maintenance, {
      as: 'Maintenance',
      foreignKey: 'vehicle_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true
    });

    Vehicle.hasMany(models.Repairs, {
      as: 'Repairs',
      foreignKey: 'vehicle_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true
    });
  }

  return Vehicle;
}