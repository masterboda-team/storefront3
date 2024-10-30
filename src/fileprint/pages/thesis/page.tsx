"use client";
import { useEffect, useState } from "react";
import { Choose, When } from "../../components/wrappers";
import { OrderProgress } from "../../components/OrderProgress/OrderProgress";
import { type UploadedFile, type UploadResult } from "../../types";
import { useFetchPdf } from "../../hooks/useFetchPdf";
import { Sections } from "./sections/Sections";
import { Loader } from "@/ui/atoms/Loader";
import type { FoundProductFragment, FoundVariantFragment } from "@/gql/graphql";
import { useGetPrintProduct } from "@/fileprint/hooks/useGetPrintProduct";
import { useAddToCheckout } from "@/fileprint/hooks/useAddToCheckout";

interface FilePrintPageProps {
	channel: string;
	getCheckout: () => Promise<string | null>;
	revalidateCart: () => void;
}

type PageState = {
	stage: 1 | 2 | 3;
	isLoading: boolean;
	uploadResult: UploadResult | null;
	coverVariant: FoundVariantFragment | null;
	coverTextColor: string | null;
};

export function FilePrintPage({ channel, getCheckout, revalidateCart }: FilePrintPageProps) {
	const [state, setState] = useState<PageState>({
		stage: 1,
		isLoading: false,
		uploadResult: null,
		coverVariant: null,
		coverTextColor: null,
	});
	const [fetchPdf, { data: fetchPdfData, isLoading: fetchPdfLoading }] = useFetchPdf();
	const [
		getPrintProduct,
		{ data: printProduct, isLoading: printProductLoading, isError: printProductError },
	] = useGetPrintProduct();
	const [addToCheckout, { isLoading: addToCheckoutLoading }] = useAddToCheckout();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getPrintProduct("tesi", channel);
	}, [channel]);

	if (printProductError)
		return (
			<div className="mt-6 flex h-full w-full flex-col items-center justify-center gap-4">
				<h1 className="mb-3 text-3xl text-neutral-900">Tesi Order</h1>
				<h1 className="text-3xl text-neutral-900">Print product not found</h1>
			</div>
		);

	const onUploadSuccess = (uploadResult: UploadResult) => {
		if (!printProduct) return;
		fetchPdf(uploadResult.hash);
		setState({
			...state,
			uploadResult,
			isLoading: false,
			stage: 2,
		});
	};

	const onCoverSuccess = (value: { coverVariant: FoundVariantFragment; coverTextColor: string }) => {
		setState({
			...state,
			...value,
			stage: 3,
		});
	};

	const onOrderSuccess = async (args: { coloredPages: number[]; quantity: number }) => {
		const checkoutId = await getCheckout();

		const input = {
			hash: state.uploadResult?.hash || "",
			slug: printProduct?.slug || "",
			checkoutId: checkoutId || "",
			coloredPages: args.coloredPages,
			coverVariantId: state.coverVariant?.id || "",
			channel,
			quantity: args.quantity,
		};

		await addToCheckout(input);

		revalidateCart();
	};

	return (
		<div className="mt-6 flex h-full w-full flex-col items-center justify-center gap-4">
			<h1 className="mb-3 text-3xl text-neutral-900">Tesi Order</h1>
			<OrderProgress stage={state.stage} total={3} />
			<Sections>
				<Choose>
					<When
						condition={
							state.isLoading ||
							printProductLoading ||
							addToCheckoutLoading ||
							(state.stage > 2 && fetchPdfLoading)
						}
					>
						<Loader />
					</When>
					<When condition={!!printProduct && !printProduct?.coverProduct}>
						<h1 className="text-3xl text-neutral-900">Cover product not found</h1>
					</When>
					<When condition={!!printProduct && !printProduct?.pageProduct}>
						<h1 className="text-3xl text-neutral-900">Page product not found</h1>
					</When>
					<When condition={!!printProduct && !printProduct?.coloredPageVariant}>
						<h1 className="text-3xl text-neutral-900">Colored variant not found</h1>
					</When>
					<When condition={!!printProduct && !printProduct?.grayscalePageVariant}>
						<h1 className="text-3xl text-neutral-900">Grayscale variant not found</h1>
					</When>
					<When condition={state.stage === 1}>
						<Sections.Upload onSuccess={onUploadSuccess} />
					</When>
					<When condition={state.stage === 2}>
						<Sections.Cover
							product={printProduct?.coverProduct as FoundProductFragment}
							coverUrl={state.uploadResult?.coverUrl || ""}
							onSuccess={onCoverSuccess}
						/>
					</When>
					<When condition={!!(state.stage === 3)}>
						<Sections.Pages
							coverVariant={state.coverVariant as FoundVariantFragment}
							coloredPageVariant={printProduct?.coloredPageVariant as FoundVariantFragment}
							grayscalePageVariant={printProduct?.grayscalePageVariant as FoundVariantFragment}
							uploadedFile={fetchPdfData as UploadedFile}
							onSuccess={onOrderSuccess}
						/>
					</When>
				</Choose>
			</Sections>
			<When condition={fetchPdfLoading}>
				<div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border-2 p-3 text-lg">
					<Loader />
					File in process...
				</div>
			</When>
		</div>
	);
}
