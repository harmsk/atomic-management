# Atomic Management
Per-project Atom text editor configurations, for each window.

## Prerequisites
Requires Atom v1.26 or above

## Usage
When a folder/project is loaded, Atomic Management will look for a `*.atomconfig.cson` or `*.atomconfig.json` file in the opened folder. If no such file is found, global configuration are used (as per usual). If a project file is indeed found, they are loaded as Project Configurations and will override the global configuration when in the project's context.

This allows for configuring visuals for different projects (font size, color, themes), as well as the activation/deactivation of packages on a per-project basis, *without* tampering with global configurations.

Usage of this package should be straightforward after install, as long as the `atomconfig` file is setup correctly. If you encounter issues, feel free to submit an issue on Github.

## Project files
Project files should be specified similar to a `.atom/config.cson` file. For example:

```
sample.atomconfig.cson

core: {
  themes: [
    "one-light-ui",
    "one-light-syntax"
  ]
  disabledPackages: [
    # "php-server"
  ]
}
editor:
  fontSize:14

```

The current version of this package only supports configuration of the two core namespaces of Atom, `core` and `editor`.

For a full list of configurable content, please see the official atom documentation [here](https://flight-manual.atom.io/using-atom/sections/basic-customization/#configuration-key-reference).

Features that pertain explicitly to styling, such as font color, can be changed by creating themes and placing them in the `core` array. See [here](https://flight-manual.atom.io/hacking-atom/sections/creating-a-theme/) for more details on creating themes.

The configuration described in the `.atomconfig` file will override the default Atom configuration, and each operates independently of each other. Directly edit the corresponding `.atomconfig` file if you wish to change per project settings, and directly edit global configuration either through `Edit > Preferences` or `Edit > Config`.
