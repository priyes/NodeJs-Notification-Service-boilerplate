import {
  define
} from 'src/containerHelper'
module.exports = define('dummyEmailServiceProvider', ({ logger }) => {
  /* -------------------------------------------------------------------------- */
  /*                               Service Methods                              */
  /* -------------------------------------------------------------------------- */

  const sendEmail = async data => new Promise(resolve => setTimeout(() => resolve(data), 1000))

  return {
    sendEmail
  }
})
