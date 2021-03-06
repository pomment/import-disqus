import buble from 'rollup-plugin-buble';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import progress from 'rollup-plugin-progress';
import json from 'rollup-plugin-json';
import nodent from 'rollup-plugin-nodent';
import autoprefixer from 'autoprefixer';
import clean from 'postcss-clean';
import postCSS from 'rollup-plugin-postcss';

const env = process.env.NODE_ENV;

const base = {
    input: 'web/index.js',
    output: {
        file: 'dist/index.js',
        format: 'iife',
        sourcemap: (env !== 'production'),
        globals: {
            jszip: 'JSZip',
        },
    },
    external: ['jszip'],
    plugins: [
        progress({
            clearLine: false,
        }),
        resolve({
            browser: true,
        }),
        commonjs(),
        json(),
        postCSS({
            extract: true,
            plugins: [
                autoprefixer(),
                clean(),
            ],
        }),
        eslint({
            exclude: ['**/*.html', '**/*.css', '**/*.scss', '**/*.json'],
        }),
        nodent({
            promises: true,
            noRuntime: true,
        }),
        buble({
            transforms: {
                modules: false,
                dangerousForOf: true,
            },
            objectAssign: 'Object.assign',
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        uglify(),
    ],
};

if (process.env.NODE_ENV === 'development') {
    base.watch = {
        chokidar: true,
        include: ['lib/**/*', 'web/**/*'],
    };
}

export default base;
