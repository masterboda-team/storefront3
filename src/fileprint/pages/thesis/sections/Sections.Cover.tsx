/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import type { FoundProductFragment } from "@/gql/graphql";
import type { PdfVariant } from "@/fileprint/types";
import { CoverPreview } from "@/fileprint/components/CoverPreview/CoverPreview";

const COLORS = ["#00bbcc", "#cf2c0c", "#c0c0c0", "#cd7f32", "#cda434", "#cf007d", "#008000", "#1c1c1c"]; // TODO: make it configurable

interface CoverSectionProps {
	product: FoundProductFragment;
	coverUrl: string;
	onSuccess: (variants: PdfVariant[]) => void;
}

export function CoverSection({ coverUrl, product, onSuccess }: CoverSectionProps) {
	const variants = product?.variants ?? [];
	const colors = COLORS;
	const [selectedCovers, setSelectedCovers] = useState<{ [key: string]: PdfVariant }>({});
	const [selectedColor, setSelectedColor] = useState(COLORS[0]);
	const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

	const variantImage = (selectedVariant.media || [{ url: "" }])[0]?.url;

	const price = selectedVariant?.pricing?.price?.gross.amount || 0;
	const currency = selectedVariant?.pricing?.price?.gross.currency || "-";

	const toOrder = () => {
		if (!selectedVariant || !selectedColor) return;
		const key = `${selectedVariant.id}-${selectedColor}`;
		const quantity = (selectedCovers[key]?.quantity || 0) + 1;
		setSelectedCovers({
			...selectedCovers,
			[key]: {
				coverVariantId: selectedVariant.id,
				coverTextColor: selectedColor,
				coloredPages: [],
				quantity,
				_coverImageUrl: variantImage,
				_printImageUrl: coverUrl,
				_coverPrice: price,
				_coverPriceCurrency: currency,
			},
		});
	};

	const onSubmit = () => {
		onSuccess(Object.values(selectedCovers));
	};

	return (
		<div className="mb-28 flex w-full flex-col items-center justify-center">
			<h3 className="mb-10 font-semibold text-neutral-900">Select cover</h3>
			<div className="flex w-full justify-center gap-14 ">
				<CoverPreview
					backgroundImageUrl={variantImage}
					printImageUrl={coverUrl}
					printColor={selectedColor}
					width={600}
				/>
				<div className="relative flex flex-col items-start gap-6 border-l-2 px-8">
					<h1 className="mb-10 text-3xl">{product?.name}</h1>
					<div className="flex justify-center gap-3">
						<h5>Cover color: </h5>
						{variants.map((variant) => (
							<button
								className={variant.id === selectedVariant.id ? "" : "opacity-70"}
								key={variant.id}
								onClick={() => setSelectedVariant(variant)}
							>
								<img
									className="h-auto w-12"
									src={(variant.media || [])[0]?.url || ""}
									alt="tesi cover variant"
								/>
							</button>
						))}
					</div>
					<div className="mb-6 flex w-full justify-center gap-3">
						<h5>Text color: </h5>
						{colors.map((color) => (
							<button
								key={color}
								style={{ backgroundColor: color }}
								onClick={() => setSelectedColor(color)}
								className={`border-1 h-8 w-8 rounded-full border-neutral-900 ${
									color === selectedColor ? "border-2" : ""
								}`}
							/>
						))}
					</div>
					<h1 className="text-1xl">
						Price: {price} {currency}
					</h1>
					<button
						onClick={toOrder}
						className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
					>
						Add to Order
					</button>
					<h5>To order: </h5>
					<div className="flex justify-center gap-3">
						{Object.values(selectedCovers).map((cover) => (
							<div
								className="relative flex flex-col items-start overflow-hidden"
								style={{ width: "100px" }}
								key={cover.coverVariantId}
							>
								<CoverPreview
									backgroundImageUrl={cover._coverImageUrl}
									printImageUrl={cover._printImageUrl}
									printColor={cover.coverTextColor}
									width={100}
								/>
								<div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
									{cover.quantity}
								</div>
							</div>
						))}
					</div>
					<button
						onClick={onSubmit}
						className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
						disabled={Object.values(selectedCovers).length === 0}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
