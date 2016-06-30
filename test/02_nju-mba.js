import fs from "fs";
import inquirer from "inquirer";
import should from "should";

import Auth from "../lib/nju-mba/auth";
import Elective from "../lib/nju-mba/elective";
import User from "../lib/model/user";

describe("nju-mba", function() {
    let auth = null;
    describe("Auth", function() {
        before(() =>
        {
            auth = new Auth();
        });

        describe("#downloadCaptchaImage()", function() {
            it("should download the captcha", function(done) {
                this.timeout(10 * 1000);
                if (!fs.existsSync("temp"))
                {
                    fs.mkdirSync("temp");
                }
                auth.downloadCaptchaImage().pipe(fs.createWriteStream('temp/captcha.png')).on("close", () => {
                    if (fs.existsSync("temp/captcha.png"))
                    {
                        done();
                    }
                    else
                    {
                        done(new Error("The CAPTCHA image has not been downloaded."));
                    }
                });
            });
        });

        describe("#login()", function() {
            it("should be successful", function(done) {
                this.timeout(120 * 1000);
                inquirer.prompt([
                    { name: "captcha", type: "text", message: "Please input the CAPTCHA:" }
                ], (answer) => {
                    auth.login({
                        schoolNum: "mf1402157",
                        password: "",
                        captcha: answer.captcha
                    }, err => {
                        should(err).be.empty();
                        should(auth).containEql({
                            schoolNum: "MF1402157",
                            name: "李昕"
                        });
                        done();
                    }, done);
                });
            });
        });
    });

    let elective = null;
    describe("elective", function() {
        before(() => {
            elective = new Elective({ auth });
        });

        it("should have 7 selected courses", function(done)
        {
            this.timeout(60 * 1000);
            elective.loadSelectedCourses(err => {
                should(err).be.empty();
                should(elective.selectedCourseIds).be.lengthOf(7);
                done();
            });
        });

        it("should have saved properly", function(done)
        {
            elective.save(err => {
                should(err).be.empty();

                User.find({ schoolNum: "MF1402157" }, function(err, savedUsers) {
                    should(savedUsers).be.lengthOf(1);
                    const savedUser = savedUsers[0];
                    should(err).be.empty();
                    should(savedUser).not.be.empty();
                    should(savedUser).containEql({
                        schoolNum: auth.schoolNum,
                        name: auth.name
                    });
                    should(savedUser.selectedCourseIds).be.lengthOf(7);
                    //should(savedUser.selectedCourseIds).containEql('c106', 'c121', 'c120', 'c109', 'c110', 'c107', 'c111');
                    done();
                });
            }, done);
        });
    });
});
