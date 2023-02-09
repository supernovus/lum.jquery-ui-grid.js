/**
 * A pseudo-module that loads a set of jQuery UI libraries.
 * 
 * It does not load the full jQuery UI library set, 
 * just the libraries needed for the UIGrid class:
 * - widget
 * - position
 * - data
 * - disable-selection
 * - focusable
 * - form-reset-mixing
 * - keycode
 * - labels
 * - scroll-parent
 * - tabbable
 * - unique-id
 * - widgets/
 *   - draggable
 *   - droppable
 *   - resizable
 *   - selectable
 *   - sortable
 *   - mouse
 * 
 * It adds the libraries to the core `jquery` module, which
 * it exports as `globalThis.jQuery`, as well as `module.exports`.
 * 
 * @module @lumjs/jquery-ui-grid/jqui/core
 */

const jq = require('jquery');

if (globalThis.jQuery === undefined)
{ // A cheap trick for code depending on a top-level jQuery variable.
  globalThis.jQuery = jq;
}

require('jquery-ui/ui/widget');
require('jquery-ui/ui/position');
require('jquery-ui/ui/data');
require('jquery-ui/ui/disable-selection');
require('jquery-ui/ui/focusable');
require('jquery-ui/ui/form-reset-mixin');
require('jquery-ui/ui/keycode');
require('jquery-ui/ui/labels');
require('jquery-ui/ui/scroll-parent');
require('jquery-ui/ui/tabbable');
require('jquery-ui/ui/unique-id');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/droppable');
require('jquery-ui/ui/widgets/resizable');
require('jquery-ui/ui/widgets/selectable');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/widgets/mouse');

module.exports = jq;
