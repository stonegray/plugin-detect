
import path from 'path';
import fs from 'fs';
import plist from 'plist';


export default async function readPlistFile(pluginPath) {
	// Read the plist file:
	const plistFile = path.join(pluginPath, './Contents/Info.plist');

	let fileContents;
	try {
		fileContents = await fs.promises.readFile(plistFile, 'utf8');
	} catch (e) {
		//console.error('Skipped plugin, missing Info.plist: ' + pluginPath);
		return e;
	}

	let retValue;
	try {

		//const plist = await import('plist');
		//console.log(plist.default);
		//retValue = plist.default.parse(fileContents);
		retValue = plist.parse(fileContents);
	} catch (e){
		//console.error('Skipped plugin, parse error: ' + e + pluginPath);
		return e;
	}
	return retValue;

}
