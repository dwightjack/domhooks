/*global jQuery:true, sinon:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
QUnit.config.reorder = false;
jQuery.holdReady(true);

(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

 var readySpy = sinon.spy();
 jQuery(readySpy);

  module('jQuery#domHooks');

  test('html hook type', function() {
    var spy = sinon.spy();

    $.domHooks('html', 'is-html', spy);
    //this is called right away
    ok(spy.calledWith('is-html'), "First argument is the class name string");
    ok(spy.getCall(0).args[1].is('html'), "Second argument is the html element");

    //fail this
    $.domHooks('html', 'not-in-html', spy);
    ok(spy.calledOnce, "Silently fails if query is not found");

  });

  asyncTest('available hook type', function() {

    var availSpy = sinon.spy();

    $.domHooks('available', '#is-available', function (s, $el) {
      availSpy();
      //still has the "holdready we set"
      ok(availSpy.calledBefore(readySpy), "Runs before DOM ready");
      equal(s, '#is-available', "First argument is the selector");
      ok($el.is('#is-available'), "Second argument is the matched element");
      start();
    });

  });

  asyncTest('ready hook type', function () {

    $.domHooks('ready', '#is-available', function (s, $el) {
      ok($.isReady, "Runs after DOM ready");
      equal(s, '#is-available', "First argument is the selector");
      ok($el.is('#is-available'), "Second argument is the matched element");
      start();
    });
    $.holdReady(false);
  });


}(jQuery));
