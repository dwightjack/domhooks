# DOMHooks

Hooks functions' execution to DOM queries.

DOMHooks is an utility function meant for DOM contextual scripting. By using it you can pair a specific DOM selector (or HTML class selector) with a function which needs to be executed just on that context.

Example:

```javascript
//old pattern
jQuery(document).ready(function ($) {
	var $foo = $('#foo');
	if ($foo.length) {
		$foo.doSomething();
		//...
	}
});

//with DOMHooks 
$.domHooks({
	//no need to wrap in a DOMReady function!
	'#foo': function (selector, $foo) {
		//selector === '#foo'
		$foo.doSomething();
	}
});
```

## Getting Started

Via [Bower](https://github.com/twitter/bower)...

```
bower install jquery.domhooks
```

... or download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/dwightjack/domhooks/master/dist/domhooks.min.js
[max]: https://raw.github.com/dwightjack/domhooks/master/dist/domhooks.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="/path/to/domhooks.min.js"></script>
<script>
	//no need to wrap in a DOMReady function!
	$.domHooks(/* args... */);
</script>
```

## Documentation


### Usage

`$.domHooks` accepts up to three arguments:

* `type`:  Type of hook, either `'ready'`, `'html'` or `'available'`. (see below for details)
* `query`: Query to execute, either a CSS selector (`'ready'` and `'available'` types) or a class name (`'html'` type)
* `callback`: Function to execute when `query` is matched. The function accepts two arguments: the `query` itself and a jQuery object referencing to it

Basic usage example:

```javascript
$.domHook('ready', '#foo', function () { /* ... */});
```

You may also pass `query` in the form of an hash `{'selector': callback}`:

```javascript
//same as before but shorter
$.domHook('ready', { '#foo': function () { /* ... */} });
```

Or you may omit the `type` argument completely, a `'ready'` hook type will always be implied:

```javascript
//even shorter, but just for 'ready' hooks
$.domHook({ '#foo': function () { /* ... */} });
```

### Settings

**Breaking changes!!!**  
**Up to v0.1.0b `.pollsMax` and `.pollsInterval` where called `.polls_max` and `.polls_interval`.**

`$.domHooks` exposes also two options used by the `'available'` hook type:

* `$.domHooks.settings.pollsMax`: The number of polls after which the hook gets discarted (defaults to `40`)
* `$.domHooks.settings.pollsInterval`: The interval in ms between each poll (defaults to `25`)

_Note that these settings are globals to every function call, and they may prejudice the overall performances of the page._

### Query types

**ready**  
hooks got parsed automatically on DOM Ready. Hooks added after DOM Ready are parsed right away. They accept CSS selector as query string.

**html**  
hooks got parsed as soon as they are added, since the `html` element always exists before the DOM is ready. They accept a single class name as query string (use [.hasClass](http://api.jquery.com/hasClass/) internally).

**available**  
hooks got parsed as soon as they are added and try to match a DOM element _BEFORE_ the DOM is ready. They work very similarly to the [available event in YUI](http://yuilibrary.com/yui/docs/event/domready.html#available), by polling the DOM for a given element at regular intervals. If the query isn't matched they fail silently. _Since these hooks are expensive in terms of performances, use them sparingly._

## Release History

* 0.1.2 Added [Bower](https://github.com/twitter/bower) support
* 0.1.1 Bugfixes
* 0.1.0b Initial release
