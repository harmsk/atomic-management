'use babel';

import AtomicManagement from '../lib/atomic-management';
const fs = require('fs');
const path = require('path');
const temp = require('temp')

// describe('backgroundColor', () => {
//     // let contents;
//     // let configName = __dirname + '/.atom/config.cson';
//     // try {
//     //     contents = CSON.readFileSync(configName);
//     // } catch(e) {
//     //     console.log(e);
//     // }
//
//     it('fontSize failed to change', () => {
//         // for(let key in contents) {
//         //     expect(atom.config.get(key)).not.toBe(contents[key]);
//         // }
//
//         expect(atom.config.get("editor.fontSize")).toBe(16);
//     });
// });

describe('Change configurations of a project', () => {
  let editor, buffer, filePath
  beforeEach(() => {
    //const directory = temp.mkdirSync()
    const directory = '/Users/weiyoud/github/AtomicManagement'
    atom.project.setPaths([directory])
    filePath = path.join(directory, '/.atom/config.cson')

    editor = atom.workspace.open(filePath)
    console.log(atom.config.get());
  })

  it('toggles the package', () => {
      atom.workspace.open(filePath).then((editor) => {
          expect(atom.config.get('atomic-management')).not.toBeDefined()
          AtomicManagement.toggle()
          expect(atom.config.get('atomic-management.isEnabled')).toBe(true)
          AtomicManagement.toggle()
          expect(atom.config.get('atomic-management.isEnabled')).toBe(false)
      })
  })

  it('enforces to toggle the package', () => {
      atom.workspace.open(filePath).then((editor) => {
          expect(atom.config.get('atomic-management')).not.toBeDefined()
          AtomicManagement.toggleEnforced()
          console.log(atom.config.get());
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(true)
          AtomicManagement.toggle()
          console.log(atom.config.get());
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(false)
      })
  })
});
