import expressFunc from "express";
import { pathFix } from "./helper";
import { classCallback, prototypeCallback } from "./type"
import { generateDecorator } from "./utils"
import * as types from "./constant"

export const express = expressFunc;
/**
 * @name AppRoot-Decorators
 */

/* class decorators */

/**
 * create root app
 * 
 * @param opts equal to app.set() of express instance
 */
export const Root = (opts: any = {}): classCallback => {
    return (target: any) => {
        try {
            if (!target.Instance) {
                target.Instance = expressFunc();
                target.InstanceType = "RootApp";
                for (let key of Object.keys(opts)) {
                    target.Instance.set(key, opts[key]);
                }
            }
            else {
                throw new Error("the root app instance has been existed");
            }
        } catch (error) {
            console.log("[root app inits error]:", error)
        }
    };
}

/**
 * use an express middleware
 * 
 * @param args equal to app.use(middleware) of express instance
 */
export const Middleware = (...args: any[]): classCallback => {
    return (target: any) => {
        try {
            if (target.Instance && target.InstanceType == "RootApp") {
                target.Instance.use(...args);
            } else {
                throw new Error("you should init a root app instance firstly");
            }
        } catch (error) {
            console.log("[middleware loads error]:", error);
        }
    };
}

/**
 * use a router controller
 * 
 * @param classModuleList controller class, support multiple argument
 */
export const Router = (...classModuleList: any[]): classCallback => {
    return (target: any) => {
        try {
            if (target.Instance && target.InstanceType == "RootApp") {
                classModuleList.forEach((ClassModule: any) => {
                    const controller: any = new ClassModule();
                    target.Instance.use(pathFix(controller.path), controller.Instance);
                });
            } else {
                throw new Error("you should init a root app instance firstly");
            }
        } catch (error) {
            console.log("[router loads error]:", error)
        }
    };
}

/* instance method decorators */

/**
 * you should call the instance method by yourself otherwise the app would not listen port
 * 
 * @param port port number
 * @param host hostname
 */
export const Listen = (port: number=3000, host: string="localhost"): prototypeCallback => {
    return (target: any, name: string, descriptor: any) => {
        const handler = descriptor.value;
        // must fix the this point to target class prototype!!
        const fixThisHandler = () => {
            handler.call(target);
        };
        const targetClass = target.constructor;
        descriptor.value = () => {
            targetClass.Instance.listen(port, host, fixThisHandler);
        }
    };
}

/**
 * @name AppController-Decorators
 */

/* class decorators */
/**
 * create a router controller
 * 
 * @param path router root path
 */
export const Controller = (path: any="/"): classCallback => {
    return (target: any) => {
        try {
            target.prototype.path = path;
            target.prototype.Instance = expressFunc.Router();
            target.prototype.InstanceType = "Controller";
            
            if(target.prototype.hasOwnProperty(types.CUSTOM_DECORATOR_PARAMS)) {
                target.prototype[types.CUSTOM_DECORATOR_PARAMS].forEach((item: any) => {
                    item(target.prototype);
                });
            }
        } catch (error) {
            console.log("[controller inits error]:", error)
        }
    };
}

/* instance method decorators */

/**
 * @description Generate some common http method Decorators such as get、post、put、delete、head、patch and options
 */
const MethodsGenerate = (): any => {
    const list = ["Get", "Post", "Delete", "Put", "Patch", "Options", "Head", "All"];
    let MethodsList: any = {};
    list.forEach((key: string) => {
        MethodsList[key] = (path: any="/", opts?: any) => {
            return generateDecorator((options: any, name: string, descriptor: any) => {
                options.push((target: any) => {
                    const method = key.toLowerCase();
                    path = pathFix(path);
                    const inject = opts && opts.inject;
                    const handler = (req: any, res: any, next: any) => {
                        inject && inject.forEach((classModule: any) => {
                            classModule.injected = req;
                        });
                        descriptor.value(req, res, next);
                    }
                    target.Instance[method](path, handler);
                })
            })
        }
    });
    return MethodsList;
}

/**
 * redirect a request to another one
 * 
 * @param from the request path
 * @param to the redirected path
 * @param method the request method
 * @param statusCode the redirected response status code
 */
export const Redirect = (from: string = "/", to: string = "/", method: string = "all", statusCode: number = 302) => {
    return generateDecorator((options: any[], name: string, descriptor: any) => {
        options.push((target: any) => {
            target.Instance[method](pathFix(from), (req: any, res: any) => {
                descriptor.value();
                res.redirect(statusCode, to);
            });
        });
    });
}

const allHttpRequest = MethodsGenerate();
export const Get = allHttpRequest.Get;
export const Post = allHttpRequest.Post;
export const Delete = allHttpRequest.Delete;
export const Put = allHttpRequest.Put;
export const Patch = allHttpRequest.Patch;
export const Options = allHttpRequest.Get;
export const Head = allHttpRequest.Head;
export const All = allHttpRequest.All;