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
		const $style =this.shadowRoot?.appendChild(document.createElement("style"));
		if ($style) $style.textContent = getStyle();

		this.shadowRoot?.append(
			h("div", {}, {}, [
				h("div", { class: "inputs" }, {}, [
					h("div", { class: "year" }, {}, [
						this.#elems.year,
						h("span", {}, {}, ["年"])
					]),
					h("div", { class: "month" }, {}, [
						this.#elems.month,
						h("span", {}, {}, ["月"])
					])
				]),
				h("div", { class:"buttons" }, {}, [
					h("button", { class: "btn-sub_month" }, { click: this.#onSubMonthClickedHandler }, ["<"]),
					h("button", { class: "btn-back_month" }, { click: this.#onBackMonthClickedHandler }, ["今月"]),
					h("button", { class: "btn-add_month" }, { click: this.#onAddMonthClickedHandler }, [">"])
				])
			])
		);
	}

	#onInputChangedHandler = () => {
		this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(this.getValue()));
	}

	#onSubMonthClickedHandler = () => {
		const current = this.getValue();

		this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(CalendarDisplayOptions.from({
			year: current.year,
			month: current.month - 1
		})));
	}

	#onAddMonthClickedHandler = () => {
		const current = this.getValue();

		this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(CalendarDisplayOptions.from({
			year: current.year,
			month: current.month + 1
		})));
	}

	#onBackMonthClickedHandler = () => {
		const today = new Date(Date.now());
		this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(CalendarDisplayOptions.from({
			year: today.getFullYear(),
			month: today.getMonth() + 1
		})));
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

function getStyle() {
	return `
		:host > div {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			box-shadow: 0 1rem 3rem #0364;
			border-radius: 1rem;
			padding: .25rem 1rem;
		}

		:host > div > div {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		.buttons {
			align-items: center;

			& > button {
				background-color: white;
				border: none;
				box-shadow: 0 .25rem .75rem #0002;
				transition: .2s;
				padding: .5rem 1rem;

				&:hover {
					background-color: #6AF;
					color: white;
				}

				&.btn-add_month,
				&.btn-sub_month {
					border-radius: 100rem;
				}
	
				&.btn-back_month {
					border-radius: .5rem;
				}
			}
		}
		
		input {
			border: none;
			background-color: transparent;
			font-size: 2rem;
			text-align: right;

			&[name="year"] {
				width: 4em;
			}

			&[name="month"] {
				width: 2em;
			}
		}
	`;
}

window.customElements.define(CalendarDisplayControllerElement.tagName, CalendarDisplayControllerElement);