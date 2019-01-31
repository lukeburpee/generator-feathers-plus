const { yellow, green } = require('chalk');
const { join } = require('path');

const { getFragments, refreshCodeFragments } = require('./code-fragments');

module.exports = {
  flattenJsonCodelist,
  formatJsonCode,
	getJsonCodelist
}

async function getJsonCodelist (directory = join( process.cwd(), 'src') ) {
  await refreshCodeFragments(directory)
  const code = getFragments()
  return formatJsonCode(code)
}

function flattenJsonCodelist (codelist, color = true) {
  let output = [];
  Object.keys(codelist).forEach(module_location => {
    output = [
      ...output,
      color ? yellow.bold(module_location) : module_location
    ];
    Object.keys(codelist[module_location]).forEach(code_location => {
      let code = codelist[module_location][code_location].join('\n')
      output = [
        ...output,
        color ? green.bold(code_location) : code_location,
        code,
        color ? green.bold('// !end') : '// !end'
      ];
    });
  });
  return output;
}

function formatJsonCode (code, dirLen = process.cwd().length + 1) {
  let module_location, code_location, module_code, output
  module_code = {}
  output = {}
  Object.keys(code).forEach(filePath => {
    const codeFilePath = code[filePath]
    module_location = `// !module ${filePath.substr(dirLen)}`
    Object.keys(codeFilePath).forEach(codeLocation => {
      code_location = `// !code: ${codeLocation}`
      module_code = {
        ...module_code,
        [code_location] : codeFilePath[codeLocation]
      }
    })
    output = { ...output, [module_location]: module_code }
    module_code = {}
  })
  return output
}