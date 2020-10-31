import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser"

export default {
    input: "src/client/index.jsx",

    output: {
        file: "public/build/bundle.js",
        format: "iife"
    },

    plugins: [
        resolve({ browser: true }),
        commonjs(),
        babel({ babelHelpers: "bundled" }),
        json(),
        terser()
    ],

    watch: {
        clearScreen: false
    }
};
