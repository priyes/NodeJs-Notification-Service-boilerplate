const { intersection } = require('ramda')

module.exports = ({ CustomError, constants: { UNAUTHORIZED_REQUEST } }) => (
  roles = []
) => {
  if (typeof roles === 'string') {
    roles = [roles]
  }
  return (req, res, next) => {
    if (
      roles.length > 0 &&
      intersection(roles, req.user.rolesList).length === 0
    ) {
      throw new CustomError(
        UNAUTHORIZED_REQUEST.code,
        UNAUTHORIZED_REQUEST.status
      )
    }
    next()
  }
}
