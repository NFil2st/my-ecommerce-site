const express = require('express');
const path = require('path');
const app = express();

//serve static files form current project folder เอาไฟล์ไว้ใน dirname 
app.use(express.static(__dirname));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
})