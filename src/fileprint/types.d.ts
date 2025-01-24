import type { FoundProductFragment, FoundVariantFragment } from "@/gql/graphql.ts";

export type UploadResult = {
	hash: string;
	coverUrl: string;
};

export type UploadedFile = {
	id: number;
	hash: string;
	name: string;
	pageCount: number;
	coloredPages: number[] | null;
	pages: { path: string; isColor: boolean; number: number }[];
	processStatus: ProcessStatus;
};

export type PrintProduct = {
	id: number;
	slug: string;
	coverProduct: FoundProductFragment | null;
	pageProduct: FoundProductFragment | null;
	coloredPageVariant: FoundVariantFragment | null;
	grayscalePageVariant: FoundVariantFragment | null;
};

export type GetPrintProductsResponse = {
	data: PrintProduct[];
};

enum ProcessStatus {
	DONE = "DONE",
	ERROR = "ERROR",
	NOT_PROCESSED = "NOT_PROCESSED",
}

export type PdfVariant = {
	// The ID of the product variant to use for the cover
	coverVariantId: string;
	// The color of the cover text
	coverTextColor: string;
	// The pages of the PDF that should be printed in color
	coloredPages: number[];
	// The quantity of the printed PDF to add
	quantity: number;
	// The URL of the cover image
	_coverImageUrl: string;
	// The URL of the print image
	_printImageUrl: string;
	// The price of the cover
	_coverPrice: number;
	// The currency of the cover price
	_coverPriceCurrency: string;
};

// Util types

export type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Nullable<T> = { [K in keyof T]: T[K] | null };
