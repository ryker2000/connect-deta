const { Deta } = require("deta");

/**
 * Return the `DetaBaseStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function (connect) {
  /**
   * Connect's Store.
   */

  var Store = connect.Store || connect.session.Store;

  /**
   * Initialize DetaBaseStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */
  function DetaBaseStore(options) {
    options = options || {};
    Store.call(this, options);
    this.prefix = null == options.prefix ? "sess:" : options.prefix;

    if (options.client) {
      this.client = options.client;
    } else {
      if (!options.detaProjectKey) {
        throw new Error(
          "You need to set detaProjectKey in express session options"
        );
      }
      const deta = Deta(options.detaProjectKey);
      this.client = deta.Base(options.detaBaseName ?? "session");
    }

    /*
     *  Inherit from `Store`.
     */
    DetaBaseStore.prototype.__proto__ = Store.prototype;

    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} fn
     * @api public
     */

    DetaBaseStore.prototype.get = async function (sid, fn) {
      sid = this.prefix + sid;

      const result = await this.client.get(sid);

      if (result !== null) {
        var sess = result.sess;
        sess = JSON.parse(sess);
        fn(null, sess);
      } else {
        fn(null, null);
      }
    };

    /**
     * Commit the given `sess` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Session} sess
     * @param {Function} fn
     * @api public
     */

    DetaBaseStore.prototype.set = async function (sid, sess, fn) {
      sid = this.prefix + sid;
      const sessString = JSON.stringify(sess);

      await this.client
        .put(
          {
            sess: sessString,
            ...(sess.cookie.maxAge && {
              expiresAt: new Date(
                new Date().getTime() + sess.cookie.maxAge
              ).valueOf(),
            }),
          },
          sid
        )
        .then(fn());
    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Function} fn
     * @api public
     */

    DetaBaseStore.prototype.destroy = async function (sid, fn) {
      sid = this.prefix + sid;
      await this.client.delete(sid);
      fn();
    };

    /**
     * Calculates the expire value based on the configuration.
     * @param  {Object} sess Session object.
     * @return {Integer}      The expire on timestamp.
     */
    DetaBaseStore.prototype.getExpiresValue = function (sess) {
      return sess.cookie.maxAge;
    };

    /**
     * Touches the session row to update it's expire value.
     * @param  {String}   sid  Session id.
     * @param  {Object}   sess Session object.
     * @param  {Function} fn   Callback.
     */
    DetaBaseStore.prototype.touch = async function (sid, sess, fn) {
      sid = this.prefix + sid;
      const sessString = JSON.stringify(sess);

      await this.client
        .update(
          {
            sess: sessString,
            ...(sess.cookie.maxAge && {
              expiresAt: new Date(
                new Date().getTime() + sess.cookie.maxAge
              ).valueOf(),
            }),
          },
          sid
        )
        .then(fn());
    };
  }

  return DetaBaseStore;
};
