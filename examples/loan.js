const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
const https = require('https');

const bip39 = require('bip39')
const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')
const network = bitcoin.networks.bitcoin;
function getAddress (node) {
return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network}).address
}

var httpsOptions = {
  cert: fs.readFileSync('/home/admin/conf/web/ssl.bitcoin.alpin52.ru.crt'),
  key: fs.readFileSync('/home/admin/conf/web/ssl.bitcoin.alpin52.ru.key'),
  ca: fs.readFileSync('/home/admin/conf/web/ssl.bitcoin.alpin52.ru.ca')
};
  
const loan = express();

process.env.PWD = process.cwd();




loan.use(express.static(/*'/home/admin/web/bitcoin.alpin52.ru/public_html/public'));//*/process.env.PWD + '/public'));
loan.use(favicon(__dirname + '/public/favicon.ico'));
  
// создаем парсер дл¤ данных loanlication/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
loan.get("/index", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/index.html");
});
loan.post("/index", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    
	const mnemonic = 'eight better wealth display father cave suffer game sign health fit exchange noble tunnel poet remember owner letter submit illness cage calm dry noble'
	console.log('Testing mnemonic: ',bip39.validateMnemonic(mnemonic))
	const seed = bip39.mnemonicToSeed(mnemonic)
	const root = bip32.fromSeed(seed)
	console.log("m/0'/0/1 ->",getAddress(root.derivePath("m/0'/0/1")));
	console.log("m/0'/0/2 ->",getAddress(root.derivePath("m/0'/0/2")));

	response.send(`${request.body.btc_in} - ${request.body.Amount}`);
	
});
  
loan.get("/", function(request, response){
    response.send("Main Page");
});
/*
loan.get("/bitcoin_logo_mini.png", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/public/bitcoin_logo_mini.png");
});
  */
var server = https.createServer(httpsOptions, loan);
server.listen(3001);
//https.createServer(httpsOptions).listen(3001);
//loan.createServer(httpsOptions).listen(3001);
