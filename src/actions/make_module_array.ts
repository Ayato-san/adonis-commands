import { type ModuleType, modules } from '../define_config.js'

export function makeModuleArray(arr: string[] = []) {
  const unique = arr.filter((value, index, array) => array.indexOf(value) === index)
  return unique.filter((value) => (modules as string[]).includes(value)) as ModuleType[]
}
