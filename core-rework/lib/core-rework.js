'use babel';

import CoreReworkView from './core-rework-view';
import { CompositeDisposable } from 'atom';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const CSON = require('season')

export default {

  coreReworkView: null,
  subscriptions: null,

  // atom.workspace.onDidOpen(() => {
  //   console.log("detected onDidOpen")
  //   this.toggle()

  activate(state) {
    this.coreReworkView = new CoreReworkView(state.coreReworkViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'core-rework:toggle': () => this.setConfig(),
    }));

    atom.workspace.onDidOpen((e) => {
      //Only on opening the main panel or an editor, not other panels such as TreeView
      if (e.item.constructor.name=='PanelDock' || e.item.constructor.name=='TextEditor') {
        this.setConfig()
      }
    })

  },

  deactivate() {
    this.subscriptions.dispose();
    this.coreReworkView.destroy();
  },

  serialize() {
    return {
      coreReworkViewState: this.coreReworkView.serialize()
    };
  },

  readConfigFile(configName, pathsToOpen) {
    try {
      if (configName.endsWith('.atomproject.cson')) {
          contents = CSON.readFileSync(configName)
      } else if (configName.endsWith('.atomproject.json')) {
          contents = JSON.parse(fs.readFileSync(configName))
      }
    } catch (e) {
          throw new Error('Unable to read supplied project specification file.')
          console.log(e)
    }
    this.generateProjectSpecification(contents, configName, pathsToOpen)
  },

  generateProjectSpecification(contents, projectConfigPath, filesToOpen) {
    let projectSpecification = {}
    let paths = atom.project.getPaths()
    projectSpecification = {
      originPath: projectConfigPath,
      paths: filesToOpen,
      config: contents.config
    }
    atom.project.replace(projectSpecification)
  },

  setConfig() {
    projectPaths = atom.project.getPaths()
    this.projectConfigs = []
    projectPaths.forEach(projectPath => {
      var config = glob.sync(`${projectPath}/*.atomproject.?(cson|json)`)
      if (config.length!=0) {
        this.projectConfigs.push({projectPath, config: config[0]})
      }
    })
    switch(this.projectConfigs.length) {
      case 0:
        return;
      case 1:
        this.readConfigFile(this.projectConfigs[0].config, projectPaths)
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
        if(this.default && projectPaths.some(defaultCheck(this.default))) {
          this.readConfigFile(this.default, projectPaths)
        } else {
          var buttons = this.projectConfigs.map(pc => {
            var split = pc.projectPath.split('/');
            return split[split.length-1];
          })
          atom.confirm({
            message: 'Multiple Config ',
            detail: 'We\'ve detected multiple configuration files, which would you like to choose: ',
            buttons: buttons,
            checkboxLabel: 'Remember my choice',
            checkboxChecked: true,
          }, (response, checkboxChecked) => {
            this.readConfigFile(this.projectConfigs[response].config, projectPaths)
            if(checkboxChecked) {
              this.default=this.projectConfigs[response].config
            }
          })
        }
    }
  }

};
