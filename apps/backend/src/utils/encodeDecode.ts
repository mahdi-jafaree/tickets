export function encode64(data: string): string {
	const buffer = Buffer.from(data);
	const encoded = buffer.toString("base64");
	return encoded;
}
export function decode64(data: string): string {
	const buffer = Buffer.from(data, "base64");
	const decoded = buffer.toString("utf-8");
	return decoded;
}
