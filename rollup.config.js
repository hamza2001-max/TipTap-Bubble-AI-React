import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import css from 'rollup-plugin-css-only';
import dts from "rollup-plugin-dts";
import { babel } from '@rollup/plugin-babel';
import json from "@rollup/plugin-json";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      css({ output: 'index.css' }),
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
    ],
    external: ["react", "react-dom", "@tiptap/react", "@google/generative-ai"],
  },
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.d.ts', format: 'esm' },
    plugins: [dts()],
    external: [/\.css$/]
  },
];