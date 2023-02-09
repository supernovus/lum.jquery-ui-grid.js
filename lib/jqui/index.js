/**
 * A pseudo-module to load jQuery UI.
 * 
 * Includes both `core` and `css` sub-modules.
 * Re-exports `jquery` as `module.exports`.
 * 
 * @module @lumjs/jquery-ui-grid/jqui
 */

 // Load jQuery UI libraries into jQuery.
module.exports = require('./core');

// Load jQuery UI stylesheets using Webpack.
require('./css');
