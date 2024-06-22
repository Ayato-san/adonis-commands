export function isModuleInstalled(moduleName: string) {
  try {
    import.meta.resolve(moduleName)
    return true
  } catch (e) {
    return false
  }
}
