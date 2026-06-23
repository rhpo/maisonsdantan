export const splitChunks = <T>(arr: T[], len: number): T[][] => {
	const chunks: T[][] = [];
	let i = 0;
	const n = arr.length;

	while (i < n) {
		chunks.push(arr.slice(i, (i += len)));
	}

	return chunks;
};

export const minLenArr = <T>(matrix: T[][]): number => {
	let minLength = matrix[0].length;

	for (let i = 1; i < matrix.length; i++)
		if (matrix[i].length < minLength) minLength = matrix[i].length;

	return minLength;
};
