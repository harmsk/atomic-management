'use babel';

const temp = require('temp')
const path = require('path')
const fs = require('fs');
const CSON = require('season')

import AtomicManagement from '../lib/atomic-management';

describe("verify enforce configured packages", () => {
  it('enforces to toggle the package', () => {
    expect(atom.config.get('atomic-management')).not.toBeDefined()
    AtomicManagement.toggleEnforceConfiguredPackages()
    expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(true)
    AtomicManagement.toggleEnforceConfiguredPackages()
    expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(false)
  });
});

describe('gets disabled packages', () => {
  let filePath, contents
  beforeEach(() => {
    filePath = __dirname + "/../.atom/config.cson"
    contents = CSON.readFileSync(filePath);
  })
});

describe('prompts users to handle packages errors', () => {
  let packageNames, packagesMap
  beforeEach(() => {
    packageNames = ["haha-testing", "happy"]
    packagesMap = new Map()
    packagesMap.set("[]", [])
  })

  it('asks users to install packages', () => {
    AtomicManagement.askInstallPackages(packageNames)
  })

  it('alerts users to check the configuration file', () => {
    AtomicManagement.alertBadPackages(packageNames)
  })

  it('installs specified packages', () => {
    AtomicManagement.installPackages(packageNames)
  })

  it('checks existance of packages', () => {
    AtomicManagement.checkPackages(packagesMap)
  })

});

describe('tests status bar', () => {
  let contentsWithAsterisk, contentsWithoutAsterisk
  beforeEach(() => {
    contentsWithAsterisk = {"*": "Testing"}
    contentsWithoutAsterisk = {"": "Testing"}
  })

  it('parses a configuration file without Asterisk', () => {
    var returnedContents = AtomicManagement.standardizeConfig(contentsWithoutAsterisk)
    expect(JSON.stringify(returnedContents)).toBe(JSON.stringify({"*":contentsWithoutAsterisk}))
  })

  it('parses a configuration file with Asterisk', () => {
    var returnedContents = AtomicManagement.standardizeConfig(contentsWithAsterisk)
    expect(JSON.stringify(returnedContents)).toBe(JSON.stringify(contentsWithAsterisk))
  })
});

describe('Checks "disabledPackages"', () => {
  let contentsWithAsterisk, contentsWithoutAsterisk, contentsWithAsteriskAndDisabledPackages
  beforeEach(() => {
    contentsWithAsterisk = {"*": "Testing"}
    contentsWithoutAsterisk = {"": "Testing"}
    contentsWithAsteriskAndDisabledPackages = {"*": {"core":{"disabledPackages":["testing", "package"]}}}
  })

  it('checks if there are two packages to be disabled', () => {
    var returnedContents = AtomicManagement.getDisabledPackages(contentsWithAsteriskAndDisabledPackages)
    expect(JSON.stringify(returnedContents)).toBe(JSON.stringify(["testing", "package"]))
  })

  it('checks if there is no disabledPackage or core', () => {
    var returnedContents = AtomicManagement.getDisabledPackages(contentsWithoutAsterisk)
    expect(JSON.stringify(returnedContents)).toBe(JSON.stringify([]))
  })
});

describe('reloads', () => {
  it('asks users to reload packages', () => {
    AtomicManagement.askReloadAtom("testing", "")
  })
});

describe('global configuration', () => {
  it('restores global configurations', () => {
    AtomicManagement.restoreGlobalConfig()
  })
});
