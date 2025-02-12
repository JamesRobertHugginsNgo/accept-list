/* BOILERPLATE */

export function parse(accept) {
	const acceptList = accept.split(',').map((acceptItem) => {
		const acceptItemParts = acceptItem.split(';').map((value) => {
			return value.trim();
		});
		const [, ...parameters] = acceptItemParts;
		for (const parameter of parameters) {
			const [name, value] = parameter.split('=');
			if (name.trim() === 'q') {
				return [[acceptItem.trim(), ...acceptItemParts], +value];
			}
		}
		return [[acceptItem.trim(), ...acceptItemParts], 1];
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

	return acceptList.map(([value]) => {
		return value;
	});
}

export function match(acceptList, evaluate, defaultAcceptItem) {
	if (typeof acceptList === 'string') {
		acceptList = parse(acceptList);
	}

	if (Array.isArray(evaluate)) {
		evaluate = ((validValues) => {
			return ([, value]) => {
				return validValues.includes(value);
			};
		})(evaluate);
	}

	if (typeof evaluate === 'object' && Object.getPrototypeOf(evaluate) === Object.getPrototypeOf({})) {
		evaluate = ((dictionary) => {
			return ([, value]) => {
				return dictionary[value];
			}
		})(evaluate);
	}

	if (evaluate instanceof RegExp) {
		evaluate = ((regex) => {
			return ([, value]) => {
				return regex.exec(value);
			}
		})(evaluate);
	}

	for (const acceptItemParts of acceptList) {
		if (evaluate(acceptItemParts)) {
			return acceptItemParts;
		}
	}

	return [defaultAcceptItem];
}
