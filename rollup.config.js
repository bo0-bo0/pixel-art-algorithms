export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.cjs',
            format: 'cjs',
            exports: 'named'
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm'
        }
    ]
};
