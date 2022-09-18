const express = require("express");
const router = express.Router();
const database = require("../database")
const jwt = require("jsonwebtoken")
const config = require("../config")
const bcrypt = require("bcryptjs")
const checkSignIn = require("../auth");

router.post("/signup", async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const userType = req.body.userType

    if (password === undefined || email === undefined || password === "" || email === ""){
        res.status(400).send("Email or Password can't be empty")
        return
    }

    const otherUsers = await database('user').select('*').where('email', email)

    if(otherUsers.length !== 0){
        res.status(409).send("Username " + email + " already exist")
        return
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let result = null
    if (userType === "restaurant"){
        result = await database('user').insert({email: email, password: encryptedPassword, user_type: "restaurant"}).returning('*')
    }
    else{
        result = await database('user').insert({email: email, password: encryptedPassword, user_type: "client"}).returning('*')
    }

    const token = jwt.sign(
        { 
            id: result[0].id,
            email: result[0].email,
            userType: result[0].user_type
        },
        config.jwtToken
    );

    res.status(200).send(token)
});

router.post("/signin", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (password === undefined || email === undefined || password === "" || email === ""){
        res.status(400).send("Email or password can't be empty")
        return
    }

    const otherUsers = await database('user').select('*').where('email', email)

    if(otherUsers.length === 0){
        res.status(404).send("Email or password is wrong")
        return
    }

    if (await bcrypt.compare(password, otherUsers[0].password)){
        const token = jwt.sign(
            {
                id: otherUsers[0].id, 
                email: otherUsers[0].email,
                userType: otherUsers[0].user_type
            },
            config.jwtToken
        );
    
        res.status(200).send(token)
        return
    }
    else{
        res.status(404).send("Email or password is wrong")
        return
    }
});

router.post("/restaurantDataInitializer", checkSignIn, async (req, res) => {
    if (req.user.userType !== "restaurant"){
        res.status(403).send("You can't create an restaurant")
        return
    }

    const restaurantName = req.body.restaurantName
    const numberOfTables = req.body.numberOfTables
    const userId = req.user.id
    
    if (restaurantName === '' || restaurantName === undefined){
        res.status(400).send("Restaurant name can't be empty")
        return
    }

    if (numberOfTables <= 0 || numberOfTables === undefined) {
        res.status(409).send("You cant have 0 or less tables in the restaurant")
        return
    }

    const otherRestaurants = await database('restaurant').select('*').where('user_id', userId)

    if (otherRestaurants.length > 0){
        res.status(409).send("You can't have more than one restaurants")
        return
    }
    else{
        const result = await database('restaurant').insert({user_id: userId, name: restaurantName, nr_tables: numberOfTables}).returning('*')
        res.status(200).send(result)
        return
    }
})

router.post("/restaurantPreparationTypeInitializer", checkSignIn, async (req, res) => {
    if (req.user.userType !== "restaurant"){
        res.status(403).send("You are not allowed to do that")
        return
    }

    const types = req.body
    const userId = req.user.id

    const restaurant = await database('restaurant').select('*').where('user_id', userId)

    if (restaurant.length === 0){
        res.status(405).send("You first need an restaurant")
        return
    }

    if (restaurant.length !== 1){
        res.status(409).send("Something went wrong")
        return
    }

    const restaurantId = restaurant[0].id

    if (types === undefined || types.length === 0){
        res.status(400).send("You need to initialize at least one type")
        return
    }

    console.log(types)
    for (const type of types){
        if (type.name === '' || type.name === undefined || type === undefined){
            res.status(400).send("You can't have types without a name")
            return
        }
    }

    const otherTypes = await database('type').select('*').where('restaurant_id', restaurantId)

    for (const type of types){
        for (const otherType of otherTypes){
            if (type.name === otherType.name){
                res.status(400).send("You already have type " + type.name)
                return
            }
        }
    }

    for (const type of types){
        await database('type').insert({restaurant_id: restaurantId, name: type.name}).returning('*')
    }

    res.status(200).send(types)
})

