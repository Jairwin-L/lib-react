import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const packagePath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

/**
 * resolvePackagePath
 * @description 获取包路径
 */
export function resolvePackagePath(packageName, isDist) {
	return `${isDist ? distPath : packagePath}/${packageName}`;
}
/**
 * getPackageJSON
 * @description 获取package.json
 */
export function getPackageJSON(packageName) {
	// package path
	const packageJSONPath = `${resolvePackagePath(packageName)}/package.json`;
	const str = fs.readFileSync(packageJSONPath, { encoding: 'utf-8' });
	return JSON.parse(str);
}
/**
 * getBaseRollupPlugins
 * @description 获取rollup基础插件
 */
export function getBaseRollupPlugins(
	alias = {
		__DEV__: true,
		preventAssignment: true
	},
	typescript = {}
) {
	return [replace(alias), cjs(), ts(typescript)];
}
