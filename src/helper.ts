export const pathFix = (path: string) => {
    if (path.startsWith("/")) {
        return path;
    } else {
        return `/${path}`
    }
} 