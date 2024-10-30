/** @type {import('next').NextConfig} */
const config = {
	crossOrigin: "anonymous",
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	experimental: {
		typedRoutes: false,
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
	env: {
		NEXT_FILEPRINT_URL: process.env.NEXT_FILEPRINT_URL,
		NEXT_FILEPRINT_MEDIA_URL: process.env.NEXT_FILEPRINT_MEDIA_URL,
	},
};

export default config;
