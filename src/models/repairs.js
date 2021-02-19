module.exports = function (sequelize, DataTypes) {
  const Repairs = sequelize.define('Repairs', {
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

  Repairs.associate = function(models) {
    Repairs.belongsTo(models.Vehicle, {
      foreignKey: 'vehicle_id',
      targetKey: 'id'
    });

    Repairs.hasMany(models.Repair_File, {
      as: 'Repair_Files',
      foreignKey: 'repair_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true
    });
  }

  return Repairs;
}