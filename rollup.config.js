import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'index.js',
    output: {
        name: 'ASDK',
        file: 'dist/bundle.js',
        format: 'umd',
        // Add this to ensure the global variable is properly set
        globals: {
            window: 'window',
            document: 'document'
        }
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