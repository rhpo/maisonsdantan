import { db } from '$lib/server/db/client';

const BUCKET = 'media';

/**
 * Images arrive already downscaled and WebP-encoded by the browser
 * (see `$lib/image/compress`). Nothing here touches pixels: Cloudflare Workers
 * cannot run sharp, so the server only validates and stores.
 */
const EXTENSIONS: Record<string, string> = {
	'image/webp': 'webp',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/avif': 'avif',
	'image/gif': 'gif',
	'image/svg+xml': 'svg'
};

const MAX_BYTES = 15 * 1024 * 1024;

export async function uploadImage(file: File, folder: string): Promise<string> {
	const contentType = file.type || 'application/octet-stream';
	const ext = EXTENSIONS[contentType];

	if (!ext) throw new Error(`Unsupported image type: ${contentType}`);
	if (file.size === 0) throw new Error('Empty image file');
	if (file.size > MAX_BYTES) {
		throw new Error(`Image too large: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 15 MB)`);
	}

	const filename = `${folder}/${crypto.randomUUID()}.${ext}`;

	const { error } = await db.storage.from(BUCKET).upload(filename, file, {
		contentType,
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
