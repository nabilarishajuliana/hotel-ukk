const express = require(`express`)
const app = express()
app.use(express.json())
const tipekamarController = require(`../controller/tipe_kamar_controller`)


app.get("/getAllTipe", tipekamarController.getAllTipeKamar)
app.post("/findTipeKamar", tipekamarController.findTipeKamar)
app.post("/addTipeKamar", tipekamarController.addTipeKamar)
app.put("/updateTipeKamar/:id", tipekamarController.updateTipeKamar)
app.delete("/deleteTipeKamar/:id", tipekamarController.deleteTipeKamar)

module.exports = app