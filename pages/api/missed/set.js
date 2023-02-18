import datastore from "../../../services/datastore";
import { flow_desc } from '../../../lib/flow_desc';

const set = async (req, res) => {
    try {
        const client = require('twilio')(req.body.twilio_sid, req.body.twilio_token);
        if (req.body.locationId) {
            var d = await datastore.get('locations', req.body.locationId);
        }
        client.studio.v2.flows.create({
            commitMessage: 'Commit from cloudwaitress gohighlevel integration',
            friendlyName: req.body.flow_name,
            status: 'published',
            definition: flow_desc()
        }).then(async (r) => {
            if (d) {
                d.sid = r.sid;
                d.user_id = req.body.user_id;
                await datastore.save('locations', req.body.locationId, d);
            } else console.log("Location id not present in request body");
            console.log('Flow : sid :', r.sid, "name: ", r.friendlyName, "status:", r.status, "account_sid:", r.accountSid, "webhook_url:", r.webhookUrl, "url:", r.url);
        }).catch((err) => console.log(err.message));
        res.json({ outcome: 0, message: "Flow created successfully" });
    } catch (e) {
        console.log("error in create flow-", e.message);
        res.json({ outcome: 1, message: e.message });
    }
}

export default set;