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

function flattenJsonCodelist (codelist, logger=false) {
  let output = [];
  Object.keys(codelist).forEach(module_location => {
    if (logger) {
      logger();
      logger(yellow.bold(module_location));
      logger();
    } else {
      output = [
        ...output,
        module_location
      ];
    }
    Object.keys(codelist[module_location]).forEach(code_location => {
      let code = codelist[module_location][code_location].join('\n');
      if (logger) {
        logger(green.bold(code_location));
        logger(code);
        logger(green.bold('// !end'));
      } else {
        output = [
          ...output,
          code_location,
          code,
          '// !end'
        ];
      }
    });
  });
  if (!logger) {
    return output
  }
  return
}

function formatJsonCode (code, dirLen = process.cwd().length + 1) {
  let module_location, code_location
  let module_code = {}
  let output = {}
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