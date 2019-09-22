import { customDecoratorCallback, prototypeCallback } from "./type"
import * as types from "./constant"

/**
 * generate a controller decorator
 * 
 * @param callback 
 */
export const generateDecorator = (callback: customDecoratorCallback): prototypeCallback => {
    return (target: any, name: string, descriptor: any) => {
        if(!target.hasOwnProperty(types.CUSTOM_DECORATOR_PARAMS)) {
            target[types.CUSTOM_DECORATOR_PARAMS] = [];
        }
        callback && callback(target[types.CUSTOM_DECORATOR_PARAMS], name, descriptor);
    };
}