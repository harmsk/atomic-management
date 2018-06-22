'use babel';

import AtomicManagement from '../lib/atomic-management';
const fs = require('fs');
const path = require('path');
const CSON = require('season');

describe("verify that the config of current window be changed as .atom/confing.cson", () => {
  it('should be consistent with the global config', () => {
    let globalConfig, userConfig
    try {
      globalConfig = CSON.readFileSync(__dirname + "/test.cson");
      userConfig = CSON.readFileSync(__dirname + "/../.atom/config.cson");
    } catch(e) {
      console.error(e);
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
