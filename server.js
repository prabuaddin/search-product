const express = require("express")
const mysql = require("mysql2")
const port = 8000

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

const dbConnection = mysql.createConnection({
    host: "localhost",
    database: "laptop",
    user: "root",
    password: "password123",
})

dbConnection.connect((err) => {
    if (err) throw err
    console.log("database connected...")

    const sql = "SELECT brand, model FROM mytable"

    dbConnection.query(sql, (err, result) => {
        const products = JSON.parse(JSON.stringify(result))
        console.log("Database -> ", result)
        app.get("/", (req, res) => {
            res.render("index", { products: products })
        })
    })
})

app.get('/produk/cari', (req, res) => {
    const brand = req.query.brand || ''
    const model = req.query.model || ''

    let sql = 'SELECT * FROM mytable WHERE 1=1'
    let params = []

    if(brand){
        sql += ' AND brand LIKE ?'
        params.push(`%${brand}`)
    }

    if(model){
        sql += ' AND model LIKE ?'
        params.push(`%${model}`)
    }

    dbConnection.query(sql, params, (err, result) => {
        if(err){
            res.status(500).json({ error: 'Produk tidak ditemukan'})
            return
        }
        res.json(result)
    })
})

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`)
})