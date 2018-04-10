# Atomic Management
Per-project Atom text editor configurations, for each window.

## Prerequisites
Requires Atom v1.24.1 or above

## Usage
When a folder/project is loaded, Atomic Management will look for a `*.atomproject.cson` or `*.atomproject.json` file in the opened folder. If no such file is found, global configuration are used (as per usual). If a project file is indeed found, they are loaded as Project Configurations and will override the global configuration when in the project's context.

This allows for configuring visuals for different projects (font size, color, themes), as well as the activation/deactivation of packages on a per-project basis, *without* tampering with global configurations.

Usage of this package should be straightforward after install, as long as the `atomproject` file is setup correctly. If you encounter issues, feel free to submit an issue on Github.

## Project files
Project files should be specified according to the official Atom Per-Project Configuration file guidelines. For example:

```
project.atomproject.cson

{
  "paths": [
    "."
  ],
  "config": {
    core: {
      themes: [
        "one-light-ui",
        "one-light-syntax"
      ]
      disabledPackages: [
        "php-server"
      ]
    }
    editor:
      fontSize:13
  }
}
```

The configuration described in the atomproject file will override the default Atom configuration, and each operates independently of each other. Directly edit the corresponding `.atomproject` file if you wish to change per project settings, and directly edit global configuration either through `Edit > Preferences` or `Edit > Config`.
