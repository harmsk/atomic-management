# Atomic Management
Per-project Atom text editor configurations, for each window.

## Prerequisites
Requires Atom v1.26 or above

## Usage
When a folder/project is loaded, Atomic Management will look for a `*.atomconfig.cson` or `*.atomconfig.json` file in the opened folder (where `*` means any preferred filename). If no such file is found, global configuration are used (as per usual). If a project file is indeed found, they are loaded as Project Configurations and will override the global configuration when in the project's context.

This allows for configuring visuals for different projects (font size, color, themes), as well as the activation/deactivation of packages on a per-project basis, *without* tampering with global configurations.

Usage of this package should be straightforward after install, as long as the `*.atomconfig.cson` file is setup correctly. If you encounter issues, feel free to submit an issue on Github.

## Per-Project Config files: How to
The `*.atomconfig.cson` or `*.atomconfig.json` files should be specified in a syntax similar to the global config file `.atom/config.cson`, but without scope declaration on the outermost level. For example:

```json
// sample.atomconfig.cson

core:
  themes: [
     "one-light-ui",
     "one-light-syntax"
  ]

  disabledPackages: [
    "php-server",
    "markdown-preview"
  ]

editor:
  tabLength: 2
  fontSize:14
  softWrap: true

whitespace:
  removeTrailingWhitespace: true
```
Supports configurations include:
   - the two core namespaces of Atom, `core` and `editor`
   - configuration on a package, such as the `whitespace` package as shown above.

For a full list of configurable content, please see the official atom documentation [here](https://flight-manual.atom.io/using-atom/sections/basic-customization/#configuration-key-reference).

Features that pertain explicitly to styling, such as font color, can be changed by creating themes and placing them in the `core` array. See [here](https://flight-manual.atom.io/hacking-atom/sections/creating-a-theme/) for more details on creating themes.

## FAQ
- [How do per-project config files interact with global config?](#How-do-per-project-config-files-interact-with-global-config)
- [How to reset my choice of which per-project config file to use as default?](#How-to-reset-my-choice-of-which-per-project-config-file-to-use-as-default)

## How do per-project config files interact with global config?
The configuration described in the `*.atomconfig.cson` or `*.atomconfig.json` file will override the global Atom configuration, and each operates independently of each other.
If you wish to change config on a per-project level, directly edit/create the `*.atomconfig.cson` or `*.atomconfig.json` under the project's root directory.
If you wish to change _global_ config however, directly edit global configuration either through `Edit > Preferences` or `Edit > Config`.

## How to reset my choice of which per-project config file to use as default?
In `Packages > atomic-management`, select the option `reset remembered config`.
