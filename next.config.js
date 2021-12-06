const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions:     {
    includePaths: [
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'public'),
      path.join(__dirname, 'node_modules', 'foundation-sites', 'scss'),
    ],
  },
}
