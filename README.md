# Typescript compiler benchmark

1. Check out the repo and the compiler submodule
1. `npm install` in both
1. `npm run build` in the `TypeScript` directory to run pre-build tasks that generate required files
1. `npm start` in the top level directory to do the benchmark.

This is the output on my system Intel Core i7-8750H @ 2.20Ghz, 32 GB ram, Win 10

```
PS C:\Users\Guntars\Code\tsc-bench> npm start

> tsc-bench@1.0.0 start C:\Users\Guntars\Code\tsc-bench
> node index.js

Compiler version 4.0.3
Compilee version 4.1.0
Loaded 73988 source files from TypeScript/**/*
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compiled 163 files and wrote 22289571 bytes
Compile the compiler mean: 15.8434785396 rme: 4.279609297255969 % samples: [ 16.2640652, 14.8851643, 16.0122635, 16.054004499, 16.001895199 ]
Input file count: 163 lines: 289850
```