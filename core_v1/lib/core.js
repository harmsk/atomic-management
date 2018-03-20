'use babel';

// import TylerTestPkgView from './tyler-test-pkg-view'; import {
// CompositeDisposable } from 'atom';
const fs = require('fs');
const path = require('path');

export default {
  textEditorSubscription : null,

  applyConfig(filename, config) {
    console.log("apply config")
    console.log(filename)
    console.log(config)
    atom.config.resetProjectSettings(config["config"], filename)
  },

  paneOps(pane) {
    // If Pane is TextEditor
    if (pane.activeItem && pane.activeItem.__proto__.constructor.name && pane.activeItem.__proto__.constructor.name == "TextEditor") {
      let panesStyle = this.loadConfig(pane.activeItem.getPath(), this.applyConfig, pane)
    }
  },

  activate(state) {
    console.log("activated now");

    console.log(state)

    this.loadConfig(atom
      .project
      .getPaths(), this.applyConfig)
  },

  deactivate() {
    textEditorSubscription.dispose();
    console.log("deactivated");
  },

  loadConfig(dirName, applyConfig) {
    console.log(dirName[0])
    dirName = dirName[0]
    fs.readdir(dirName, (err, files) => {
      if (files) {
        files.forEach((file) => {
          if (file.endsWith(".atomproject.json")) {
            console.log("found thing!")
            filename = path.join(dirName, file)
            console.log(filename);
            const config = JSON.parse(fs.readFileSync(filename))
            console.log(config)
            applyConfig(filename, config)
          }
        })
      }
    })
  }

};
