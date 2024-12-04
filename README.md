<div align="center">
  <img src="https://github.com/Ayato-san/adonis-commands/assets/71392060/cd36b965-5a4f-481a-bf64-8f357c6e5689">
  <h1>Adonis Commands</h1>
  <p>My custom commands for AdoniJS</p>
  <div>
    <a href="https://github.com/Ayato-san/adonis-commands/blob/1.x/LICENSE.md"><img alt="GitHub License" src="https://img.shields.io/github/license/Ayato-san/adonis-commands?style=for-the-badge"></a>
    <a href="https://github.com/Ayato-san/adonis-commands/releases/latest"><img alt="NPM Version" src="https://img.shields.io/github/package-json/version/Ayato-san/adonis-commands?style=for-the-badge"></a>
    <a href="https://github.com/Ayato-san/adonis-commands/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/Ayato-san/adonis-commands?style=for-the-badge"></a>
    <a href="#"><img alt="GitHub Top Language" src="https://img.shields.io/github/languages/top/Ayato-san/adonis-commands?style=for-the-badge"></a>
  </div>
</div>

## Features

- Designed to work with AdonisJS, his packages lucid and bouncer out of the box
- add / modify Adonis commands

### Installation

- with npm
  ```sh
  npm install -D @ayato-san/adonis-commands
  node ace configure @ayato-san/adonis-commands
  ```

- with pnpm
  ```sh
  pnpm install -D @ayato-san/adonis-commands
  node ace configure @ayato-san/adonis-commands
  ```

- with yarn
  ```sh
  yarn add -D @ayato-san/adonis-commands
  node ace configure @ayato-san/adonis-commands
  ```

### Commands

- `make:action` create an action class
- `make:enum` create an enum file
- `make:helper` create an helper file (empty)
- `make:presenter` create a presenter class
- `make:repository` create a repository class
- `make:migration` (⚠️ only if lucid configured) create a migration based on default adonis migration but using postgres `uuid` generation

### Configure

change folders generation :

```ts
import { defineConfig } from '@ayato-san/adonis-commands'

const commandConfig = defineConfig({
  folders: {
    app: 'src',
    start: 'boot',
  },
})

export default commandConfig
```
