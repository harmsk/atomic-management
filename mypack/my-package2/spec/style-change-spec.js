'use babel';

import MyPackage2 from '../lib/my-package2';
const fs = require('fs');
const path = require('path');

function generateConfigFile(demoConfig) {
  configFilePath = __dirname + '/test.atomconfig';
  fs.writeFileSync(configFilePath, JSON.stringify(demoConfig));
}
function testConfig(demoConfig) {
  let paneStyle = JSON.parse(fs.readFileSync(__dirname + '/test.json'));
  const configKeys = Object.keys(demoConfig);
  const paneStyleKeys = Object.keys(paneStyle);
  configKeys.forEach((key) => {
    expect(demoConfig[key]).toBe(paneStyle[key]);
  });
}

var demoConfig = {
  "backgroundColor": "white",
  "color": "red",
  "tabSize": "2",
  "columnWidth": "8em"
};

generateConfigFile(demoConfig);

fdescribe('backgroundColor', () => {
    it('should change the backgroundColor of the panel', () => {
      unitConfig = {
        "backgroundColor": "white"
      };
      testConfig(unitConfig);
    });
});

fdescribe('color', () => {
    it('should change the color of the panel', () => {
      unitConfig = {
        "color": "red"
      };
      testConfig(unitConfig);
    });
});

fdescribe('tabSize', () => {
    it('should change the tab size of the panel', () => {
      unitConfig = {
        "tabSize": "2"
      };
      testConfig(unitConfig);
    });
});

fdescribe('columnWidth', () => {
    it('should change the column width of the panel', () => {
      unitConfig = {
        "columnWidth": "8em"
      };
      testConfig(unitConfig);
    });
});

// fdescribe('fontSize', () => {
//     it('should change the font size of the panel', () => {
//       unitConfig = {
//         "fontSize": "20"
//       };
//       testConfig(unitConfig);
//     });
// });
