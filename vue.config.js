const { defineConfig } = require("@vue/cli-service");

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        "@": resolve("src"),
      },
    },
  },
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
