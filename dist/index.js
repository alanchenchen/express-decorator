"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helper_1 = require("./helper");
const utils_1 = require("./utils");
const types = __importStar(require("./constant"));
exports.express = express_1.default;
/**
 * @name AppRoot-Decorators
 */
/* class decorators */
/**
 * create root app
 *
 * @param opts equal to app.set() of express instance
 */
exports.Root = (opts = {}) => {
    return (target) => {
        try {
            if (!target.Instance) {
                target.Instance = express_1.default();
                target.InstanceType = "RootApp";
                for (let key of Object.keys(opts)) {
                    target.Instance.set(key, opts[key]);
                }
            }
            else {
                throw new Error("the root app instance has been existed");
            }
        }
        catch (error) {
            console.log("[root app inits error]:", error);
        }
    };
};
/**
 * use an express middleware
 *
 * @param args equal to app.use(middleware) of express instance
 */
exports.Middleware = (...args) => {
    return (target) => {
        try {
            if (target.Instance && target.InstanceType == "RootApp") {
                target.Instance.use(...args);
            }
            else {
                throw new Error("you should init a root app instance firstly");
            }
        }
        catch (error) {
            console.log("[middleware loads error]:", error);
        }
    };
};
/**
 * use a router controller
 *
 * @param classModuleList controller class, support multiple argument
 */
exports.Router = (...classModuleList) => {
    return (target) => {
        try {
            if (target.Instance && target.InstanceType == "RootApp") {
                classModuleList.forEach((ClassModule) => {
                    const controller = new ClassModule();
                    target.Instance.use(helper_1.pathFix(controller.path), controller.Instance);
                });
            }
            else {
                throw new Error("you should init a root app instance firstly");
            }
        }
        catch (error) {
            console.log("[router loads error]:", error);
        }
    };
};
/* instance method decorators */
/**
 * you should call the instance method by yourself otherwise the app would not listen port
 *
 * @param port port number
 * @param host hostname
 */
exports.Listen = (port = 3000, host = "localhost") => {
    return (target, name, descriptor) => {
        const handler = descriptor.value;
        // must fix the this point to target class prototype!!
        const fixThisHandler = () => {
            handler.call(target);
        };
        const targetClass = target.constructor;
        descriptor.value = () => {
            targetClass.Instance.listen(port, host, fixThisHandler);
        };
    };
};
/**
 * @name AppController-Decorators
 */
/* class decorators */
/**
 * create a router controller
 *
 * @param path router root path
 */
exports.Controller = (path = "/") => {
    return (target) => {
        try {
            target.prototype.path = path;
            target.prototype.Instance = express_1.default.Router();
            target.prototype.InstanceType = "Controller";
            if (target.prototype.hasOwnProperty(types.CUSTOM_DECORATOR_PARAMS)) {
                target.prototype[types.CUSTOM_DECORATOR_PARAMS].forEach((item) => {
                    item(target.prototype);
                });
            }
        }
        catch (error) {
            console.log("[controller inits error]:", error);
        }
    };
};
/* instance method decorators */
/**
 * @description Generate some common http method Decorators such as get、post、put、delete、head、patch and options
 */
const MethodsGenerate = () => {
    const list = ["Get", "Post", "Delete", "Put", "Patch", "Options", "Head", "All"];
    let MethodsList = {};
    list.forEach((key) => {
        MethodsList[key] = (path = "/", opts) => {
            return utils_1.generateDecorator((options, name, descriptor) => {
                options.push((target) => {
                    const method = key.toLowerCase();
                    path = helper_1.pathFix(path);
                    const inject = opts && opts.inject;
                    const handler = (req, res, next) => {
                        inject && inject.forEach((classModule) => {
                            classModule.injected = req;
                        });
                        descriptor.value(req, res, next);
                    };
                    target.Instance[method](path, handler);
                });
            });
        };
    });
    return MethodsList;
};
/**
 * redirect a request to another one
 *
 * @param from the request path
 * @param to the redirected path
 * @param method the request method
 * @param statusCode the redirected response status code
 */
exports.Redirect = (from = "/", to = "/", method = "all", statusCode = 302) => {
    return utils_1.generateDecorator((options, name, descriptor) => {
        options.push((target) => {
            target.Instance[method](helper_1.pathFix(from), (req, res) => {
                descriptor.value();
                res.redirect(statusCode, to);
            });
        });
    });
};
const allHttpRequest = MethodsGenerate();
exports.Get = allHttpRequest.Get;
exports.Post = allHttpRequest.Post;
exports.Delete = allHttpRequest.Delete;
exports.Put = allHttpRequest.Put;
exports.Patch = allHttpRequest.Patch;
exports.Options = allHttpRequest.Get;
exports.Head = allHttpRequest.Head;
exports.All = allHttpRequest.All;
