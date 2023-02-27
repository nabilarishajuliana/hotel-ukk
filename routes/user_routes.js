const express = require('express')
const app = express()
app.use(express.json())

const userController =
require('../controller/user_controller')
app.get("/getAllUser", userController.getAllUser)
app.post("/addUser", userController.addUser)
app.post("/findUser", userController.findUser)
app.put("/updateUser/:id", userController.updateUser)
app.delete("/deleteUser/:id", userController.deleteUser)
module.exports = app