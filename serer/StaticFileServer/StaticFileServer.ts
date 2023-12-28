import { DebuggerOptions } from "../../modules/util/Debugger/Debugger.ts";
// import * as Path from "path";
import { mime } from "mime";

export class StaticFileServer {
    async createResponse(request: Request, options?: DebuggerOptions) {
        const url = new URL(request.url);
        const pathname = decodeURIComponent(url.pathname);
        const filepath = `./static${pathname}`;
        
        options?.debugger?.log("StaticFileServer", "requested to fetch", [filepath]);

        const fileData = await this.#openFile(filepath)
            ?? await this.#openFile(`${filepath}index.html`);

        if (fileData === undefined)
            return new Response("Not Found", { status: 404 });

        return new Response(fileData.readable, {
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
