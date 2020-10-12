const { initPlugin } = require('cypress-plugin-snapshots/plugin');

module.exports = (on, config) => {
  initPlugin(on, config);

  // const { viewportWidth: w, viewportHeight: h } = config;
  const w = 1000;
  const h = 660;
  on('before:browser:launch', (browser = {}, launchOptions) => {
    switch (browser.name) {
      //browser.family === 'chromium' && browser.name !== 'electron')
      case 'chrome':
        launchOptions.args.push(`--window-size=${w},${h}`);
        /*
        launchOptions.push('--cast-initial-screen-width=1600')
        launchOptions.push('--cast-initial-screen-height=900')
         */
        break;

      case 'electron':
        launchOptions.preferences.width = w;
        launchOptions.preferences.height = h;
        break;

      default:
    }
    return launchOptions;
  });

  return config;
};
