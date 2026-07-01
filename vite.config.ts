import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When building in GitHub Actions, serve assets from the repo subpath
// (https://<user>.github.io/<repo>/). Locally this stays '/'.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
