// options.js for Gaze extension
const focusChoices = [
  'docs.google.com',
  'drive.google.com',
  'classroom.google.com',
  'canvas.instructure.com',
  'notion.so'
];

const blockedChoices = [
  'youtube.com',
  'netflix.com',
  'spotify.com',
  'tiktok.com',
  'instagram.com'
];

function makeChip(text){
  const el = document.createElement('div');
  el.className = 'chip';
  el.textContent = text;
  el.addEventListener('click', ()=>{
    el.classList.toggle('active');
  });
  return el;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const focusArea = document.getElementById('focusPresets');
  const blockedArea = document.getElementById('blockedPresets');
  focusChoices.forEach(c=> focusArea.appendChild(makeChip(c)));
  blockedChoices.forEach(c=> blockedArea.appendChild(makeChip(c)));

  const usernameInput = document.getElementById('username');
  const domainsInput = document.getElementById('domains');
  const blockedInput = document.getElementById('blocked');

  chrome.storage.local.get(['gaze_username','gaze_domains','blocked_domains'], (res)=>{
    if(res.gaze_username) usernameInput.value = res.gaze_username;
    if(res.gaze_domains) domainsInput.value = (Array.isArray(res.gaze_domains)? res.gaze_domains.join(', '): res.gaze_domains);
    if(res.blocked_domains) blockedInput.value = (Array.isArray(res.blocked_domains)? res.blocked_domains.join(', '): res.blocked_domains);

    // mark preset chips active if present
    const focusArr = res.gaze_domains || [];
    const blockedArr = res.blocked_domains || [];
    Array.from(focusArea.children).forEach(chip=>{
      if(focusArr.includes(chip.textContent)) chip.classList.add('active');
    });
    Array.from(blockedArea.children).forEach(chip=>{
      if(blockedArr.includes(chip.textContent)) chip.classList.add('active');
    });
  });

  document.getElementById('save').addEventListener('click', ()=>{
    const username = usernameInput.value.trim() || 'default_user';
    // collect chips
    const selectedFocus = Array.from(document.querySelectorAll('#focusPresets .chip.active')).map(c=>c.textContent);
    const selectedBlocked = Array.from(document.querySelectorAll('#blockedPresets .chip.active')).map(c=>c.textContent);
    // custom
    const customFocus = domainsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
    const customBlocked = blockedInput.value.split(',').map(s=>s.trim()).filter(Boolean);
    const focusFinal = Array.from(new Set([...selectedFocus,...customFocus]));
    const blockedFinal = Array.from(new Set([...selectedBlocked,...customBlocked]));
    chrome.storage.local.set({gaze_username: username, gaze_domains: focusFinal, blocked_domains: blockedFinal}, ()=>{
      alert('Saved to extension storage.');
    });
  });

  document.getElementById('reset').addEventListener('click', ()=>{
    if(!confirm('Reset saved options?')) return;
    chrome.storage.local.set({gaze_username: 'default_user', gaze_domains: ['docs.google.com'], blocked_domains: []}, ()=>{
      alert('Reset. Please reload extension if needed.');
      location.reload();
    });
  });
});
