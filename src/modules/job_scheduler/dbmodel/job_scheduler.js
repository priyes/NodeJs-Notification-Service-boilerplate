
module.exports = (sequelize, DataTypes) => {
  const jobScheduler = sequelize.define(
    'job_scheduler',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      jobName: {
        type: DataTypes.STRING
      },
      pattern: {
        type: DataTypes.STRING
      },
      eventCommand: {
        type: DataTypes.STRING
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
      },
      parameters: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Parameter are required'
          }
        },
        isValid (val) {
          try {
            JSON.parse(val)
          } catch (error) {
            throw new Error('Please provide valid json for parameters')
          }
        }
      },
      description: {
        type: DataTypes.TEXT
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  )
  return jobScheduler
}
