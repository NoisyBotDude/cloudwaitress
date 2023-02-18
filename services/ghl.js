import datastore from "./datastore";
import axios from "axios";
//fetch config  
const newContactOptions = (customer, token) => {
    // console.log(JSON.stringify(customer))
    const { name, email, phone } = customer.details;
    const bearerToken = "Bearer " + token;
    var [firstName, lastName] = name.split(" ");

    if (!lastName) lastName = " ";

    const data = {
        firstName: firstName,
        lastName: lastName,
        name: name,
        email: email,
        // locationId: locationId,
        phone: phone,
        source: 'public api'
    }

    return {
        method: 'POST',
        headers: { "Content-Type": "application/json", Authorization: bearerToken, Version: process.env.GHL_API_VERSION },
        body: JSON.stringify(data)
    };
}

const newNoteOptions = (note, token, userId) => {
    const bearerToken = "Bearer " + token;

    const data = {
        body: note,
        userId: userId
    }

    return {
        method: 'POST',
        headers: { "Content-Type": "application/json", Authorization: bearerToken, Version: process.env.GHL_API_VERSION },
        body: JSON.stringify(data)
    };
}

//returns ghl oauth2 credentials js object
export const getcred = async (code, grant_type = 'authorization_code', refresh_token = '') => {
    let data = {
        client_id: process.env.GHL_CLIENT_ID,
        client_secret: process.env.GHL_CLIENT_SECRET,
        grant_type: grant_type,
        code: code,
        refresh_token: refresh_token
    };
    let response = await fetch('https://api.msgsndr.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    });
    let result = await response.json();
    return result;
}

//sets the oauth cache and db ,and returns new tokens 
// export const RefreshToken = async (refresh_token) => {
//     const response = await getcred('', 'refresh_token', refresh_token);
//     console.log(JSON.stringify(response));
//     let data = await datastore.get('locations', response.locationId);
//     //set tokens in db 
//     if (data) {
//         data.access_token = response.access_token;
//         data.refresh_token = response.refresh_token;
//         await datastore.save('locations', response.locationId, data);
//     }
//     return { "access_token": response.access_token, "refresh_token": response.refresh_token };
// }

//Creates new contact in ghl
export const createContact = async (customer) => {

    //get the ghl tokens
    const tokenData = (await datastore.GetAll("locations"))[0];
    const accToken = tokenData.ghlv1api;

    // const data = await fetch_request(endpoint, options, 1);
    // const endpoint = process.env.GHL_ENDPOINT + '/contacts/';

    //Make API call to create new contact
    const options = newContactOptions(customer, accToken);
    let data = await fetch("https://rest.gohighlevel.com/v1/contacts/", options);
    data = await data.json();
    if (data.contact) return { "contact": data.contact };

    //Handle invalid access token
    // else if (data.statusCode && data.statusCode === 401) {
    //     const { access_token, refresh_token } = await RefreshToken(refToken);
    //     if (access_token) await createGhlContact(customer, access_token, refresh_token);
    // }
}

export const createTask = (token, contactid, due, userid, type, caller) => {
    due = due.split(".")[0] + due.charAt(due.length - 1);
    console.log("create task params :", token, contactid, due, userid, type);
    axios({
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        url: `https://rest.gohighlevel.com/v1/contacts/${contactid}/tasks/`,
        data: {
            title: "Cloudwaitress missedcall",
            dueDate: due,
            description: `Customer ${type} number : ${caller}`,
            assignedTo: userid,
        }
    }).then((response) => {
        console.log("Task created successfully", response.data, "user :", userid);
    }).catch((e) => {
        console.error('Error in task creation :', e.message);
    })
}

export const createTag = async (name, token) => {
    let r = await fetch(`https://rest.gohighlevel.com/v1/tags/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "name": name
        })
    });
    let res = await r.text();
    return res;
}


// fetch users for a location ID
export const fetch_users = async (locationId) => {
    let d = await datastore.get('locations', locationId);
    let r;
    if (d) {
        r = await fetch("https://rest.gohighlevel.com/v1/users/location", {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${d.ghlv1api}`
            }
        });
    }
    let a = await r.text();
    return a;
}

//  to add tag on contacts
export const addtag = async (contactId, tag1, token) => {
    console.log("add tag params :", contactId, tag1);
    try {
        let config = {
            method: 'POST',
            url: 'https://rest.gohighlevel.com/v1/contacts/' + contactId + '/tags',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            data: {
                'tags': []
            }
        }
        config.data.tags.push(tag1);
        let r = await axios(config);
        console.log("tag added to:", contactId, "response:", r.data);
        return r.data;
    } catch (e) {
        console.error("Error in adding tag :", e.message);
    }
}

export const getcontact = async (number, token = '') => {
    let r = await fetch(`https://rest.gohighlevel.com/v1/contacts/?limit=20&query=${number.slice(-10)}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    let d = await r.json();
    console.log("get contact response", d);
    return d;
}

export const addNote = async (note, contactId) => {

    const tokenData = (await datastore.GetAll("locations"))[0];
    const accToken = tokenData.ghlv1api;

    var users = await fetch(`https://rest.gohighlevel.com/v1/users/?locationId=${tokenData.locationId}`, {
        headers: {
            Authorization: `Bearer ${accToken}`
        }
    })
    users = await users.json()

    const options = newNoteOptions(note, accToken, users.users[0].id);
    let data = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, options);
    data = await data.json();
    console.log("DATA", data)
    if (data.id) return { "note": data.body };
}

// create missed call contacts
export const createGhlContact = async (token, phone) => {
    let contact = await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "phone": phone,
        })
    });
    return await contact.json();
}