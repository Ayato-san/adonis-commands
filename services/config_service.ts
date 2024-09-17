/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import type { ApplicationService } from '@adonisjs/core/types'
import { RuntimeException } from '@poppinss/utils'

import type { ProjectConfig } from '../src/define_config.js'

/** ConfigService class to manage application configuration */
export default class ConfigService {
  /** Holds the project configuration */
  private config?: ProjectConfig

  /** Initializes with the application service */
  constructor(protected app: ApplicationService) {}

  /** Retrieves the project configuration */
  getConfig() {
    if (this.config) return this.config // Return cached config if available

    // Fetches the configuration from the application service
    this.config = this.app.config?.get<ProjectConfig>('command') || { screamingArchitecture: false }

    // Throws an error if the configuration is invalid
    if (!this.config) {
      throw new RuntimeException(
        'Invalid config exported from "config/command.ts" file. Make sure to use the defineConfig method'
      )
    }

    return this.config // Returns the valid configuration
  }
}
