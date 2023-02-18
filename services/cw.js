import datastore from "./datastore";
import { createContact } from "./ghl";

export const orderNote = (dishes) => {
  var orderNote = "";
  var subtot = 0;
  dishes.forEach((element) => {
    const item = "Name: "+ element.name + ", Price: "+ element.price + ", Qty: " + element.qty + ", totalAmt: "+ (element.price*element.qty).toString()
    orderNote += item + ", \n";
    subtot+=element.price*element.qty;
  });
  orderNote+=`\nSubtotal: ${subtot}`
  return orderNote;
}

export const updateExistingCustomer = async (customerId, orderTotal, restaurantId) => {
  let contact = await datastore.get("customers", customerId);

  //Update existing restaurant dictionary record 
  // if(contact.orderRecord[restaurantId]) contact.orderRecord[restaurantId] +=  orderTotal;    
  // else 
  //Create a new key-value pair
  // contact.orderRecord[restaurantId] = orderTotal

  //Saving in database
  await datastore.upsert("customers", customerId, contact);
  // return {"total": contact.orderRecord[restaurantId], "ghlId": contact.ghlId };
}

export const addNewContact = async (customer) => {
  const newGhlContact = await createContact(customer);
  console.log(newGhlContact)
  const { contact } = newGhlContact
  const id = contact.id;

  //Total orders of all restaurants will be stored as a map/dictionary object
  // let dict = {};
  // dict[restaurant_id] = newTotal

  // data fields
  const obj = {
    cwId: customer._id,
    ghlId: id,
    phone: '+' + customer.details.phone,
    // phone
    // orderRecord: dict,
    location_id: contact.locationId
  };

  //saving in database
  await datastore.save("customers", customer._id, obj);
  return id;
}

// export  const updateExistingRetaurant = async (restaurantId, customerId, newTotal) => {
//fetch restaurant
// let restaurant = await datastore.get("restaurants", restaurantId);
// restaurant.maxCustomer = (restaurant.maxSale < newTotal) ? customerId : restaurant.maxCustomer;
// restaurant.maxSale = (restaurant.maxSale < newTotal) ? newTotal : restaurant.maxSale; 
//Update info
// await datastore.upsert("restaurants", restaurantId, restaurant);
// } 

export const addNewRestaurant = async (restaurantId, restaurantName) => {
  const restaurant_info = {
    restaurantId: restaurantId,
    restaurantName: restaurantName,
    // maxCustomer: customerId 
  }
  //saving in database
  await datastore.save("restaurants", restaurantId, restaurant_info);
}

export const addNewOrder = async (ghlId, amount, timestamp, orderId, name) => {
  var daet = new Date(timestamp);
  const order_info = {
    customerGhlId: ghlId,
    amount: amount,
    createdAt: timestamp,
    // dateInfo: daet.to,
    orderId: orderId,
    customer: name
  }
  //saving in database
  await datastore.save("orders", timestamp, order_info)
}