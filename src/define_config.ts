/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export function defineConfig(config: ProjectConfig): ProjectConfig {
  return config
}

/**
 * Shape of config inside the project config file
 */
export type ProjectConfig = {
  screamingArchitecture: boolean
  folders?: FolderConfig
}

/**
 * Shape of config for folder achitecture
 */
export type FolderConfig = {
  /** "app" by default */
  app?: string
  /** "start" by default */
  start?: string
}
