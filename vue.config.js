const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9090,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop completed with undelivered notifications",
            "ResizeObserver loop limit exceeded",
          ];
          if (
            ignoreErrors.some((ignoreError) =>
              error.message.includes(ignoreError)
            )
          ) {
            return false;
          }
          return true;
        },
      },
    },
  },
});
