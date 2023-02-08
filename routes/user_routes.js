const express = require('express')
const app = express()
app.use(express.json())

const userController =
require('../controller/user_controller')
app.get("/getAllUser", userController.getAllUser)
app.post("/addUser", userController.addUser)
app.post("/findUser", userController.findUser)
app.put("/:id/updateUser", userController.updateUser)
app.delete("/:id/deleteUser", userController.deleteUser)
module.exports = app