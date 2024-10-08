/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Defines the project configuration.
 * @param config - The configuration object to define.
 * @returns The defined project configuration.
 */
export function defineConfig(config: ProjectConfig): ProjectConfig {
  return config
}

/** Shape of config inside the project config file */
export type ProjectConfig = {
  /** Define if the project use a Screaming Architecture */
  screamingArchitecture: boolean
  /** Configure the folders generation */
  folders?: FolderConfig
}

/** Shape of config for folder achitecture */
export type FolderConfig = {
  /** "app" by default */
  app?: string
  /** "start" by default */
  start?: string
}
