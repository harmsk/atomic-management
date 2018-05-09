'use babel';

import AtomicManagement from '../lib/atomic-management';
const fs = require('fs');
const path = require('path');
const temp = require('temp');
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

describe('two ways of toggling a project', () => {
  it('toggles the package', () => {
          expect(atom.config.get('atomic-management')).not.toBeDefined()
          expect(atom.config.get('editor.fontSize')).toBe(16)
          AtomicManagement.toggle()
          expect(atom.config.get('editor.fontSize')).toBe(16)
          expect(atom.config.get('editor.tabLength')).toBe(2)
          expect(atom.config.get('atomic-management.isEnabled')).toBe(true)
          AtomicManagement.toggle()
          expect(atom.config.get('editor.fontSize')).toBe(16)
          expect(atom.config.get('editor.tabLength')).toBe(2)
          expect(atom.config.get('atomic-management.isEnabled')).toBe(false)
  })

  it('enforces to toggle the package', () => {
          expect(atom.config.get('atomic-management')).not.toBeDefined()
          expect(atom.config.get('editor.fontSize')).toBe(16)
          expect(atom.config.get('editor.tabLength')).toBe(2)
          AtomicManagement.toggleEnforced()
          expect(atom.config.get('editor.fontSize')).toBe(16)
          expect(atom.config.get('editor.tabLength')).toBe(2)
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(true)
          AtomicManagement.toggleEnforced()
          expect(atom.config.get('editor.fontSize')).toBe(16)
          expect(atom.config.get('editor.tabLength')).toBe(2)
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(false)
  })
});

// describe('reads the configuration file', () => {
//     let filePath
//     beforeEach(() => {
//
//         filePath = "users/weiyoud/github/AtomicManagement/.atom/config.cson"
//         // console.log(atom.config.set("editor.fontSize", 13))
//         console.log(AtomicManagement.installedPackageNames)
//     })
//
//     it('apply users customerized configuration', () => {
//       expect(atom.config.get('atomic-management')).not.toBeDefined()
//       AtomicManagement.toggle()
//       expect(atom.config.get('atomic-management.isEnabled')).toBe(true)
//       // console.log(filePath)
//
//       //AtomicManagement.readConfigFile(filePath)
//       console.log(atom.packages.getAvailablePackageNames())
//       //console.log(atom.config.get())
//     })
//
// });
//
// describe('resets state of a project', () => {
//     let projectPaths
//     beforeEach(() => {
//         const directory = temp.mkdirSync()
//         atom.project.setPaths([directory])
//         const filePath = path.join(directory, './atom/config.cson')
//         projectPaths = "users/weiyoud/github/AtomicManagement"
//         editor = atom.workspace.open(filePath)
//         // console.log(atom.config.set("editor.fontSize", 13))
//         // console.log(atom.config.get())
//     })
//     it('apply users customerized configuration', () => {
//       expect(atom.config.get('atomic-management')).not.toBeDefined()
//       AtomicManagement.toggle()
//       expect(atom.config.get('atomic-management.isEnabled')).toBe(true)
//      // console.log(atom.config.get())
//       atom.project.setPaths(projectPaths)
//       //console.log(atom.config.get())
// //      AtomicManagement.resetState()
//       //console.log(atom.config.get())
//     })
//
// });
