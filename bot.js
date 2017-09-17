const Discord = require("discord.js");
const mysql = require('mysql');
const client = new Discord.Client();
const config = require("./config.json");

// ==========================================================
// CONNECT MYSQL!
// ==========================================================
const connection = mysql.createConnection({
  host: '69.xx.xx.xx',
  user: 'user_xxxxxxx',
  password: 'pw_xxxx',
  database: 'dope_xxxx'
});
// ==========================================================


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setGame(`DopeHosting.net`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
    let guild = member.guild;
    guild.channels.find("name", "general").send(`Welcome To DopeHosting ${member.user} Please Take A look at #Welcome !`);
});

client.on('guildMemberRemove', member => {
    let guild = member.guild;
    guild.channels.find("name", "general").send(`R.I.P ${member.user}. !`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // ==========================================================
  // PING.
  // ==========================================================
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  // ==========================================================
  
  // ==========================================================
  // SAY SOMETHING
  // ==========================================================
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
  }
  // ==========================================================

  // ==========================================================
  // Help.
  // ==========================================================
  if(command === "help") {
    message.channel.send(
        `${message.author}` + "Available Commands |"
        + "\n" + '|~*~*~*~*~*~*~*~*~*~*~*~*~*~*~~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~|'
        + "\n" + '|~*~*~*~*~*~*~*~*~*~*~*~*~*~*~~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~|'
        + "\n" + '|!ping           - Simple ping                             ' 
        + "\n" + '|!say             - Say something                          ' 
        + "\n" + '|!cc               - Count Clients                         ' 
        + "\n" + '|!p?              - Pending Orders                         ' 
        + "\n" + '|!hosted      - Hosted Domains By DopeHosting              ' 
        + "\n" + '|!kick           - Kick Someone.                           '
        + "\n" + '|~*~*~*~*~*~*~*~*~*~*~*~*~*~*~~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~|'
        + "\n" + '|~*~*~*~*~*~*~*~*~*~*~*~*~*~*~~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~|');
  }
  // ==========================================================

  // ==========================================================
  // COUNT CLIENTS.
  // ==========================================================
  if(command === "cc") {
      message.delete().catch(O_o=>{});
      const m = await message.channel.send("Counting Clients.. Please Wait!");
      
      connection.query('SELECT * FROM tblclients', (err,rows) => {
        if(err) throw err;
        m.edit(`Total Clients : **${rows.length}**`);
       });
  }
  // ==========================================================

  // ==========================================================
  // PENDING ORDERS.
  // ==========================================================
  if(command === "p?") {
      message.delete().catch(O_o=>{});
      const m = await message.channel.send("Counting Pending Orders.. Please Wait!");
      
      connection.query('SELECT `status` FROM `tblorders` WHERE `status`="pending"', (err,rows) => {
        if(err) throw err;
        m.edit(`Pending Orders : **${rows.length}**`);
       });
  }
  // ==========================================================
    
  // ==========================================================
  // HOSTED.
  // ==========================================================
  if(command === "hosted") {
      message.delete().catch(O_o=>{});
      const m = await message.channel.send("Counting Pending Orders.. Please Wait!");
      
      connection.query('SELECT * FROM `tblhosting`', (err,rows) => {
        if(err) throw err;
        m.edit(`Hosted Domains : **${rows.length}**`);
       });
  }
  // ==========================================================
    
  // ==========================================================
  // Kick Someone !kick @user reason
  // ==========================================================
  if(command === "kick") {
    if(!message.member.roles.some(r=>["HEAD", "DEV-TEAM"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this :facepalm: !");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  }
  // ==========================================================
});

client.login(config.token);
