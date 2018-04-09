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

  paneOps(pane) {
    // If Pane is TextEditor
    console.log('pane')
    if (pane.activeItem &&
       pane.activeItem.__proto__.constructor.name &&
       pane.activeItem.__proto__.constructor.name == "TextEditor") {
          this.readConfigFile(pane.activeItem.getPath(), pane)
    }
  },

  readConfigFile(filePath, pane) {
    let contents
    const dirName = path.dirname(filePath)
    console.log(filePath)
    fs.readdir(dirName,
      (err, files) => {
      if (files) {
        files.forEach( (file) => {
          if (path.extname(file) == ".cson") {
            fileName = path.join(dirName, file)
            // const contents = JSON.parse(fs.readFileSync(fileName))
            try {
              contents = CSON.readFileSync(fileName)
              console.log(contents)
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

    const paths = (contents.paths == null)
      ? undefined
      : contents.paths.map(currentPath =>
        path.isAbsolute(currentPath)
        ? currentPath
        : path.join(base, currentPath)
      )

    // const paths = null

    console.log(paths)

    projectSpecification = {
      originPath: pathToProjectFile,
      paths,
      config: contents.config
    }

    console.log(projectSpecification)
    atom.project.replace(projectSpecification)
  },

  toggle() {
    console.log('CoreRework was toggled!')
    atom.workspace.getPanes().map((pane) => {
         this.paneOps(pane);
    });
  }

};
