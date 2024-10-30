import React, { type ReactNode } from "react";

interface WhenProps {
	children: JSX.Element;
	condition?: boolean;
}

export function When({ condition, children }: WhenProps) {
	if (condition) return children;
	return null;
}

interface ChooseProps {
	children: ReactNode;
}

export function Choose({ children }: ChooseProps) {
	const childrens = React.Children.toArray(children);
	if (!childrens?.length) return null;

	const renderedChild = childrens.find((child) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		return React.isValidElement(child) && child.type === When && !!child.props?.condition;
	});

	return renderedChild || null;
}
