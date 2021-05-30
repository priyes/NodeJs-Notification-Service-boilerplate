import { RESOLVER } from 'awilix'

/**
 * This is function that can be used to make function compatible with DI awilix
 * @param {Name for the DI container} name
 * @param {} fn
 */
export const define = (name, fn) => {
  // const wrapper = () => fn
  fn[RESOLVER] = {
    name
  }
  return fn
}
