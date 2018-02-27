'use babel';

// import TylerTestPkgView from './tyler-test-pkg-view';
// import { CompositeDisposable } from 'atom';
const fs = require('fs');
const path = require('path');

export default {

  // tylerTestPkgView: null,
  // modalPanel: null,
  // subscriptions: null,
  textEditorSubscription: null,

  activate(state) {
    // this.tylerTestPkgView = new TylerTestPkgView(state.tylerTestPkgViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.tylerTestPkgView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'tyler-test-pkg:toggle': () => this.toggle()
    // }));
    console.log("activated");
    // atom.window.onfocus = () => console.log("focused!");
    textEditorSubscription = atom.workspace.onDidChangeActiveTextEditor(currEditor => {
        console.log("active text editor change!");
        if (currEditor !== undefined) {
            this.loadSettings(currEditor.getPath())
            // console.log(currEditor.getPath());
        }
    });
  },

  deactivate() {
    // this.modalPanel.destroy();
    // this.subscriptions.dispose();
    // this.tylerTestPkgView.destroy();
    textEditorSubscription.dispose();
    console.log("deactivated");
  },

  // serialize() {
  //   return {
  //     tylerTestPkgViewState: this.tylerTestPkgView.serialize()
  //   };
  // },

  // toggle() {
  //   console.log('TylerTestPkg was toggled!');
  //   console.log(atom.workspace.getActiveTextEditor().getPath());
  //   console.log(path.dirname(atom.workspace.getActiveTextEditor().getPath()));
  //
  //   if (atom.packages.getActivePackage('vim-mode-plus') === undefined) {
  //       atom.packages.enablePackage('vim-mode-plus');
  //       atom.config.set("editor.fontSize", 20);
  //   } else {
  //       atom.packages.disablePackage('vim-mode-plus');
  //       atom.config.set("editor.fontSize", 14);
  //   }
  //   atom.packages.getAvailablePackageNames().
  //   atom.packages.disablePackage('vim-mode-plus');
  //   return (
  //     this.modalPanel.isVisible() ?
  //     this.modalPanel.hide() :
  //     this.modalPanel.show()
  //   );
  //   return true;
  // }

  loadSettings(filePath) {
      const dirPath = path.dirname(atom.workspace.getActiveTextEditor().getPath());
      const configFilePath = path.join(dirPath, "atomconfig.json");

      if (fs.existsSync(configFilePath)) {
          const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));

          atom.config.set("core.disabledPackages", config.disabledPackages);
          // config.disabledPackages.forEach(pkg => atom.packages.disablePackage(pkg));

          Object.entries(config.settings).forEach(([key, val]) => atom.config.set(key, val));
      }
  }

};
