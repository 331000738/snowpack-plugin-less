const compiler = require('less');
const fs = require('fs');

const pkg = require('./package.json');

const render = async (filepath, args) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const option = { filename: filepath };
        for (const key of Object.keys(args)) {
          option[key] = args[key];
        }
        
        compiler.render(data, option, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
}

module.exports = function plugin(snowpackConfig, args) {
  return {
    name: pkg.name,
    resolve: {
      input: ['.less'],
      output: ['.css'],
    },
    async load({ filePath }) {
      try {
        const result = await render(filePath, args);
        return {
          '.css': result.css,
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
}