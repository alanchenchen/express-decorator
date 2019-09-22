"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const types = __importStar(require("./constant"));
/**
 * generate a controller decorator
 *
 * @param callback
 */
exports.generateDecorator = (callback) => {
    return (target, name, descriptor) => {
        if (!target.hasOwnProperty(types.CUSTOM_DECORATOR_PARAMS)) {
            target[types.CUSTOM_DECORATOR_PARAMS] = [];
        }
        callback && callback(target[types.CUSTOM_DECORATOR_PARAMS], name, descriptor);
    };
};
