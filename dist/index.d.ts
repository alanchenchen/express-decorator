import expressFunc from "express";
import { classCallback, prototypeCallback } from "./type";
export declare const express: typeof expressFunc;
/**
 * @name AppRoot-Decorators
 */
/**
 * create root app
 *
 * @param opts equal to app.set() of express instance
 */
export declare const Root: (opts?: any) => classCallback;
/**
 * use an express middleware
 *
 * @param args equal to app.use(middleware) of express instance
 */
export declare const Middleware: (...args: any[]) => classCallback;
/**
 * use a router controller
 *
 * @param classModuleList controller class, support multiple argument
 */
export declare const Router: (...classModuleList: any[]) => classCallback;
/**
 * you should call the instance method by yourself otherwise the app would not listen port
 *
 * @param port port number
 * @param host hostname
 */
export declare const Listen: (port?: number, host?: string) => prototypeCallback;
/**
 * @name AppController-Decorators
 */
/**
 * create a router controller
 *
 * @param path router root path
 */
export declare const Controller: (path?: any) => classCallback;
/**
 * redirect a request to another one
 *
 * @param from the request path
 * @param to the redirected path
 * @param method the request method
 * @param statusCode the redirected response status code
 */
export declare const Redirect: (from?: string, to?: string, method?: string, statusCode?: number) => prototypeCallback;
export declare const Get: any;
export declare const Post: any;
export declare const Delete: any;
export declare const Put: any;
export declare const Patch: any;
export declare const Options: any;
export declare const Head: any;
export declare const All: any;
