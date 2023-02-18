import datastore from "../../services/datastore";
import { getcred } from "../../services/ghl";
import { getCookie, setCookie } from 'cookies-next';

const auth = async (req, res) => {
    if (req.body.code) {
        try {
            let credentials = await getcred(req.body.code);
            //if location id is valid
            if (credentials) {
                //create it
                // console.log("credentials- ", credentials);
                return res.status(200).json({ outcome: 0, locationId: credentials.locationId });
            }
            throw new Error();
        } catch (e) {
            console.log(e)
            return res.status(401).json({ outcome: 1, message: "Invalid ghl account" });
        }
    } else {
        return res.status(200).json({ outcome: 0, message: "" });
    }
}
export default auth;