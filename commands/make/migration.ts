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
import { stubsRoot as lucidStubsRoot } from '@adonisjs/lucid'
import type { Database } from '@adonisjs/lucid/database'

import { hasLucid, hasPostgreSQL } from '../../src/utilities/package_utility.js'
import { stubsRoot as localStubsRoot } from '../../stubs/main.js'

export default class MakeMigration extends BaseCommand {
  static commandName = 'make:migration'
  static description = 'Make a new migration file'
  static options: CommandOptions = { startApp: true, allowUnknownFlags: true }

  /**
   * The name of the migration file. We use this to create the migration
   * file and generate the table name
   */
  @args.string({ description: 'Name of the migration file' })
  declare name: string

  /**
   * Choose a custom pre-defined connection. Otherwise, we use the
   * default connection
   */
  @flags.string({ description: 'Select database connection for which to create the migration' })
  declare connection: string

  /**
   * Pre select migration directory. If this is defined, we will ignore the paths
   * defined inside the config.
   */
  @flags.string({ description: 'Select migration directory (if multiple sources are configured)' })
  declare folder: string

  /**
   * Custom table name for creating a new table
   */
  @flags.boolean({ description: 'Create a new default (Default action)' })
  declare create: boolean

  /**
   * Custom table name for altering an existing table
   */
  @flags.boolean({ description: 'Alter an existing table' })
  declare alter: boolean

  /**
   * Returns the directory for creating the migration file
   */
  private async getDirectory(migrationPaths?: string[]): Promise<string> {
    if (this.folder) {
      return this.folder
    }

    const directories = migrationPaths?.length ? migrationPaths : ['database/migrations']
    if (directories.length === 1) {
      return directories[0]
    }

    return this.prompt.choice('Select the migrations folder', directories, { name: 'folder' })
  }

  prepare() {
    if (!hasLucid()) {
      throw new Error('you need to install "@adonisjs/lucid" before')
    }
  }

  /**
   * Execute command
   */
  async run(): Promise<void> {
    const db: Database = await this.app.container.make('lucid.db')
    this.connection = this.connection || db.primaryConnectionName
    const connection = db.getRawConnection(this.connection || db.primaryConnectionName)
    /**
     * Invalid database connection
     */
    if (!connection) {
      throw new Error(
        `"${this.connection}" is not a valid connection name. Double check "config/database" file`
      )
    }
    /**
     * Not allowed together, hence we must notify the user about the same
     */
    if (this.alter && this.create) {
      this.logger.warning('--alter and --create cannot be used together. Ignoring --create')
    }
    /**
     * Entity to create
     */
    const entity = this.app.generators.createEntity(this.name)
    /**
     * The folder for creating the schema file
     */
    const folder = await this.getDirectory((connection.config.migrations || {}).paths)
    const prefix = new Date().getTime()
    const action = this.alter ? 'alter' : 'create'
    const tableName = this.app.generators.tableName(entity.name)
    const fileName = `${prefix}_${action}_${tableName}_table.ts`
    const codemods = await this.createCodemods()
    let stubsRoot = localStubsRoot
    if (!hasPostgreSQL()) stubsRoot = lucidStubsRoot
    let stubPath = 'make/migration/create.stub'
    if (action === 'alter') {
      stubsRoot = lucidStubsRoot
      stubPath = 'make/migration/alter.stub'
    }

    await codemods.makeUsingStub(stubsRoot, stubPath, {
      entity,
      flags: this.parsed.flags,
      migration: {
        tableName,
        folder,
        fileName,
      },
    })
  }
}
