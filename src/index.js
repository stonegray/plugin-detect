// Ableton version and install info

import path from 'path';
import os from 'os';

import { getSystemPlugins } from './getSystemPlugins.js';
import { getUserPlugins } from './getUserPlugins.js';
import packageJson from './util/getVersion.js';
import newGithubIssueUrl from 'new-github-issue-url';

const version = packageJson.version;

export default async function getPlugins(){

	
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

		console.error('An unhandled error has occured in @stonegray/plugin-detect. Please report this using the following link:');
		const url = newGithubIssueUrl({
			user: 'stonegray',
			repo: 'plugin-detect',
			title: 'Unhandled error',
			body:
				`An unhandled error occured in the application. I am running version ${version} ` +
				`using Node ${process.version}. The error is automatically added below. Please ` +
				'add a brief description of the problem and a title. \n' +
				'\n\nError:\n' +
				'```\n' +
				`${e.message}\n` +
				'```\n' +
				'Stack:\n' +
				'```\n' +
				`${e.stack}` +
				'```\n'
		});

		console.error(url);

		throw e;
	}

	return plugins;
}


