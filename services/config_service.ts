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

export default class ConfigService {
  private config?: ProjectConfig

  constructor(protected app: ApplicationService) {}

  getConfig() {
    if (this.config) {
      return this.config
    }

    this.config = this.app.config.get<ProjectConfig>('command')

    if (!this.config) {
      throw new RuntimeException(
        'Invalid config exported from "config/command.ts" file. Make sure to use the defineConfig method'
      )
    }

    return this.config
  }
}
