'use babel';

import AtomicManagement from '../lib/atomic-management';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomicManagement', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atomic-management');
  });

  describe('when the atomic-management:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.atomic-management')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atomic-management:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.atomic-management')).toExist();

        let atomicManagementElement = workspaceElement.querySelector('.atomic-management');
        expect(atomicManagementElement).toExist();

        let atomicManagementPanel = atom.workspace.panelForItem(atomicManagementElement);
        expect(atomicManagementPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'atomic-management:toggle');
        expect(atomicManagementPanel.isVisible()).toBe(false);
      });
    })

    describe('Change configurations of a project', () => {
      let editor
      beforeEach(() => {
        const directory = temp.mkdirSync()
        atom.project.setPaths([directory])
        const filePath = path.join(directory, 'myProject.atomconfig.cson')
        console.log("path = " + filePath)
        //editor = atom.workspace.open(filePath)
      })
      it('sets a project specification', () => {
        expect(atom.config.get('this.fontsize') == '10').toBe(false)

        atom.workspace.onDidOpen()
        this.toggle()
        expect(atom.config.get('this.fontSize')).toBe('10')
        expect(atom.config.get('this.themes')).toBe('one-light-ui')
        expect(atom.config.get('this.themes')).toBe('one-light-syntax')
      })
    });


    describe('Enable/Disable a project', () => {
      let editor
      beforeEach(() => {
        atom.packages.enablePackage('my-package2')
        atom.packages.enablePackage('php-server')

        expect(atom.packages.isPackageDisabled('my-package2')).toBe(false)
        expect(atom.packages.isPackageDisabled('php-server')).toBe(false)

        const directory = temp.mkdirSync()
        atom.project.setPaths([directory])
        const filePath = path.join(directory, 'myProject.atomconfig.cson')
        console.log("path = " + filePath)
        //editor = atom.workspace.open(filePath)
        editor = atom.workspace.buildTextEditor()
      })
      it('disables two dummy packages ', () => {
        atom.workspace.onDidOpen()
        this.toggle()
        expect(atom.packages.isPackageDisabled('my-package2')).toBe(true)
        expect(atom.packages.isPackageDisabled('php-server')).toBe(true)
      })
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.atomic-management')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atomic-management:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let atomicManagementElement = workspaceElement.querySelector('.atomic-management');
        expect(atomicManagementElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atomic-management:toggle');
        expect(atomicManagementElement).not.toBeVisible();
      });
    });
  });
});
