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

import { stubsRoot } from '../../stubs/main.js'

export default class MakeAction extends BaseCommand {
  static commandName = 'make:action'
  static description = 'Create a new action class'

  static options: CommandOptions = {}

  @args.string({ description: 'The name of the action' })
  declare name: string

  @flags.boolean({
    description: 'Generate action in singular form',
    alias: 's',
  })
  declare singular: boolean

  /**
   * Converts an entity name to action name
   */
  actionName(entityName: string) {
    const action = new StringBuilder(entityName).removeExtension().removeSuffix('action')

    if (this.app.generators.singularControllerNames.includes(action.toString().toLowerCase())) {
      action.singular()
    } else if (this.singular) {
      action.singular()
    } else {
      action.plural()
    }

    return action.pascalCase().suffix('Action').toString()
  }

  /**
   * Converts an entity name to action file name
   */
  private actionFileName(entityName: string) {
    return new StringBuilder(this.actionName(entityName)).snakeCase().ext('.ts').toString()
  }

  /**
   * Makes path to the actions directory
   */
  actionsPath(entityName: string): string {
    return this.app.makePath('app/actions', this.actionFileName(entityName))
  }

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const name = this.actionName(entity.name)
    const filePath = this.actionsPath(entity.name)

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/action/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      action: { filePath, name },
    })
  }
}
