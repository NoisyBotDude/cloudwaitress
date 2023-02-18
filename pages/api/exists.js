import datastore from "../../services/datastore"
// check if the locationId exists in database
const exists = async (req, res) => {
    let val = await datastore.get('locations', req.body.locationId);
    if (val)
        res.send(true);
    else res.send(false);
}

export default exists;