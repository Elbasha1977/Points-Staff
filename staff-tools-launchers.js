(function(){
 "use strict";
 const STYLE="points-staff-tools-launchers-style";
 const IDS=["points-staff-live-worksheets","points-staff-homework-cert-verify"];
 function addStyle(){
  if(document.getElementById(STYLE))return;
  const s=document.createElement("style");s.id=STYLE;
  s.textContent=".points-staff-tools-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;width:100%;margin:12px auto}.points-staff-tool-link{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 20px;border:0;border-radius:13px;color:#fff!important;text-decoration:none!important;font:900 15px Tahoma,Arial,sans-serif;box-shadow:0 5px 15px #0002;cursor:pointer}.points-staff-tool-link:hover{filter:brightness(1.06);transform:translateY(-1px)}";
  document.head.appendChild(s);
 }
 function loggedIn(){
  try{return !!(window.firebase&&firebase.auth&&firebase.auth().currentUser)}catch(_){return false}
 }
 function install(){
  if(!loggedIn())return false;
  const host=document.querySelector("#mainApp .buttons-grid")||document.querySelector(".buttons-grid")||document.querySelector(".header-buttons")||document.querySelector("#mainApp");
  if(!host)return false;
  addStyle();
  let row=document.getElementById("points-staff-tools-row");
  if(!row){row=document.createElement("div");row.id="points-staff-tools-row";row.className="points-staff-tools-row";host.appendChild(row);}
  if(!document.getElementById(IDS[0])){
   const a=document.createElement("a");a.id=IDS[0];a.className="points-staff-tool-link";a.href="https://points.abuhazem.com/?openLiveWorksheets=1";a.target="_blank";a.rel="noopener";a.style.background="linear-gradient(135deg,#8b5cf6,#6d28d9)";a.textContent="📝 Live Worksheets";a.title="فتح إدارة أوراق العمل التفاعلية";row.appendChild(a);
  }
  if(!document.getElementById(IDS[1])){
   const a=document.createElement("a");a.id=IDS[1];a.className="points-staff-tool-link";a.href="./homework-certificate-verify.html";a.style.background="linear-gradient(135deg,#7c3aed,#db2777)";a.textContent="🔎 التحقق من الشهادات";a.title="التحقق من صحة شهادات الواجبات المنزلية";row.appendChild(a);
  }
  return true;
 }
 function start(){
  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>=80)clearInterval(timer)},500);
  try{
   if(window.firebase&&firebase.auth)firebase.auth().onAuthStateChanged(()=>{install();});
  }catch(_){}
  const observer=new MutationObserver(()=>install());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),60000);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();