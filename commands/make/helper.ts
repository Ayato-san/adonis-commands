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

export default class MakeHelper extends BaseCommand {
  static commandName = 'make:helper'
  static description = 'Create a new helper class'

  static options: CommandOptions = {}

  @args.string({ description: 'The name of the helper' })
  declare name: string

  /**
   * Converts an entity name to helper name
   */
  helperName(entityName: string) {
    return new StringBuilder(entityName)
      .removeExtension()
      .removeSuffix('helper')
      .singular()
      .pascalCase()
      .toString()
  }

  /**
   * Converts an entity name to helper file name
   */
  private helperFileName(entityName: string) {
    return new StringBuilder(this.helperName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the helpers directory
   */
  helpersPath(entityName: string): string {
    return this.app.makePath('app/helpers', this.helperFileName(entityName))
  }

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const name = this.helperName(entity.name)
    const filePath = this.helpersPath(entity.name)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/helper/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      helper: { filePath, name },
    })
  }
}
