
const chalk = require('chalk');
const { cwd } = require('process');
const { parse } = require('path');

const Generator = require('../../lib/generator');
const { getFragments } = require('../../lib/code-fragments');

module.exports = class CodelistGenerator extends Generator {
  async prompting () {
    this.checkDirContainsApp();
    await Generator.asyncInit(this);

    const combineProps = answers => Object.assign({}, props, answers);

    const prompts = [{
      type: 'confirm',
      name: 'file',
      message: 'Output codelist to file?',
      default: false
    }, {
      type: 'list',
      name: 'fileFormat',
      message: 'Which file output format would you prefer?',
      default: () => 'js-file',
      choices: () => [
        { name: 'JS File', value: 'js-file' },
        { name: 'Json File', value: 'json-file' },
        { name: 'Text File', value: 'text-file' }
      ],
      when: (current) => {
        const { file } = current;
        if (!file) {
          return false
        }
        return true
      }
    }]
  }

  writing () {
    const code = getFragments();
    const dirLen = process.cwd().length + 1;

    this.log();
    this.log([
      chalk.green.bold('The custom code found in generated modules in dir '),
      chalk.yellow.bold(parse(cwd()).base),
      ':',
    ].join(''));

    Object.keys(code).forEach(filePath => {
      const codeFilePath = code[filePath];

      this.log();
      this.log(chalk.yellow.bold(`// !module ${filePath.substr(dirLen)}`));
      this.log();

      Object.keys(codeFilePath).forEach(codeLocation => {
        this.log(chalk.green.bold(`// !code: ${codeLocation}`));
        this.log(codeFilePath[codeLocation].join('\n'));
        this.log(chalk.green.bold('// !end'));
      });
    });
  }
};
