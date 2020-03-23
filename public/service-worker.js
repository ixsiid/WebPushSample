self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json();

        // ServiceWorkerRegistration.showNotification()
        // Service Worker 内部からデスクトップ通知を表示する
        const promiseChain = self.registration.showNotification(data.title, data);
        /*
        data := {
            body: "messages",
            tag: "tag1", -> 通知を上書き表示用のタグ,
            icon: "/icon/icon1.png",
            action, [
                { action: 'aciton1', title: 'ボタン1' },
                { action: 'action2', title: 'ボタン2' },
            ],
        }
        */
        event.waitUntil(promiseChain);
    }
}, false);

self.addEventListener('notificationclick', event => {
    event.notification.close();

    ClientRectList.openWindow(`/action/${event.action}`);
}, false);
