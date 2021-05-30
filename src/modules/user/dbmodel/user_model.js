
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      dialCode: {
        type: DataTypes.STRING
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  )
  return User
}
