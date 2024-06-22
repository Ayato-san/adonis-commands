/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
// import { configProvider } from '@adonisjs/core'
import type { ApplicationService } from '@adonisjs/core/types'
import { RuntimeException } from '@poppinss/utils'

import type { ProjectConfig } from '../src/define_config.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'command.config': ProjectConfig
  }
}

export default class CommandProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('command.config', async () => {
      const config = this.app.config.get<ProjectConfig>('command')

      if (!config) {
        throw new RuntimeException(
          'Invalid config exported from "config/command.ts" file. Make sure to use the defineConfig method'
        )
      }

      return config
    })
  }
}
