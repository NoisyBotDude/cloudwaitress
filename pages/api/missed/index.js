import datastore from "../../../services/datastore"
import { addtag, createGhlContact, createTag, getcontact } from "../../../services/ghl";

const searchcontact = async (number, token) => {
    let r = await fetch(`https://rest.gohighlevel.com/v1/contacts/lookup?phone=${number}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    console.log("this is response: ", r)
    let res = await r.text();
    return res;
}

// check if the locationId exists in database
export default async function type(req, res) {
    console.log('Request body from twilio flow : ', req.body);
    console.log("this is working", req.body.body)
    /* req.body = {
        "tags":"text_back", // the tag that is mentioned in the twilio flow
        "caller": {{trigger.call.From}} , // the number called from
        "to": {{trigger.call.To}} , ;// the number called to i.e. our twilio number
        "flow_sid": {{flow.sid}} // the flow sid of the flow that was called
        } 
    eg- {
        "tags":"textback",
        "caller": +13107210117 ,
        "to": +19514066588 ,
        "flow_sid": FN165b5b6cdf982a18e8e4e1d4941e25e0
        }
        */

        // {
        //     body: '{\n' +
        //       '"tags":"textback",\n' +
        //       '"caller": +919394527658 ,\n' +
        //       '"to": +16282328164 ,\n' +
        //       '"flow_sid": FN1aa96c71e72f9fef4c093701285776ac\n' +
        //       '}'
        //   }
    // split the req.body.body in "+" sign
    // req.body.body = req.body.body.split("+");
    // console.log(req.body.body.split("\n")[2].split(",")[0].split(":")[1].trim())
    let tags = req.body.body.split("\n")[1].split(",")[0].split(":")[1].trim().split("\"")[1];
    console.log("this is tags: ", tags)
    let caller = req.body.body.split("\n")[2].split(",")[0].split(":")[1].trim();
    console.log("this is caller: ", caller)
    let to = req.body.body.split("\n")[3].split(",")[0].split(":")[1].trim();
    console.log("this is to: ", to)
    let flow_sid = req.body.body.split("\n")[4].split(",")[0].split(":")[1].trim();
    console.log("this is flow_sid: ", flow_sid)
    
    try {
        var loc = await datastore.FilterEquals("locations", "sid", flow_sid);
        loc = loc[0];
        if (Object.keys(loc).length === 0) {
            console.log("location not found");
            return;
        }
        console.log("hello")
        var v1api = loc.ghlv1api;

        try {
            await createTag(tags, v1api);
        } catch (e) {
            console.log("Tag error on attempt : ", e.message);
        }
        let contact_id = await searchcontact(caller, v1api);
        contact_id = contact_id.contacts[0].id;
        if (contact_id === null) {
            try {
                contact_id = await createGhlContact(caller, v1api);
                contact_id = contact_id.contact.id;
            } catch (e) {
                console.log("Error in creating contact :", e.message);
                return;
            }
        }
        await addtag(contact_id, tags, v1api);

        return res.status(200).send("200");
    } catch (e) {
        console.log(e.message);
        return res.status(500).send("500");
    }
}