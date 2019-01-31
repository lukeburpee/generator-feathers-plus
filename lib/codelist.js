const chalk = require('chalk');
const { join } = require('path');

const { getFragments, refreshCodeFragments } = require('../../lib/code-fragments');

module.exports = {
  flattenJsonCodelist,
  formatJsonCode,
	getJsonCodelist
}

function getJsonCodelist (directory = join( process.cwd(), 'src') ) {
  refreshCodeFragments(directory)
  const code = getFragments()
  return formatJsonCode(code)
}

function flattenJsonCodelist (codelist, log = true) {
  let output: any = []
  Object.keys(codelist).forEach(module_location => {
    if (log) {
      console.log(chalk.yellow.bold(module_location))
    } else {
      output = [
        ...output,
        module_location
      ]
    }
    Object.keys(codelist[module_location]).forEach(code_location => {
      let code: string = codelist[module_location][code_location].join('\n')
      if (log) {
        console.log(chalk.green.bold(code_location))
        console.log(code)
        console.log(chalk.green.bold('// !end'))
      } else {
        output = [
          ...output,
          code_location,
          code,
          '// !end'
        ]
      }
    })
  })
  if (!log) {
    return output
  }
  return
}

function formatJsonCode (code, dirLen = process.cwd().length + 1) {
  let module_location: string
  let code_location: string
  let module_code: any = {}
  let output: any = {}
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