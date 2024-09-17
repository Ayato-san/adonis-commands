/*
 * @ayato-san/adonis-commands
 *
 * (c) Ayato-san
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { getDirname } from '@poppinss/utils'

/** Get the directory name of the current module */
export const stubsRoot = getDirname(import.meta.url)
