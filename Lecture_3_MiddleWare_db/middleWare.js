const express = require('express');
const app = express();


function beforeFn(req, res, next) {
    try {
        console.log("beforeFn called")
        const length = Object.keys(req.body).length;
        if(length > 0 && req.body.name && req.body.userId){
            next();
        }else{
            res.status(400).json({
                message: 'bad request'
            })
        }
    }
    catch(err) {
        res.status(500).json({
            message: 'internal server error'
        });
    }
}

function afterFn(req, res) {
  try {
    console.log('afterFn called')
    console.log('req.body', req.body)
    res.status(200).json({
      message: 'respond send 2',
      body: req.body
    })
  } catch (err) {
    res.status(500).json({
      message: 'internal server error'
    })
  }
}

// yaha pe sequential order me function call hoga (sequential matching) or agar ek bar res.status mil gya to firr vo aage nhi jata vhi ruk jata h. jaise post req lagayi postman m to khaali 1st console.log ka "respond send" aayega or uske baad 2nd console.log ka "req.body" aaya kyoki express.json() ke baad hi req.body me data aata h. or express.json() bewfore function ke baad h to vo data nhi de paya req.body me.

app.use(express.json())
app.post('/posts', beforeFn)
app.post("/posts", afterFn);


// jb koi bhi req nhi lgti to ek last m 404 not found ka message aata h. to uska route last m define hota h ab ye hrr req pr chna chahiye to isiliye hrr req k liye app.use() use krte h.

// inshort agr aapko hrr method or hrr req pr koi ek function chahiye to app.use() use kro or route m kuch bhi use mtt kro app.use() m route optional hota h.

app.use(function(req, res) {
    res.status(404).json({
        message: ' req not found'
    })
})


app.listen(3000, function()   {
  console.log('Server is running on port 3000');
});