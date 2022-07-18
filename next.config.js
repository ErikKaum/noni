/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    config.experiments = { asyncWebAssembly: true }
    config.resolve.fallback = { fs: false };
    return config
  },  
  reactStrictMode: true,
}

module.exports = nextConfig
