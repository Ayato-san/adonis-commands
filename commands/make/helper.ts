/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import StringBuilder from '@poppinss/utils/string_builder'

import ConfigHelper from '../../helpers/config_helper.js'
import { stubsRoot } from '../../stubs/main.js'

export default class MakeHelper extends BaseCommand {
  static commandName = 'make:helper'
  static description = 'Create a new helper class'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the helper' })
  declare name: string

  @flags.boolean({
    description: 'Generate helper in singular form',
    alias: 's',
  })
  declare singular: boolean

  /**
   * Converts an entity name to helper name
   */
  helperName(entityName: string) {
    const helper = new StringBuilder(entityName).removeExtension().removeSuffix('helper')

    if (this.app.generators.singularControllerNames.includes(helper.toString().toLowerCase())) {
      helper.singular()
    } else if (this.singular) {
      helper.singular()
    } else {
      helper.plural()
    }

    return helper.pascalCase().suffix('Helper').toString()
  }

  /**
   * Converts an entity name to helper file name
   */
  private helperFileName(entityName: string) {
    return new StringBuilder(this.helperName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the helpers directory
   */
  helpersPath(entityName: string, appPath: string = 'app'): string {
    return this.app.makePath(appPath, '/helpers', this.helperFileName(entityName))
  }

  async run() {
    const config = new ConfigHelper(this.app).getConfig()
    const entity = this.app.generators.createEntity(this.name)
    const name = this.helperName(entity.name)
    const filePath = this.helpersPath(entity.name, config.folders?.app)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/helper/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      helper: { filePath, name },
    })
  }
}
