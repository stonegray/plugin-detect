import path from 'path';
import getHeaderBytes from './util/getHeaderBytes.js';
import readPlistFile from './util/readPlistFile.js';

export async function scanPlugin(plugin) {
	// macOS plugins are directories, so we can immediately exclude
	// anything that isn't a directory type.
	if (!plugin.isDirectory()){
		console.error('Unhandled error: Unable to parse plugin' + plugin.name);
		return [];
	}

	// Read the plist file:
	// const plistFile = path.join(plugin.dir, plugin.name, './Contents/Info.plist');

	const plist = await readPlistFile(path.join(plugin.dir, plugin.name));

	if (plist instanceof Error){
		console.warn('Error parsing ', plugin.name);
		return [];

	}


	// By now we have an Ableton, so let's collect some info about it.
	const info = {}; // Contains info about the plugin in general
	const plugins = []; // Because a single plugin can contain multiple
	// effects, we push them seperately into plugins[] as we detect them. 

	// Create an empty errors array for now:
	info.errors = [];

	info._plist = plist;
	info.name = plist.CFBundleName
		|| plist.CFBundleDisplayName
		|| plist.CFBundleExecutable
		|| plugin.name;

	info.manufacturer = 'Unknown';

	// Read the version and min system vresion:
	info.version = plist.CFBundleShortVersionString 
		|| plist.CFBundleVersion
		|| '0.0.0';
	info.minimumOsVersion = plist.MinimumOSVersion 
		|| plist.LSMinimumSystemVersion
		|| '0.0.0';

	info.identifier = plist.CFBundleIdentifier || '';

	// Append file information:
	info.relPath = plugin.name;
	info.absPath = path.resolve(path.join(plugin.dir, plugin.name));

	// Get the icon path so we can show the correct icons in a browser:
	if (typeof plist.CFBundleIconFile !== 'undefined') {
		info.icon = path.join(info.absPath, './Contents/Resources', plist.CFBundleIconFile);
	} else {
		info.icon = false;
	}

	// Detect type using extension:
	// Detect plugin type
	const extension = path.extname(info.relPath);
	if (extension == '.vst') {
		info.type = 'VST';
	} else if (extension == '.vst3') {
		info.type = 'VST3';
	} else if (extension == '.component') {
		info.type = 'AU';
	} else {
		info.type = 'Unknown';
		info.errors.push('Unknown filetype ' + extension);
	}

	// Detect architecture:
	const executable = plist.CFBundleExecutable;
	const executablePath = path.join(plugin.dir, plugin.name, './Contents/MacOS/', executable);
	const header = await getHeaderBytes(executablePath, 16);
	if (Buffer.compare(header, Buffer.from('CFFAEDFE', 'hex'))) {
		info.arch = ['x64'];
	} else if (Buffer.compare(header, Buffer.from('CEFAEDFE', 'hex'))) {
		info.arch = ['x32'];
	} else if (Buffer.compare(header, Buffer.from('CAFEBABE', 'hex'))) {
		// Universal/Object file
		info.arch = ['x32', 'x64'];
	} else {
		// TODO: Should add aarch64 header parser before Ableton releases an macOS/ARM version
		info.type = 'Unknown/Malformed';
		info.ok = false;
		info.errors.push('Unsupported architecture', header.toString('hex'));
	}

	// AudioCompoents can (and many do) have a number of effects/devices
	// within a single component. We take the generic information applicable
	// to them all above, and then individuaally push them into plugins[] 
	// with each name specified.

	// For VST/VST3 this probably won't get used, some VSTs have the AudioComponents
	// field but I haven't found one with multiple Dicts in it.

	// Iterate through AudioComponents array if it exists:
	if (
		typeof plist.AudioComponents !== 'undefined'
		&& Array.isArray(plist.AudioComponents)
	){
		// Store component count in info object:
		info.componentCount = plist.AudioComponents.length;

		// Iterate through each:
		for (const c of plist.AudioComponents){
			// Create a copy of Info for this specific component:
			let compInfo = info;
			// Get basic info from AudioComponent Dict:
			compInfo.description = c.description || '';

			// Get information as found in AudioComponet dict:
			compInfo.name = c.name || info.name;
			compInfo.manufacturer = c.manufacturer || info.manufacturer;

			// For many plugins, the format is not standardized. Let's check
			// if it looks like "Vendor: Name", and if it does, split it up:

			// If we have the manufacturer and name in the same field:
			const regexSplit = /^(([^:]*): )(.*)/gm;
			let split = regexSplit.exec(compInfo.name);
			
			// Don't know why this fixes it, but was getting some weird
			// behaviour where the regex was only executing every 2nd time
			// correctly.
			regexSplit.exec(compInfo.name);



			if (split !== null && typeof split[3] === 'string') {
				// This captures everything after the ".*: "
				compInfo.name = split[3] || compInfo.name;
				// This captures everything before the first ": "
				compInfo.manufacturer = split[2] || compInfo.manufacturer;
			}

			// Push a copy of compInfo into the plugins to return for
			// this .component:
			// This breaks if you push compInfo itself. I honestly don't 
			// know wny...
			plugins.push({
				...compInfo
			});
		}

	} else {
		// If no array exists, just push the single one. This is the
		// expected flow for VST/VST3
		plugins.push(info);
	}

	return plugins;

	/*

	// CFBundleIdentifier we can probably skip sanity checking the rest. 
	if (typeof plistData.CFBundleIdentifier == 'undefined') {
		console.warn('Detected malformed Plugin plugin', plugin.name);
		return;
	}

	// Get name:

	// in AU, 
	info.name = plistData.CFBundleName;

	if (typeof plistData.AudioComponents == 'object') {
		info.description = plistData.AudioComponents[0].description;
		info.vendor = plistData.AudioComponents[0].manufacturer;
	}

	info.identifier = plistData.CFBundleIdentifier;

	info.relPath = plugin.name;
	info.absPath = path.join(plugin.dir, plugin.name);

	// I'm using a dirty trick to get the first word, basically just creating an
	// ephemeral array and popping the first off, which is the version string.
	info.version = plistData.CFBundleVersion.split(' ').shift();

	info.minSystemVersion = plistData.LSMinimumSystemVersion;

	// Get the icon path so we can show the correct icons for different versions/varients
	// like the green icon for Intro.
	if (typeof plistData.CFBundleIconFile !== 'undefined') {
		info.icon = path.join(info.absPath, './Contents/Resources', plistData.CFBundleIconFile);
	} else {
		info.icon = false;
	}

	// Detect plugin type
	const extension = path.extname(info.relPath);
	if (extension == '.vst') {
		info.type = 'VST';
	} else if (extension == '.vst3') {
		info.type = 'VST3';
	} else if (extension == '.component') {
		info.type = 'AU';
	}

	

	// Add initial type into array
	info.types.push(info.type);

	// Check if plugin binary is 32-bit or 64-bit by inspecting the header
	const executable = plistData.CFBundleExecutable;
	const executablePath = path.join(plugin.dir, plugin.name, './Contents/MacOS/', executable);
	const header = await getHeaderBytes(executablePath, 16);
	if (Buffer.compare(header, Buffer.from('CFFAEDFE', 'hex'))) {
		info.arch = ['x64'];
	} else if (Buffer.compare(header, Buffer.from('CEFAEDFE', 'hex'))) {
		info.arch = ['x32'];
	} else if (Buffer.compare(header, Buffer.from('CAFEBABE', 'hex'))) {
		// Universal/Object file
		info.arch = ['x32', 'x64'];
	} else {
		// TODO: Should add aarch64 header parser before Ableton releases an macOS/ARM version
		info.type = 'Unknown/Malformed';
		info.ok = false;
		info.errors.push('Unsupported architecture');
	}

	*/



}
