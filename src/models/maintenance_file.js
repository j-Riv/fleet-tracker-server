module.exports = function (sequelize, DataTypes) {
  const Maintenance_File = sequelize.define('Maintenance_File', {
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

  Maintenance_File.associate = function (models) {
    Maintenance_File.belongsTo(models.Vehicle, {
      foreignKey: 'maintenance_id',
      targetKey: 'id',
    });
  };

  return Maintenance_File;
};
