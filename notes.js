
const plufgin = {

	//AU:
	// Preferred:
	// AudioComponents.CFBundleName,
	// if (AudioComponents.length == 1) CFBundleName
	// name
	// DisplayName if DisplayName.length < ExecutableFilename
	// CFBundleExecutable
	// CFBundleExecutable || RelPath no extension

	// If AudioComponents matches /({2,16}[^:]): .+/, then it's probably
	// a description eg. "Vendor: Name". 


	// VST
	// Preferred:
	// name

	// AudioComponents[0].CFBundleName
	// If vst AudioComponents.length >1, error, use 0th.
	// CFBundleName
	// CFBundleExecutable
	// RelPath without extension



	name: 'FooBarf',
	
	//AU;

	//VST:
	description: 'Barfer of Foo',


	//AudioComponents[0].manufacturer
	// If (AudioComponents[0].match(/^({2,16}[^:]): .+$/)){
	//  name = everythhing in the first capture group
	//  // This matches "VendorNAme: Plugin"
	// }

	// If the (AudioComponents[0]?.manufacturer.length === 4) {
    //	// maybe use something else, since many seem to use truncated mfg names in this field 
	// }

	// Use identifier?

	vendor: 'ACME Corp',
	displayname: 'ACME Corp: FooBarf 1.2',
	identifier: 'com.acme.vst.foobarf',
	version: '1.2.3',
	type: 'VST',
	relPath: 'foobar-1.2.vst',
	absPath: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst',
	icon: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst/Contents/Resources/icon.icnx',
	arch: ['mips', 'ppc'],
	ok: true,
    errors: [],
    size: 3204923204,
    copyright: "(c) 2048 ACME Corp,  "
};
const plugin = {
	name: 'FooBarf',
	description: 'Barfer of Foo',
	vendor: 'ACME Corp',
	displayname: 'ACME Corp: FooBarf 1.2',
	identifier: 'com.acme.vst.foobarf',
	version: '1.2.3',
	type: 'VST',
	relPath: 'foobar-1.2.vst',
	absPath: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst',
	icon: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst/Contents/Resources/icon.icnx',
	arch: ['mips', 'ppc'],
	ok: true,
    errors: [],
    size: 3204923204,
    copyright: "(c) 2048 ACME Corp,  "
};

const pluginCombined = {
	name: 'FooBarf',
	description: 'Barfer of Foo',
	vendor: 'ACME Corp',
	displayname: 'ACME Corp: FooBarf 1.2',
	identifier: 'com.acme.vst.foobarf',
	version: '1.2.3',
	types: ['VST', 'VST3', 'AU'],
	vst: {
		relPath: 'foobar-1.2.vst',
		identifier: 'com.acme.vst.foobarf',
		absPath: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst',
		icon: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst/Contents/Resources/icon.icnx',
		arch: ['mips', 'ppc']
	},
	au: {
		relPath: 'foobar-1.2.vst',
		identifier: 'com.acme.au.foobarf',
		absPath: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst',
		icon: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst/Contents/Resources/icon.icnx',
		arch: ['mips', 'ppc']
	},
	vst3: {
		relPath: 'foobar-1.2.vst',
		identifier: 'com.acme.vst3.foobarf',
		absPath: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst',
		icon: '/Volumes/USB found under couch/VSTs/foobarf-1.2.vst/Contents/Resources/icon.icnx',
		arch: ['mips', 'ppc']
	},
	ok: true,
	errors: []
};