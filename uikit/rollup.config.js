/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import path from 'path'

export default [
  {
    input: 'src/index.ts', // All of your library files will be named exports from here
    output: [
      {
        dir: './dist',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    ],
    external: ['@emotion/react', '@emotion/styled'],
    plugins: [
      // This prevents needing an additional `external` prop in this config file by automaticall excluding peer dependencies
      peerDepsExternal({
        includeDependencies: true
      }),
      resolve({
        rootDir: path.resolve('src')
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.rollup.json' })
    ]
  },
  {
    input: './types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
]
