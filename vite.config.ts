import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryBase = '/awssaa_in_the_ghost/';
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export default defineConfig({
  base: env.GITHUB_ACTIONS ? repositoryBase : '/',
  plugins: [react()],
});
