import React from "react";

interface OrderProgressProps {
	stage: number;
	total: number;
}

export function OrderProgress({ stage, total }: OrderProgressProps) {
	return (
		<div className="relative mb-3 flex w-2/3 items-center">
			{Array.from({ length: total }).map((_, index) => (
				<React.Fragment key={index}>
					<div
						className={`ml-3 mr-3 flex h-6 w-6 items-center justify-center rounded-full font-bold text-white
            ${index <= stage - 1 ? "bg-blue-500" : "bg-gray-300"} border-2 
            ${index <= stage - 1 ? "border-blue-500" : "border-transparent"}
            transition-all duration-300`}
					>
						{index + 1}
					</div>
					{index < total - 1 && (
						<div
							className={`h-1 flex-1 transition-all duration-300 
              ${index < stage - 1 ? "bg-blue-500" : "bg-gray-300"}`}
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
