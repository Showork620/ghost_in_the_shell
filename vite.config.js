var _a, _b;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var repositoryBase = '/awssaa_in_the_ghost/';
var env = (_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.env) !== null && _b !== void 0 ? _b : {};
export default defineConfig({
    base: env.GITHUB_ACTIONS ? repositoryBase : '/',
    plugins: [react()],
});
