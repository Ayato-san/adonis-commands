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

import ConfigService from '../../services/config_service.js'
import { stubsRoot } from '../../stubs/main.js'

/** Command class for creating a new helper */
export default class MakeEnum extends BaseCommand {
  /** Name of the command */
  static commandName = 'make:enum'
  /** Description of the command */
  static description = 'Create a new enumeration class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  /** Argument for enumeration name */
  @args.string({ description: 'The name of the enum' })
  declare name: string

  /** Flag to generate singular enumeration */
  @flags.boolean({ description: 'Generate action in singular form', alias: 's' })
  declare singular: boolean

  /** Converts an entity name to enum name */
  enumName(entityName: string) {
    /** Create a StringBuilder instance to manipulate the entity name */
    const enumName = new StringBuilder(entityName).removeExtension().removeSuffix('enum')

    // Determine if the enum should be singular or plural based on the app's settings
    if (
      this.app.generators.singularControllerNames.includes(enumName.toString().toLowerCase()) ||
      this.singular
    ) {
      enumName.singular()
    } else {
      enumName.plural()
    }

    // Return the formatted enum name in PascalCase
    return enumName.pascalCase().toString()
  }

  /** Converts an entity name to enum file name */
  private enumFileName(entityName: string) {
    // Generate the file name for the enum in snake_case with .ts extension
    return new StringBuilder(this.enumName(entityName)).snakeCase().ext('.ts').toString()
  }

  /** Makes path to the enums directory */
  enumsPath(entityName: string, appPath: string = 'app'): string {
    // Construct the full path to the enums directory
    return this.app.makePath(appPath, '/enums', this.enumFileName(entityName))
  }

  async run() {
    /** Retrieve the configuration settings */
    const config = new ConfigService(this.app).getConfig()
    /** Create an entity based on the provided name */
    const entity = this.app.generators.createEntity(this.name)
    /** Get the enum name for the entity */
    const name = this.enumName(entity.name)
    /** Determine the file path for the new enum */
    const filePath = this.enumsPath(entity.name, config.folders?.app)

    /** Create codemods for the enum generation */
    const codemods = await this.createCodemods()
    /** Use the stub to create the enum file */
    await codemods.makeUsingStub(stubsRoot, 'make/enum/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      enumeration: { filePath, name },
    })
  }
}
