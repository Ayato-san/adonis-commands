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

/**
 * Configures the Adonis command by prompting the user for options
 * and creating necessary configuration files and commands.
 *
 * @param command - The command instance to configure.
 */
export async function configure(command: Configure) {
  // Retrieve the 'screaming' flag from the command's parsed flags
  let screaming: boolean | undefined = command.parsedFlags.screaming

  // Prompt to select the architecture when --screaming flag is not used.
  if (screaming === undefined) {
    // Ask the user if they want to use screaming architecture
    screaming = await command.prompt.confirm('Do you want to use screaming architecture?')
  } else {
    // Convert the screaming value to a boolean
    screaming = !!screaming
  }

  /** Create codemods based on the command */
  const codemods = await command.createCodemods()

  // Create the configuration file
  await codemods.makeUsingStub(stubsRoot, 'config/main.stub', { screaming: !!screaming })

  // Register commands and provider to the rcfile
  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@ayato-san/adonis-commands/commands')
  })
}
