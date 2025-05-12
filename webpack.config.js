/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

/** @type WebpackConfig */
const sharedConfig = {
	mode: 'none',
	externals: {
		// vscode is already included, so we don't have to include it
		vscode: 'commonjs vscode',
	},
	devtool: 'nosources-source-map',
	performance: {
		hints: false,
	},
	resolve: {
		conditionNames: ['import', 'require'],
		extensions: ['.ts', '.js'], // support ts-files and js-files
		alias: {},
		fallback: {
			path: require.resolve('path-browserify'),
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
	output: {
		filename: '[name].js',
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
};

/** @type WebpackConfig */
const sharedNodeConfig = {
	target: 'node', // desktop extensions run in a node context
	resolve: {
		mainFields: ['module', 'main'],
	}
};

/** @type WebpackConfig */
const sharedBrowserConfig = {
	target: 'webworker', // web extensions run in a webworker context
	resolve: {
		mainFields: ['browser', 'module', 'main'],
	}
};
/** @type WebpackConfig */
const sharedClientConfig = {
	context: path.join(__dirname, 'client'),
	output: {
		path: path.join(__dirname, 'client', 'dist'),
		libraryTarget: 'commonjs',
	},
};

/** @type WebpackConfig */
const sharedServerConfig = {
	context: path.join(__dirname, 'server'),
	output: {
		path: path.join(__dirname, 'server', 'dist'),
		libraryTarget: 'var',
		library: 'serverExportVar',
	}
};

/** @type WebpackConfig */
const nodeClientConfig = merge(sharedConfig, sharedNodeConfig, sharedClientConfig, {
	entry: {
		nodeClientMain: './src/nodeClientMain.ts',
	}
});

/** @type WebpackConfig */
const nodeServerConfig = merge(sharedConfig, sharedNodeConfig, sharedServerConfig, {
	entry: {
		nodeServerMain: './src/nodeServerMain.ts',
	}
});

/** @type WebpackConfig */
const browserClientConfig = merge(sharedConfig, sharedBrowserConfig, sharedClientConfig, {
	entry: {
		browserClientMain: './src/browserClientMain.ts',
	},
});

/** @type WebpackConfig */
const browserServerConfig = merge(sharedConfig, sharedBrowserConfig, sharedServerConfig, {
	entry: {
		browserServerMain: './src/browserServerMain.ts',
	},
});



module.exports = [browserClientConfig, browserServerConfig, nodeClientConfig, nodeServerConfig];
