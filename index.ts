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


/**
 * Converts base64 file to blob
 * @param file The base64 file
 * @param contentType The content type of the file. Defaults to: image/jpeg
 */
export async function base64ToBlob(file: string, contentType?: string): Promise<Blob> {
	let fetchResponse = await fetch(`data:${contentType || 'image/jpeg'};base64,` + file)
    return await fetchResponse.blob();
}
