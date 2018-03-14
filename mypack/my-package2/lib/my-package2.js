'use babel';

// import TylerTestPkgView from './tyler-test-pkg-view';
// import { CompositeDisposable } from 'atom';
const fs = require('fs');
const path = require('path');

export default {
  textEditorSubscription: null,

  applyConfig(config, pane) {
    let editor = pane.activeItem
    let elementToStyle = atom.views.getView(editor)
    const keys = Object.keys(config)
    keys.forEach((key) => {
      switch(key) {
        case "fontSize":
            editor.
            break;
        default:
          console.log(elementToStyle.style)
          if (elementToStyle.style.hasOwnProperty(key)) {
            elementToStyle.style[key] = config[key]
            elementToStyle.fontSize = 20;
            console.log(elementToStyle.style[key])
          }
      }
    })
  },

  paneOps(pane) {
    // If Pane is TextEditor
    if (pane.activeItem &&
       pane.activeItem.__proto__.constructor.name &&
       pane.activeItem.__proto__.constructor.name == "TextEditor") {
          let panesStyle = this.loadConfig(pane.activeItem.getPath(), this.applyConfig, pane)
    }
  },

  activate(state) {
    console.log("activated now");

    atom.workspace.observeTextEditors((editor) =>
      editor.onDidSave(() => {
        atom.workspace.getPanes().map((pane) => {
         this.paneOps(pane);
       })

      }
    ));
    },

  deactivate() {
    textEditorSubscription.dispose();
    console.log("deactivated");
  },

  loadConfig(filePath, applyConfig, pane) {
    dirName = path.dirname(filePath)
    fs.readdir(dirName,
      (err, files) => {
      if (files) {
        files.forEach( (file) => {
          if (path.extname(file) == ".atomconfig") {
            fileName = path.join(dirName, file)
            const config = JSON.parse(fs.readFileSync(fileName))
            applyConfig(config, pane)
          }
        })
      }
    })
  }

};
