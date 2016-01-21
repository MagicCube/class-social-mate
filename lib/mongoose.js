import config from "config";
import mongoose from "mongoose";

let mongoDbUrl = config.get("db.mongodb.url");
if (mongoDbUrl === "VCAP_SERVICES" && process.env.VCAP_SERVICES)
{
    try
    {
        mongoDbUrl = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials.uri;
    }
    catch (e)
    {

    }
}

mongoose.connect(mongoDbUrl);

export default mongoose;
