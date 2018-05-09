'use babel';

const temp = require('temp')
const path = require('path')
const fs = require('fs');
const CSON = require('season')

import AtomicManagement from '../lib/atomic-management';

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

describe('gets disabled packages', () => {
    let filePath, contents
    beforeEach(() => {
        filePath = "users/weiyoud/github/AtomicManagement/.atom/config.cson"
        contents = CSON.readFileSync(filePath);
    })

    it('get disabled packages', () => {
        expect(disabledPackages).not.toBeDefined();
        var disabledPackages = AtomicManagement.getDisabledPackages(contents);
        expect(disabledPackages[0]).toBe('php-server');
    })

    it('opens configuration files', () => {
        AtomicManagement.currentConfig = filePath
        console.log(AtomicManagement.currentConfig)
        AtomicManagement.openConfigFile()
    })
});
