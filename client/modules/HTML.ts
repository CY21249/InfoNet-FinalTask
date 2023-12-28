export function html(bases: TemplateStringsArray, ...args: unknown[]): HTMLElement[] {
    const idPrefix = "__html-template_will-be-replaced-slot__";

    let htmlElemStr = "";
    for (let i = 0; i < bases.length; i++) {
        htmlElemStr += bases[i];
        if (i < args.length)
            htmlElemStr += `<div id="${idPrefix}${i}"></div>`;
    }
    const $element = _createElement(htmlElemStr);

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const $elem = arg instanceof HTMLElement ? arg : _createElement(arg);

        $element.querySelector(`#${idPrefix}${i}`)!.replaceWith($elem);
    }

    return Array.from($element.children) as HTMLElement[];
}

function _createElement(value: unknown): HTMLBodyElement {
    return new DOMParser().parseFromString(`
        <!DOCTYPE html>
        <head></head>
        <body>
            ${value}
        </body>
    `, "text/html").body as HTMLBodyElement;
}