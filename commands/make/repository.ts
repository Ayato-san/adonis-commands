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

/** Command class for creating a new repository */
export default class MakeRepository extends AbstractMakeCommand {
  stubPath = 'repository'
  /** Name of the command */
  static commandName = 'make:repository'
  /** Description of the command */
  static description = 'Create a new repository class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the repository' })
  declare name: string
  @flags.boolean({ description: 'Generate repository in singular form', alias: 's' })
  declare singular: boolean

  getName(entityName: string): string {
    /** Create a StringBuilder instance to manipulate the entity name */
    const repository = new StringBuilder(entityName).removeExtension().removeSuffix('repository')

    // Determine if the helper should be singular or plural based on the app's settings
    if (
      this.app.generators.singularControllerNames.includes(repository.toString().toLowerCase()) ||
      this.singular
    ) {
      repository.singular()
    } else {
      repository.plural()
    }

    // Return the formatted helper name in PascalCase
    return repository.pascalCase().suffix('Repository').toString()
  }

  getPath(entityName: string, path: string = 'app'): string {
    // Construct the full path to the helpers directory
    return this.app.makePath(path, '/repositories', this.getFileName(entityName))
  }
}
