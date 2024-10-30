"use client";
import { useState } from "react";
import { type UploadResult } from "../types";

type UseProcessPdfReturn = [
	(file: File) => Promise<UploadResult | null>,
	{ data: UploadResult | null; isLoading: boolean },
];

export const useUploadPdf = (): UseProcessPdfReturn => {
	const [data, setData] = useState<UploadResult | null>(null);
	const [isLoading, setIsLoaing] = useState<boolean>(false);

	const upload = async (file: File): Promise<UploadResult | null> => {
		const formData = new FormData();
		formData.append("file", file);
		setIsLoaing(true);
		let result: UploadResult | null = null;
		try {
			const response = await fetch(`${process.env.NEXT_FILEPRINT_URL}/api/pdf/upload`, {
				method: "POST",
				body: formData,
			});
			const parsedResponse = (await response.json()) as { data: UploadResult };
			result = parsedResponse.data;
			setData(parsedResponse.data);
		} catch (error) {
			console.warn(error);
		} finally {
			setIsLoaing(false);
			return result;
		}
	};

	return [upload, { data, isLoading }];
};
