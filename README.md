# lum.jquery-ui-grid.js

A class for calculating flexible grids in web apps with [jQuery UI]
providing the key layout and event handling capabilities.

## Stability Status

I am still in the process of testing this after porting the code
from the old monolithic library set, and there's strange bugs that
show up in the conflict resolution methods in this version that don't
happen in the Lum.sh v4 version. Until I figure out why, I will not mark
this as the stable `1.0.0`.

## Exports

| Name                         | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `@lumjs/jquery-ui-grid`      | The class with default conflict methods.     |
| `@lumjs/jquery-ui-grid/grid` | The class with _no_ conflict methods.        |
| `@lumjs/jquery-ui-grid/jqui` | A virtual package to load jQuery UI.         |

## Extends

* [@lumjs/web-grid](https://github.com/supernovus/lum.web-grid.js)
  * [@lumjs/grid](https://github.com/supernovus/lum.grid.js)

## Deprecation Notice

[jQuery UI is deprecated], and so is this. I'm planning on writing a
replacement using modern HTML5 DOM technologies, so this one can be retired.

## Official URLs

This library can be found in two places:

 * [Github](https://github.com/supernovus/lum.jquery-ui-grid.js)
 * [NPM](https://www.npmjs.com/package/@lumjs/jquery-ui-grid)

## Author

Timothy Totten <2010@totten.ca>

## License

[MIT](https://spdx.org/licenses/MIT.html)


[jQuery UI]: https://jqueryui.com/
[jQuery UI is deprecated]: https://blog.jqueryui.com/2021/10/jquery-maintainers-update-and-transition-jquery-ui-as-part-of-overall-modernization-efforts/

