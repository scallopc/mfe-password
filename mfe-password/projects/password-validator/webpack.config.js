const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "password",

  exposes: {
    "./Routes": "./projects/password-validator/src/app/app.routes.ts",
  },

  shared: {
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/common/http": { singleton: true, strictVersion: true },
  },
});
