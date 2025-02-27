export function parse(accept) {
	const acceptList = accept.split(",").map((item) => {
		return item.trim();
	});
	const sortableAcceptSet = acceptList.map((item) => {
		item = item.trim();
		const [value, ...parameters] = item.split(";").map((part) => {
			return part.trim();
		});
		for (const parameter of parameters) {
			const [name, parameterValue] = parameter.split("=");
			if (name === "q") {
				return [[item, value, ...parameters], +parameterValue];
			}
		}
		return [[item, value, ...parameters], 1];
	});
	sortableAcceptSet.sort((sortableAcceptItemA, sortableAcceptItemB) => {
		const [, qA] = sortableAcceptItemA;
		const [, qB] = sortableAcceptItemB;
		return qA < qB ? 1 : qA > qB ? -1 : 0;
	});
	return sortableAcceptSet.map((sortableAcceptItem) => {
		const [[mainValue, ...parameters]] = sortableAcceptItem;
		return [mainValue, ...parameters];
	});
}
export function match(acceptSet, evaluate, defaultAcceptSet = ["*", "*"]) {
	if (typeof acceptSet === "string") {
		acceptSet = parse(acceptSet);
	}
	if (evaluate instanceof RegExp) {
		evaluate = ((regex) => {
			return (acceptSetItem) => {
				const [, value] = acceptSetItem;
				return regex.test(value);
			};
		})(evaluate);
	} else if (Array.isArray(evaluate)) {
		evaluate = ((values) => {
			return (acceptSetItem) => {
				const [, value] = acceptSetItem;
				return values.includes(value);
			};
		})(evaluate);
	} else if (typeof evaluate === "object") {
		evaluate = ((values) => {
			return (acceptSetItem) => {
				const [, value] = acceptSetItem;
				return Boolean(values[value]);
			};
		})(evaluate);
	}
	if (typeof evaluate === "function") {
		for (const acceptSetItem of acceptSet) {
			if (evaluate(acceptSetItem)) {
				return acceptSetItem;
			}
		}
	}
	return defaultAcceptSet;
}
