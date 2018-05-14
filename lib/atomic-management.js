'use babel';
/**
 * Cornell University CS 5150 Spring 2018
 * Extend The Atom Project Team
 * Team members:
 * Saqif Badruddin <ssb229@cornell.edu>
 * Joseph Chuang <jcc436@cornell.edu>
 * Weiyou Dai <wd248@cornell.edu>
 * Jianhua Fan <jf773@cornell.edu>
 * Daniel Jordan Hirsch <djh329@cornell.edu>
 * Athena Danlu Huang <dh527@cornell.edu>
 * Tyler Yeung Ishikawa <tyi3@cornell.edu>
 * Jacob Ethan Rauch <jer322@cornell.edu>
 */

/**
 * This package enables users to configure per-project settings using an
 * .atom/config.cson file.
 */

// requires fs, glob, season libraries and assigned them as constants.
const fs = require('fs');
const glob = require('glob');
const CSON = require('season');
const mergeJSON = require("merge-json") ;

const CONFIG_FILE_PREFIX = '.atom/config'
import { CompositeDisposable, BufferedProcess } from 'atom';

import RootController from './views/RootController';

import React from 'react';
import ReactDom from 'react-dom';


// import 'font-awesome/css/font-awesome.min.css';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.currentConfig = null;
    this.enabledProjects = [];
    // Register commands that toggles this view, reset the configuration if
    // available, and open the configuration file if exists. The commands should
    // be available in the Packages dropdown menu.
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atomic-management:toggle': () => this.toggle(),
        'atomic-management:resetState': () => this.resetState(),
        'atomic-management:toggleEnforced': () => this.toggleEnforced()
      }),
      atom.config.onDidChange("atomic-management.isEnabled",
        ({newValue, oldValue}) => { this.enabledChanged(newValue); }
      ),
      // Register event handler to set project config when projects are
      // added/removed from the window
      atom.project.onDidChangePaths(paths => {
          this.setConfig()
      }),
      // Register event handler to set project config when current config file
      // is saved.
      atom.workspace.observeTextEditors(editor => {
        editor.onDidSave(e => {
          // whenever users save, new configuration applies
          if (!this.currentConfig || this.currentConfig.includes(e.path)) {
            this.setConfig();
          }
        });
      }),
      // Register event handler to set project config when item is opened
      atom.workspace.onDidOpen(e => {
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


  consumeStatusBar(statusBar) {
    this.element = document.createElement('div');
    this.element.id = 'renderPanel';
    this.statusBar = statusBar
    this.tooltips = atom.tooltips
    this.tile = this.statusBar.addLeftTile({item: this.element, priority: 100});
  },

  updateStatusBar() {
    if (this.tile) {
      this.tile.destroy()
    }
    if(this.element) {
      console.log(this.element)
      var elem = document.getElementById(this.element.id);
      if(elem) {
        console.log('here')
        elem.parentNode.removeChild(elem);
      }
    }
    // if(!this.element) {
      // this.tile = this.statusBar.addLeftTile({item: this.element, priority: 100});
    // }
    ReactDom.render(<RootController
      statusBar={this.statusBar}
      tooltips={this.tooltips}
      projectConfigs={this.projectConfigs}
      enabledConfigs={this.enabledProjects}
      onReorder={this.onReorder.bind(this)}
      onCheck={this.onCheck.bind(this)}
      />, this.element);
},

  deactivate() {
    this.restoreGlobalConfig();
    this.subscriptions.dispose();
    if (this.tile != null) {
      this.tile.destroy();
    }
    if(this.tooltips) {
      this.tooltips.dispose();
    }
  },

  serialize() {
    return;
  },

  /**
   * Toggles Atomic Management on/off depending on the new value of
   * `atomic-management.isEnabled`. If the package is toggled off, the global
   * configuration settings will be restored. If the package is toggled on,
   * local configuration settings, if any, will go into effect.
   *
   * @param {Boolean} newValue The new value of `atomic-management.isEnabled`
   */
  enabledChanged(newValue){
    if(!newValue){
      atom.notifications.addSuccess(
        'Disabled atomic-management by toggle. \nRestoring global config.cson.',
        { dismissable: true }
      );
      this.defaultConfig = null;
      this.currentConfig = null;
      this.projectToConfigContentsMap = new Map();
      // resets the project setting by reading the global configuration file.
      this.restoreGlobalConfig();
    }
    else {
      atom.notifications.addSuccess('Enabled atomic-management by toggle', {
        dismissable: true
      });
      this.setConfig();
      this.updateStatusBar();
    }
  },

  toggle() {
    let old = atom.config.get('atomic-management.isEnabled');
    atom.config.set('atomic-management.isEnabled', !old);
  },

  toggleEnforced() {
    let old = atom.config.get('atomic-management.enforceConfiguredPackages');
    atom.config.set('atomic-management.enforceConfiguredPackages', !old);
  },

  /**
   * Returns a string array of names of disabled packages specified in the given
   * configuration object.
   *
   * @param {Object} config An Atom configuration object
   */
  getDisabledPackages(config) {
    if (config) {
      config = this.standardizeConfig(config);

      if (config['*'].core && config['*'].core.disabledPackages) {
        return config['*'].core.disabledPackages;
      }
    }
    return [];
  },

  /**
   * Prompts user to reload the window.
   */
  askReload(customMessage = null, customDescription = null) {
    if (customMessage === null) {
      customMessage = 'Package Reloading';
    }
    if (customDescription === null) {
      customDescription =
        'These package changes may not take affect until you reload Atom.' +
        'Would you like to reload the window now?'
    }

    var notification = atom.notifications.addInfo(customMessage, {
      description: customDescription,
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

  /**
   * Compares two arrays for equality.
   *
   * @param {Array} arr1
   * @param {Array} arr2
   */
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

  /**
   * Sets the window's configuration based on the opened projects. If multiple
   * projects in this window have their own configuration files, the user will
   * be given the option to choose between the configurations.
   */
  setConfig() {
    if (!atom.config.get('atomic-management.isEnabled')) return;
    const projectPaths = atom.project.getPaths();
    this.projectConfigs = [];
    projectPaths.forEach(projectPath => {
      var config = glob.sync(`${projectPath}/${CONFIG_FILE_PREFIX}.@(cson|json)`);
      if (config.length !== 0) {
        this.projectConfigs.push(config[0]);
      }
    });
    if (this.projectConfigs.length === 0) {
      this.restoreGlobalConfig();
      return;
    } else if (this.projectConfigs.length === 1) {
      this.readConfigs([this.projectConfigs[0]]);
      this.updateStatusBar()
      return;
    }
    if (this.defaultConfig && this.defaultConfig.every((file) => {return this.projectConfigs.includes(file)})) {
      this.readConfigs(this.defaultConfig);
      this.updateStatusBar()
  } else {
      var buttons = this.projectConfigs.map(pc => {
        var split = pc.split('/');
        return split[split.length - 3];
      });
      buttons.push("Merge configs");

      const detail =
            `We've detected multiple .atom/config files in your open ` +
            `projects, which would you like to apply? \n\n` +
            `Your choice is remembered until you quit Atom. \n` +
            `You can always reset the choice in ` +
            `"Packages -> atomic-management -> Reset remembered config"`;

      atom.confirm(
        {
          message: 'Multiple Config ',
          detail: detail,
          buttons: buttons
        },
        response => {
          this.hasAskedForConflict = true;
          if (response === buttons.length - 1) {
            this.readConfigs();
          } else {
            this.readConfigs([this.projectConfigs[response]])
          }
          this.updateStatusBar();
        }
      );
    }
  },

  /** Function to be called on reordering of project settings
   * newOrder is the full paths of projects in their new order of priority
   */
  onReorder(newOrder) {
    this.readConfigs(newOrder);
    this.updateStatusBar();
},

/** Function to be called when a check box of the status bar gui is
 * clicked. Gets passed index of projectConfigs of the file that was changed
 * and the state of all checkboxes, prior to this change, where the last element
 * is */
onCheck(index, checked){
  //If the config file is currently impactful, remove it
  var nowEnabled = []
  this.projectConfigs.forEach((file, ind) => {
    if(checked[ind]) {
      nowEnabled.push(file)
    }
  })
  this.readConfigs(nowEnabled)
  this.updateStatusBar();
},

  /**
   * merge all config.cson detected in all open project.
   * Upper projects take precedence over lower ones if there are conflicting entries
   */
  readConfigs(newProjectConfigsArray=this.projectConfigs) {
    var mergedConfig = {};
    this.enabledProjects=[]
    newProjectConfigsArray.forEach(configName => {
      let contents;
      try {
        if (configName.endsWith('.cson')) {
          contents = CSON.readFileSync(configName);
        } else if (configName.endsWith('.json')) {
          contents = JSON.parse(fs.readFileSync(configName));
        }
        contents = this.standardizeConfig(contents);
      } catch (e) {
        atom.notifications.addWarning(
          [
            'Unable to read supplied project specification file:\n\n',
            `${configName}\n\n`,
            'Please check the config file. Restoring global config.cson.'
          ].join(''),
          {
            dismissable: true
          }
        );
        console.log(e);
        return;
      }
      if (contents === null) {
        contents = {};
      }
      this.enabledProjects.push(configName)
      mergedConfig = mergeJSON.merge(contents,mergedConfig);
    });
    this.defaultConfig=newProjectConfigsArray;
    const currDisabled = this.getDisabledPackages(this.configContents);
    const newDisabled = this.getDisabledPackages(mergedConfig);
    if (this.configContents && !this.compareArrays(currDisabled, newDisabled)) {
      this.askReload();
    }
    const installedPackageNames = new Set(
      atom.packages.getAvailablePackageNames()
    );
    const notInstalledPackageNames = [];//newDisabled.filter(packageName => !installedPackageNames.has(packageName));
    for (var toplevel in mergedConfig) {
      for (var pname in mergedConfig[toplevel]) {
        if (pname != "core" &&
            pname != "editor" &&
            !installedPackageNames.has(pname)) {
          notInstalledPackageNames.push(pname);
        }
      }
    }

    if (notInstalledPackageNames.length !== 0) {
      this.askInstallPackages(notInstalledPackageNames);
    }
    this.currentConfig = this.enabledProjects
    this.configContents = mergedConfig;
    atom.config.resetProjectSettings(
      mergedConfig,
      this.projectConfigs[0] || atom.config.mainSource
    );
  },

  /**
   * Resets the default configuration file for the current window.
   */
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
    if (!atom.config.get('atomic-management.enforceConfiguredPackages')){
      return
    }

    const message = 'Packages Not Installed';
    const description =
      'The following packages are configured in the local project ' +
      'configuration file but are not installed. Would you like to install ' +
      'these packages now?\n\n' +
      packageNames.map(name => `- ${name}`).join('\n');

    const notification = atom.notifications.addWarning(message, {
      description,
      dismissable: true,
      buttons: [
        {
          text: 'Install Packages',
          onDidClick: () => {
            this.installPackages(packageNames);
            notification.dismiss();
          }
        },
        {
          text: 'Ignore',
          onDidClick: () => {
            notification.dismiss();
          }
        }
      ]
    });
  },

  /**
   * Unsets the local project configuration and restores the global
   * configuration.
   */
  restoreGlobalConfig() {
    atom.config.resetProjectSettings ({}, true)
    atom.config.clearProjectSettings();
    this.currentConfig=null;
    this.updateStatusBar()
  },

  /**
  * Installs the packages specified using apm install. Will silently ignore
  * any package names that contain spaces, because that is invalid.
  *
  * @param {Array<String>} packageNames The package names to install
  */
  installPackages(packageNames) {
    // ignore any package names that contain spaces
    packageNames = packageNames.filter(name => name.indexOf(' ') === -1);

    if (packageNames.length === 0) {
      return;
    }

    const installPromises = [];

    const command = atom.packages.getApmPath();
    const stdout = output => console.log(output);

    packageNames.forEach(name => {
      const args = ['install', name];

      let exit;
      const myPromise = new Promise((resolve, reject) => {
        exit = code => {
          resolve({packageName: name, code: code})
        }
      });

      installPromises.push(myPromise);

      const process = new BufferedProcess({ command, args, stdout, exit });
    });

    Promise.all(installPromises)
      .then(allResults => {
        const successful = allResults
                           .filter(r => r.code === 0)
                           .map(r => r.packageName);

        const message = "Reload to Use Packages";
        const detail =
          "The following packages have been installed successfully (any " +
          "packages not listed may be misspelled in your config file):\n\n" +
          successful.map(name => `- ${name}`).join('\n') +
          "\n\n" +
          "Would you like to reload the window to begin using these packages?";

        if (successful.length > 0) {
          this.askReload(message, detail);
        } else {
          const err =
            "None of the packages could be installed. Please ensure that " +
            "the package names are not misspelled in your config file.";

          atom.notifications.addError(err);
        }
      });
  },

  /**
   * Adds global namespace to configuration object if it does not use
   * namespaces.
   *
   * @param {Object} config A configuration object
   */
  standardizeConfig(config) {
    if ("*" in config){
      return config;
    } else {
      return {"*": config};
    }
  }
};
