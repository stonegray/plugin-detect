import fs from 'fs';
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


	// For each plugin path we have, scan it:
	const installedPlugins = [];

	// Run scanPlugin on each result in the search directories:
	for (const pluginPath of pluginPaths) {
		installedPlugins.push(await scanPlugin(pluginPath));
	}

	// Flatten plugins:
	let out = [];
	for (const p of installedPlugins) {

		// Check if we've already seen an identical (by ver/id) plugin
		const i = out.findIndex(t => t.identifier == p.identifier && t.version === p.version
		);

		// If we don't already have a matching version and ID, add it.
		if (i == -1) {
			out.push(p);
		} else {
			let t = out[i];

			// Append the type if it doesn't already exist.
			if (out[i].types.includes(p.type)) {
				continue;
			} else {
				out[i].types.push(p.type);
			}

			out[i]['plugin' + p.type] = {
				relPath: p.relPath,
				absPath: p.absPath,
				icon: p.icon,
			};

			// Update the vendor information if it's blank:
			out[i].vendor = !t.vendor || t.vendor == '' ? p.vendor : t.vendor;



		}
	}

	// Remove type value since we have the array now:
	out = out.map(({ type, ...rest }) => rest);

	return out;

}
