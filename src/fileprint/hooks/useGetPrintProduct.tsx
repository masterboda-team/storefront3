import { useState } from "react";
import { type GetPrintProductsResponse, type PrintProduct } from "../types";

type useGetPrintProductReturn = [
	(slug: string, channel: string) => Promise<void>,
	{ data: PrintProduct | null; isLoading: boolean; isError: boolean },
];

export const useGetPrintProduct = (): useGetPrintProductReturn => {
	const [data, setData] = useState<PrintProduct | null>(null);
	const [isLoading, setIsLoaing] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const query = async (slug: string, channel: string) => {
		setIsLoaing(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_FILEPRINT_URL}/api/print-products?slug=${slug}&channel=${channel}`,
				{
					method: "GET",
				},
			);
			const responseData = (await response.json()) as GetPrintProductsResponse;
			if (responseData?.data[0]) setData(responseData?.data[0]);
			else setData(null);
		} catch (error) {
			console.warn(error);
			setIsError(true);
		} finally {
			setIsLoaing(false);
		}
	};

	return [query, { data, isLoading, isError }];
};
