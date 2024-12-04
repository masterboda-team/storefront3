"use client";
import { useState } from "react";
import { type UploadedFile } from "../../../types";
import { InputNumber } from "@/fileprint/components/InputNumber/InputNumber";
import { type FoundVariantFragment } from "@/gql/graphql";

interface PagesSectionProps {
	coloredPageVariant: FoundVariantFragment;
	grayscalePageVariant: FoundVariantFragment;
	coverVariant: FoundVariantFragment;
	uploadedFile: UploadedFile;
	onSuccess: ({ coloredPages, quantity }: { coloredPages: number[]; quantity: number }) => void;
}

export function PagesSection({
	coloredPageVariant,
	grayscalePageVariant,
	coverVariant,
	uploadedFile,
	onSuccess,
}: PagesSectionProps) {
	const [coloredPages, setColoredPages] = useState<number[]>(uploadedFile.coloredPages || []);
	const [quantity, setQuantity] = useState(1);

	const onOrder = () => {
		onSuccess({ coloredPages, quantity });
	};

	const coloredPagesCount = coloredPages.length;
	const grayscaledPagesCount = uploadedFile.pageCount - coloredPagesCount;
	const coloredPrice = coloredPageVariant.pricing?.price?.gross || null;
	const grayscalePrice = grayscalePageVariant.pricing?.price?.gross || null;
	const coverPrice = coverVariant.pricing?.price?.gross || null;

	const totalColoredPrice = coloredPagesCount * (coloredPrice?.amount || 0);
	const totalGrayscalePrice = grayscaledPagesCount * (grayscalePrice?.amount || 0);
	const totalCoverPrice = coverPrice?.amount || 0;
	const totalPrice = (totalColoredPrice + totalGrayscalePrice + totalCoverPrice) * quantity;

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4">
			<h3 className="font-semibold text-neutral-900">Order</h3>
			<div className="flex gap-4">
				<div className="flex  w-full flex-wrap gap-4">
					<PageList
						uploadedFile={uploadedFile}
						coloredPages={coloredPages}
						setColoredPages={setColoredPages}
					/>
				</div>
				<div className="relative flex w-2/5 flex-col items-start gap-6 border-l-2 px-8">
					<h1 className="text-1xl">
						Cover: {coverPrice?.amount} {coverPrice?.currency}
					</h1>
					<h1 className="text-1xl">Pages:</h1>
					<h2 className="text-1xl">
						- grayscale: {grayscalePrice?.amount} {grayscalePrice?.currency} x {grayscaledPagesCount} ={" "}
						{totalGrayscalePrice} {grayscalePrice?.currency}
					</h2>
					<h2 className="text-1xl">
						- color: {coloredPrice?.amount} {coloredPrice?.currency} x {coloredPagesCount} ={" "}
						{totalColoredPrice} {coloredPrice?.currency}
					</h2>
					<div className="flex items-center gap-4">
						<h1 className="text-1xl">Quantity:</h1>
						<InputNumber value={quantity} onChange={setQuantity} />
					</div>
					<h1 className="text-1xl">
						Total price: {totalPrice} {coverPrice?.currency}
					</h1>
					<button
						onClick={onOrder}
						className="h-12 items-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
					>
						Order
					</button>
				</div>
			</div>
		</div>
	);
}

interface PageListProps {
	uploadedFile: UploadedFile;
	coloredPages: number[];
	setColoredPages: (coloredPages: number[]) => void;
}

function PageList({ uploadedFile, coloredPages, setColoredPages }: PageListProps) {
	const onColorChange = (index: number) => {
		if (coloredPages.includes(index)) {
			setColoredPages(coloredPages.filter((i) => i !== index));
		} else {
			setColoredPages([...coloredPages, index]);
		}
	};

	return [...Array(uploadedFile.pageCount).keys()].map((index) => {
		return (
			<div key={uploadedFile.hash + index} className="relative border-2">
				<img
					className="h-auto w-56 cursor-pointer"
					src={`${process.env.NEXT_MEDIA_URL}/${uploadedFile.hash}/${index + 1}.png`}
					alt="page"
				/>
				<button
					onClick={() => onColorChange(index + 1)}
					className={`absolute bottom-3 right-3 h-4 w-4 rounded-2xl ${
						(coloredPages || uploadedFile.coloredPages)?.includes(index + 1) ? "bg-red-600" : "bg-black"
					}`}
				/>
			</div>
		);
	});
}
