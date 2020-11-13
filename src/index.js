// Ableton version and install info

import path from 'path';
import os from 'os';

import macosRelease from 'macos-release';
import semver from 'semver';
import { getSystemPlugins } from './getSystemPlugins.js';
import { getUserPlugins } from './getUserPlugins.js';

export default async function getPlugins(directories){

	
	let pluginDirs = [
		'/Library/Audio/Plug-Ins/Components',
		'/Library/Audio/Plug-Ins/VST',
		'/Library/Audio/Plug-Ins/VST3',
		path.join(os.homedir(), './Library/Audio/Plug-Ins/Components'),
		path.join(os.homedir(), './Library/Audio/Plug-Ins/VST'),
		path.join(os.homedir(), './Library/Audio/Plug-Ins/VST3'),
	];

	let plugins = [];

	try {

		plugins = plugins.concat([...await getUserPlugins(pluginDirs)]);
		plugins = plugins.concat([...await getSystemPlugins()]);

	} catch (e){
		console.log('Failed:');
		throw e;
	}

	return plugins;
}


