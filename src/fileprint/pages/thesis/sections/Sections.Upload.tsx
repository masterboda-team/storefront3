"use client";
import { Upload } from "../../../components/Upload/Upload";
import { useUploadPdf } from "../../../hooks/useUploadPdf";
import { When } from "../../../components/wrappers";
import type { UploadResult } from "../../../types";

interface UploadSectionProps {
	onLoading?: () => void;
	onError?: () => void;
	onSuccess: (file: UploadResult) => void;
}

export function UploadSection({ onLoading, onError, onSuccess }: UploadSectionProps) {
	const [upload, { isLoading, data }] = useUploadPdf();

	const onFileChange = async (file: File) => {
		onLoading && onLoading();
		const processedPdf = await upload(file);
		if (processedPdf) onSuccess(processedPdf);
		else onError && onError();
	};

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4">
			<h3 className="font-semibold text-neutral-900">First, upload your PDF file:</h3>
			<p className="text-neutral-900">
				Upload your thesis in PDF format including the title page. (Don&apost worry if your title page is not
				perfectly formatted, we&aposll take care of it).
			</p>
			<When condition={!data}>
				<Upload onChange={onFileChange} isLoading={isLoading} />
			</When>
		</div>
	);
}
