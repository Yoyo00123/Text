name: "addmc",
aliases: [+mc],
author: "Nahid Bro",
onStart: async function ({ message, args, event, usersData }) {
    const senderID = event.senderID;

    // ================= SUPER ADMIN CHECK =================
    if (!config.superAdmin || !config.superAdmin.includes(senderID)) {
        return message.reply("⛔ | Only Super Admin can use this command!");
    }

    let uids = [];

    // Mention
    if (Object.keys(event.mentions).length)
        uids = Object.keys(event.mentions);

    // Reply
    else if (event.type === "message_reply")
        uids = [event.messageReply.senderID];

    // UID
    else
        uids = args.filter(a => !isNaN(a));

    if (!uids.length)
        return message.reply("⚠️ | Tag / reply / UID needed.");

    const newAdmins = [];
    const alreadyAdmins = [];

    for (const uid of uids) {
        if (config.adminBot.includes(uid))
            alreadyAdmins.push(uid);
        else
            newAdmins.push(uid);
    }

    config.adminBot.push(...newAdmins);
    writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

    const newNames = await Promise.all(newAdmins.map(uid => usersData.getName(uid)));
    const oldNames = await Promise.all(alreadyAdmins.map(uid => usersData.getName(uid)));

    return message.reply(
        (newNames.length ?
        `👑 𝗦𝗨𝗣𝗘𝗥 𝗔𝗗𝗠𝗜𝗡 𝗔𝗗𝗗𝗘𝗗:\n━━━━━━━━━━━━━━━━\n${newNames.map(n => `• ${n}`).join("\n")}\n━━━━━━━━━━━━━━━━`
        : "") +

        (alreadyAdmins.length ?
        `\n⚠️ 𝗔𝗹𝗿𝗲𝗮𝗱𝘆 𝗔𝗱𝗺𝗶𝗻:\n━━━━━━━━━━━━━━━━\n${oldNames.map(n => `• ${n}`).join("\n")}\n━━━━━━━━━━━━━━━━`
        : "")
    );
}
