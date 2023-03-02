/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

const { resolver } = require("./metro.config");

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(
		{
			...env,
			babel: {
				dangerouslyAddModulePathsToTranspile: ["nativewind"],
			},
		},
		argv
	);

	config.module.rules.push({
		test: /\.css$/i,
		use: ["postcss-loader"],
	});

	Object.assign(config.resolve.alias, {
		...resolver.extraNodeModules,
	});

	return config;
};
