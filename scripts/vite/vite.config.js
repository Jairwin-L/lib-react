import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
// import reactRefresh from 'eslint-plugin-react-refresh';
import { resolvePackagePath } from '../rollup/utils';
import path from 'path';

export default defineConfig({
	server: true,
	plugins: [
		react({}),
		replace({
			__DEV__: true,
			preventAssignment: true
		})
	],
	resolve: {
		alias: [
			{
				find: 'react',
				replacement: resolvePackagePath('react')
			},
			{
				find: 'react-dom',
				replacement: resolvePackagePath('react-dom')
			},
			{
				find: 'hostConfig',
				replacement: path.resolve(
					resolvePackagePath('react-dom'),
					'./src/hostConfig.ts'
				)
			}
		]
	}
});
