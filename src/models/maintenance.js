module.exports = function (sequelize, DataTypes) {
  const Maintenance = sequelize.define('Maintenance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    end_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });

  Maintenance.associate = function(models) {
    Maintenance.belongsTo(models.Vehicle, {
      foreignKey: 'vehicle_id',
      targetKey: 'id'
    });

    Maintenance.hasMany(models.Maintenance_File, {
      as: 'Maintenance_Files',
      foreignKey: 'maintenance_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true
    });
  }

  return Maintenance;
}