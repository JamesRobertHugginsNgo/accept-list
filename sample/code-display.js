import jsBeautify from 'https://cdn.jsdelivr.net/npm/js-beautify@1.15.3/+esm';

export default class CodeDisplay {
	#containerEl;

	constructor(containerEl) {
		this.#containerEl = containerEl;
	}

	insert(title, description, code, ...args) {
		const result = code(...args);
		this.#containerEl.insertAdjacentHTML('beforeend', `<h2>${title}</h2><p>${description}</p><h3>Code</h3><pre><code>${jsBeautify(code.toString())}</code></pre><h3>Return Value</h3><pre><code>${typeof result === 'object' ? JSON.stringify(result, null, '\t') : result}</code></pre>`);
		return result;
	}
}
