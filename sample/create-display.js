export default function createDisplay(containerEl) {
	return (title, description, code) => {
		const result = code();
		containerEl.insertAdjacentHTML('beforeend', `<h2>${title}</h2><p>${description}</p><h3>Code</h3><pre><code>${code.toString().replace(/\s+/g, ' ').trim()}</code></pre><h3>Return Value</h3><pre><code>${typeof result === 'object' ? JSON.stringify(result, null, '\t') : result}</code></pre>`);
	}
}
