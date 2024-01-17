/** Transpile TypeScript file "script.ts" into JavaScript */

import { bundle } from "bundle";
import * as Path from "path";
import { Debugger } from "./modules/util/Debugger/Debugger.ts";

const dbgr = new Debugger(true);

const baseFilepath = "./client";

function toDistFilepath(filepath: string) {
	const { dir, name } = Path.parse(filepath);
	const dirElems = dir.split("/"); // "./static/..." -> [".", "static", ...]
	const distDir = [dirElems[0], "static", ...dirElems.slice(2)].join("/");

	return `${distDir}/${name}.js`;
}

async function bundleAndChildren(filepath: string) {
	const files = Deno.readDir(filepath);
	for await (const file of files) {
		const fp = `${filepath}/${file.name}`;
		const { ext, base } = Path.parse(fp);

		if (file.isDirectory) {
			bundleAndChildren(fp);
			continue;
		}
		if (![".ts", ".tsx"].includes(ext))
			continue;
		if (base !== "script.ts")
			continue;

		// bundle
		const result = await bundle(fp, { importMap: "./deno.json", minify: false, type: "module" });

		const distFP = toDistFilepath(fp);

		// output
		writeJSFile(distFP, fp, result.code);

		dbgr.log("Bundle", "Bundled TypeScript file and Distributed", [fp, "->", distFP]);
	}
}

function writeJSFile(filepath: string, origin: string, bundledCode: string) {
	const content = `/**
* File transpiled from TypeScript and bundled 
* - at ${new Date().toLocaleString()}
* - file: ${origin} -> ${filepath}
* - using: https://deno.land/x/emit@0.32.0/mod.ts
*/
${bundledCode}`;
	return Deno.writeTextFile(filepath, content);
}

bundleAndChildren(baseFilepath);
