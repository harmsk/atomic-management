'use babel';

import { CompositeDisposable } from 'atom';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const CSON = require('season')

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'core-rework:toggle': () => this.setConfig(),
      'core-rework:resetState': () => this.resetState(),
    }));

    atom.workspace.onDidOpen((e) => {
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
    this.subscriptions.dispose();
    // this.coreReworkView.destroy();
  },

  serialize() {
    return {
      // coreReworkViewState: this.coreReworkView.serialize()
    };
  },

  readConfigFile(configName) {
    try {
      console.log(`configName: ${configName}`);
      if (configName.endsWith('.atomconfig.cson')) {
          contents = CSON.readFileSync(configName)
      } else if (configName.endsWith('.atomconfig.json')) {
          contents = JSON.parse(fs.readFileSync(configName))
      }
    } catch (e) {
          throw new Error('Unable to read supplied project specification file.')
          console.log(e)
    }
    atom.config.resetProjectSettings(contents, configName)
  },


  setConfig() {
    projectPaths = atom.project.getPaths()
    this.projectConfigs = []
    projectPaths.forEach(projectPath => {
      var config = glob.sync(`${projectPath}/*.atomconfig.?(cson|json)`)
      if (config.length!=0) {
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
            console.log(def)
            console.log(path)
            console.log(def.startsWith(path),'\n')
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
            checkboxChecked: true,
          }, (response, checkboxChecked) => {
            this.readConfigFile(this.projectConfigs[response].config)
            if(checkboxChecked) {
              this.defaultConfig=this.projectConfigs[response].config
            }
          })
        }
    }
  },

  resetState() {
    this.defaultConfig = null
    this.setConfig()
  }

};
