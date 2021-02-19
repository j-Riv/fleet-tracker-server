module.exports = function (sequelize, DataTypes) {
  const Repair_File = sequelize.define('Repair_File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Repair_File.associate = function(models) {
    Repair_File.belongsTo(models.Vehicle, {
      foreignKey: 'repair_id',
      targetKey: 'id'
    });
  }

  return Repair_File;
}