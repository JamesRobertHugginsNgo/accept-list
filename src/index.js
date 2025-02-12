/* BOILERPLATE */

export function parse(accept) {
	const acceptList = accept.split(',').map((acceptItem) => {
		const [, ...parameters] = acceptItem.split(';');
		for (const parameter of parameters) {
			const [name, value] = parameter.split('=');
			if (name.trim() === 'q') {
				return [acceptItem.trim(), +value];
			}
		}
		return [acceptItem.trim(), 1];
	})

	acceptList.sort(([, qA], [, qB]) => {
		if (qA < qB) {
			return 1;
		}
		if (qA > qB) {
			return -1;
		}
		return 0;
	});

	return acceptList.map(([acceptItem]) => {
		return acceptItem;
	});
}

export function match(acceptList, evaluate, defaultAcceptItem) {
	if (typeof acceptList === 'string') {
		acceptList = parse(acceptList);
	}

	if (Array.isArray(evaluate)) {
		evaluate = ((acceptItems) => (acceptItem) => {
			const [value] = acceptItem.split(';');
			const index = acceptItems.indexOf(value.trim());
			if (index != -1) {
				return index;
			}
		})(evaluate);
	}

	if (typeof evaluate === 'object' && Object.getPrototypeOf(evaluate) === Object.getPrototypeOf({})) {
		evaluate = ((dictionary) => (acceptItem) => {
			const [value] = acceptItem.split(';');
			return dictionary[value.trim()];
		})(evaluate);
	}

	if (evaluate instanceof RegExp) {
		evaluate = ((regex) => (acceptItem) => {
			const [value] = acceptItem.split(';');
			return regex.exec(value);
		})(evaluate);
	}

	for (const acceptItem of acceptList) {
		const result = evaluate(acceptItem);
		if (result || result === 0) {
			return [acceptItem, result];
		}
	}
	return [defaultAcceptItem];
}
