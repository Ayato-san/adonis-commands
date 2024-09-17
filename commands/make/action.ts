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

/** Command class for creating a new action */
export default class MakeAction extends BaseCommand {
  /** Name of the command */
  static commandName = 'make:action'
  /** Description of the command */
  static description = 'Create a new action class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  /** Argument for action name */
  @args.string({ description: 'The name of the action' })
  declare name: string

  /** Flag to generate singular action */
  @flags.boolean({ description: 'Generate action in singular form', alias: 's' })
  declare singular: boolean

  /** Converts an entity name to action name */
  actionName(entityName: string) {
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

  /** Converts an entity name to action file name */
  private actionFileName(entityName: string) {
    // Generate the file name for the action in snake_case with .ts extension
    return new StringBuilder(this.actionName(entityName)).snakeCase().ext('.ts').toString()
  }

  /** Makes path to the actions directory */
  actionsPath(entityName: string, appPath: string = 'app'): string {
    // Construct the full path to the actions directory
    return this.app.makePath(appPath, '/actions', this.actionFileName(entityName))
  }

  async run() {
    /** Retrieve the configuration settings */
    const config = new ConfigService(this.app).getConfig()
    /** Create an entity based on the provided name */
    const entity = this.app.generators.createEntity(this.name)
    /** Get the action name for the entity */
    const name = this.actionName(entity.name)
    /** Determine the file path for the new action */
    const filePath = this.actionsPath(entity.name, config.folders?.app)

    /** Create codemods for the action generation */
    const codemods = await this.createCodemods()
    /** Use the stub to create the action file */
    await codemods.makeUsingStub(stubsRoot, 'make/action/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      action: { filePath, name },
    })
  }
}
