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
          expect(atom.config.get('atomic-management.isActive')).toBe(true)
          AtomicManagement.toggle()
          expect(atom.config.get('atomic-management.isActive')).toBe(false)
  })

  it('enforces to toggle the package', () => {
          expect(atom.config.get('atomic-management')).not.toBeDefined()
          AtomicManagement.toggleEnforced()
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(true)
          AtomicManagement.toggleEnforced()
          expect(atom.config.get('atomic-management.enforceConfiguredPackages')).toBe(false)
  })
});

describe('gets disabled packages', () => {
    let filePath, contents
    beforeEach(() => {
        filePath = __dirname + "/../.atom/config.cson"
        contents = CSON.readFileSync(filePath);
    })

    // it('get disabled packages', () => {
    //     expect(disabledPackages).not.toBeDefined();
    //     var disabledPackages = AtomicManagement.getDisabledPackages(contents);
    //     expect(disabledPackages[0]).toBe('php-server');
    // })
});

describe("atomic-management default toggle", () => {
  let activationPromise, workspaceElement
  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('atomic-management')
    })
describe ("when the atomic-management:toggle() event is triggered", () => {
    it ("attaches and then detaches the view", () => {
        expect(workspaceElement.querySelector('.atomic-management')).not.toExist()

        //  This is an activation event, triggering it will cause the package to be
        //  activated.
        atom.commands.dispatch(workspaceElement, 'atomic-management:toggle()')
        runs => {
            expect(workspaceElement.querySelector('.atomic-management')).toExist()
            atom.commands.dispatch(workspaceElement, 'atomic-management:toggle()')
            expect(workspaceElement.querySelector('.atomic-management')).not.toExist()
        };
    });
    });
});

describe('when the atom text editor is destroyed', () => {
    let editor, workspaceElement, filePath
    beforeEach(async() => {
        const directory = temp.mkdirSync()
        atom.project.setPaths([directory])
        workspaceElement = atom.views.getView(atom.workspace)
        filePath = path.join(directory, 'testing.txt')
        editor =  atom.workspace.open(filePath)
        await atom.packages.activatePackage('atomic-management')
        editor.destroy()
    })

    it('does not leak subscriptions', async() => {
      const {atomicmanagement} = atom.packages.getActivePackage('atomic-management').mainModule
      expect(atomicmanagement.subscriptions.disposables.size).toBe(5)

      await atom.packages.deactivatePackage('atomic-management')
      expect(atomicmanagement.subscriptions.disposables).toBeNull()
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
        contentsWithAsteriskAndDisabledPackages = {"*": {"core":{"disabledPackages":["haha", "lol"]}}}
    })

    it('checks if there are two packages to be disabled', () => {
        var returnedContents = AtomicManagement.getDisabledPackages(contentsWithAsteriskAndDisabledPackages)
        expect(JSON.stringify(returnedContents)).toBe(JSON.stringify(["haha", "lol"]))
    })

    it('checks if there is no disabledPackage or core', () => {
        var returnedContents = AtomicManagement.getDisabledPackages(contentsWithoutAsterisk)
        expect(JSON.stringify(returnedContents)).toBe(JSON.stringify([]))
    })
});

describe('reloads', () => {
    it('asks users to reload packages', () => {
        AtomicManagement.askReload("haha", "okay")
    })
});

describe('global configuration', () => {
    it('restores global configurations', () => {
        AtomicManagement.restoreGlobalConfig()
    })
});
