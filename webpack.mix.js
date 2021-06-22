const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .setPublicPath('public')
    .js('resources/js/app.js', 'public/TimetableWeek.js').react()
    /**
     * Uncomment these lines during development to copy your updated JS
     * file automatically (you must have installed and activated your app)
     * 
     * Update the relative path to your WebApps Directory
     */
    .copy('public/TimetableWeek.js', '../../../WebApps/public/js/apps/TimetableWeek.js')
