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

import AbstractMakeCommand from '../../src/make/abstract.js'

/** Command class for creating a new Data Transfer Object */
export default class MakeDTO extends AbstractMakeCommand {
  stubPath = 'dto'
  /** Name of the command */
  static commandName = 'make:dto'
  /** Description of the command */
  static description = 'Create a new data transfer object class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the dto' })
  declare name: string
  @flags.boolean({ description: 'Generate dto in singular form', alias: 's' })
  declare singular: boolean

  getName(entityName: string): string {
    /** Create a StringBuilder instance to manipulate the entity name */
    const dto = new StringBuilder(entityName).removeExtension().removeSuffix('dto')

    // Determine if the dto should be singular or plural based on the app's settings
    if (
      this.app.generators.singularControllerNames.includes(dto.toString().toLowerCase()) ||
      this.singular
    ) {
      dto.singular()
    } else {
      dto.plural()
    }

    // Return the formatted dto name in PascalCase
    return dto.pascalCase().suffix('DTO').toString()
  }

  getPath(entityName: string, path: string = 'app'): string {
    // Construct the full path to the dtos directory
    return this.app.makePath(path, '/dtos', this.getFileName(entityName))
  }
}
