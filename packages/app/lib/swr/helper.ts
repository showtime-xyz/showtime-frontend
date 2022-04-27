export const noop = () => {};

// Using noop() as the undefined value as undefined can possibly be replaced
// by something else.  Prettier ignore and extra parentheses are necessary here
// to ensure that tsc doesn't remove the __NOINLINE__ comment.
// prettier-ignore
export const UNDEFINED: undefined = (/*#__NOINLINE__*/ noop()) as undefined

export const isUndefined = (v: any): v is undefined => v === UNDEFINED;
