require('dotenv').config();
const express=require('express')
const server=express()
const axios=require('axios')
const cors=require('cors')
const mongoose=require('mongoose')
server.use(cors());
server.use(express.json());
const PORT=process.env.PORT|| 3001
mongoose.connect('mongodb://localhost:27017/DB_NAME',{ useNewUrlParser: true, useUnifiedTopology: true });

let colorschema=mongoose.Schema({

title:String,
userName:String,
imageUrl:String

})


let userschema=mongoose.Schema({

email:String,
Thecolors:[colorschema]


})

let usermodel=mongoose.model('alluser',userschema)


const userseed=()=>{

const user1=usermodel({

    email:'mamoun.alshishani@yahoo.com',

    Thecolors:[{

        title:'colors',
        userName:'mamoun',
        imageUrl:'hajsdhkknkj',

    }]


})

const user2=usermodel({

    email:'quraanrazan282@gmail.com',

    Thecolors:[{

        title:'colors',
        userName:'razan',
        imageUrl:'hggggggg',

    }]


})



user1.save();
user2.save();
console.log(user1);
console.log(user2);
}

userseed();

server.get('/',(req,res)=>{res.send('home')})




server.get('/Alldata',AlldataHandler)
server.get('/getData',getDataHandler)
server.post('/AddData',AddDataHandler)
server.put('/Updatedata/:ids',UpdatedataHandler)
server.delete('/deleteData/:id',deleteDataHandler)


function AlldataHandler(req,res){

let url='https://ltuc-asac-api.herokuapp.com/allColorData'
axios.get(url).then(response=>{

let Alldata=response.data.map(el=>{

return new Color(el)




})

res.send(Alldata)

})

}



function AddDataHandler(req,res){


const email=req.query.email;
const {title,
    userName,
    imageUrl}=req.body;



    usermodel.findOne({email:email},(err,data)=>{

        if(err){res.send(err)}
        
        else{
        data.Thecolors.push({
        
        
            title:title,
            userName:userName,
            imageUrl:imageUrl,
        
        
        })
        data.save();
        res.send(data.Thecolors);
        }
        })



}


function getDataHandler(req,res){

    const email=req.query.email;
    usermodel.findOne({email:email},(err,data)=>{
if(err){res.send(err)}
else{res.send(data)}

     })

}



function deleteDataHandler(req,res){

    const email=req.query.email;
const favid=req.params.id
    usermodel.findOne({email:email},(err,data)=>{
if(err){res.send(err)}
else{
let Newarr=[];
    data.Thecolors.forEach((el,idx)=>{

if(idx !==Number(favid)){


    Newarr.push(el)

}
    })

    data.Thecolors=Newarr;
data.save();
res.send(data.Thecolors)
}
})
}



function UpdatedataHandler(req,res){

    const email=req.query.email;
    const favid=Number(req.params.ids)

    const {title,
        userName,
        imageUrl}=req.body;

        usermodel.findOne({email:email},(err,data)=>{


if(err){res.send(err)}

else{

    data.Thecolors.splice(favid,1,{

title:title,
userName:userName,
imageUrl:imageUrl,

    })

data.save()
res.send(data.Thecolors);
}




        })

}




class Color{

constructor(data){

this.title=data.title
this.userName=data.userName
this.imageUrl=data.imageUrl

}





}


server.listen(PORT,()=>{console.log(`listening to port${PORT}`);})

// server.listen(PORT,()=>{`listening to port${PORT}`})