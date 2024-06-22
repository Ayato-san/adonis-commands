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

export default class MakeRepository extends BaseCommand {
  static commandName = 'make:repository'
  static description = 'Create a new repository class'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the repository' })
  declare name: string

  @flags.boolean({
    description: 'Generate repository in singular form',
    alias: 's',
  })
  declare singular: boolean

  /**
   * Converts an entity name to repository name
   */
  repositoryName(entityName: string) {
    const repository = new StringBuilder(entityName).removeExtension().removeSuffix('repository')

    if (this.app.generators.singularControllerNames.includes(repository.toString().toLowerCase())) {
      repository.singular()
    } else if (this.singular) {
      repository.singular()
    } else {
      repository.plural()
    }

    return repository.pascalCase().suffix('Repository').toString()
  }

  /**
   * Converts an entity name to repository file name
   */
  private repositoryFileName(entityName: string) {
    return new StringBuilder(this.repositoryName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the repositories directory
   */
  repositoriesPath(entityName: string, appPath: string = 'app'): string {
    return this.app.makePath(appPath, '/repositories', this.repositoryFileName(entityName))
  }

  async run() {
    const cmd: ProjectConfig = await this.app.container.make('command.config')
    const entity = this.app.generators.createEntity(this.name)
    const name = this.repositoryName(entity.name)
    const filePath = this.repositoriesPath(entity.name, cmd.folders?.app)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/repository/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      repository: { filePath, name },
    })
  }
}
