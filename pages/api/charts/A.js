import datastore from "../../../services/datastore";

const getRestaurants = async () => {
    const orders = await datastore.GetAll("orders");
    let data = orders.map((order) =>  
    {
    //     const { ghlId } = (await datastore.get("customers", rest.maxCustomer));
        
        const obj = {
            "timestamp": order.createdAt,
            "amt": rest.amount,
            // "maxCustomer": ghlId
        }

        return obj;
    })

    // return Promise
    // .all(data)

    return data;
    
}

// const getOrders = async () => {
//     const orders = await datastore.GetAll("orders");
// }

// const getCustomers = async () => {
//     const customers = await datastore.GetAll("customers");
// }

const A = async (req, res) => {
    console.log("HIT")
    const data = await getRestaurants();
    res.json({"data": data});
}

export default A;