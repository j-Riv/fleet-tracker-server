module.exports = function (sequelize, DataTypes) {
  const Vehicle_Image = sequelize.define('Vehicle_Image', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    file_type: {
      type: DataTypes.STRING,
      defaultValue: 'image',
      allowNull: false
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Vehicle_Image.associate = function(models) {
    Vehicle_Image.belongsTo(models.Vehicle, {
      foreignKey: 'vehicle_id',
      targetKey: 'id'
    });
  }

  return Vehicle_Image;
}