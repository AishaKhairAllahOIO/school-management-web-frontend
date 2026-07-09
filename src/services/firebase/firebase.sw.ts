export async function registerFirebaseServiceWorker() 
{
  if (!("serviceWorker" in navigator)) return;

  await navigator.serviceWorker.register("/firebase-messaging-sw.js");
}