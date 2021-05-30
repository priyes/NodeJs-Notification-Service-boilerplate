
module.exports = (sequelize, DataTypes) => {
  const EventLog = sequelize.define(
    'event_log',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        autoIncrement: false
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      eventName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      eventDetails: {
        type: DataTypes.TEXT
      },
      eventData: {
        type: DataTypes.TEXT
      },
      errorDetails: {
        type: DataTypes.TEXT
      },
      isSuccess: {
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
  return EventLog
}
