/**
 * Browser-side image downscaling + WebP encoding.
 *
 * This replaces the former server-side `sharp` pipeline: Cloudflare Workers
 * cannot load sharp's native libvips binary (it needs `fs`/`child_process`),
 * so the resize happens in the admin's browser before upload instead. It also
 * keeps request bodies well under the Workers 100 MB limit.
 */

export const MAX_WIDTH = 1920;
export const QUALITY = 0.82;

/** Formats we must not re-encode: vector, or animation we would flatten. */
const SKIP_TYPES = new Set(['image/svg+xml', 'image/gif', 'image/avif']);

function canvasFor(width: number, height: number): OffscreenCanvas | HTMLCanvasElement {
	if (typeof OffscreenCanvas !== 'undefined') {
		return new OffscreenCanvas(width, height);
	}
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

function toBlob(
	canvas: OffscreenCanvas | HTMLCanvasElement,
	type: string,
	quality: number
): Promise<Blob | null> {
	if (canvas instanceof HTMLCanvasElement) {
		return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
	}
	return canvas.convertToBlob({ type, quality });
}

function rename(name: string): string {
	const base = name.replace(/\.[^./\\]+$/, '') || 'image';
	return `${base}.webp`;
}

/**
 * Downscale `file` to at most {@link MAX_WIDTH} wide and re-encode it as WebP.
 *
 * Never throws and never enlarges: if the browser lacks the APIs, the format is
 * one we refuse to re-encode, or encoding produces nothing smaller, the
 * original `File` is returned untouched so the upload still succeeds.
 */
export async function compressImage(file: File): Promise<File> {
	if (!file.type.startsWith('image/') || SKIP_TYPES.has(file.type)) return file;
	if (typeof createImageBitmap === 'undefined') return file;

	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file);
	} catch {
		return file;
	}

	try {
		const scale = Math.min(1, MAX_WIDTH / bitmap.width);
		const width = Math.max(1, Math.round(bitmap.width * scale));
		const height = Math.max(1, Math.round(bitmap.height * scale));

		const canvas = canvasFor(width, height);
		const ctx = canvas.getContext('2d') as
			| OffscreenCanvasRenderingContext2D
			| CanvasRenderingContext2D
			| null;
		if (!ctx) return file;

		ctx.drawImage(bitmap, 0, 0, width, height);

		const blob = await toBlob(canvas, 'image/webp', QUALITY);
		// Browsers that cannot encode WebP silently hand back a PNG instead.
		if (!blob || blob.type !== 'image/webp') return file;
		// Already-optimised sources can come out bigger; keep the smaller one.
		if (blob.size >= file.size && scale === 1) return file;

		return new File([blob], rename(file.name), {
			type: 'image/webp',
			lastModified: Date.now()
		});
	} catch {
		return file;
	} finally {
		bitmap.close();
	}
}

/** {@link compressImage} across a list, sequentially to bound peak memory. */
export async function compressImages(files: File[]): Promise<File[]> {
	const out: File[] = [];
	for (const file of files) out.push(await compressImage(file));
	return out;
}
