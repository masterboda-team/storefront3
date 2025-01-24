import { useState } from "react";
import { type PdfVariant } from "../types";

export interface AddPdfToCheckoutInput {
	channel: string;
	checkoutId: string;
	slug: string;
	hash: string;
	variants: PdfVariant[];
}

export const useAddToCheckout = (): [
	(input: AddPdfToCheckoutInput) => Promise<void>,
	{ data: { checkoutId: string } | null; isLoading: boolean },
] => {
	const [data, setData] = useState<{ checkoutId: string } | null>(null);
	const [isLoading, setIsLoaing] = useState<boolean>(false);

	const mutation = async (input: AddPdfToCheckoutInput): Promise<void> => {
		setIsLoaing(true);
		try {
			const response = await fetch(`${process.env.NEXT_FILEPRINT_URL}/api/pdf/add-to-checkout`, {
				method: "POST",
				body: JSON.stringify(input),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const responseData = (await response.json()) as { checkoutId: string };
			setData(responseData);
		} catch (error) {
			console.warn(error);
		} finally {
			setIsLoaing(false);
		}
	};

	return [mutation, { data, isLoading }];
};
