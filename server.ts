import { Server } from "./server/Server.ts";
import { Debugger } from "@/modules/util/Debugger/Debugger.ts";

new Server({ debugger: new Debugger(true) }).serve();
