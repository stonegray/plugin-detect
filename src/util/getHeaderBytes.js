import fs from 'fs';

export default async function getHeaderBytes(file, number) {

	const fd = await fs.promises.open(file, 'r');

	const buf = Buffer.alloc(number);

	await fd.read(buf, 0, number);

	await fd.close();

	return buf;
}
            