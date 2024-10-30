"use client";
import { NavLink } from "@/ui/components/nav/components/NavLink";

interface NavDropdownProps {
	name: string;
	items?: {
		id: string;
		name: string;
		url?: string | null;
	}[];
}

export function NavDropdown({ name, items = [] }: NavDropdownProps) {
	return (
		<li className="group inline-flex">
			<button className="flex w-full items-center justify-between rounded px-3 py-2 pt-px text-sm font-medium hover:text-neutral-700 md:w-auto md:border-0 md:p-0">
				{name}{" "}
				<svg
					className="ms-3 h-2.5 w-2.5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m1 1 4 4 4-4"
					/>
				</svg>
			</button>
			<div className="invisible absolute top-14 w-44 rounded-md bg-neutral-100 px-2 py-2 group-hover:visible">
				<ul className="flex flex-col gap-3 text-sm">
					{items.map((item) => (
						<NavLink key={item.id} href={item.url || ""}>
							{item.name}
						</NavLink>
					))}
				</ul>
			</div>
		</li>
	);
}
