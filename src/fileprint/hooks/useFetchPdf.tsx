import { useState } from "react";
import { type UploadedFile } from "../types";

type UseFetchPdfReturn = [(hash: string) => void, { data: UploadedFile | null; isLoading: boolean }];

export const useFetchPdf = (): UseFetchPdfReturn => {
	const [data, setData] = useState<UploadedFile | null>(null);
	const [isLoading, setIsLoaing] = useState<boolean>(false);

	const query = async (hash: string) => {
		setIsLoaing(true);
		try {
			const response = await fetch(`${process.env.NEXT_FILEPRINT_URL}/api/pdf/${hash}`, {
				method: "GET",
			});
			const responseData = (await response.json()) as { data: UploadedFile };
			setData(responseData.data);
		} catch (error) {
			console.warn(error);
		} finally {
			setIsLoaing(false);
		}
	};

	return [query, { data, isLoading }];
};
