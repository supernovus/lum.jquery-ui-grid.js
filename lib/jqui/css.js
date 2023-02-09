/**
 * A pseudo-module that loads a set of jQuery UI stylesheets using Webpack.
 * 
 * It's not the complete set, only the stylesheets used by the UIGrid class:
 * - `base/`
 *   - `core`
 *   - `draggable`
 *   - `resizable`
 *   - `selectable`
 *   - `sortable`
 *   - `theme`
 * 
 * Because it is only loading CSS resources, there are no `module.exports`.
 * 
 * **NOTE**: Don't forget to add `style-loader` and `css-loader` to your
 * Webpack config, or this won't work, and will likely just throw an error.
 * 
 * @module @lumjs/jquery-ui-grid/jqui/css
 */

require('jquery-ui/themes/base/core.css');

require('jquery-ui/themes/base/draggable.css');
require('jquery-ui/themes/base/resizable.css');
require('jquery-ui/themes/base/selectable.css');
require('jquery-ui/themes/base/sortable.css');

require('jquery-ui/themes/base/theme.css');
