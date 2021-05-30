module.exports = (sequelize, DataTypes) => {
  const NotificationConfig = sequelize.define(
    'notification_config',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false
      },
      notification_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      notification_channel: {
        type: DataTypes.STRING,
        allowNull: false
      },
      desc: {
        type: DataTypes.TEXT
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
  return NotificationConfig
}
