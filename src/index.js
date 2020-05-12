import { publish, subscribe } from './scripts/pubsub';
import './components/reload-banner'; 
import './components/example-content'; 

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('SW: controllerchange');
      publish('NEW_SW_CONTROLLING');
    });
    navigator.serviceWorker.addEventListener('message', event => {
      if(event.data.offline) publish('SITE_OFFLINE');
      if(event.data.online) publish('SITE_ONLINE');
    });
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

const makeOffline = () => {
  document.body.classList.add('offline'); 
};
const makeOnline = () => {
  document.body.classList.remove('offline'); 
};


// Do offline stuff
if (navigator.onLine === false) { 
  makeOffline();
}

subscribe('SITE_OFFLINE', makeOffline);
subscribe('SITE_ONLINE', makeOnline);