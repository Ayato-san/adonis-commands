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

/** Command class for creating a new repository */
export default class MakeRepository extends BaseCommand {
  /** Name of the command */
  static commandName = 'make:repository'
  /** Description of the command */
  static description = 'Create a new repository class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  /** Argument for repository name */
  @args.string({ description: 'The name of the repository' })
  declare name: string

  /** Flag to generate singular helper */
  @flags.boolean({ description: 'Generate repository in singular form', alias: 's' })
  declare singular: boolean

  /** Converts an entity name to repository name */
  repositoryName(entityName: string) {
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

  /** Converts an entity name to repository file name */
  private repositoryFileName(entityName: string) {
    // Generate the file name for the helper in snake_case with .ts extension
    return new StringBuilder(this.repositoryName(entityName)).snakeCase().ext('.ts').toString()
  }

  /** Makes path to the repositories directory */
  repositoriesPath(entityName: string, appPath: string = 'app'): string {
    // Construct the full path to the helpers directory
    return this.app.makePath(appPath, '/repositories', this.repositoryFileName(entityName))
  }

  async run() {
    /** Retrieve the configuration settings */
    const config = new ConfigService(this.app).getConfig()
    /** Create an entity based on the provided name */
    const entity = this.app.generators.createEntity(this.name)
    /** Get the helper name for the entity */
    const name = this.repositoryName(entity.name)
    /** Determine the file path for the new helper */
    const filePath = this.repositoriesPath(entity.name, config.folders?.app)

    /** Create codemods for the helper generation */
    const codemods = await this.createCodemods()
    /** Use the stub to create the helper file */
    await codemods.makeUsingStub(stubsRoot, 'make/repository/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      repository: { filePath, name },
    })
  }
}
