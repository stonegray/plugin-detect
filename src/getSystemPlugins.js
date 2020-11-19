import path from 'path';
import plist from 'plist';
import fs from 'fs';

export async function getSystemPlugins(){

	// We specify location and identifier.
	let plugin = {
		path: '/System/Library/Components/CoreAudio.component',
		identifier: 'com.apple.audio.units.Components'
	};

	// macOS plugins are directories, so we can immediately exclude
	// anything that isn't a directory type.
	//if (!plugin.path.isDirectory()) return;

	// Read the plist file:
	const plistFile = path.join(plugin.path, './Contents/Info.plist');
	const plistData = plist.parse(await fs.promises.readFile(plistFile, 'utf8'));


	// Check if this is actually Live; not another plugin renamed. If there's a matching
	// CFBundleIdentifier we can probably skip sanity checking the rest. 
	if (plistData.CFBundleIdentifier !== plugin.identifier){
		console.warn(`Fatal error reading ${plugin.identifier}: Identifier mismatch`);
		return;
	}

	if (typeof plistData.AudioComponents !== 'object'){
		console.warn(`Fatal error reading ${plugin.identifier}: Malformed AudioComponents list`);
		return;
	}

	// Get overall version string:
	const libVersion = (plistData.CFBundleShortVersionString);
	
	const o = plistData.AudioComponents.map(p => {

		const plug = {
			name: p.name.split(' ').pop(),
			vendor: 'Apple',
			description: p.description,
			displayName: '',
			identifier: plugin.identifier+'.'+p.name.split(' ').pop(),
			relPath: plugin.path,
			absPath: plugin.path,
			version: `${libVersion}-${p.version}`,
			types: ['AU'],
			icon: '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/KEXT.icns',
			ok: true,
			system: true,
			errors: []
		};
		if (plug.name.match(/^AU.*/gm)){
			return plug;
		} 
	});

	// Return without undefined fields (ones taht we didn't map back above
	return o.filter(p => p !== undefined);
}
