const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static("public"))

let orders=[]
let number=0

io.on("connection",socket=>{

 socket.emit("orders",orders)

 socket.on("newOrder",data=>{

  number++
  if(number>999) number=1

  const order={
   id:Date.now(),
   number:"#"+String(number).padStart(3,"0"),
   item:data.item,
   extras:data.extras
  }

  orders.push(order)

  io.emit("orders",orders)
  socket.emit("orderNumber",order.number)

 })

 socket.on("finish",id=>{

  orders=orders.filter(o=>o.id!=id)
  io.emit("orders",orders)

 })

})

http.listen(3000,()=>console.log("Server läuft auf Port 3000"))
