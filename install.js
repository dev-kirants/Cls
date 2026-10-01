/* Shows an "Install app" button when Chrome allows installing */
(function(){
  var deferred = null;
  var btn = document.createElement('button');
  btn.textContent = 'Install app';
  btn.setAttribute('aria-label','Install Attendance Ledger as an app');
  btn.style.cssText = 'display:none;position:fixed;right:16px;bottom:16px;z-index:100;padding:10px 18px;border:0;border-radius:4px;background:#7A1E2C;color:#fff;font:600 .9rem system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer;';
  document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(btn); });
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferred = e; btn.style.display = 'block';
  });
  btn.addEventListener('click', function(){
    if(!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function(){ deferred = null; btn.style.display = 'none'; });
  });
  window.addEventListener('appinstalled', function(){ btn.style.display = 'none'; });
})();
