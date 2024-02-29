import {
	getBaseRollupPlugins,
	getPackageJSON,
	resolvePackagePath
} from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name: packageName, module } = getPackageJSON('react');
// react包路径
const packagePath = resolvePackagePath(packageName);
// react产物路径
const packageDistPath = resolvePackagePath(packageName, true);

export default [
	// react
	{
		input: `${packagePath}/${module}`,
		output: {
			file: `${packageDistPath}/index.js`,
			name: 'react',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: packagePath,
				outputFolder: packageDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	{
		input: `${packagePath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${packageDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${packageDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: [...getBaseRollupPlugins()]
	}
];
