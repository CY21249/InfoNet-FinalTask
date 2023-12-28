import { DebuggerOptions } from "../../modules/util/Debugger/Debugger.ts";

export class APIServer {
    createResponse(request: Request, options?: DebuggerOptions) {
        const url = new URL(request.url);
        const pathElems = url.pathname.split("/").slice(1);

        options?.debugger?.log("APIServer", "requested", [pathElems]);

        return new Response(JSON.stringify(pathElems));
    }
}