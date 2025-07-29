const express = require("express") // expressi import ettik
const cors = require("cors") // cors, http ve https isteklerini kabul eden bağımlılıktır.
const sql = require("mysql2") // veritabanı bağlantısı mysql


const app = express() // express ile bir uygulama oluşturduk
const port = 3000 // bir port belirledik


app.use(cors()) // express ile oluşturduğumuz uygulamamıza cors'u bağlayarak http & https isteklerini kabul ettik.
app.use(express.json()) // express'imizin json verilerini okuyabilmesini sağlar.
app.use(express.urlencoded({ extended: true })) // express'imizin form verilerini okuyabilmesini sağlar.

const connection = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "isbelvalex123",
    database: "myDatabase",
})
connection.connect((err) => {
    if (err) {
        console.error("Connection.Connect bir hata oluştu. =>", err)
    } else {
        console.log("MySQL2 Veritabanı bağlantısı başarılı!")
    }
})


app.get('/', (req, res) => { // Eğer bize "/" boş bir "get" isteği gelirse, (req -> sunucuya gelen veri, res -> kullanıcıya giden veri) response olarak gönder -> bir string.
    // buradaki ilk parametre olan stringe / ile başlayarak istediğimizi yazabiliriz. Örneğin, ...('/deneme/kullanici/1')
    res.send('NodeJs ile Express Sunucusu Çalışıyor')
});

app.post('/submit-form', (req, res) => {
    const { name, email } = req.body
    if (!name || !email) {
        return res.status(400).send("Kullanıcı adı veya e postası bulunamadı.")
    }
    connection.query("INSERT INTO form_data (name,email) VALUES(?,?)",
        [name, email], (err, result) => {
            if (err) {
                console.error("Connection.Query Hata =>", err)
                return res.status(500).send("Sunucu Hatası")
            }
            console.log("Kayıt olma başarılı.")
        }
    )
    res.send("From başarıyla gönderildi.")
})

app.get("/form-data", (req, res) => {
    const query = "SELECT * FROM form_data";
    connection.query(query, (err, result) => {
        if (err) {
            console.error("SELECT Query Hata =>", err)
            res.status(500).send("Select Hata Oluştu!")
        }
        res.json(result)
    })
})

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id
    const query = "DELETE FROM form_data WHERE id=?"
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Connection Delete Hata", err)
            res.status(500).send("Connection Delete Hata")
        }
        res.send("Veri silme başarılı.").status(200)
    })
})

app.put("/form-update/:id", (req, res) => {
    const id = req.params.id
    const { name, email } = req.body
    const query = "UPDATE form_data SET name=?,email=? WHERE id=?"
    if (!name || !email) {
        console.error("İsim veya e posta girilmedi.")
        res.status(500).send("Düzenlenirken bir hata oluştu.")
    }
    connection.query(query, [name, email, id], (err, result) => {
        if (err) {
            console.error("Düzenlenirken hata oluştu2")
            res.status(500).send("Düzenlenirken 2 hata oluştu", err)
        }
        res.status(200).send("Başarıyla düzenlendi.")
    })

})






app.listen(port, () => { // uygulamayı çalıştır  
    console.log(`Localhost: ${port} portunda çalışıyor.`)
})