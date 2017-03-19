const Discord = require('discord.js');
const client = new Discord.Client();

var giveawayActive;
var giveawayWinnersNum;
var giveawayRole;
var giveawayEligibleList = [];
var winnersString = "";

client.on('ready', () => {
    console.log("-----------------------");
    console.log("Giveway Bot is ready!!");
    console.log("-----------------------");
    console.log("");
});

client.on('message', message => {
    if (message.content.startsWith(".giveaway")) {
        if (message.content === ".giveaway") {
            message.channel.sendMessage("", {
                embed: {
                    description: ":white_check_mark: Giveaway Bot is up and running!",
                    color: 0x77b255
                }
            });
            console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway - Up and running.")
            return;
        }
        if (message.content.startsWith(".giveaway start")) {
            if (message.author.id === "137945048883920896" || message.author.id === "102441280612630528") {
                if (giveawayActive) {
                    message.channel.sendMessage("", {
                        embed: {
                            description: ":x: There's a giveaway already running.",
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> Already one giveaway running.");
                    return;
                }

                if (message.content.split(" ").length < 4 || message.content.split(" ").length > 4) {
                    message.channel.sendMessage("", {
                        embed: {
                            title: ":x: Giveaway Command",
                            description: "You are doing it wrong!",
                            fields: [
                                { name: "Usage:", value: "`.giveaway start [role] [number-of-winners]`", inline: true }
                            ],
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> Something wrong creating giveaway, not all params were given.")
                    return;
                }

                if (isNaN(message.content.split(" ")[3])) {
                    message.channel.sendMessage("", {
                        embed: {
                            description: ":x: Don't try to trick me, that's not a number on the last parameter!",
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> Winner's param not a number.");
                    return;
                }

                giveawayRole = message.content.split(" ")[2].toLowerCase();

                if (giveawayRole === "all") {
                    giveawayRole = "@everyone";
                }

                var roleFound;
                for (i = 0; i < message.guild.roles.array().length; i++) {
                    if (message.guild.roles.array()[i].name.toLowerCase().replace(/ /g, '') === giveawayRole) {
                        roleFound = true;
                    }
                }

                if (!roleFound) {
                    message.channel.sendMessage("", {
                        embed: {
                            description: ":x: That role doesn't exist. If you wish to everyone to enter, use `all`.",
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> Role not found.");
                    return;
                }

                giveawayActive = true;
                giveawayWinnersNum = parseFloat(message.content.split(" ")[3]);

                message.channel.sendMessage("", {
                    embed: {
                        title: ":white_check_mark: Giveaway Started!",
                        description: "\u200B\nA giveaway has been started. Good luck!",
                        fields: [
                            { name: "Join:", value: "`.giveaway enter`", inline: true }
                        ],
                        color: 0x77b255
                    }
                });

                console.log(">> Giveaway started! " + giveawayWinnersNum + " winner's.")
            } else {
                message.channel.sendMessage("", {
                    embed: {
                        description: ":x: Sorry, you do not have the permission to start giveaways.",
                        color: 0xdd2e44
                    }
                });
                console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway start : No permission.");
                return;
            }
        }

        if (message.content === ".giveaway enter") {
            if (!giveawayActive) {
                message.channel.sendMessage("", {
                    embed: {
                        description: ":x: There's not a giveaway running.",
                        color: 0xdd2e44
                    }
                });
                console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway enter : There's no running giveaway.");
                return;
            } else {
                var roleFoundEnter;
                for (m = 0; m < message.member.roles.array().length; m++) {
                    if (message.member.roles.array()[m].name.toLowerCase().replace(/ /g, '') === giveawayRole) {
                        roleFoundEnter = true;
                    }
                }

                if (!roleFoundEnter) {
                    message.channel.sendMessage("", {
                        embed: {
                            description: ":x: Sorry, you do not have the **" + giveawayRole + "** role necessary to enter.",
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway enter : User does not have the role.");
                    return;
                }

                for (k = 0; k < giveawayEligibleList.length; k++) {
                    if (giveawayEligibleList[k].username + "#" + giveawayEligibleList[k].discriminator === message.author.username + "#" + message.author.discriminator) {
                        message.channel.sendMessage("", {
                            embed: {
                                description: ":white_check_mark: **" + message.author.username + "**, it's seems you **already entered** the giveaway.",
                                color: 0x77b255
                            }
                        });
                        console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway enter : Entered the giveway sucessfully.");
                        return;
                    }
                }

                giveawayEligibleList.push(message.author)

                message.channel.sendMessage("", {
                    embed: {
                        description: ":white_check_mark: **" + message.author.username + "**, you have entered the giveaway. Good luck!",
                        color: 0x77b255
                    }
                });
                console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway enter : Entered the giveway sucessfully.");
            }
        }

        if (message.content === ".giveaway end") {
            if (message.author.id === "137945048883920896" || message.author.id === "102441280612630528") {
                if (!giveawayActive) {
                    message.channel.sendMessage("", {
                        embed: {
                            description: ":x: There's no giveaway running!",
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway ed : No giveaway running.");
                } else if (giveawayEligibleList.length < giveawayWinnersNum) {
                    //not enough entered to pick specified number of winners
                    message.channel.sendMessage("", {
                        embed: {
                            description: ":x: Not enough people entered the giveaway to select **" + giveawayWinnersNum + "** winner/s.",
                            color: 0xdd2e44
                        }
                    });
                    console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway enter : Not enough people to raffle " + giveawayWinnersNum + " winners.");
                } else {
                    for (e = 0; e < giveawayWinnersNum; e++) {
                        var index = Math.floor(Math.random() * giveawayEligibleList.length);
                        var pickedWinner = giveawayEligibleList[index];
                        giveawayEligibleList.splice(index, 1);

                        winnersString += (e + 1) + ". - " + pickedWinner.toString() + "\n";
                    }

                    message.channel.sendMessage("", {
                        embed: {
                            title: ":white_check_mark: Giveaway Results!",
                            fields: [
                                { name: "The winner/s:", value: winnersString, inline: true }
                            ],
                            color: 0x77b255
                        }
                    });

                    winnersString = "";
                    giveawayActive = false;
                    giveawayEligibleList = [];

                    console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway end: Giveaway ended.");
                }

            } else {
                message.channel.sendMessage("", {
                    embed: {
                        description: ":x: Sorry, you do not have the permission to end giveaways.",
                        color: 0xdd2e44
                    }
                });
                console.log(">> " + message.author.username + "#" + message.author.discriminator + ": .giveaway end : No permission.");
                return;
            }
        }
    }
});

client.login('TOKEN HERE');
