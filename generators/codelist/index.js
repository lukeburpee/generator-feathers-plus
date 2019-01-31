
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
      message: `Which file output format would you prefer?`,
      default: 'js',
      choices: () => [
        { name: 'JS   (feathers-gen-code.js)', value: 'js' },
        { name: 'Json (feathers-gen-code.json)', value: 'json' },
        { name: 'Text (feathers-gen-code.txt)', value: 'txt' }
      ],
      when: (current) => {
        const { file } = current;
        if (!file) {
          return false
        }
        return true
      }
    }, {
      type: 'confirm',
      name: 'jsConfirmed',
      message: () => {
        console.log(chalk.red(
          `** Warning ** Running an app containing a feathers-gen-code.js file may result in unintended changes to your code.`
        ))
        return 'Proceed?'
      },
      default: true,
      when: (current) => (current.fileFormat === 'js') ? true : false
    }];
    
    return this.prompt(prompts).then(answers => {
      Object.assign(this.props, answers);

      // Set missing defaults when call during test
      if (this._opts.calledByTest && this._opts.calledByTest.prompts) {
        this.props = Object.assign({}, this._opts.calledByTest.prompts, this. props);
      }

      debug('codelist prompting() ends', this.props);

      if (!generator.callWritingFromPrompting()) return;

      debug('codelist writing patch starts. call generatorWriting');
      generatorWriting(generator, 'codelist');
      debug('codelist writing patch ends');
    });
  }

  writing () {
    if (this.callWritingFromPrompting()) return;

    generatorWriting(this, 'codelist');
  }
};
