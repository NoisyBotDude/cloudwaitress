import datastore from "../../services/datastore"

const form = async (req, res) => {
    const body = req.body;
    const apiKey = body.ghlv1api;
    const options = {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${apiKey}`
        }
    }

    let apiValid = await fetch("https://rest.gohighlevel.com/v1/contacts", options);
    let locationValid = await fetch("https://rest.gohighlevel.com/v1/locations/" + body.locationId, options)

    apiValid = await apiValid.json();
    locationValid = await locationValid.json();
    if (!apiValid.contacts) return res.status(404).json({ outcome: 1, message: 'GHL API key is invalid' });
    if (!locationValid.id) return res.status(404).json({ outcome: 1, message: 'GHL location ID is invalid' });

    let val = await datastore.get('locations', body.locationId);
    if (!val) {
        val = {}
    }
    val.cwkey = body.cwKey;
    val.ghlv1api = body.ghlv1api;
    val.number = body.number;
    val.locationId = body.locationId;

    await datastore.save('locations', body.locationId, val);
    res.status(200).json({ outcome: 0, locationId: body.locationId, message: "Data registered successfully" });
}

export default form;