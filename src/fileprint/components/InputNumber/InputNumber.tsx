"use client";

interface InputNumberProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
}

export function InputNumber({ value, onChange, min = 1, max }: InputNumberProps) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(event.target.value);
		if (Number.isNaN(newValue)) return;
		if (max && newValue > max) return;
		if (min && newValue < min) return;
		onChange(newValue);
	};

	const handleIncrement = () => {
		if (max && value === max) return;
		onChange(value + 1);
	};

	const handleDecrement = () => {
		if (min && value === min) return;
		onChange(value - 1);
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white  " data-hs-input-number="">
			<div className="flex w-full items-center justify-between gap-x-1">
				<div className="grow px-3 py-2">
					<input
						onChange={handleChange}
						className="w-full border-0 bg-transparent p-0 text-gray-800 focus:ring-0  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						type="number"
						value={value}
					></input>
				</div>
				<div className="-gap-y-px flex items-center divide-x divide-gray-200 border-s border-gray-200">
					<button
						onClick={handleDecrement}
						type="button"
						className="inline-flex size-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
						aria-label="Decrease"
						data-hs-input-number-decrement=""
					>
						<svg
							className="size-3.5 shrink-0"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M5 12h14"></path>
						</svg>
					</button>
					<button
						onClick={handleIncrement}
						type="button"
						className="inline-flex size-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-5"
						aria-label="Increase"
						data-hs-input-number-increment=""
					>
						<svg
							className="size-3.5 shrink-0"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M5 12h14"></path>
							<path d="M12 5v14"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
