export type classCallback = (target: any) => void;
export type prototypeCallback = (target: any, name: string, descriptor: any) => void;
export type customDecoratorCallback = (options: any[], name: string, descriptor: any) => void;