/* eslint-disable @next/next/no-img-element */
interface CoverPreviewProps {
	backgroundImageUrl: string;
	printImageUrl: string;
	printColor: string;
	width?: number;
}

export function CoverPreview({
	backgroundImageUrl,
	printImageUrl,
	printColor,
	width = 600,
}: CoverPreviewProps) {
	return (
		<div className="relative flex flex-col items-start overflow-hidden" style={{ width }}>
			<img className="w-full" src={backgroundImageUrl} alt={backgroundImageUrl} />
			<img
				className="absolute h-auto w-full"
				style={{ left: width, filter: `drop-shadow(-${width}px 0 0 ${printColor})` }}
				src={printImageUrl}
				alt={printImageUrl}
			/>
		</div>
	);
}
