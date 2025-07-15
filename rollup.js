const path = require('path');
const { rollup, watch } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel').default;
const { builtinModules } = require('module');
const pkg = require('./package.json');

const dependencies = Object.keys(pkg.dependencies || {});
const peerDependencies = Object.keys(pkg.peerDependencies || {});
const externalDeps = [...builtinModules, ...dependencies, ...peerDependencies];

function getBaseConfig() {
  return {
    input: path.resolve(__dirname, 'src/index.js'),
    external: externalDeps,
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx']
      })
    ]
  };
}

function generateConfig(format) {
  const isESM = format === 'esm';
  const base = getBaseConfig();
  const output = {
    file: path.resolve(__dirname, `dist/index.${isESM ? 'esm' : 'cjs'}.js`),
    format: isESM ? 'esm' : 'cjs',
    sourcemap: true,
    ...(isESM ? {} : { exports: 'named' })
  };
  return { ...base, output };
}

async function build(format) {
  const config = generateConfig(format);
  const bundle = await rollup(config);
  await bundle.write(config.output);
  await bundle.close();
}

function watchFiles(globs) {
  const base = getBaseConfig();
  const outputs = [
    { file: path.resolve(__dirname, 'dist/index.esm.js'), format: 'esm', sourcemap: true },
    { file: path.resolve(__dirname, 'dist/index.cjs.js'), format: 'cjs', sourcemap: true, exports: 'named' }
  ];
  const watcher = watch({
    ...base,
    output: outputs,
    watch: { include: globs }
  });
  watcher.on('event', event => {
    switch (event.code) {
      case 'START':
        console.log('Watching for changes...');
        break;
      case 'BUNDLE_END':
        console.log(`Bundled: ${event.output} in ${event.duration}ms`);
        break;
      case 'ERROR':
        console.error('Error:', event.error);
        break;
    }
  });
}

async function main() {
  const env = process.env.NODE_ENV || 'production';
  await build('esm');
  await build('cjs');
  if (env === 'development') {
    watchFiles('src/**');
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});