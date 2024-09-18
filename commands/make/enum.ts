/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import StringBuilder from '@poppinss/utils/string_builder'

import AbstractMakeCommand from './abstract.js'

/** Command class for creating a new enumeration */
export default class MakeEnum extends AbstractMakeCommand {
  stubPath = 'enum'
  /** Name of the command */
  static commandName = 'make:enum'
  /** Description of the command */
  static description = 'Create a new enumeration class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the enum' })
  declare name: string
  @flags.boolean({ description: 'Generate action in singular form', alias: 's' })
  declare singular: boolean

  getName(entityName: string) {
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

  getPath(entityName: string, path: string = 'app') {
    // Construct the full path to the enums directory
    return this.app.makePath(path, '/enums', this.getFileName(entityName))
  }
}
