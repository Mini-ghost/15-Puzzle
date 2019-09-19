module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  css: {
    loaderOptions: {
      scss: {
        data: `@import  "@/assets/scss/variable/_include.sass"`
      }
    }
  }
}
