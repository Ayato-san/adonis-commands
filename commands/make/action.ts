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

/** Command class for creating a new action */
export default class MakeAction extends AbstractMakeCommand {
  stubPath = 'action'
  /** Name of the command */
  static commandName = 'make:action'
  /** Description of the command */
  static description = 'Create a new action class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the action' })
  declare name: string
  @flags.boolean({ description: 'Generate action in singular form', alias: 's' })
  declare singular: boolean

  getName(entityName: string): string {
    /** Create a StringBuilder instance to manipulate the entity name */
    const action = new StringBuilder(entityName).removeExtension().removeSuffix('action')

    // Determine if the action should be singular or plural based on the app's settings
    if (
      this.app.generators.singularControllerNames.includes(action.toString().toLowerCase()) ||
      this.singular
    ) {
      action.singular()
    } else {
      action.plural()
    }

    // Return the formatted action name in PascalCase
    return action.pascalCase().suffix('Action').toString()
  }

  getPath(entityName: string, path: string = 'app'): string {
    // Construct the full path to the actions directory
    return this.app.makePath(path, '/actions', this.getFileName(entityName))
  }
}
