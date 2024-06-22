/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import type Configure from '@adonisjs/core/commands/configure'

import { stubsRoot } from './stubs/main.js'

export async function configure(command: Configure) {
  let screaming: boolean | undefined = command.parsedFlags.screaming

  /**
   * Prompt to select the architecture when --screaming flag
   * is not used.
   */
  if (screaming === undefined) {
    screaming = await command.prompt.confirm('Do you want to use screaming architecture?')
  }

  const codemods = await command.createCodemods()

  /**
   * Create the configuration file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/main.stub', { screaming: !!screaming })

  /**
   * Register commands and provider to the rcfile
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@ayato-san/adonis-commands/commands')
  })
}
