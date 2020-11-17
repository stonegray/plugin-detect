import getPlugins from '../src/index.js' // from '@stonegray/plugin-detect';

Error.stackTraceLimit = Infinity;
const plugins = await getPlugins();

console.log(plugins);

debugger;