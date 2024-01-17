import { h } from "@/client/modules/HTML.ts";
import { CalendarDisplayOptions, CalendarDisplayOptionsChangedEvent } from "./MonthlyCalendar.ts";

export class CalendarDisplayControllerElement extends HTMLElement {
	static readonly tagName = "elem-monthly_calendar-display_controller";

	readonly #elems: {
		readonly year: HTMLInputElement;
		readonly month: HTMLInputElement;
	};

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.#elems = {
			year: h("input", { name: "year", type: "number" }, { change: this.#onInputChangedHandler }),
			month: h("input", { name: "month", type: "number" }, { change: this.#onInputChangedHandler })
		};
		this.shadowRoot?.append(
			h("div", { class: "year" }, {}, [
				this.#elems.year,
				h("span", {}, {}, ["年"])
			]),
			h("div", { class: "month" }, {}, [
				this.#elems.month,
				h("span", {}, {}, ["月"])
			])
		);
	}

	#onInputChangedHandler = () => {
		this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(this.getValue()));
	}

	getValue() {
		return CalendarDisplayOptions.from(this.getRawValue());
	}

	getRawValue() {
		return {
			year: +(this.#elems.year.value),
			month: +(this.#elems.month.value)
		};
	}

	update(value: CalendarDisplayOptions) {
		const raw = this.getRawValue();
		if (raw.year === value.year && raw.month === value.month)
			return;

		this.#elems.year.value = `${value.year}`;
		this.#elems.month.value = `${value.month}`;
		this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(value));
	}
}

window.customElements.define(CalendarDisplayControllerElement.tagName, CalendarDisplayControllerElement);