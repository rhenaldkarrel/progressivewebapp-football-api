// service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./service-worker.js').then(function () {
            console.log('service worker: pendaftaran berhasil')
        }).catch(function () {
            console.log('service worker: pendaftaran gagal');
        })
    })
} else {
    console.log('service worker: browser tidak mendukung service worker');
}

// notification API
if ('Notification' in window) {
    Notification.requestPermission().then( perm => {
        if (perm == 'denied') {
            return
        }else if(perm == 'default'){
            return
        }
    })
}

// push notification API
navigator.serviceWorker.ready.then(() => {
if ('PushManager' in window) {
    navigator.serviceWorker.getRegistration().then(function (regis) {
        regis.pushManager.subscribe({
            userVisibleOnly : true,
            applicationServerKey : urlBase64ToUint8Array("BEICJq8fsb9RV1Yc3aGsUWx8prfzY4QV3J3_PHMfd0WEzv8DoiA5woxzPUUzjB985r2B4MKhrraqvCeILmDcVjE")
        }).then(subscribe=>{
            console.log('Berhasil melakukan subscribe dengan endpoint : ',subscribe.endpoint);
            console.log('Berhasil melakukan subscribe dengan p265dh key : ',btoa(String.fromCharCode.apply(null,new Uint8Array(subscribe.getKey('p256dh')))));
            console.log('Berhasil melakukan subscribe dengan auth key : ',btoa(String.fromCharCode.apply(null,new Uint8Array(subscribe.getKey('auth')))));
        }).catch( err => {
            console.log('subscription error : ' +err.message)
        })
    }).catch(e => {
        console.log('push manager error : '+ e);
    })
}
})

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}