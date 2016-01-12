import config from "config";
import mongoose from "mongoose";
import should from "should";

describe("database", function() {
    it("should be connected", function(done) {
        mongoose.connect(config.get("db.mongodb.url"), function(err) {
            should(err).be.empty();
            mongoose.model("User").find({}, function(err, users) {
                done();
            });
        });
    });
});
