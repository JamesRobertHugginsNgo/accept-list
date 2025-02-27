type AcceptSetItem = [string, string, ...string[]];
export declare function parse(accept: string): AcceptSetItem[];
type AcceptEvaluateType = (acceptSetItem: AcceptSetItem) => boolean;
export declare function match(
	acceptSet: string | AcceptSetItem[],
	evaluate:
		| string[]
		| {
				[key: string]: any;
		  }
		| RegExp
		| AcceptEvaluateType,
	defaultAcceptSet?: AcceptSetItem,
): AcceptSetItem;
export {};
