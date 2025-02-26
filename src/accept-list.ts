type ParseResultItemType = [string, string, ...string[]];

export function parse(accept: string): ParseResultItemType[] {
	const acceptList: [ParseResultItemType, number][] = accept.split(',').map((acceptItem) => {
		const [value, ...parameters] = acceptItem.split(';').map((value) => {
			return value.trim();
		});

		for (const parameter of parameters) {
			const [name, parameterValue] = parameter.split('=');
			if (name.trim() === 'q') {
				return [[acceptItem.trim(), value, ...parameters], +parameterValue];
			}
		}

		return [[acceptItem.trim(), value, ...parameters], 1];
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

type EvaluateType = (value: ParseResultItemType) => undefined | boolean;

export function match(
	acceptList: string | ParseResultItemType[],
	evaluate: string[] | object | RegExp | EvaluateType,
	defaultAcceptItem: ParseResultItemType = ['*', '*']
): ParseResultItemType {
	if (typeof acceptList === 'string') {
		acceptList = parse(acceptList);
	}

	if (Array.isArray(evaluate)) {
		evaluate = ((validValues: string[]) => {
			return ([, value]) => {
				return validValues.includes(value);
			};
		})(evaluate);
	}

	if (typeof evaluate === 'object' && Object.getPrototypeOf(evaluate) === Object.getPrototypeOf({})) {
		evaluate = ((dictionary: object) => {
			return ([, value]) => {
				return dictionary[value];
			}
		})(evaluate);
	}

	if (evaluate instanceof RegExp) {
		evaluate = ((regex: RegExp) => {
			return ([, value]) => {
				return regex.exec(value);
			}
		})(evaluate);
	}

	if (typeof evaluate === 'function') {
		for (const acceptItemParts of acceptList) {
			if (evaluate(acceptItemParts)) {
				return acceptItemParts;
			}
		}
	}

	return defaultAcceptItem;
}
