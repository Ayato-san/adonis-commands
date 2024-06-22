/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import type Configure from '@adonisjs/core/commands/configure'

import { makeModuleArray } from './src/actions/make_module_array.js'
import { type ModuleType, modules as modulesChoice } from './src/define_config.js'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: Configure) {
  let screaming: boolean | undefined = command.parsedFlags.screaming

  let modules: ModuleType[] | undefined = command.parsedFlags.modules

  /**
   * Prompt to select the architecture when --screaming flag is not used.
   */
  if (screaming === undefined) {
    screaming = await command.prompt.confirm('Do you want to use screaming architecture?')
  } else {
    screaming = !!screaming
  }

  /**
   * Prompt to select the architecture when --modules flag is not used.
   */
  if (modules === undefined) {
    modules = await command.prompt.multiple('Select the used modules', modulesChoice)
  } else if (typeof modules === 'string') {
    modules = [modules]
  }
  modules = makeModuleArray(modules)

  const codemods = await command.createCodemods()

  /**
   * Create the configuration file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/main.stub', { screaming: !!screaming, modules })

  /**
   * Register commands and provider to the rcfile
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@ayato-san/adonis-commands/commands')
  })
}
