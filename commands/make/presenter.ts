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

export default class MakePresenter extends BaseCommand {
  static commandName = 'make:presenter'
  static description = 'Create a new presenter class'

  static options: CommandOptions = {}

  @args.string({ description: 'The name of the presenter' })
  declare name: string

  /**
   * Converts an entity name to presenter name
   */
  presenterName(entityName: string) {
    return new StringBuilder(entityName)
      .removeExtension()
      .removeSuffix('presenter')
      .singular()
      .pascalCase()
      .toString()
  }

  /**
   * Converts an entity name to presenter file name
   */
  private presenterFileName(entityName: string) {
    return new StringBuilder(this.presenterName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the presenters directory
   */
  presentersPath(entityName: string): string {
    return this.app.makePath('app/presenters', this.presenterFileName(entityName))
  }

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const name = this.presenterName(entity.name)
    const filePath = this.presentersPath(entity.name)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/presenter/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      presenter: { filePath, name },
    })
  }
}
