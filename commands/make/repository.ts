/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import StringBuilder from '@poppinss/utils/string_builder'

import { stubsRoot } from '../../stubs/main.js'

export default class MakeRepository extends BaseCommand {
  static commandName = 'make:repository'
  static description = 'Create a new repository class'

  static options: CommandOptions = {}

  @args.string({ description: 'The name of the repository' })
  declare name: string

  /**
   * Converts an entity name to repository name
   */
  repositoryName(entityName: string) {
    return new StringBuilder(entityName)
      .removeExtension()
      .removeSuffix('repository')
      .singular()
      .pascalCase()
      .toString()
  }

  /**
   * Converts an entity name to repository file name
   */
  private repositoryFileName(entityName: string) {
    return new StringBuilder(this.repositoryName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the repositorys directory
   */
  repositoriesPath(entityName: string): string {
    return this.app.makePath('app/repositories', this.repositoryFileName(entityName))
  }

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const name = this.repositoryName(entity.name)
    const filePath = this.repositoriesPath(entity.name)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/repository/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      repository: { filePath, name },
    })
  }
}
