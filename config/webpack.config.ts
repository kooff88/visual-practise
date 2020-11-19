
// 待类型推导
export default (config: any) => {
  config.module
    .rule('csv-loader')
    .test(/\.csv$/)
    .pre()
    .use('csv-loader')
    .loader('csv-loader')
    .options({
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
    })  
};
