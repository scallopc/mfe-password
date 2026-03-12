const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  remotes: {
    password: "http://localhost:4201/remoteEntry.js",
    auth: "http://localhost:4202/remoteEntry.js",
  },

  shared: {
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/common/http": { singleton: true, strictVersion: true },
  },
});
