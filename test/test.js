const should = require("should"),
  session = require("express-session"),
  DetaBaseStore = require(__dirname + "/../lib/connect-deta.js")({
    session: session,
  }),
  { Deta } = require("deta");

var client;

const project = Deta("<YOUR PRIVATE DETA.SH PROJECT KEY>");
client = project.Base("session_test");

const options = {
  cookie: {
    maxAge: 259200000, // 3 day cookie age (this will also set the auto expire in Deta Base)
  },
};

describe("ConnectDetaBase", function () {
  describe("Constructor", function () {
    it("should take session as argument", function () {
      const DetaBaseStore = require(__dirname + "/../lib/connect-deta.js")(
        session
      );
      DetaBaseStore.should.be.an.instanceOf(Function);
    });

    it("should take session as one of the options", function () {
      const DetaBaseStore = require(__dirname + "/../lib/connect-deta.js")({
        session: session,
      });
      DetaBaseStore.should.be.an.instanceOf(Function);
    });
  });
});

describe("DetaBaseStore", function () {
  describe("Instantiation", function () {
    it("should be able to be created", function () {
      var store = new DetaBaseStore(options);
      store.should.be.an.instanceOf(DetaBaseStore);
    });
  });
  describe("Setting", function () {
    it("should store data correctly", function (done) {
      var store = new DetaBaseStore(options);

      store.set(
        "123",
        {
          cookie: {
            maxAge: 259200000,
          },
          name: "tj",
        },
        function (err, res) {
          if (err) throw err;

          done();
        }
      );
    });
  });
  describe("Getting", function () {
    before(function (done) {
      var store = new DetaBaseStore(options);
      store.set(
        "1234",
        {
          cookie: {
            maxAge: 259200000,
          },
          name: "tj",
        },
        done
      );
    });

    it("should get data correctly", function (done) {
      var store = new DetaBaseStore(options);
      store.get("1234", function (err, res) {
        if (err) throw err;
        res.cookie.should.eql({
          maxAge: 259200000,
        });
        res.name.should.eql("tj");

        done();
      });
    });

    it("does not crash on invalid session object", function (done) {
      var store = new DetaBaseStore(options);

      store.get("9876", function (err, res) {
        if (err) throw err;
        should.not.exist(res);

        done();
      });
    });
  });
  describe("Touching", function () {
    var sess = {
      cookie: {
        maxAge: 259200000,
      },
      name: "tj",
    };
    before(function (done) {
      var store = new DetaBaseStore(options);
      store.set("1234567", sess, done);
    });

    it("should touch data correctly", function (done) {
      var store = new DetaBaseStore(options);
      store.touch("1234567", sess, function (err, res) {
        if (err) throw err;
        done();
      });
    });
  });

  describe("Destroying", function () {
    before(function (done) {
      var store = new DetaBaseStore(options);
      store.set(
        "12345",
        {
          cookie: {
            maxAge: 259200000,
          },
          name: "tj",
        },
        done
      );
    });

    it("should destroy data correctly", function (done) {
      var store = new DetaBaseStore(options);
      store.destroy("12345", function (err, res) {
        if (err) throw err;

        store.get("12345", function (err, res) {
          if (err) throw err;
          should.not.exist(res);

          done();
        });
      });
    });
  });
});
