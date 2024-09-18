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

/** Command class for creating a new presenter */
export default class MakePresenter extends AbstractMakeCommand {
  stubPath = 'presenter'
  /** Name of the command */
  static commandName = 'make:presenter'
  /** Description of the command */
  static description = 'Create a new presenter class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the presenter' })
  declare name: string
  @flags.boolean({ description: 'Generate presenter in singular form', alias: 's' })
  declare singular: boolean

  getName(entityName: string): string {
    /** Create a StringBuilder instance to manipulate the entity name */
    const presenter = new StringBuilder(entityName).removeExtension().removeSuffix('presenter')

    // Determine if the presenter should be singular or plural based on the app's settings
    if (
      this.app.generators.singularControllerNames.includes(presenter.toString().toLowerCase()) ||
      this.singular
    ) {
      presenter.singular()
    } else {
      presenter.plural()
    }

    // Return the formatted presenter name in PascalCase
    return presenter.pascalCase().suffix('Presenter').toString()
  }

  getPath(entityName: string, path: string = 'app'): string {
    // Construct the full path to the presenters directory
    return this.app.makePath(path, '/presenters', this.getFileName(entityName))
  }
}
