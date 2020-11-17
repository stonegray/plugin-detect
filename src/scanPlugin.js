import path from 'path';
import fs from 'fs';
import plist from 'plist';
import { getHeaderBytes } from './getHeaderBytes.js';

export async function scanPlugin(plugin) {
	// macOS plugins are directories, so we can immediately exclude
	// anything that isn't a directory type.
	if (!plugin.isDirectory())
		return;

	// Read the plist file:
	const plistFile = path.join(plugin.dir, plugin.name, './Contents/Info.plist');

	let plistData;
	try {
		plistData = plist.parse(await fs.promises.readFile(plistFile, 'utf8'));
	} catch (e) {
		console.error("Skipped plugin, missing Info.plist:"+plugin.name)
		return;
	}


	// By now we have an Ableton, so let's collect some info about it.
	const info = {
		name: '',
		vendor: '',
		displayName: '',
		description: '',
		identifier: '',
		relPath: '',
		absPath: '',
		version: '',
		type: '',
		types: [],
		icon: '',
		system: false,
		licenceStatus: '',
		ok: true,
		errors: []
	};
	info.plist = plistData;




	// CFBundleIdentifier we can probably skip sanity checking the rest. 
	if (typeof plistData.CFBundleIdentifier == 'undefined') {
		console.warn('Detected malformed Plugin plugin', plistFile);
		return;
	}

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

	return info;



}
