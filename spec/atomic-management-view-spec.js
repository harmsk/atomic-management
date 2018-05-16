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
          expect(atom.config.get('atomic-management.isEnabled')).toBe(true)
          AtomicManagement.toggle()
          expect(atom.config.get('atomic-management.isEnabled')).toBe(false)
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

describe('when the disabledPackages have extra packages', () => {
    let disabledPackages, packages, disabledPackagesTypo, disabledPackagesEmpty, emptyPackages
    beforeEach(() => {
        disabledPackages = ["markdown-preview", "php-server", "atom-clock"]
        disabledPackagesTypo = ["markdown-preview", "php-server", "atom clock"]
        packages = ["markdown-preview", "php-server"]
        disabledPackagesEmpty = []
        emptyPackages = []
    })

    it('disabledPackages do have other packages', () => {
        expect(AtomicManagement.compareArrays(disabledPackages, packages)).toBe(false)
    })

    it('typo in disabledPackages', () => {
        expect(AtomicManagement.compareArrays(disabledPackages, disabledPackagesTypo)).toBe(false)
    })

    it('nothing in disabledPackages', () => {
        expect(AtomicManagement.compareArrays(disabledPackagesEmpty, emptyPackages)).toBe(true)
    })

    it('all packages in disabledPackages are installed', () => {
        expect(AtomicManagement.compareArrays(disabledPackages, packages)).toBe(false)
        packages.push("atom-clock")
        expect(AtomicManagement.compareArrays(disabledPackages, packages)).toBe(true)
    })
});

describe('Prompts users to install packages', () => {
    it('asks users to install packages', () => {
        AtomicManagement.askInstallPackages()
    })
});

describe('When there is an invalid/non-existing package', () => {
    let packageNames
    beforeEach(() => {
        packageNames = ["no-sense-testing", "haha-testing"]
    })

    it('alerts users to check packages', () => {
        AtomicManagement.alertBadPackages(packageNames)
    })
});

describe('Checks given packages list for uninstalled or non-existing packages', () => {
    let packageNames
    beforeEach(() => {
        packageNames = ["whitespace", "haha-testing"]
    })

    it('checks packages', () => {
        AtomicManagement.checkPackages(packageNames)
    })
});