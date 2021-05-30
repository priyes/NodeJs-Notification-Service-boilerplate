import {
  define
} from 'src/containerHelper'

module.exports = define('userRepository', ({
  database
}) => {
  const user = database['user']

  const getUser = async whereClause => user.findOne({
    where: {
      isActive: 1,
      ...whereClause
    }
  })
  const getAllUser = async whereClause => user.findAll({
    where: {
      isActive: 1,
      ...whereClause
    }
  })

  const createUser = async userEntity => user.create(userEntity)

  const updateUser = async (userEntity, id) => user.update(userEntity, {
    where: {
      id
    }
  })

  return {
    getUser,
    getAllUser,
    createUser,
    updateUser
  }
})
