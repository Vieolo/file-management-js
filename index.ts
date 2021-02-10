/**
 * Fetches a file from the given url and converts it to base64
 * @param url The url of the file
 */
export async function remoteFileToBase64(url: string): Promise<string> {
	let rr = await fetch(url)
	let blob: Blob = await rr.blob();

	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject;
		reader.readAsDataURL(blob)
	})
}


/**
 * Converts the uploaded file object to base64
 * @param file The JS file object
 */
export async function fileToBase64(file: File): Promise<string> {

	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject;
		reader.readAsDataURL(file)
	})
}
