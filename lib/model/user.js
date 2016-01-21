import mongoose from "../mongoose";

const schema = new mongoose.Schema({
    schoolNum: { type: String, index: true },
    name: { type: String },
    selectedCourseIds: { type: [ String ], index: true },
    createdTime: { type: Date, default: Date.now }
});

schema.static("findBySchoolNum", function(schoolNum, cb) {
    return this.findOne({ schoolNum: schoolNum }, cb);
});

export default mongoose.model("User", schema);
