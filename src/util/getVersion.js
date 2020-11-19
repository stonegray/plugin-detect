import path from 'path';
import url from 'url'
import fs from 'fs';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const packageJsonPath = path.join(dirname, '../../package.json');

const packageData = fs.readFileSync(packageJsonPath, 'utf8');

const packageJson = JSON.parse(packageData);

export default packageJson;
