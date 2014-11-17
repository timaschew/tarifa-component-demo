var fs = require('fs');
var resolve = require('component-resolver');
var builder = require('component-builder');
var autoprefix = require('builder-autoprefixer');
var path = require('path');
var WWW = path.join(__dirname, '..', 'www');
var mkdirp = require('mkdirp');
var Q = require('q');

var copyPages = function(options) {
  return function copy(file) {
    // file.path is from component.json pages property
    var targetFile = path.join(options.destination, file.path);
    fs.writeFileSync(targetFile, fs.readFileSync(file.filename));
  };
};

module.exports.build = function build(platform, settings, envName) {
  var deferScripts = Q.defer();
  var deferStyles = Q.defer();
  var deferAssets = Q.defer();

  mkdirp.sync(WWW);
  var currentSettings = settings.configurations[platform][envName];
  // because version is only defined in the outer object scope
  currentSettings.version = settings.version;

  // builder options
  var options = {
    root: path.join(__dirname, '..'), // where your main component.json is located
    destination: WWW,
  };
  var resolverOptions = {
    install: true,
    verbose: true,
    out: path.join(__dirname, '..', 'components')
  };
  if (envName != 'prod') {
    //TODO: sourceURLs not working for local files
    // options.development = true;
    // resolverOptions.development = true;
  }
  // resolve the dependency tree
  resolve(options.root, resolverOptions, function (err, tree) {
    if (err) return deferScripts.reject(err);
    // only include `.js` files from components' `.scripts` field
    builder.scripts(tree, options)
      .use('templates', builder.plugins.string(options))
      .use('json', builder.plugins.json(options))
      .use('scripts', builder.plugins.js())
      .end(function (err, output) {
        if (err) return deferScripts.reject(err);
        var entryPoints = Object.keys(tree.locals);
        if (entryPoints.length > 1) {
          return deferScripts.reject(new Error('multiple entry points implemented yet'));
          // consider using https://github.com/componentjs/bundler.js
        }
        var bootComponent = tree.locals[entryPoints[0]];
        var settingsModule = '\nrequire.define("tarifa-settings", '+JSON.stringify(currentSettings)+');\n';
        var autoRequire = '\nrequire("' + bootComponent.canonical + '");';
        output = builder.scripts.require + settingsModule + output + autoRequire;
        fs.writeFileSync(path.join(WWW, 'app.js'), output);
        deferScripts.resolve();
      });

    // only include `.css` files from components' `.styles` field
    builder.styles(tree)
      .use('styles', 
        builder.plugins.css(), 
        builder.plugins.urlRewriter(options.prefix || ''),
        autoprefix(options)
      )
      .end(function (err, string) {
        if (err) return deferStyles.reject(err);
        fs.writeFileSync(path.join(WWW, 'app.css'), string);
        deferStyles.resolve();
      });

    // only copy `images` to the build folder
    builder.files(tree, options)
      .use('images', builder.plugins.copy())
      .use('fonts', builder.plugins.copy())
      .use('page', copyPages(options))
      .end(deferAssets.resolve()); // callback optional
  });

  return Q.all([deferScripts.promise, deferStyles.promise, deferAssets.promise]);
};