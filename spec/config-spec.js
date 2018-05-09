'use babel';

import AtomicManagement from '../lib/atomic-management';
const fs = require('fs');
const path = require('path');
const temp = require('temp');
const CSON = require('season');

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
          AtomicManagement.toggle()
          console.log(atom.config.get());
          expect(atom.config.get('atomic-management.isEnabled')).toBe(true)
          AtomicManagement.toggle()
          console.log(atom.config.get());
          expect(atom.config.get('atomic-management.isEnabled')).toBe(false)
  })

  it('enforces to toggle the package', () => {
          expect(atom.config.get('atomic-management')).not.toBeDefined()
          AtomicManagement.toggleEnforced()
          console.log(atom.config.get());
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(true)
          AtomicManagement.toggleEnforced()
          console.log(atom.config.get());
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(false)
  })
});

describe("verify that the config of current window be changed as .atom/confing.cson", () => {
    it('should be consistent with the global config', () => {
        let globalConfig, userConfig
        try {
            globalConfig = CSON.readFileSync(__dirname + "/test.cson");
            userConfig = CSON.readFileSync(__dirname + "/../.atom/config.cson");
        } catch(e) {
            console.log(e);
        }
        expect(globalConfig).not.toBeNull();
        expect(userConfig).not.toBeNull();
        function compare(user, glob) {
            for(var toplevel in user) {
                for(var keyPath in user[toplevel]) {
                    var vals = user[toplevel][keyPath]
                    if(Array.isArray(vals)) {
                        vals.forEach(val => {
                            console.log(val)
                            expect(glob[toplevel][keyPath]).toContain(val)
                        })
                    } else {
                        console.log(vals)
                        expect(glob[toplevel][keyPath]).toEqual(vals)
                    }
                }
            }
        }
        if("*" in userConfig) {
            compare(userConfig["*"], globalConfig)
        } else {
            compare(userConfig["*"], globalConfig)
        }

    });
});
