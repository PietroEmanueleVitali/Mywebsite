import express from "express";
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import 'dotenv/config';
import http from 'http';


const app = express();
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname);

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname,"./public")));

let data = new Date();

app.get("/", (req, res)=>{
    res.render('pages/home.ejs', {data: data});
})

app.get("/project", (req, res) => {
    res.render('pages/projects.ejs');
})

app.get("/message", (req, res) => {
    res.render('pages/message.ejs');
})

app.get("/contacts", (req, res) => {
    res.render('pages/contacts.ejs');
})

app.get("/curriculum", (req, res) => {
    res.render('pages/curriculum.ejs');
})

app.get('/curriculum-download', (req, res) => {

    res.download('Pietro-Emanuele-Vitali_CV.pdf', (err) =>{
        if(err){
            console.log('errore');
        }
    });
})

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emailsendertopietrovitali@gmail.com',
    pass: process.env.SECRET_KEY
  }
});

app.post('/message', (req, res) => {

    let mailOptions = {
        from: 'emailsendertopietrovitali@gmail.com',
        to: 'pietrovitali.pv@gmail.com',
        subject: 'Work email from' + ' ' + req.body.firstname + ' ' + req.body.lastname,
        text: req.body.message + '\n' + req.body.email + '\n' + 'Phone: ' + req.body.phone, 
      };

    // console.log(req.body.firstname);
    // res.send('ok');

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.render('./pages/message', {sent: 'yes'});
        }
      });

})

//Function to create servers for multiple IP addresses
function createServers(ipAddresses, port) {
  ipAddresses.forEach(ip => {
      const server = http.createServer(app);
      
      server.listen(port, ip, () => {
          console.log(`Server running on http://${ip}:${port}`);
      });

      // Error handling
      server.on('error', (error) => {
          if (error.code === 'EADDRNOTAVAIL') {
              console.error(`Error: IP address ${ip} is not available`);
          } else {
              console.error(`Error starting server on ${ip}:${port}:`, error);
          }
      });
  });
}





// Example usage
const ips = [
  '3.75.158.163',      
  '3.125.183.140',   
  '35.157.117.28'         
];

createServers(10000, ips);
// app.listen (3000);
