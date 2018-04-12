'use babel';

// import TylerTestPkgView from './tyler-test-pkg-view';
import { CompositeDisposable } from 'atom';
const fs = require('fs');
const path = require('path');

export default {
  textEditorSubscription: null,

  applyConfig(config, pane) {
    let editor = pane.activeItem
    let elementToStyle = atom.views.getView(editor)
    const keys = Object.keys(config)
    console.log(elementToStyle.style)
    keys.forEach((key) => {
      if (elementToStyle.style.hasOwnProperty(key)) {
        elementToStyle.style[key] = config[key]
        elementToStyle.style["fontSize"] = "20";
        console.log(elementToStyle.style[key])
      }
    })
    paneStyle = JSON.stringify(elementToStyle.style)
    paneFilePath = editor.getPath();
    dirName = path.dirname(paneFilePath);
    fileName = path.join(dirName, 'test.json');
    console.log(fileName);
    fs.writeFile(fileName, paneStyle, (err) => {
      if (err) throw err;
      console.log("The file was succesfully saved!");
    });
  },

  paneOps(pane) {
    // If Pane is TextEditor
    console.log('pane')
    if (pane.activeItem &&
       pane.activeItem.__proto__.constructor.name &&
       pane.activeItem.__proto__.constructor.name == "TextEditor") {
          let panesStyle = this.loadConfig(pane.activeItem.getPath(), this.applyConfig, pane)
    }
  },

  activate(state) {
    atom.notifications.addSuccess('activate now')
    console.log("activated now");

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'my-package2:toggle': () => this.toggle()
    }))

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
    console.log('loadConfig')
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
  },
  toggle() {
    atom.workspace.getPanes().map((pane) => {
         this.paneOps(pane);
    });
  }
};
