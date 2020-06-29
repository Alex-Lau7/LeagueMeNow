
const Discord = require('discord.js');
const bot = new Discord.Client();
const puppeteer = require('puppeteer');
const token = 'Njg5MjQ1NDgzNjYyNzA0Njgx.XnAUvQ.vdnzIZsVTS_XqX7qd-NnzkUv5ck';
const fs = require('fs');
let error = true;
const PREFIX = '!';

bot.on('ready', () => {
    console.log("bot is online");
})

// bot.on('message' , msg => {
//     let args = msg.content.substring(PREFIX.length).split(" "); //substring(length) = 
//     //turns args into an array so that we can select parts of command and identify what the user wants
//     //ex !champ Sion runes => [!champ,Sion,runes]       args[0] = !champ, args[1] = Sion, args[2] = runes
// })

bot.on('message', async message => {
    let args = message.content.substring(PREFIX.length).split(" ");
    //console.log(args);
    switch(args[0]) {
        case "champ":
            if(args[1] != null) {
                //embed a link to the champion.gg page
                var url = "https://champion.gg/champion/" + args[1];
                //imageLogger(img);
                console.log("check");
                const link = new Discord.MessageEmbed() 
                    .setColor("0x0000ff")
                    //.setTitle("Click this link to view " + args[1])
                    //.setURL("https://champion.gg/champion/" + args[1])
                    .setDescription("Waiting for your champion data to load...")
                    //.attachFiles(["./example.jpeg"])
                    //.setImage("attachment://example.jpeg")
                message.channel.send(link).then(async(link) => {
                    const img = await scrapeProduct(url);
                    if(error == true) {
                        console.log(error);
                        const noChampion = new Discord.MessageEmbed()
                        .setColor("0xff0000")
                        .setTitle("Sorry :(")
                        .setDescription("We couldn't find " + args[1] +" in the champion pool. Try a different champion.")
                        message.channel.send(noChampion).then(() => {
                            link.delete();
                        })
                    }
                    else {
                        const link2 = new Discord.MessageEmbed()
                            .setColor("0x00ff00")
                            .setTitle("Click this link to view " + args[1])
                            .setURL("https://champion.gg/champion/" + args[1])
                            .setDescription("You searched for " + args[1])
                            .attachFiles(["./runes1.jpeg"])
                            .setImage("attachment://runes1.jpeg")
                        const link3 = new Discord.MessageEmbed()
                            .setColor("0x00ff00")
                            .attachFiles(["./runes11.jpeg"])
                            .setImage("attachment://runes11.jpeg")
                        //const skill1 = new Discord.MessageEmbed()
                        //    .setColor("0x00ff00")
                        //    .attachFiles(["./skills1.jpeg"])
                        //    .setImage("attachment://skills1.jpeg")
                        message.channel.send(link2).then(() => {
                            message.channel.send(link3);
                            //message.channel.send(skill1);
                            link.delete();
                        })
                    }
                })
            }
            else
                message.reply("Please use !champ with a League of Legends Champion")
            break;
        case null:
            message.reply("Please enter a valid command")
    }
})

const scrapeProduct = async(url) => {
    error = false;
    console.log(error);
    const browser = await puppeteer.launch({headless:true, timeout: 0});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil:'networkidle2'}); 
    const rect = await page.evaluate(() => {
        const element = document.querySelector('#app');
        console.log(element);
        if(element == null) {
            return null;
        }
        else {
            const {x,y,width,height} = element.getBoundingClientRect();
            console.log("beans");
            console.log({x,y,width,height});
            return {left: x, top: y, width, height};
        }
    });
    //page.setViewport({width: rect.x, height: rect.y, deviceScaleFactor: 2});
    if(rect == null) {
        await browser.close();
    }
    else {
        const shot1 = await page.screenshot({path: 'runes1.jpeg', type:"jpeg",
        clip: {
            x: rect.left+10,
            y: rect.top+5,
            width: rect.width/2,
            height: rect.height/2
        }
        });

        const shot2 = await page.screenshot({path:'runes11.jpeg', type:'jpeg',
        clip: {
            x: rect.left+10,
            y: rect.top+(rect.height/2)+2,
            width: rect.width/2,
            height: rect.height/2,
        }
        })
        /*
        await page.goto(url, {waitUntil:'networkidle2'}); 
        const skill = await page.evaluate(() => {
            const element = document.querySelector('.skill-order clearfix')
            const {x,y,width,height} = element.getBoundingClientRect();
            console.log({x,y,width,height});
            return {left: x, top: y, width, height};
        })
    
        const skillorder = await page.screenshot({path: 'skills1.jpeg', type:'jpeg',
        clip: {
            x: skill.left,
            y: skill.top,
            width: skill.width,
            height: skill.height
        }
        });
        */
    
        await browser.close();
    }
    }


bot.login(token);

