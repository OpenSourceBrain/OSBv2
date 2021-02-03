const withMdxEnhanced = require("next-mdx-enhanced");
const withLess = require('@zeit/next-less')
module.exports = withLess(withMdxEnhanced({
  layoutPath: "src/layouts",
  defaultLayout: true,
})({
  pageExtensions: ["mdx", "tsx"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ]
    );
    return config;
  },
}))
