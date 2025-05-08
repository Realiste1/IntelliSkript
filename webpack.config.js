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
		mainFields: ['browser', 'module', 'main'],
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
};

/** @type WebpackConfig */
const sharedNodeConfig = {
	target: 'node', // web extensions run in a webworker context
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
const nodeClientConfig = merge(sharedConfig, sharedNodeConfig, {
	context: path.join(__dirname, 'client'),
	entry: {
		nodeClientMain: './src/nodeClientMain.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'client', 'dist'),
		libraryTarget: 'commonjs',

		devtoolModuleFilenameTemplate: info =>
			"webpack:///" + path.relative(__dirname, info.absoluteResourcePath).replace(/\\/g, "/")
	},
});

/** @type WebpackConfig */
const nodeServerConfig = merge(sharedConfig, sharedNodeConfig, {
	context: path.join(__dirname, 'server'),

	entry: {
		nodeServerMain: './src/nodeServerMain.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'server', 'dist'),
		libraryTarget: 'var',
		library: 'serverExportVar',
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
});

/** @type WebpackConfig */
const browserClientConfig = merge(sharedConfig, sharedBrowserConfig, {
	context: path.join(__dirname, 'client'),

	entry: {
		browserClientMain: './src/browserClientMain.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'client', 'dist'),
		libraryTarget: 'commonjs',

		devtoolModuleFilenameTemplate: info =>
			"webpack:///" + path.relative(__dirname, info.absoluteResourcePath).replace(/\\/g, "/")
	},
});

/** @type WebpackConfig */
const browserServerConfig = merge(sharedConfig, sharedBrowserConfig, {
	context: path.join(__dirname, 'server'),

	entry: {
		browserServerMain: './src/browserServerMain.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'server', 'dist'),
		libraryTarget: 'var',
		library: 'serverExportVar',
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
});



module.exports = [browserClientConfig, browserServerConfig, nodeClientConfig, nodeServerConfig];
