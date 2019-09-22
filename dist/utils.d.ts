import { customDecoratorCallback, prototypeCallback } from "./type";
/**
 * generate a controller decorator
 *
 * @param callback
 */
export declare const generateDecorator: (callback: customDecoratorCallback) => prototypeCallback;
