import { DebuggerOptions } from "../../modules/util/Debugger/Debugger.ts";
// import * as Path from "path";
import { mime } from "mime";

export class StaticFileServer {
    static readonly name = "StaticFileServer";

    async createResponse(request: Request, options?: DebuggerOptions) {
        const url = new URL(request.url);
        const pathname = decodeURIComponent(url.pathname);
        const filepath = `./static${pathname}`;
        
        options?.debugger?.log(StaticFileServer.name, "requested to fetch", [filepath]);

        const fileInfo = {
            path: filepath,
            data: await this.#openFile(filepath)
        };
        if (fileInfo.data == null) {
            if (filepath.endsWith("/")) {
                fileInfo.path = `${filepath}index.html`;
                fileInfo.data = await this.#openFile(fileInfo.path);
            } else {
                options?.debugger?.log(StaticFileServer.name, "respond with", [302, `Location: ${pathname}/`]);
                return new Response(null, {
                    headers: { "Location": `${pathname}/` },
                    status: 302, statusText: "Found"
                });
            }
        }
        
        if (fileInfo.data === undefined) {
            options?.debugger?.log(StaticFileServer.name, "respond with", [404]);
            return new Response("Not Found", { status: 404 });
        }

        options?.debugger?.log(StaticFileServer.name, "respond with", [200, fileInfo.path]);
        return new Response(fileInfo.data.readable, {
            headers: {
                "Content-Type": mime.getType(filepath) ?? ""
            }
        });
    }

    async #openFile(filepath: string) {
        try {
            return await Deno.open(filepath);
        } catch {
            return undefined;
        }
    }
}