router.post("/restaurantPreparationsInitializer", checkSignIn, async (req, res) => {
    if (req.user.userType !== "restaurant"){
        res.status(403).send("You are not allowed to do that")
        return
    }

    const preparates = req.body
    console.log(preparates);

    const userId = req.user.id
    const restaurant = await database('restaurant').select('*').where('user_id', userId)

    if (restaurant.length === 0){
        res.status(405).send("You first need an restaurant")
        return
    }

    if (restaurant.length !== 1){
        res.status(409).send("Something went wrong")
        return
    }

    const restaurantId = restaurant[0].id

    if (preparates === undefined || preparates.length === 0){
        res.status(400).send("You need to initialize at least one preparate")
        return
    }

    for (const preparate of preparates){
        if (preparate === undefined){
            res.status(400).send("You have to define all preparates")
            return
        }

        const preparateType = await database('type').select('*').where('name', preparate.type_name).where("restaurant_id", restaurantId)
        if (preparateType.length === 0){
            res.status(400).send("A preparate must be part of a valid type")
            return
        }
        if (preparateType.length > 1){
            res.status(409).send("Something went wrong")
            return
        }

        if (preparate.name === '' || preparate.name === undefined){
            res.status(400).send("You can't have preparates without a name")
            return
        }
        
        if (preparate.price === '' || preparate.price < 0){
            res.status(400).send("Preparate can't have a less than 0 price")
            return
        }
    }

    for (const preparate of preparates){
        await database('preparate').insert({type_name: preparate.type_name, name: preparate.name, description: preparate.description, price: preparate.price, restaurant_id: restaurantId}).returning('*')
    }
    res.status(200).send(preparates)
})

router.post("/clientCreatePurchaseOrderLine", checkSignIn, async (req, res) => {
    if (req.user.userType !== "client"){
        res.status(403).send("You are not allowed to do that")
        return
    }
    
    const userId = req.user.id
    var isPurchseOrderCreated = await database("purchase_order").select("*").where('user_id', userId)

    if (isPurchseOrderCreated.length !== 1){
        isPurchseOrderCreated = false
    }
    else{
        isPurchseOrderCreated = true
    }

    if (isPurchseOrderCreated){
        const restaurantId = req.query.restaurant_id
        const tableNumber = req.query.table_number
        const preparates = req.body

        const othersPurchaseOrdersId = await database("purchase_order").select("id").where('user_id', userId)
        const purchaseOrderId = othersPurchaseOrdersId[0]["id"]

        var totalPrice = parseInt(0)
        for (const preparate of preparates){
            const product = await database("preparate").select("*").where('name', preparate["name"]).where('restaurant_id', restaurantId)
            totalPrice = totalPrice + product[0]["price"] * preparate["quantity"]
            const totalProductPrice = product[0]["price"] * preparate["quantity"]
            await database("purchase_order_line").insert({purchase_order_id: purchaseOrderId, preparate_id: product[0]["id"], quantity: preparate["quantity"], price: totalProductPrice})
        }

        const oldTotalPrice = await database("purchase_order").select("total_price").where('user_id', userId)
        totalPrice = totalPrice + parseInt(oldTotalPrice[0]["total_price"])

        await database("purchase_order").update({total_price: totalPrice}).where("id", purchaseOrderId)
        
        res.status(200).send("oke")
    }
    else{
        const restaurantId = req.query.restaurant_id
        const tableNumber = req.query.table_number

        await database("purchase_order").insert({user_id: userId, restaurant_id: restaurantId, table_number: tableNumber, total_price: 0})
        const othersPurchaseOrdersId = await database("purchase_order").select("id").where('user_id', userId)
        const purchaseOrderId = othersPurchaseOrdersId[0]["id"] 

        const preparates = req.body
        var totalPrice = parseInt(0)
        for (const preparate of preparates){
            const product = await database("preparate").select("*").where('name', preparate["name"]).where('restaurant_id', restaurantId)
            totalPrice = totalPrice + product[0]["price"] * preparate["quantity"]
            const totalProductPrice = product[0]["price"] * preparate["quantity"]
            await database("purchase_order_line").insert({purchase_order_id: purchaseOrderId, preparate_id: product[0]["id"], quantity: preparate["quantity"], price: totalProductPrice})
        }
        await database("purchase_order").update({total_price: totalPrice}).where("id", purchaseOrderId)

        res.status(200).send("oke")
    }
})

router.post("/clientCreateComment", checkSignIn, async (req, res) => {
    if (req.user.userType !== "client"){
        res.status(403).send("You are not allowed to do that")
        return
    }
    
    const userId = req.user.id
    const commentary = req.body.commentary

    const othersPurchaseOrdersId = await database("purchase_order").select("id").where('user_id', userId)
    
    try{
        const purchaseOrderId = othersPurchaseOrdersId[0]["id"]

        await database("comment").insert({purchase_order_id: purchaseOrderId, commentary: commentary})

        res.status(200).send("oke") 
    }
    catch{
        res.status(201).send("oke")
    }
}) 

