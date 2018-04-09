'use babel';

import CoreReworkView from './core-rework-view';
import { CompositeDisposable } from 'atom';

const fs = require('fs');
const path = require('path');
const CSON = require('season')

export default {

  coreReworkView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.coreReworkView = new CoreReworkView(state.coreReworkViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.coreReworkView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'core-rework:toggle': () => this.toggle()
    }));

    atom.workspace.onDidOpen(() => {
      console.log("detected onDidOpen")
      this.toggle()
    })
    // atom.workspace.observePanes((pane) => {
    //   pane.onDidActivate(() => {
    //     console.log("Detected pane activate")
    //     this.toggle()
    //   })
    // })

    // atom.workspace.observePanes((pane) => {
    //   atom.workspace.onDidAddPane(({pane}) => {
    //     console.log('onDidAddPane detected')
    //   })
    // })

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.coreReworkView.destroy();
  },

  serialize() {
    return {
      coreReworkViewState: this.coreReworkView.serialize()
    };
  },

  readConfigFile(dirName) {
    let contents
    fs.readdir(dirName,
      (err, files) => {
      if (files) {
        files.forEach( (file) => {
          if (file.endsWith('.atomproject.cson')) {
            fileName = path.join(dirName, file)
            try {
              contents = CSON.readFileSync(fileName)
              // console.log(contents)
            } catch (e) {
              throw new Error('Unable to read supplied project specification file.')
              console.log(e)
            }
            this.generateProjectSpecification(contents, fileName)
          } else if (file.endsWith('.atomproject.json')) {
            fileName = path.join(dirName, file)
            try {
              contents = JSON.parse(fs.readFileSync(fileName))
              // console.log(contents)
            } catch (e) {
              throw new Error('Unable to read supplied project specification file.')
              console.log(e)
            }
            this.generateProjectSpecification(contents, fileName)
          }
        })
      }
    })
  },

  generateProjectSpecification(contents, fileName) {
    let projectSpecification = {}
    const pathToProjectFile = fileName
    const base = path.dirname(pathToProjectFile)

    let paths = (contents.paths == null)
      ? undefined
      : contents.paths.map(currentPath =>
        path.isAbsolute(currentPath)
        ? currentPath
        : path.join(base, currentPath)
      )

    console.log(paths)

    projectSpecification = {
      originPath: pathToProjectFile,
      paths,
      config: contents.config
    }

    // console.log(projectSpecification)
    atom.project.replace(projectSpecification)
  },

  toggle() {
    // console.log('CoreRework was toggled!')
    projectPaths = atom.project.getPaths()
    // console.log(projectPaths)
    projectPaths.forEach(projectPath =>
      this.readConfigFile(projectPath)
    )
  }

};
