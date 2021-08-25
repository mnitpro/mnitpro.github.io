import jsonServer from 'json-server';
import https from 'https';
import path from 'path';
import fs, { writeFile } from 'fs';

const server = jsonServer.create();

const rootPath = 'C:\\Users\\Power\\Mirth';
const exportPath = 'C:\\Users\\Power\\Mirth\\export';
const port = 7443;
const hostname = 'mnbrain.com';
const url = `https://${hostname}:${port}/`
const keyFile = path.join(`${rootPath}/certs/private.key`);
const certFile = path.join(`${rootPath}/certs/certificate.crt`);
const router = jsonServer.router(`${rootPath}/db.json`);
const middlewares = jsonServer.defaults(); 
 
server.use(middlewares);

https
  .createServer(
    {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile),
    },

    server.use(router) 
  )

  .listen(port, hostname, () => {
    console.log(`${url}`);
  });

router.render = (req, res) => {
    const data = JSON.stringify(req.body, null, 4);
    var parsed = JSON.parse(data);
    var msgId = parsed.MessageHeader.MessageID;
    fs.writeFile(`${exportPath}/${msgId}.json`, data, function (err) {
        if (err) return console.log(err);
        console.log(`Exported to ${msgId}.json`);
      });

    res.jsonp({"MessageHeader": {
	  "MessageId": `${msgId}`, 
	  "MessageType": "ACK"
	} 
  });
  
}