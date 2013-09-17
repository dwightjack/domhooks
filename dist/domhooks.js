/*! DOMHooks - v0.1.2 - 2013-09-17
* https://github.com/dwightjack/domhooks
* Copyright (c) 2013 Marco "DWJ" Solazzi; Licensed MIT */
(function($, document) {

  var

  /* html element reference  */
  $html = $(document.documentElement),

    /* document reference */
    $document = $(document),

    /* the list of hooks to run on DOM ready */
    readyHooks = [],

    /**
     * Queries the DOM for a given selector, if found executes the associated function
     *
     * @param  {Object} hook An object in the form `{selector: '#my .selector', callback: my_function}`
     * @private
     */
    hookMatcher = function(hook) {
      var $el = $document.find(hook.selector);
      if ($el && $el.length) {
        hook.callback(hook.selector, $el);
      }
    },

    /**
     * Private namespace with settings and methods
     * @type {Object}
     */
    _domHooks = {

      /**
       * Default Settings
       * @type {Object}
       */
      settings: {
        /**
         * The frequency between polls in ms.
         * Defaults to `25`
         */
        pollsInterval: 25,
        /**
         * How many times the hook will poll for the searched selector.
         * Defaults to `40`
         */
        pollsMax: 40
      },

      /**
       * Searches a given class into the `class` attribute of the `html` DOM element.
       *
       * Query run as soon as it's added.
       *
       * @param {String} query Class name to search for
       * @param {Function} fn Function to run when `query` is matched
       * @private
       */
      html: function(query, fn) {
        if (typeof query === 'string' && $html.hasClass(query)) {
          fn(query, $html);
        }
      },


      /**
       * Queries the DOM for elements matching a CSS selector.
       *
       * This hook must be run AFTER the DOM is ready.
       *
       * @param {String} query CSS selector to match
       * @param {Function} fn Function to run when `query` is matched
       * @private
       */
      ready: function(query, fn) {
        var queryObject = {
          'selector': query,
          'callback': fn
        };

        if ($.isReady) {
          //run right aways
          hookMatcher(queryObject);
        } else {
          //enqueue
          readyHooks.push(queryObject);
        }
      },

      /**
       * Queries the DOM for elements matching a CSS selector BEFORE the DOMReady.
       *
       * Since it will poll for matching selector, it's not advisable to use it for non-existing elements at DOM Ready.

       * @param {String} query  CSS selector to match in the DOM
       * @param {Function} fn Function to run when `query` is matched
       * @private
       */
      available: function(query, fn) {
        var dfd = $.Deferred(),
          maxPolls = _domHooks.settings.pollsMax,
          poll;

        dfd.progress(function() {
          var $el = $document.find(query);

          if (!$el.length) {
            maxPolls -= 1;
            if (!maxPolls) {
              dfd.reject();
            }
          } else {
            dfd.resolve(query, $el);
          }

        });

        dfd.done(fn);

        dfd.always(function() {
          if (poll) {
            clearInterval(poll);
          }
        });


        if (dfd.state() === 'pending') {
          poll = setInterval(dfd.notify, _domHooks.settings.pollsInterval);
        }
      }
    };

  //PUBLIC INTERFACE

  /**
   * Hooks functions' execution to DOM queries.
   *
   * @param  {String|Object}    type    Type of query, either `'ready'`, `'html'` or `'available'`. If argument is an object `'ready'` is implied.
   * @param  {[String|Object]}  query   Query to execute. May also be an hash of query and function
   * @param  {[Function]}       fn      Function to execute when `query` is matched
   */
  $.domHooks = function(type, query, fn) {
    //default usage
    if (arguments.length === 3) {
      return $.isFunction(_domHooks[type]) ? _domHooks[type].call(_domHooks, query, fn) : null;
    }
    //passing an object as first argument
    //implies a ready hook-list
    if ($.isPlainObject(type)) {
      query = type;
      type = 'ready';
    }
    //cycle the hook-list
    if ($.isFunction(_domHooks[type])) {
      $.each(query, _domHooks[type]);
    }
  };

  /**
   * Global settings.
   * @see _domHooks.settings
   */
  $.domHooks.settings = _domHooks.settings;

  //enqueue DOM ready hooks
  $document.ready(function() {
    while (readyHooks.length) {
      hookMatcher(readyHooks.pop());
    }
  });

}(jQuery, document));