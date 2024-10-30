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

// Util types

type Unpacked<T> = T extends (infer U)[] ? U : T;
