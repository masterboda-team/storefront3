/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { type PdfVariant } from "../../../types";
import { CoverPreview } from "@/fileprint/components/CoverPreview/CoverPreview";
import { InputNumber } from "@/fileprint/components/InputNumber/InputNumber";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

interface PagesSectionProps {
	coloredPagePrice: number;
	grayscalePagePrice: number;
	variants: PdfVariant[];
	pageCount: number;
	hash: string;
	coverUrl: string;
	toCart: (variants: PdfVariant[]) => void;
	onVariantsChange: (variants: PdfVariant[]) => void;
}

export function PagesSection({
	coloredPagePrice,
	grayscalePagePrice,
	variants,
	pageCount,
	hash,
	coverUrl,
	toCart,
	onVariantsChange,
}: PagesSectionProps) {
	const onDeleteVariant = (variantToDelete: PdfVariant) => {
		const newVariants = variants.filter(
			(variant) =>
				variant.coverVariantId !== variantToDelete.coverVariantId &&
				variant.coverTextColor !== variantToDelete.coverTextColor,
		);
		onVariantsChange(newVariants);
	};

	const onUpdateVariant = (variantToUpdate: PdfVariant) => {
		const index = variants.findIndex(
			(variant) =>
				variant.coverVariantId === variantToUpdate.coverVariantId &&
				variant.coverTextColor === variantToUpdate.coverTextColor,
		);
		if (index === -1) {
			onVariantsChange([...variants, variantToUpdate]);
		} else {
			const newVariants = [...variants];
			newVariants[index] = variantToUpdate;
			onVariantsChange(newVariants);
		}
	};

	if (variants.length === 0) {
		return (
			<div className="flex w-full flex-col items-center justify-center gap-4">
				<span>0 items in order</span>
				<LinkWithChannel href="/products" className="relative flex items-center" data-testid="CartNavItem">
					<button className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700">
						Back to Shopping
					</button>
				</LinkWithChannel>
				<LinkWithChannel href="/cart" className="relative flex items-center" data-testid="CartNavItem">
					<button className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700">
						Go To Cart
					</button>
				</LinkWithChannel>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4">
			<h3 className="font-semibold text-neutral-900">Order</h3>
			<div className="flex flex-col gap-4">
				{variants.map((variant) => {
					return (
						<VariantRow
							key={variant.coverVariantId + variant.coverTextColor}
							variant={variant}
							pageCount={pageCount}
							coloredPagePrice={coloredPagePrice}
							grayscalePagePrice={grayscalePagePrice}
							coverUrl={coverUrl}
							hash={hash}
							onUpdateVariant={onUpdateVariant}
							onDeleteVariant={onDeleteVariant}
							toCart={(variant: PdfVariant) => toCart([variant])}
						/>
					);
				})}
			</div>
		</div>
	);
}

interface VariantRowProps {
	variant: PdfVariant;
	pageCount: number;
	coloredPagePrice: number;
	grayscalePagePrice: number;
	hash: string;
	coverUrl: string;
	onUpdateVariant: (variant: PdfVariant) => void;
	onDeleteVariant: (variant: PdfVariant) => void;
	toCart: (variant: PdfVariant) => void;
}

function VariantRow({
	variant,
	pageCount,
	coloredPagePrice,
	grayscalePagePrice,
	hash,
	coverUrl,
	onUpdateVariant,
	onDeleteVariant,
	toCart,
}: VariantRowProps) {
	const [expanded, setExpanded] = React.useState(false);
	const coloredPagesCount = variant.coloredPages.length;
	const grayscaledPagesCount = pageCount - coloredPagesCount;
	const totalGrayscalePrice = grayscaledPagesCount * grayscalePagePrice;
	const totalColoredPagePrice = coloredPagesCount * coloredPagePrice;
	const totalPrice = (totalGrayscalePrice + totalColoredPagePrice + variant._coverPrice) * variant.quantity;

	const onToggleColor = (index: number) => {
		onUpdateVariant({
			...variant,
			coloredPages: variant.coloredPages.includes(index + 1)
				? variant.coloredPages.filter((p) => p !== index + 1)
				: [...variant.coloredPages, index + 1],
		});
	};

	return (
		<div className="flex flex-col gap-4 rounded-lg border-2 p-8">
			<div className="flex w-full border-b-2 pb-8">
				<CoverPreview
					backgroundImageUrl={variant._coverImageUrl}
					printImageUrl={coverUrl}
					printColor={variant.coverTextColor}
					width={300}
				/>
				<div className="relative flex w-2/5 flex-col items-start gap-6 px-8">
					<div className="flex flex-col gap-2">
						<h1 className="text-1xl font-bold">Cover:</h1>
						<h1 className="text-1xl">
							{variant._coverPrice} {variant._coverPriceCurrency}
						</h1>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-1xl font-bold">Grayscale pages:</h1>
						<h1 className="text-1xl">
							{grayscalePagePrice} {variant._coverPriceCurrency} x {grayscaledPagesCount} ={" "}
							{totalGrayscalePrice} {variant._coverPriceCurrency}
						</h1>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-1xl font-bold">Color pages:</h1>
						<h1 className="text-1xl">
							{coloredPagePrice} {variant._coverPriceCurrency} x {coloredPagesCount} = {totalColoredPagePrice}{" "}
							{variant._coverPriceCurrency}
						</h1>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-1xl font-bold">Quantity:</h1>
						<InputNumber
							width={200}
							value={variant.quantity}
							onChange={(value) => {
								onUpdateVariant({ ...variant, quantity: value });
							}}
						/>
					</div>
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col gap-2">
							<h1 className="text-1xl font-bold">Total price:</h1>
							<h1 className="text-1xl">
								{totalPrice} {variant._coverPriceCurrency}
							</h1>
						</div>
						<button
							onClick={() => {
								toCart(variant);
								onDeleteVariant(variant);
							}}
							className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
						>
							To Cart
						</button>
					</div>
				</div>
			</div>
			<div
				className="flex w-full flex-wrap gap-4 overflow-y-hidden transition-all duration-300"
				style={{ height: expanded ? "auto" : "100px", transitionProperty: "height" }}
			>
				{[...Array(pageCount).keys()].map((index) => {
					return (
						<div key={hash + index} className="relative border-2" onClick={() => onToggleColor(index)}>
							<img
								className="h-auto w-56 cursor-pointer"
								src={`${process.env.NEXT_MEDIA_URL}/${hash}/${index + 1}.png`}
								alt="page"
								style={{ filter: variant.coloredPages.includes(index + 1) ? "none" : "grayscale(100%)" }}
							/>
							<div
								className={`absolute bottom-3 right-3 h-4 w-4 rounded-full border-2 border-black bg-white transition-all duration-300 ${
									variant.coloredPages?.includes(index + 1)
										? "bg-gradient-to-br from-red-500 to-red-700"
										: "bg-gray-300"
								}`}
							/>
						</div>
					);
				})}
			</div>
			<button
				type="button"
				onClick={() => {
					setExpanded(!expanded);
				}}
				className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md  font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-md"
			>
				{!expanded ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
					</svg>
				)}
				{expanded ? "Collapse" : "Expand"}
			</button>
		</div>
	);
}
