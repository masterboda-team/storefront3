"use client";
import { useState } from "react";
import { type FoundProductFragment, type FoundVariantFragment } from "@/gql/graphql";

const COLORS = ["#00bbcc", "#cf2c0c", "#c0c0c0", "#cd7f32", "#cda434", "#cf007d", "#008000", "#1c1c1c"]; // TODO: make it configurable

interface CoverSectionProps {
	product: FoundProductFragment;
	coverUrl: string;
	onSuccess: (value: { coverVariant: FoundVariantFragment; coverTextColor: string }) => void;
}

export function CoverSection({ coverUrl, product, onSuccess }: CoverSectionProps) {
	const variants = product?.variants ?? [];
	const colors = COLORS;
	const [selectedColor, setSelectedColor] = useState(COLORS[0]);
	const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

	const variantImage = (selectedVariant.media || [{ url: "" }])[0]?.url;

	const price = selectedVariant?.pricing?.price?.gross.amount || "-";
	const currency = selectedVariant?.pricing?.price?.gross.currency || "-";

	const onSubmit = () => {
		onSuccess({
			coverVariant: selectedVariant as FoundVariantFragment,
			coverTextColor: selectedColor,
		});
	};

	return (
		<div className="mb-28 flex w-full flex-col items-center justify-center">
			<h3 className="mb-10 font-semibold text-neutral-900">Select cover</h3>
			<div className="flex w-full justify-center gap-14 ">
				<div className="relative flex flex-col items-start overflow-hidden" style={{ width: "600px" }}>
					<img className="w-full" src={variantImage} alt={variantImage} />
					<img
						className="absolute h-auto w-full"
						style={{ left: 600, filter: `drop-shadow(-600px 0 0 ${selectedColor})` }}
						src={coverUrl}
						alt={coverUrl}
					/>
				</div>
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
						onClick={onSubmit}
						className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
