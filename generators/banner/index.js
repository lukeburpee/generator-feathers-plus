
const chalk = require('chalk');
const makeDebug = require('debug');
const { cwd } = require('process');
const { parse } = require('path');

const Generator = require('../../lib/generator');
const generatorWriting = require('../writing');
const { initSpecs } = require('../../lib/specs');
const { colors } = require('../../lib/banner');

const debug = makeDebug('generator-feathers-plus:prompts:banner');

module.exports = class BannerGenerator extends Generator {
  async prompting () {
    this.checkDirContainsApp();
    await Generator.asyncInit(this);
    const { props, _specs: specs } = this;
    const generator = this;
    this._initialGeneration = !specs.banner;
    initSpecs('banner');

    if (this._initialGeneration) {
      this.log('\n\n');
      this.log([
        chalk.green.bold('We are'),
        chalk.yellow.bold(' adding '),
        chalk.green.bold('a new console banner')
      ].join(''));
      this.log();
    }

    const combineProps = answers => Object.assign({}, props, answers);

    const prompts = [{
      name: 'title',
      message: 'Banner Title?',
      type: 'input',
      default: () => specs.app.name,
    }, {
      name: 'titleColor',
      message: 'Title Color?',
      type: 'list',
      default: () => 'blue',
      choices: () => colors
    }, {
      name: 'subheader',
      message: 'Include Subheader?',
      type: 'confirm',
      default: true
    }, {
      name: 'subheaderText',
      message: 'Subheader Text?',
      type: 'input',
      default: () => 'powered by feathers-plus',
      when: (current) => {
        const { subheader } = combineProps(current);
        if (!subheader) {
          return false
        }
        return true
      }
    }, {
      name: 'subheaderColor',
      message: 'Subheader Color?',
      type: 'list',
      default: () => 'yellow',
      when: (current) => {
        const { subheader } = combineProps(current);
        if (!subheader) {
          return false
        }
        return true
      },
      choices: () => colors
    }];

    return this.prompt(prompts).then(answers => {
      Object.assign(this.props, answers);

      // Set missing defaults when call during test
      if (this._opts.calledByTest && this._opts.calledByTest.prompts) {
        this.props = Object.assign({}, this._opts.calledByTest.prompts, this. props);
      }

      debug('banner prompting() ends', this.props);

      if (!generator.callWritingFromPrompting()) return;

      debug('banner writing patch starts. call generatorWriting');
      generatorWriting(generator, 'banner');
      debug('banner writing patch ends');
    });
  }

  writing () {
    if (this.callWritingFromPrompting()) return;

    generatorWriting(this, 'banner');
  }
};
