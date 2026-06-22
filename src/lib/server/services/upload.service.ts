import sharp from 'sharp';
import { db } from '$lib/server/db/client';

const BUCKET = 'media';
const MAX_WIDTH = 1920;
const QUALITY = 82;

export async function uploadImage(file: File, folder: string): Promise<string> {
	const buffer = new Uint8Array(await file.arrayBuffer());

	const processed = await sharp(buffer)
		.resize({ width: MAX_WIDTH, withoutEnlargement: true })
		.webp({ quality: QUALITY })
		.toBuffer();

	const filename = `${folder}/${crypto.randomUUID()}.webp`;

	const { error } = await db.storage.from(BUCKET).upload(filename, processed, {
		contentType: 'image/webp',
		upsert: false
	});

	if (error) throw new Error(`Storage upload failed: ${error.message}`);

	return filename;
}

export function getPublicUrl(path: string): string {
	const { data } = db.storage.from(BUCKET).getPublicUrl(path);
	return data.publicUrl;
}

export async function deleteStorageFile(path: string): Promise<void> {
	const { error } = await db.storage.from(BUCKET).remove([path]);
	if (error) throw new Error(`Storage delete failed: ${error.message}`);
}
