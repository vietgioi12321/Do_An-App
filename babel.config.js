module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              // Định danh @icons trỏ thẳng tới file quản lý icon của bạn
              '@icons': './assets/icons/AppIcon.tsx',
              '@': './',
            },
          },
        ],
      ],
    };
  };