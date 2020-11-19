import fs from 'fs';
import path from 'path';
import { scanPlugin } from './scanPlugin.js';

export async function getUserPlugins(directories) {
	// Array of paths to plugins
	let pluginPaths = [];

	for (const dir of directories) {

		// Read search directory and find all plugins in it
		let thisPlugins;

		try {
			thisPlugins = await fs.promises.readdir(dir, {
				withFileTypes: true
			});
		} catch (e) {

			continue;
		}

		

		// Shoehorn some directory information into each app field before
		// we lose context... grrr why don't DirEnt objects store path info?
		thisPlugins = thisPlugins.map(a => {
			a.dir = dir;
			return a;
		});

		// Join arrays
		pluginPaths = pluginPaths.concat(...thisPlugins);
	}

	// Recurse by one:



	// For each plugin path we have, scan it:
	let installedPlugins = [];

	// Run scanPlugin on each result in the search directories:
	let index = 0;
	for (const pluginPath of pluginPaths) {
		// Get array of plugins from this directory:
		const arr = await scanPlugin(pluginPath);
		console.log(index++);
		// Add to array:
		installedPlugins = [...installedPlugins, ...arr];
	}

	return installedPlugins;

}
