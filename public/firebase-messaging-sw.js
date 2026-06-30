importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

// Config hardcoded here (NEXT_PUBLIC_ keys are safe to be public)
const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyA0iqGS04NPAEqpvqmeWwMMT66ov0qr7i8',
  authDomain:        'qitt-e87a1.firebaseapp.com',
  projectId:         'qitt-e87a1',
  storageBucket:     'qitt-e87a1.firebasestorage.app',
  messagingSenderId: '935131186150',
  appId:             '1:935131186150:web:f534f8e23ceede70b74c27',
}

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

self.addEventListener('install',  () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notification = payload.notification ?? {}
  const data         = payload.data         ?? {}

  self.registration.showNotification(notification.title ?? 'Qitt', {
    body:     notification.body ?? '',
    icon:     notification.icon ?? '/favicon_io/android-chrome-192x192.png',
    badge:    '/favicon_io/favicon-32x32.png',
    tag:      data.type ?? 'qitt',
    renotify: false,
    data,
  })
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/student/home'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      const match = wins.find(w => w.url.includes(self.location.origin))
      if (match) return match.focus().then(w => w.navigate(url))
      return self.clients.openWindow(url)
    })
  )
})
