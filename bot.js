const Discord = require('discord.js');
const express = require("express");
const https = require("https");
const xml2js = require('xml2js');
const client = new Discord.Client();
const app = express();
var domainList = [];
var nameInfo;
var pricingInfo;
var domainCost;
var ClientIp;
var util = require('util');
var url;
const publicIp = require('public-ip');
const {prefix, botToken, ApiKey, UserName} = require("./config.json");
var embed = new Discord.MessageEmbed()
 embed.setColor('#EEA81C');
 embed.setTitle("**Domain Result**");
 embed.setFooter("Domain Bot");
embed.setThumbnail('https://lh3.googleusercontent.com/OqNhnq-8y-CmnHn6LwfhWo5bmV0ydRg0yGRu_L1kbpClZg6oG3Lhe_3NYE-1hSYb5Zu_');
embed.setTimestamp();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  (async () => {
    ClientIp = (await publicIp.v4());
	console.log(ClientIp);
})();
});




client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  args = args.join(" ");

  if (command === 'check') {
    if (!args.length) {
      		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      	}
        else {
          domainList = args.split(" ");
          console.log(domainList);
          if (domainList.length > 5) {
            message.channel.send("You can not send more then 5 domains at a time!");
          }
          else {
            try {
            checkDomains();
            }
            catch {
              message.channel.send("A problem occured. Please try again!")
            }
          }






        }

  }
async function checkDomains() {







for (let i = 0; i < domainList.length; i++) {

  url = `https://api.namecheap.com/xml.response?ApiKey=${ApiKey}&ApiUser=${UserName}&ClientIp=${ClientIp}&Command=namecheap.domains.check&DomainList=${domainList[i]}&UserName=${UserName}`
    https.get(url, function(response) {


  console.log(response.statusCode);




response.on("data", function(data) {


nameInfo = xmlJs(nameInfo, data);
embed.setURL("https://www.namecheap.com/domains/registration/results/?domain=" + domainList[i]);
    try {
     if (nameInfo.ApiResponse.CommandResponse[0].DomainCheckResult[0].$.Available == "true") {
       if (nameInfo.ApiResponse.CommandResponse[0].DomainCheckResult[0].$.IsPremiumName == "true") {
         domainCost = nameInfo.ApiResponse.CommandResponse[0].DomainCheckResult[0].$.PremiumRegistrationPrice;
		 embed.addFields(
		{ name: '**Domain:** ', value: "`" + domainList[i] + "`" },
    { name: '**Status:** ', value: "✅" },
    { name: '**Price:** ', value: "`$" + parseInt(domainCost * 100)/100 + "`"},
        );
message.channel.send(embed);
embed.fields = [];


       }
       else {
         getPricing(domainList[i]);
       }
     }
     else {
       embed.addFields(
  		{ name: '**Domain:** ', value: "`" + domainList[i] + "`" },
      { name: '**Status:** ', value: "❌" },
      );
      message.channel.send(embed);
      embed.fields = [];

     }
}
catch {
  embed.addFields(
 { name: '**Domain:** ', value: "`" + domainList[i] + "`" },
 { name: '**Status:** ', value: "Invalid" },
 );
 message.channel.send(embed);
 embed.fields = [];
}




  });
  });












}
}


 function getPricing (domain) {
var domainEnding = domain.split('.')[1].toUpperCase();
url = `https://api.namecheap.com/xml.response?ApiKey=${ApiKey}&ApiUser=${UserName}&ClientIp=${ClientIp}&Command=namecheap.users.getPricing&UserName=${UserName}&ProductType=DOMAIN&ProductCategory=DOMAINS&ActionName=REGISTER&ProductName=${domainEnding}`

https.get(url, function(response) {



  response.on("data", function(data) {
pricingInfo = xmlJs(pricingInfo, data);


domainCost = pricingInfo.ApiResponse.CommandResponse[0].UserGetPricingResult[0].ProductType[0].ProductCategory[0].Product[0].Price[0].$.Price;
embed.addFields(
{ name: '**Domain:** ', value: "`" + domain + "`" },
{ name: '**Status:** ', value: "✅" },
{ name: '**Price:** ', value: "`$" + parseInt(domainCost * 100)/100 + "`"},

);
message.channel.send(embed);
embed.fields = [];
    });
    });
}



});







function xmlJs(info, data) {
  info = data.toString('utf8');
  xml2js.parseString(info, (err, result) => {
     info = JSON.stringify(result, null, 4);
     info = JSON.parse(info);
     });
     return info;

}











client.login(botToken);
