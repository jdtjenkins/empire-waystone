export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
} | undefined
