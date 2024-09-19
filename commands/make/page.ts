/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { args, BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import StringBuilder from '@poppinss/utils/string_builder'

import ConfigService from '../../services/config_service.js'
import { hasInertia, hasReact } from '../../src/utilities/package_utility.js'
import { stubsRoot } from '../../stubs/main.js'

/** Command class for creating a new page */
export default class MakePage extends BaseCommand {
  /** Name of the command */
  static commandName = 'make:page'
  /** Description of the command */
  static description = 'Create a new page class'
  /** Options for the command */
  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'The name of the page' })
  declare name: string

  @flags.string({ description: '' })
  declare config?: 'page' | 'controller'

  /** Converts an entity to name */
  getName(entityName: string): string {
    /** Create a StringBuilder instance to manipulate the entity name */
    const page = new StringBuilder(entityName).removeExtension().removeSuffix('page')

    // Return the formatted page name in PascalCase
    return page.pascalCase().toString()
  }

  /** Converts an entity to file name */
  getFileName(entityName: string): string {
    // Generate the file name for the command in snake_case with .ts extension
    return new StringBuilder(this.getName(entityName)).snakeCase().ext('.tsx').toString()
  }

  /** Makes path to the command directory */
  getPath(entityName: string, path: string = './inertia'): string {
    // Construct the full path to the pages directory
    return this.app.makePath(path, '/pages', this.getFileName(entityName))
  }

  prepare() {
    if (!hasInertia()) throw new Error('you need to install "@adonisjs/inertia" before')

    if (!hasReact()) throw new Error('you need use react adapter')
  }

  async run() {
    /** Retrieve the configuration settings */
    const config = new ConfigService(this.app).getConfig()
    /** Create an entity based on the provided name */
    const entity = this.app.generators.createEntity(this.name)
    /** Get the page name for the entity */
    const name = this.getName(entity.name)
    /** Determine the file path for the new page */
    const filePath = this.getPath(entity.name, config.folders?.app)

    /** Create codemods for the page generation */
    const codemods = await this.createCodemods()

    let stubName: string = 'no-props'
    switch (this.config) {
      case 'controller':
        stubName = 'controller-props'
        break
      case 'page':
        stubName = 'page-props'
        break
    }

    /** Use the stub to create the page file */
    await codemods.makeUsingStub(stubsRoot, `make/pages/${stubName}.stub`, {
      entity,
      cmd: { filePath, name },
    })
  }
}
