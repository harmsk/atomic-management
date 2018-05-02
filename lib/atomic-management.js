'use babel';
/*
Cornell University CS 5150 Spring 2018
Extend The Atom Project Team
Team members:
Saqif Badruddin <ssb229@cornell.edu>
Joseph Chuang <jcc436@cornell.edu>
Weiyou Dai <wd248@cornell.edu>
Jianhua Fan <jf773@cornell.edu>
Daniel Jordan Hirsch <djh329@cornell.edu>
Athena Danlu Huang <dh527@cornell.edu>
Tyler Yeung Ishikawa <tyi3@cornell.edu>
Jacob Ethan Rauch <jer322@cornell.edu>
*/

/* This package will enable users to configure per-project settings and to enable/disable packages in a customerized atomconfig.cson file.
*/

const fs = require('fs');
const glob = require('glob');
const CSON = require('season');

import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    // Activates and restores the previous session of your package.
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.currentConfig = null;
    this.isEnabled = true;
    this.configuredFields = new Map();

    /* Register commands that toggles this view, reset the configuration if available, and open the configuration file if exists. 
	The commands should be available in the packages dropdown menu.
    */
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atomic-management:toggle': () => this.toggle(),
        'atomic-management:resetState': () => this.resetState(),
        'atomic-management:openConfigFile': () => this.openConfigFile()
      })
    );

    // Register event handler to set project config when projects are
    // added/removed from the window
    this.subscriptions.add(
      atom.project.onDidChangePaths(paths => this.setConfig())
    );

    // Register event handler to set project config when current config file
    // is saved.
    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        editor.onDidSave(e => {
          // whenever users save, new configuration applies
          if (!this.isEnabled) return;
          if (!this.currentConfig || e.path === this.currentConfig) {
            this.setConfig();
          }
        });
      })
    );

    // Register event handler to set project config when item is opened
    this.subscriptions.add(
      atom.workspace.onDidOpen(e => {
        if (!this.isEnabled) return;
        //Only on opening the main panel or an editor
        //Also need TreeView on opening Atom with folder already
        if (
          e.item.constructor.name === 'PanelDock' ||
          e.item.constructor.name === 'TextEditor' ||
          e.item.constructor.name === 'TreeView'
        ) {
          this.setConfig();
        }
      })
    );
  },

  deactivate() {
    // When the user or Atom itself kills a window, this method is called.
    // It also disables the subscriptions.
    this.isEnabled = false;
    this.subscriptions.dispose();
  },

  serialize() {
    return;
  },

  toggle() {
    if (this.isEnabled) {
      // resets the project setting by reading the configuration file.
      atom.notifications.addSuccess(
        'Disabled atomic-management by toggle. \nRestoring global config.cson.',
        { dismissable: true }
      );
      this.isEnabled = false;
      this.defaultConfig = null;
      this.currentConfig = null;
      this.restoreGlobalConfig();
    } else {
      atom.notifications.addSuccess('Enabled atomic-management by toggle', {
        dismissable: true
      });
      this.isEnabled = true;
      this.setConfig();
    }
  },

  readConfigFile(configName) {
    let contents;

    try {
      /* reads the customerized atomconfig files either in cson or json format and stores them in a variable 'content'. The parameter contains the full path for the file.
    */
      if (configName.endsWith('atomconfig.cson')) {
        contents = CSON.readFileSync(configName);
      } else if (configName.endsWith('atomconfig.json')) {
        contents = JSON.parse(fs.readFileSync(configName));
      } else {
        // This Should never be executed, glob ensures that the only two
        // matching paterns are the two cases above
        return;
      }
    } catch (e) {
      atom.notifications.addWarning(
        // error handling by warning users and logging the error.
        [
          'Unable to read supplied project specification file:\n\n',
          `${configName}\n\n`,
          'Please check the config file. Restoring global config.cson.'
        ].join(''),
        {
          dismissable: true
        }
      );
      this.restoreGlobalConfig();
      console.log(e);
      return;
    }

    // case when atomconfig.cson or atomconfig.json is empty
    if (contents === null) {
      contents = {};
    }

    const currDisabled = this.getDisabledPackages(this.configContents);
    const newDisabled = this.getDisabledPackages(contents);
    if (this.configContents && !this.compareArrays(currDisabled, newDisabled)) {
      // if there is a change in disabledPackages array, it asks users for a reload.
      this.askReload();
    }

    // If a package is listed as disabled but not installed, ask user if they want to install it
    const installedPackageNames = new Set(
      atom.packages.getAvailablePackageNames()
    );
    /* finds all packages that are not installed but are in the customerized configuration file
    */
    const notInstalledPackageNames = newDisabled.filter(
      packageName => !installedPackageNames.has(packageName)
    );
    if ('*' in contents) {
      for (var toplevel in contents) {
        for (var pname in contents[toplevel]) {
          if (
            pname != 'core' &&
            pname != 'editor' &&
            !installedPackageNames.has(pname)
          ) {
            notInstalledPackageNames.push(pname);
          }
        }
      }
    } else {
      for (var pname in contents) {
        if (
          pname !== 'core' &&
          pname !== 'editor' &&
          !installedPackageNames.has(pname)
        ) {
          notInstalledPackageNames.push(pname);
        }
      }
    }

    if (notInstalledPackageNames.length !== 0) {
      this.askInstallPackages(notInstalledPackageNames);
    }

    this.config = configName;
    this.currentConfig = configName;
    this.configContents = contents;
    if (contents) {
      Object.keys(contents).forEach(namespace => {
        Object.keys(contents[namespace]).forEach(key => {
          if (!this.configuredFields.has(key)) {
            var keyPath = namespace + '.' + key;
            this.configuredFields = this.configuredFields.set(
              keyPath,
              contents[namespace][key]
            );
          }
        });
      });
    }
    atom.config.resetProjectSettings(
      contents,
      atom.enablePersistence || configName || atom.config.mainSource
    );
  },

  /**
   * Returns a string array of names of disabled packages specified in the given
   * configuration object.
   *
   * @param {Object} config An Atom configuration object
   */
  getDisabledPackages(config) {
    if (config) {
      if (config.core && config.core.disabledPackages) {
        return config.core.disabledPackages;
      } else if (
        config['*'] &&
        config['*'].core &&
        config['*'].core.disabledPackages
      ) {
        return config['*'].core.disabledPackages;
      }
    }
    return [];
  },

  askReload() {
    // prompts users for a reload.
    var notification = atom.notifications.addInfo('Package Reloading', {
      detail:
        'These package changes will take affect when you reload Atom. You can do this with the command `Window: Reload` in the Command Palette',
      buttons: [
        {
          text: 'Reload Now',
          onDidClick: () => {
            atom.reload();
          }
        },
        {
          text: 'Ignore',
          onDidClick: () => {
            notification.dismiss();
          }
        }
      ],
      dismissable: true
    });
  },

  compareArrays(arr1, arr2) {
    if ((arr1 && !arr2) || (!arr1 && arr2)) {
      return false;
    }
    if (!arr1 && !arr2) {
      return true;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  },

  setConfig() {
    // gets all available projects paths.
    const projectPaths = atom.project.getPaths();
    this.projectConfigs = [];
    projectPaths.forEach(projectPath => {
      var config = glob.sync(`${projectPath}/atomconfig.@(cson|json)`);
      if (config.length !== 0) {
        this.projectConfigs.push(config[0]);
      }
    });
    console.log(this.projectConfigs);

    if (this.projectConfigs.length === 0) {
      this.restoreGlobalConfig();
      return;
    } else if (this.projectConfigs.length === 1) {
      this.readConfigFile(this.projectConfigs[0]);
      return;
    }

    if (
      this.defaultConfig &&
      this.projectConfigs.includes(this.defaultConfig)
    ) {
      this.readConfigFile(this.defaultConfig);
    } else {
      /* If mulitiple project configurations detected, there will be a pop-up box for a confirmation of which project configuration to use. 
	Users will have the option to choose "Remember my choice" and the pop-up will not appear anymore unless users change their mind.
    */
      var buttons = this.projectConfigs.map(pc => {
        var split = pc.split('/');
        return split[split.length - 2];
      });
      atom.confirm(
        {
          message: 'Multiple Config ',
          detail:
            "We've detected multiple atomconfig files in your open projects, which would you like to apply? \n\n" +
            'Your choice is remembered until you quit Atom. \nYou can always reset the choice in "Packages -> atomic-management -> Reset remembered config"',
          buttons: buttons
        },
        response => {
          this.defaultConfig = this.projectConfigs[response];
          this.readConfigFile(this.projectConfigs[response]);
        }
      );
    }
  },

  openConfigFile() {
    console.log(this.currentConfig);
    atom.workspace.open(this.currentConfig);
  },

  resetState() {
    this.defaultConfig = null;
    this.setConfig();
  },

  /**
   * Instructs the user on how to install the specified packages.
   *
   * @param {Array<String>} packageNames The names of packages that are not installed currently
   */
  askInstallPackages(packageNames) {
    const message = 'Packages Not Installed';
    let description = `
    The following packages are listed under the "disabledPackages" configuration
    setting but are not installed. If you would like to install these packages,
    you can do so through the Atom > Preferences > Install menu, or by running
    this command in your terminal:

    <pre>apm install ${packageNames.join(' ')}</pre>
    `;

    description = description
      .split('\n')
      .join('')
      .trim();

    atom.notifications.addWarning(message, {
      description,
      dismissable: true
    });
  },

  /**
   * Unsets the local project configuration and restores the global
   * configuration.
   */
  restoreGlobalConfig() {
    atom.config.resetProjectSettings(
      CSON.readFileSync(atom.config.getUserConfigPath()),
      atom.config.getUserConfigPath()
    );
  }
};
