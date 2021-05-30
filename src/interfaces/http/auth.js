import passport from 'passport'
import {
  ExtractJwt,
  Strategy
} from 'passport-jwt'

module.exports = ({
  config,
  CustomError,
  constants: { UNAUTHORIZED_REQUEST },
  response: { Success }
}) => {
  const params = {
    secretOrKey: config.authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }

  const JWTStrategy = new Strategy(params, (payload, done) => {
    /**
     *  Implement User validation
     *   done(null, user) => on success
     *   done(error, null) => on error
     */
  })

  passport.use(JWTStrategy)

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  return {
    initialize: () => {
      return passport.initialize()
    },
    authenticate: () => {
      return (req, res, next) => passport.authenticate('jwt', null, (error, user, info) => {
        if (error || !user) {
          next(new CustomError(
            UNAUTHORIZED_REQUEST.code,
            UNAUTHORIZED_REQUEST.status,
            info
          ))
        }
        req.user = user
        next()
      })(req, res, next)
    }
  }
}
