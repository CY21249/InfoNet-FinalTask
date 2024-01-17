/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
/// <reference lib="esnext" />
/// <reference lib="dom" />

import { DebuggerOptions } from "../modules/util/Debugger/Debugger.ts";
import { APIServer } from "./APIServer/APIServer.ts";
import { StaticFileServer } from "./StaticFileServer/StaticFileServer.ts";

export class Server {
    readonly #apiServer = new APIServer();
    readonly #staticFileServer = new StaticFileServer();
    #server?: Deno.HttpServer;
    readonly #options?: DebuggerOptions;

    constructor(options?: DebuggerOptions) {
        this.#options = options;
    }

    // bind this
    readonly handler: Deno.ServeHandler = (request: Request) => {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api/"))
            return this.#apiServer.createResponse(request, this.#options);
        else
            return this.#staticFileServer.createResponse(request, this.#options);
    };

    serve(options: Deno.ServeOptions = {}) {
        this.#server = Deno.serve(
            options,
            this.handler
        );
    }

    shutdown() {
        if (this.#server == null) {
            console.log("server not serving")
            return;
        }
        
        this.#server.shutdown();
        this.#server = undefined;
    }
}