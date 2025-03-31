import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'src/vanilla_sdk.js',
    output: {
        name: 'ASDK',
        file: 'dist/affise-vanilla-sdk.js',
        format: 'iife'
    },
    plugins: [
        resolve({
            browser: true,
        }),
        commonjs(),
        babel({
            babelrc: false,
            presets: [['@babel/preset-env', { modules: false }]],
            exclude: 'node_modules/**'
        }),
        uglify(),
    ]
}
