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

/** Command class for creating a new helper */
export default class MakeHelper extends AbstractMakeCommand {
  stubPath = 'helper'
  /** Name of the command */
  static commandName = 'make:helper'
  /** Description of the command */
  static description = 'Create a new helper class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the helper' })
  declare name: string
  @flags.boolean({ description: 'Generate helper in singular form', alias: 's' })
  declare singular: boolean

  getName(entityName: string): string {
    /** Create a StringBuilder instance to manipulate the entity name */
    const helper = new StringBuilder(entityName).removeExtension().removeSuffix('helper')

    // Determine if the helper should be singular or plural based on the app's settings
    if (
      this.app.generators.singularControllerNames.includes(helper.toString().toLowerCase()) ||
      this.singular
    ) {
      helper.singular()
    } else {
      helper.plural()
    }

    // Return the formatted helper name in PascalCase
    return helper.pascalCase().suffix('Helper').toString()
  }

  getPath(entityName: string, path: string = 'app'): string {
    // Construct the full path to the helpers directory
    return this.app.makePath(path, '/helpers', this.getFileName(entityName))
  }
}
