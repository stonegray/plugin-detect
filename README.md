# plugin-detect

**Get information from installed VST and AU plugins**

![](https://img.shields.io/github/languages/code-size/stonegray/plugin-detect) ![](https://img.shields.io/github/license/stonegray/plugin-detect)


`plugin-detect` scans the plugin directories on the system, and collects  information about each available plugin. It supports VST, VST3, and AU, with full support for Audio Units containing multiple effects and instruments, such as WavesShell (400+ effects!), and the built-in CoreAudio effects. (eg. AUDelay, AURountripAAC)

This library provides an async function as an ES module, and only supports macOS. 

*Working with Ableton? Also try [@stonegray/ableton-detect](https://www.npmjs.com/package/@stonegray/ableton-detect)*

## Examples

Basic example:

```javascript
import scanPlugins from `plugin-detect`;

console.log(await scanPlugins());
```

Output:

```javascript
[
    {
        name: 'OneKnob Wetter (s)',
        manufacturer: 'Waves',
        version: '11.0.0',
        minimumOsVersion: '10.0',
        identifier: 'com.WavesAudio.WaveShell1-AU.11.0.0',
        relPath: 'WaveShell1-AU 11.0.component',
        absPath: '/Library/Audio/Plug-Ins/Components/WaveShell1-AU 11.0.component',
        icon: '/Library/Audio/Plug-Ins/Components/WaveShell1-AU 11.0.component/Contents/Resources/WaveShell1-AU 11.0.icns',
        type: 'AU',
        arch: [ 'x64' ],
        componentCount: 448,
        description: 'Plugin_description',
        system: false,
        errors: [],
        ok: true
    },
    ... 772 more
]

```

## Error handling

In the unlikely event that this plugin encounters an unexpected issue while reading plugins, it will output a link which can be used to quickly report the error on the issue tracker, and automatically neccessary information. 

Any errors will be thrown normally after this link is generated.
