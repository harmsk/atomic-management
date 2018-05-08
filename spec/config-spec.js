'use babel';

import AtomicManagement from '../lib/atomic-management';
const fs = require('fs');
const path = require('path');

describe('backgroundColor', () => {
    // #atom.config.get("editor.fontSize") == 12
    let contents;
    let configName = __dirname + '/.atom/config.cson';
    try {
        contents = CSON.readFileSync(configName);
    } catch(e) {
        console.log(e);
    }
    it('should change the font size of the panel', () => {
        for(let key in contents) {
            expect(atom.config.get(key)).not.toBe(contents[key]);
        }
        expect(atom.config.get("editor.fontSize")).toBe(15);
    });
});
