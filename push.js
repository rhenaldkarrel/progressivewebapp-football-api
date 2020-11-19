const webPush = require("web-push");

const vapidKeys = {
    publicKey : "BEICJq8fsb9RV1Yc3aGsUWx8prfzY4QV3J3_PHMfd0WEzv8DoiA5woxzPUUzjB985r2B4MKhrraqvCeILmDcVjE",
    privateKey : "_zihRlWd-LNNkz4XCzd7Qq9QIiuKvQKh3eIQiV3IvSQ"
}
const subscription = {
    endpoint : "https://fcm.googleapis.com/fcm/send/fC98no6gezw:APA91bGIxc8BNgr64W6zFY2ow-2Tq3Um4lK2ur2eYpDngvaVEA-y138TvVUnPm5k7FaY-oFOfFPNe467rgRcmMURACdVDJBixdPQe_RyAtkmXw_Y-lat65AobalMXT9IS3_M1mATZ--U",
    keys : {
        p256dh : "BIQ63sGvL5eo/WyVQCzGxe1swDgdnmToPbX/HHyApFTFytu9cwV8mLYuNoi/fMeYYAMFp0Lrwpn4eA6iU9SYiCs=",
        auth : "4GtCw5OX6W1iYtUP7RyjQg=="
    }
}
const options = {
    gcmAPIKey : "840436468817",
    TTL : 60
}
webPush.setVapidDetails('mailto:renaldkarrel@gmail.com',vapidKeys.publicKey,vapidKeys.privateKey)

let payloads = "Selamat! push notification & subscription berhasil digunakan."

webPush.sendNotification(
    subscription,
    payloads,
    options
)