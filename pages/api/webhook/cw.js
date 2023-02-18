import datastore from "../../../services/datastore";
import { orderNote, updateExistingRetaurant, addNewContact, addNewRestaurant, addNewOrder } from "../../../services/cw";
import { addNote } from "../../../services/ghl";

const getRestaurants = async () => {
  const rests = await datastore.GetAll("restaurants");
  console.log(rests)
  let data = rests.map((rest) => rest.restaurantId)

  return Promise
    .all(data)
}

//Events mapped to their respective handlers
const eventMap = {
  order_new: async function newOrder(body) {
    const { data } = body;
    const { order, customer } = data;
    const { restaurant_id, restaurant_name } = body;
    const { dishes, bill, created } = order;
    const orderTotal = bill.total;
    //Saving the dishes as a comma separated list
    const note = orderNote(dishes);

    try {
      // if exists in missed call kind
      let ms_contact = await datastore.FilterEquals("missed", "phone", customer.details.phone)[0];
      // retrieve data and move to customers kind
      if (ms_contact) {
        console.log("missed call contact- ", ms_contact);
        await datastore.delete("missed", ms_contact.ghlId);
      }
      //else
      var contactExists = await datastore.get("customers", customer._id);
      // var newTotal = 0;
      var ghl_id = "";
      if (contactExists) ghl_id = contactExists.ghlId;
      //Update existing customer total    
      // const {total, ghlId} = await updateExistingCustomer(customer._id, orderTotal, restaurant_id)
      // newTotal = total;
      // ghl_id = ghlId;
      // } else {
      else {
        //Create new contact in GHL and add to database
        // newTotal = orderTotal;
        ghl_id = await addNewContact(customer);
      }

      //Add order note
      console.log(ghl_id)
      var contactNote = await addNote(note, ghl_id);

      //Update max sale amount for the restaurant
      var restaurantExists = await datastore.Exists("restaurants", restaurant_id);

      if (!restaurantExists) await addNewRestaurant(restaurant_id, restaurant_name, customer._id);
      // {
      //Update existing restaurant information
      // await updateExistingRetaurant(restaurant_id, customer._id);
      // }else{
      //Create new restaurant in db
      // await addNewRestaurant(restaurant_id, restaurant_name, customer._id);
      // }

      await addNewOrder(ghl_id, orderTotal, created, order._id, customer.details.name);

    } catch (e) {
      console.log("error ", e.message);
    }
  },

  // order_update_status: async function orderStatusUpdate(data) {
  //   try {
  //   } catch (e) {}
  // },

  // order_update_ready_time: async function updateReadyTime(data) {
  //   try {
  //   } catch (e) {}
  // },

  // booking_new: async function newBooking(data) {
  //   try {
  //   } catch (e) {}
  // },

  // booking_update_status: async function updateBookingStatus(data) {
  //   try {
  //   } catch (e) {}
  // },
};

const cwHookHandler = async (req, res) => {

  //Verifying webhook origin
  const valid = (req.body.secret === process.env.WEBHOOK_SECRET)

  console.log("this is valid")

  const reqBody = req.body;
  res.status(200).send("ok");

  if (valid) {
    await eventMap[reqBody.event](reqBody);
  } else console.log("mismatch")


};

export default cwHookHandler;