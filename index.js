var discord = require("discord.js");
var request = require("request-promise");
require("dotenv").config();

let token = process.env["TOKEN"];

let episodes = [
    new Date("2022-07-03T00:00:00"),
    new Date("2022-07-10T00:00:00"),
    new Date("2022-07-17T00:00:00"),
    new Date("2022-07-24T00:00:00"),
    new Date("2022-07-31T00:00:00"),
    new Date("2022-08-07T00:00:00"),
    new Date("2022-08-14T00:00:00"),
    new Date("2022-08-21T00:00:00"),
    new Date("2022-08-28T00:00:00"),
    new Date("2022-09-04T00:00:00"),
    new Date("2022-09-11T00:00:00"),
    new Date("2022-09-18T00:00:00"),
    new Date("2022-09-25T00:00:00"),
];

let texts = require("./text");

async function run() {
    while (true) {
        if (textIndex == 0) {
            texts = texts.sort(() => {
                return Math.random() - 0.5
            });
        }
        let custom_status = getText();
        let res = await request.patch("https://discord.com/api/v9/users/@me/settings", {
            headers: {
                "authorization": token,
                "origin": "https://discord.com",
                "referer": "https://discord.com/channels/@me",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja-JP;q=0.6,ja;q=0.5,ko-KR;q=0.4,ko;q=0.3",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                "x-debug-options": "bugReporterEnabled",
                "x-discord-locale": "zh-TW",
                "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6InpoLVRXIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMy4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTAzLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL3d3dy55b3V0dWJlLmNvbS8iLCJyZWZlcnJpbmdfZG9tYWluIjoid3d3LnlvdXR1YmUuY29tIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEzODI1NCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
            },
            json: { "custom_status": { "text": custom_status } }
        })
        console.log(custom_status);
        await delay(2500)
    }
}

let textIndex = 0;

function getText() {
    let e = null;
    let now = Date.now();
    for (let episode of episodes) {
        if (episode.getTime() < now) {
            continue;
        }

        e = episode;
        break;
    }

    if (!e) {
        return "沒有解藥的Lycoris中毒患者"
    }

    let d = Math.round((e.getTime() - now) / 1000);
    let day = parseInt(d / (60 * 60 * 24));
    let hour = parseInt(d % (60 * 60 * 24) / (60 * 60));
    let minute = parseInt(d % (60 * 60) / (60));
    let second = parseInt(d % 60);

    let total_hour = parseInt(d / 3600);
    let total_second = d;

    for (let t of texts) {
        let match = true;
        for (let r of t.rule) {
            match = match && eval(r);
        }
        t.match = match;
    }

    let text = null;
    while (true) {
        textIndex++;
        if (!texts[textIndex]) {
            textIndex = 0;
        }
        if (!texts[textIndex].match) {
            continue;
        }

        text = texts[textIndex];
        break;
    }

    let a = text.text;
    a = a.replace(/%(f-)?day%/, f.bind(day));
    a = a.replace(/%(f-)?hour%/, f.bind(hour));
    a = a.replace(/%(f-)?minute%/, f.bind(minute));
    a = a.replace(/%(f-)?second%/, f.bind(second));
    a = a.replace(/%total_hour%/, total_hour);
    a = a.replace(/%total_second%/, total_second);

    return a;
}

function f(...a) {
    if (a[1] == "f-") {
        return ("0" + this).slice(-2);
    }
    return this;
}

function delay(time) {
    return new Promise((a) => {
        setTimeout(a, time)
    });
}

run();