tarifa-component-demo
=====================

example app for tarifa using component

```
tarifa check
tarifa run browser
```


The result of this project is quite the same as the [tarifa default example](https://github.com/TarifaTools/tarifa/tree/master/template/project).

Instead of browserify it uses [component](https://github.com/componentjs/component) for the [browser build](https://github.com/timaschew/tarifa-component-demo/blob/master/project/bin/build.js). It provides a CommonJS module loader like browserify. To achieve full flexibility for the output the API of component is used instead of the CLI. Component uses GitHub instead of npm as a registiry and a __component.json__ file. Remote modules will be downloaded into __components__ (instead of __node_modules__).

The main idea of component is to write reusable and self-contained modules. This can be achieved by using not only remote dependencies but also local dependencies (via the `.locals` property in the __component.json__ file).

See the [source code](https://github.com/timaschew/tarifa-component-demo/tree/master/project)

## derivation from the tarifa example project
- directory restructure 
  - everything in `src` is the source, even the font files
  - evertyhing in `www` is the generated output of component
- component instead of browserify
- extract the css circle in its own local module
- other remote modules (which supports component)
- handling css, template and fonts