router.delete("/clientFinish", checkSignIn, async (req,res) => {
    if (req.user.userType !== "client"){
        res.status(403).send("You are not allowed to do that")
        return
    }
    
    const userId = req.user.id

    const otherPurchaseOrderId = await database("purchase_order").select("*").where("user_id", userId)
    
    try{
        const purchaseOrderId = otherPurchaseOrderId[0]["id"]

        await database("purchase_order_line").del().where("purchase_order_id", purchaseOrderId)
        await database("comment").del().where("purchase_order_id", purchaseOrderId)
        await database("purchase_order").del().where("id", purchaseOrderId)

        res.status(200).send("oke")
    }
    catch{
        res.status(201).send("oke")
    }
})


router.get("/getOrder", checkSignIn, async(req, res) => {
    if (req.user.userType !== "restaurant"){
        res.status(403).send("You are not allowed to do that")
        return
    }

    const userId = req.user.id
    const tableNumber = req.query.table_number
    const restaurant = await database('restaurant').select('*').where('user_id', userId)

    if (restaurant.length === 0){
        res.status(405).send("You first need an restaurant")
        return
    }

    if (restaurant.length !== 1){
        res.status(409).send("Something went wrong")
        return
    }

    const restaurantId = restaurant[0].id + ""
    const purchaseOrder = await database('purchase_order').select('*').where('restaurant_id', restaurantId).where('table_number', tableNumber)

    if (purchaseOrder.length === 0){
        let order = []
        res.status(200).send(order)
        return
    }

    const purchaseOrderId = purchaseOrder[0].id + ""

    const purchaseOrderLines = await database('purchase_order_line').select("*").where('purchase_order_id', purchaseOrderId)

    var purchaseOrderLineList = []

    for (let purchaseOrderLine of purchaseOrderLines){
        var preparateName = await database("preparate").select("*").where("restaurant_id", restaurantId).where("id",purchaseOrderLine.preparate_id)
        preparateName = preparateName[0].name
        var quantity = purchaseOrderLine.quantity
        purchaseOrderLineList.push({"type":"preparate", "name": preparateName, "quantity": quantity})
    }

    const comments = await database('comment').select("commentary").where('purchase_order_id', purchaseOrderId)

    var commentList = []

    for (let comment of comments){
        commentList.push({"type": "comment", "comment": comment.commentary})
    }

    const order = purchaseOrderLineList.concat(commentList)

    res.status(200).send(order)
    return
})

router.get("/getNumberOfTables", checkSignIn, async (req, res) =>{
    if (req.user.userType !== "restaurant"){
        res.status(403).send("You are not allowed to do that")
        return
    }

    const userId = req.user.id
    const restaurant = await database('restaurant').select('*').where('user_id', userId)

    if (restaurant.length === 0){
        res.status(405).send("You first need an restaurant")
        return
    }

    if (restaurant.length !== 1){
        res.status(409).send("Something went wrong")
        return
    }

    const restaurantId = restaurant[0].id + ""
    const numberOfTables = restaurant[0].nr_tables + ""

    const data = {
        restaurantId: restaurantId,
        numberOfTables: numberOfTables
    }

    res.status(200).send(data)
})

router.get("/getMenu", checkSignIn, async (req,res) =>{
    if (req.user.userType !== "client"){
        res.status(403).send("You are not allowed to do that")
        return
    }

    let data = req.query.data
    const restaurantId = data.split("-")[0]

    let dbTypes = await database("type").select("name").where("restaurant_id", restaurantId)
    var types = []

    for (let type of dbTypes){
        types.push(type["name"])
    }

    var menu = []

    for (let type of types){
        let dbPreparates = await database("preparate").select("*").where("restaurant_id", restaurantId).where("type_name", type)
        let preparates = []
        for (let preparate of dbPreparates){
            preparates.push({
                name: preparate["name"],
                description: preparate["description"],
                price: preparate["price"],
                quantity: 0
            })
        }
        menu.push({
            type: type,
            preparates: preparates
        })
    }

    res.status(200).send(menu)
})

module.exports = router;
 