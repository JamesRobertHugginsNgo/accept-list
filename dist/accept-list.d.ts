type ParseResultItemType = [string, string, ...string[]];
export declare function parse(accept: string): ParseResultItemType[];
type EvaluateType = (value: ParseResultItemType) => undefined | boolean;
export declare function match(
	acceptList: string | ParseResultItemType[],
	evaluate: string[] | object | RegExp | EvaluateType,
	defaultAcceptItem?: ParseResultItemType,
): ParseResultItemType;
export {};
