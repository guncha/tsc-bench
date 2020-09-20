const ts = require("typescript");
const glob = require("glob");
const fs = require("fs");
const Benchmark = require("benchmark");
const { createSystem, createVirtualCompilerHost } = require("@typescript/vfs");

console.log("Compiler version", ts.version);
console.log("Compilee version", require("./TypeScript/package.json").version)

// Load all files into memory
const sources = (function () {
    const sources = new Map();
    const pattern = "TypeScript/**/*";

    for (const file of glob.sync(pattern)) {
        const stats = fs.statSync(file)
        if (stats.isDirectory()) {
            // Ignore
        } else {
            sources.set("/" + file, fs.readFileSync(file, { encoding: "utf8" }))
        }
    }

    console.log("Loaded", sources.size, "source files from", pattern);

    return sources;
})()

let filesRead = new Set();

function compileTheCompiler() {
    filesRead = new Set();
    let bytesWritten = 0;

    const project = ts.parseJsonConfigFileContent(
        JSON.parse(sources.get("/TypeScript/src/tsconfig.json")),
        {},
        "TypeScript/src"
    )

    const system = createSystem(sources);
    const host = createVirtualCompilerHost({
        ...system,
        getCurrentDirectory: () => "/",
        getExecutingFilePath: () => "/index.js",
        readFile: (fileName) => {
            if (fileName.startsWith("/lib"))
                fileName = "/TypeScript/built/local" + fileName;

            filesRead.add(fileName);
            return system.readFile(fileName);
        },
        writeFile: (fileName, data, bom) => {
            // Don't actually write anything
            bytesWritten += data.length;
        },
        write: (s) => console.log("host:", s)
    }, project.options, ts);

    const builderHost = ts.createSolutionBuilderHost(host.compilerHost);
    const builder = ts.createSolutionBuilder(builderHost, ["/TypeScript/src/tsc"], {
        force: true
    });

    const result = builder.build();
    if (result !== 0) {
        throw new Error("Compilation failed: " + result)
    }

    console.log("Compiled", filesRead.size, "files and wrote", bytesWritten, "bytes")
}

new Benchmark.Suite().add("Compile the compiler", compileTheCompiler).on("cycle", (event) => {
    const bench = event.target;
    console.log(bench.name, "mean:", bench.stats.mean, "rme:", bench.stats.rme + " %", "samples:", bench.stats.sample)
}).on("complete", () => {
    console.log("Input file count:", filesRead.size, "lines:", [...filesRead.keys()].map(name => sources.get(name).split("\n").length).reduce((a, b) => a + b, 0))
}).run()