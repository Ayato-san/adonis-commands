/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { BaseCommand } from '@adonisjs/core/ace'
import StringBuilder from '@poppinss/utils/string_builder'

import ConfigService from '../../services/config_service.js'
import { stubsRoot } from '../../stubs/main.js'

/** Command class for creating a new make command */
export default abstract class AbstractMakeCommand extends BaseCommand {
  /** The path of the command's stub */
  abstract stubPath: string

  /** Argument for command name */
  abstract name: string

  /** Flag to generate singular command file */
  abstract singular: boolean

  /** Converts an entity to name */
  abstract getName(entityName: string): string

  /** Converts an entity to file name */
  getFileName(entityName: string): string {
    // Generate the file name for the command in snake_case with .ts extension
    return new StringBuilder(this.getName(entityName)).snakeCase().ext('.ts').toString()
  }

  /** Makes path to the command directory */
  abstract getPath(entityName: string, path?: string): string

  async run() {
    /** Retrieve the configuration settings */
    const config = new ConfigService(this.app).getConfig()
    /** Create an entity based on the provided name */
    const entity = this.app.generators.createEntity(this.name)
    /** Get the action name for the entity */
    const name = this.getName(entity.name)
    /** Determine the file path for the new action */
    const filePath = this.getPath(entity.name, config.folders?.app)

    /** Create codemods for the action generation */
    const codemods = await this.createCodemods()
    /** Use the stub to create the action file */
    await codemods.makeUsingStub(stubsRoot, `make/${this.stubPath}/main.stub`, {
      entity: this.app.generators.createEntity(this.name),
      cmd: { filePath, name },
    })
  }
}
