import { Server } from "./serer/Server.ts";
import { Debugger } from "./modules/util/Debugger/Debugger.ts";

new Server({ debugger: new Debugger(true) }).serve();
