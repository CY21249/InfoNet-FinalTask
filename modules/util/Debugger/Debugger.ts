export type DebuggerOptions = {
    debugger?: Debugger;
};

export class Debugger {
    #enabled: boolean;
    get enabled() { return this.#enabled; }
    enable() { this.#enabled = true; }
    disable() { this.#enabled = false; }

    constructor(enabled: boolean) {
        this.#enabled = enabled;
    }

    log(loc: string, message: string, args?: unknown[], options?: { stack?: boolean; }) {
        console.log(
            `%c${new Date().toLocaleString("ja")} %c ${loc} %c %c${message}`, 
            "color: #888;",
            "background-color: #222; color: #6a93ba;",
            "",
            "text-decoration: underline;",
            ...(args != null ? [":", ...args] : []),
        );

        if (options?.stack)
            this.stacktrace();
    }

    stacktrace() {
        console.trace();
    }
}