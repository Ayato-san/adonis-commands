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

/** Command class for creating a new presenter */
export default class MakePresenter extends BaseCommand {
  /** Name of the command */
  static commandName = 'make:presenter'
  /** Description of the command */
  static description = 'Create a new presenter class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  /** Argument for presenter name */
  @args.string({ description: 'The name of the presenter' })
  declare name: string

  /** Flag to generate singular presenter */
  @flags.boolean({ description: 'Generate presenter in singular form', alias: 's' })
  declare singular: boolean

  /** Converts an entity name to presenter name */
  presenterName(entityName: string) {
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

  /** Converts an entity name to presenter file name */
  private presenterFileName(entityName: string) {
    // Generate the file name for the presenter in snake_case with .ts extension
    return new StringBuilder(this.presenterName(entityName)).snakeCase().ext('.ts').toString()
  }

  /** Makes path to the presenters directory */
  presentersPath(entityName: string, appPath: string = 'app'): string {
    // Construct the full path to the presenters directory
    return this.app.makePath(appPath, '/presenters', this.presenterFileName(entityName))
  }

  async run() {
    /** Retrieve the configuration settings */
    const config = new ConfigService(this.app).getConfig()
    /** Create an entity based on the provided name */
    const entity = this.app.generators.createEntity(this.name)
    /** Get the presenter name for the entity */
    const name = this.presenterName(entity.name)
    /** Determine the file path for the new presenter */
    const filePath = this.presentersPath(entity.name, config.folders?.app)

    /** Create codemods for the presenter generation */
    const codemods = await this.createCodemods()
    /** Use the stub to create the presenter file */
    await codemods.makeUsingStub(stubsRoot, 'make/presenter/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      presenter: { filePath, name },
    })
  }
}
