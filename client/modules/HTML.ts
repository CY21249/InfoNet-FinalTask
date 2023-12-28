export function html(bases: TemplateStringsArray, ...args: unknown[]): HTMLElement[] {
    const idPrefix = "__html-template_will-be-replaced-slot__";

    let htmlElemStr = "";
    const elems = [];
    for (let i = 0; i < bases.length; i++) {
        htmlElemStr += bases[i];
        
        const arg = args[i];
        if (arg === undefined)
            continue;

        if (arg instanceof HTMLElement) {
            htmlElemStr += `<div id="${idPrefix}${elems.length}"></div>`;
            elems.push(arg);
        } else
            htmlElemStr += arg;
    }
    const $element = _createElement(htmlElemStr);

    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];

        $element.querySelector(`#${idPrefix}${i}`)!.replaceWith(elem);
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