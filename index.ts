import { serve } from "https://deno.land/std@0.61.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.61.0/http/file_server.ts";
import { walk, readJson, readFileStr, writeFileStr, ensureDir } from "https://deno.land/std/fs/mod.ts";
import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { green, cyan, bold, yellow, red } from "https://deno.land/std@0.61.0/fmt/colors.ts";

function assignData(root: any, path: string[], index: number, data: object) {
	if (index == path.length - 1) {
		const basename: string = path[index].split(".").slice(0, -1).join(".");
		root[basename] = data;
	} else {
		const key: string = path[index];

		if (!root[key]) {
			root[key] = {};
		}
		assignData(root[key], path, index + 1, data);
	}
}

async function getFilesAsData(filePath: string) {
	const result = {};
	for await (const entry of walk(filePath)) {
		if (entry.isFile && !entry.isSymlink) {
			const extension = entry.name.split(".").pop();
			switch (extension) {
				case "json":
					const data: any = await readJson(entry.path);
					assignData(result, entry.path.split("/"), 0, data);
					break;
				default:
					const text: any = await readFileStr(entry.path);
					assignData(result, entry.path.split("/"), 0, text);
					break;
			}
		}
	}
	return result;
}

async function useTemplate(template, replacementMap) {
	let str: string = await readFileStr(template);
	for (let key in replacementMap) {
		str = str.split(key).join(replacementMap[key]);
	}
	return str;
}

async function fileExists(path) {
	try {
		const stats = await Deno.lstat(path);
		return stats && stats.isFile;
	} catch(e) {
  		if (e instanceof Deno.errors.NotFound) {
  			return false;
  		} else {
  			throw e;
  		}
	}
	return true; 
}

async function initialize() {
	const { config } = await getFilesAsData("config");
	await ensureDir("public/generated");
	const configCode = await useTemplate("template/config-template.js", {
		CONFIGURATION: JSON.stringify(config, null, 3),
	});
	await writeFileStr("public/generated/config.js", configCode);

	const server = serve({ port: config.server.port });
	console.log(bold("Start listening on ") + green(`localhost:${config.server.port}`));

	for await (const req of server) {
	  	const path = `${Deno.cwd()}/public${req.url}`;
	  	if (await fileExists(path)) {
		  	const content = await serveFile(req, path);
		  	req.respond(content);
	  	} else if (req.url === '/') {
			req.respond(await serveFile(req, `${Deno.cwd()}/public/index.html`));
		} else if (req.url === '/ping') {
		    req.respond({ body: "ping" });
		} else {
  			req.respond({status: 404});
		}
	}
}


initialize();