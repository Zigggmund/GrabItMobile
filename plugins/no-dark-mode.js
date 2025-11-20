const { withAndroidStyles, createRunOncePlugin } = require('@expo/config-plugins');

const pkg = {
  name: 'expo-plugin-no-dark-mode',
  version: '1.0.0',
};

/**
 * Отключает автоматическую тёмную тему на Android
 */
const withNoDarkMode = (config) => {
  return withAndroidStyles(config, (config) => {
    if (config.modResults.resources?.style) {
      for (const style of config.modResults.resources.style) {
        if (style.$?.name === 'AppTheme' && style.item) {
          const alreadyExists = style.item.some(
            (item) => item.$?.name === 'android:forceDarkAllowed'
          );

          if (!alreadyExists) {
            style.item.push({
              _: 'false',
              $: { name: 'android:forceDarkAllowed' },
            });
          }
        }
      }
    }
    return config;
  });
};

module.exports = createRunOncePlugin(withNoDarkMode, pkg.name, pkg.version);