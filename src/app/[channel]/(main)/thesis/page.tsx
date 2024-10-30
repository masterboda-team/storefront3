// eslint-disable-next-line import/no-named-as-default
import invariant from "ts-invariant";
import { revalidatePath } from "next/cache";
import * as Checkout from "@/lib/checkout";
import { FilePrintPage } from "@/fileprint/pages/thesis/page";

async function getCheckout(): Promise<string | null> {
	"use server";

	const checkout = await Checkout.findOrCreate({
		checkoutId: Checkout.getIdFromCookies("default-channel"),
		channel: "default-channel",
	});

	invariant(checkout, "This should never happen");

	Checkout.saveIdToCookie("default-channel", checkout.id);

	return checkout.id;
}

async function revalidateCart(): Promise<void> {
	"use server";
	revalidatePath("/cart");
}

export default async function Page({ params }: { params: { channel: string } }) {
	return <FilePrintPage channel={params.channel} getCheckout={getCheckout} revalidateCart={revalidateCart} />;
}
