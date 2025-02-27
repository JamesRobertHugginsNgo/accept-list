type AcceptSetItem = [string, string, ...string[]];
type AcceptSortableSetItem = [AcceptSetItem, number];

export function parse(accept: string): AcceptSetItem[] {
	const acceptList: string[] = accept.split(',')
		.map((item: string): string => {
			return item.trim();
		});

	const sortableAcceptSet: AcceptSortableSetItem[] = acceptList
		.map((item: string): AcceptSortableSetItem => {
			item = item.trim();
			const [value, ...parameters]: string[] = item.split(';')
				.map((part: string): string => {
					return part.trim();
				});

			for (const parameter of parameters) {
				const [name, parameterValue]: string[] = parameter.split('=');
				if (name === 'q') {
					return [[item, value, ...parameters], +parameterValue];
				}
			}

			return [[item, value, ...parameters], 1];
		});

	sortableAcceptSet.sort((
		sortableAcceptItemA: AcceptSortableSetItem,
		sortableAcceptItemB: AcceptSortableSetItem
	): number => {
		const [, qA]: AcceptSortableSetItem = sortableAcceptItemA;
		const [, qB]: AcceptSortableSetItem = sortableAcceptItemB;
		return qA < qB ? 1 : qA > qB ? -1 : 0;
	});

	return sortableAcceptSet
		.map((sortableAcceptItem: AcceptSortableSetItem): AcceptSetItem => {
			const [[mainValue, ...parameters]]: AcceptSortableSetItem = sortableAcceptItem;
			return [mainValue, ...parameters];
		});
}

type AcceptEvaluateType = (acceptSetItem: AcceptSetItem) => boolean;

export function match(
	acceptSet: string | AcceptSetItem[],
	evaluate: string[] | { [key: string]: any } | RegExp | AcceptEvaluateType,
	defaultAcceptSet: AcceptSetItem = ['*', '*']
): AcceptSetItem {
	if (typeof acceptSet === 'string') {
		acceptSet = parse(acceptSet);
	}

	if (evaluate instanceof RegExp) {
		evaluate = ((regex: RegExp) => {
			return (acceptSetItem: AcceptSetItem): boolean => {
				const [, value]: AcceptSetItem = acceptSetItem;
				return regex.test(value);
			};
		})(evaluate);
	} else if (Array.isArray(evaluate)) {
		evaluate = ((values: string[]): AcceptEvaluateType => {
			return (acceptSetItem: AcceptSetItem): boolean => {
				const [, value]: AcceptSetItem = acceptSetItem;
				return values.includes(value);
			};
		})(evaluate);
	} else if (typeof evaluate === 'object') {
		evaluate = ((values: { [key: string]: any }): AcceptEvaluateType => {
			return (acceptSetItem: AcceptSetItem): boolean => {
				const [, value]: AcceptSetItem = acceptSetItem;
				return Boolean(values[value]);
			};
		})(evaluate);
	}

	if (typeof evaluate === 'function') {
		for (const acceptSetItem of acceptSet) {
			if (evaluate(acceptSetItem)) {
				return acceptSetItem;
			}
		}
	}

	return defaultAcceptSet;
}
