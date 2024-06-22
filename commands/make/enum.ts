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

import type { ProjectConfig } from '../../src/define_config.js'
import { stubsRoot } from '../../stubs/main.js'

export default class Makeenum extends BaseCommand {
  static commandName = 'make:enum'
  static description = 'Create a new enum class'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the enum' })
  declare name: string

  @flags.boolean({
    description: 'Generate action in singular form',
    alias: 's',
  })
  declare singular: boolean

  /**
   * Converts an entity name to enum name
   */
  enumName(entityName: string) {
    const enumName = new StringBuilder(entityName).removeExtension().removeSuffix('enum')

    if (this.app.generators.singularControllerNames.includes(enumName.toString().toLowerCase())) {
      enumName.singular()
    } else if (this.singular) {
      enumName.singular()
    } else {
      enumName.plural()
    }

    return enumName.pascalCase().toString()
  }

  /**
   * Converts an entity name to enum file name
   */
  private enumFileName(entityName: string) {
    return new StringBuilder(this.enumName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the enums directory
   */
  enumsPath(entityName: string, appPath: string = 'app'): string {
    return this.app.makePath(appPath, '/enums', this.enumFileName(entityName))
  }

  async run() {
    const cmd: ProjectConfig = await this.app.container.make('command.config')
    const entity = this.app.generators.createEntity(this.name)
    const name = this.enumName(entity.name)
    const filePath = this.enumsPath(entity.name, cmd.folders?.app)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/enum/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      enumeration: { filePath, name },
    })
  }
}
