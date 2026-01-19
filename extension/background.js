// background.js - final
let lastTabId = null;
let lastUrl = null;
let lastNotified = 0;
const SERVER_URL = "http://127.0.0.1:5000/log_tab";

// keepalive to prevent quick termination (helps notifications)
setInterval(()=> chrome.runtime.getPlatformInfo(()=>{}), 20000);

async function sendEvent(eventType, url){
  try{
    const res = await chrome.storage.local.get(['gaze_username','gaze_domains','blocked_domains']);
    const user = res.gaze_username || 'default_user';
    const domains = res.gaze_domains || [];
    const blocked = res.blocked_domains || [];
    const payload = { event: eventType, url, username: user, focus_domains: domains, blocked_domains: blocked };
    console.log('[Gaze] POST', payload);
    await fetch(SERVER_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  }catch(e){ console.error('[Gaze] sendEvent error', e); }
}

function notify(message){
  if(Date.now() - lastNotified < 3000) return;
  const icon = chrome.runtime.getURL('icons/bell.png');
  chrome.notifications.create('gaze_'+Date.now(), { type:'basic', iconUrl: icon, title:'Gaze', message }, ()=>{});
  lastNotified = Date.now();
}

chrome.tabs.onActivated.addListener(async (info)=>{
  try{
    const tab = await chrome.tabs.get(info.tabId);
    if(!tab || !tab.url) return;

    // check blocked domains quickly
    const st = await chrome.storage.local.get(['blocked_domains']);
    const blocked = st.blocked_domains || [];
    for(const b of blocked){
      if(b && tab.url.includes(b)){
        // blocked site opened
        sendEvent('blocked_site', tab.url);
        notify('Blocked site opened — focus back!');
        break;
      }
    }

    if(lastTabId && lastTabId !== tab.id){
      console.log('[Gaze] Tab switch', tab.url);
      sendEvent('tab_switch', tab.url);
      notify('You switched tabs');
    }
    lastTabId = tab.id;
    lastUrl = tab.url;
  }catch(e){ console.error(e); }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
  if(changeInfo.status === 'complete' && tab.active){
    sendEvent('tab_focus', tab.url);
  }
});

chrome.runtime.onInstalled.addListener(()=> {
  chrome.storage.local.get(['gaze_domains','gaze_username','blocked_domains'], (res)=>{
    if(!res.gaze_domains) chrome.storage.local.set({gaze_domains: ['docs.google.com']});
    if(!res.gaze_username) chrome.storage.local.set({gaze_username: 'default_user'});
    if(!res.blocked_domains) chrome.storage.local.set({blocked_domains: ['youtube.com']});
  });
});
