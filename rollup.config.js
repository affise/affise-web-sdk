import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'index.js',
    output: {
        name: 'ASDK',
        file: 'dist/affise-web-sdk.js',
        format: 'umd'
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
