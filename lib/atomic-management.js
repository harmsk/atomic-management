'use babel';

const fs = require('fs');
const glob = require('glob');
const CSON = require('season')

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.currentConfig = null;
    this.isEnabled = true;

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atomic-management:toggle': () => this.toggle(),
      'atomic-management:resetState': () => this.resetState(),
      'atomic-management:openConfigFile': () => this.openConfigFile(),
    }));

    atom.workspace.observeTextEditors((editor) => {
      editor.onDidSave((e) => {
        if (! this.isEnabled) return;
        if(!this.currentConfig || e.path == this.currentConfig) {
          this.setConfig();
        }
      })
    })

    atom.workspace.onDidOpen((e) => {
      if (! this.isEnabled) return;
      //Only on opening the main panel or an editor
      //Also need TreeView on opening Atom with folder already
      if (e.item.constructor.name=='PanelDock'
        || e.item.constructor.name=='TextEditor'
        || e.item.constructor.name=='TreeView'
      ) {
        this.setConfig()
      }
    })
  },

  deactivate() {
    this.isEnabled = false;
    this.subscriptions.dispose();
  },

  serialize() {
    return;
  },

  toggle() {
    if (this.isEnabled) {
      atom.notifications.addSuccess('Disabled atomic-management by toggle. \nRestoring global config.cson', {dismissable: true})
      this.isEnabled = false
      this.defaultConfig = null
      this.currentConfig = null
      atom.config.resetProjectSettings(CSON.readFileSync(atom.config.getUserConfigPath()), atom.config.getUserConfigPath())
    }
    else {
      atom.notifications.addSuccess('Enabled atomic-management by toggle', {dismissable: true})
      this.isEnabled = true
      this.setConfig()
    }
  },

  readConfigFile(configName) {
    try {
      if (configName.endsWith('.atomconfig.cson')) {
          contents = CSON.readFileSync(configName)
      } else if (configName.endsWith('.atomconfig.json')) {
          contents = JSON.parse(fs.readFileSync(configName))
      }
    } catch (e) {
          atom.notifications.addWarning(`Unable to read supplied project specification file: \n\n ${configName} \n\n Please check the config file.`)
          console.log(e)
    }
    currDisabled = this.hasPackageDisable(this.configContents)
    newDisabled = this.hasPackageDisable(contents);
    if(this.configContents && !this.compareArrays(currDisabled,newDisabled)) {
        this.askReload()
    }
    this.currentConfig = configName
    this.configContents = contents
    atom.config.resetProjectSettings(contents, configName)
  },
  hasPackageDisable(config){
      if (config){
          if(config.core){
              return config.core.disabledPackages;
          }
          else if (config["*"].core){
              return config["*"].core.disabledPackages;
          }
      }
      return null;
  },
  askReload() {
    var notification = atom.notifications.addInfo("Package Reloading",
    {
      detail: "These package changes will take affect when you reload Atom. You can do this with the command `Window: Reload` in the Command Palette",
      buttons: [
        {text: 'Reload Now', onDidClick: () => {atom.reload()}},
        {text: 'Ignore', onDidClick: () => {notification.dismiss()}}
      ],
      dismissable: true
    })
  },

  compareArrays(arr1, arr2) {
    if((arr1 && !arr2) || (!arr1 && arr2)){
        return false
    }
    if(!arr1 && !arr2){
        return true
    }
    if(arr1.length!=arr2.length) {
      return false
    }
    for(i=0;i<arr1.length;i++) {
      if(arr1[i]!=arr2[i]){
        return false;
      }
    }
    return true;
  },

  setConfig() {
    projectPaths = atom.project.getPaths()
    this.projectConfigs = []
    projectPaths.forEach(projectPath => {
      var config = glob.sync(`${projectPath}/*.atomconfig.?(cson|json)`)
      if (config.length != 0) {
        this.projectConfigs.push({projectPath, config: config[0]})
      }
    })
    switch(this.projectConfigs.length) {
      case 0:
        return;
      case 1:
        this.readConfigFile(this.projectConfigs[0].config)
        break;
      default:
        // If the default exists and one of the paths is the current default
        function defaultCheck(def) {
          return (function(path) {
            return def.startsWith(path)
          })
        }
        if(this.defaultConfig && projectPaths.some(defaultCheck(this.defaultConfig))) {
          this.readConfigFile(this.defaultConfig, projectPaths)
        } else {
          var buttons = this.projectConfigs.map(pc => {
            var split = pc.projectPath.split('/');
            return split[split.length-1];
          })
          atom.confirm({
            message: 'Multiple Config ',
            detail: 'We\'ve detected multiple .atomconfig files in your open projects, which would you like to apply: ',
            buttons: buttons,
            checkboxLabel: 'Remember my choice',
            checkboxChecked: false,
          }, (response, checkboxChecked) => {
            this.readConfigFile(this.projectConfigs[response].config)
            if(checkboxChecked) {
              this.defaultConfig=this.projectConfigs[response].config
            }
          })
        }
    }
  },

  openConfigFile() {
      console.log(this.currentConfig)
      atom.workspace.open(this.currentConfig)
  },

  resetState() {
    this.defaultConfig = null
    this.setConfig()
  }

};
