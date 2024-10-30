"use client";
import { type ReactNode } from "react";
import { UploadSection } from "./Sections.Upload";
import { CoverSection } from "./Sections.Cover";
import { PagesSection } from "./Sections.Pages";

interface SectionsProps {
	children?: ReactNode;
}

function Sections({ children }: SectionsProps) {
	return <div className="flex w-full flex-col items-center justify-center gap-4">{children}</div>;
}

Sections.Upload = UploadSection;
Sections.Cover = CoverSection;
Sections.Pages = PagesSection;

export { Sections };
