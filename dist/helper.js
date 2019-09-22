"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathFix = (path) => {
    if (path.startsWith("/")) {
        return path;
    }
    else {
        return `/${path}`;
    }
};
