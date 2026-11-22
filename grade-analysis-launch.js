(function(){
  "use strict";
  const STYLE_ID="points-grade-analysis-launch-style";
  const LINK_ID="points-grade-analysis-launch";
  const DIAG_ID="points-grade-analysis-diagnostic";
  window.__pointsGradeAnalysisLauncherLoaded=true;
  const VISIBILITY_HINTS={
    gradeAnalysis:{href:["grade-analysis.html"],text:["تحليل درجات الطلاب"]},
    dailyChallenge:{href:["daily-challenge.html"],text:["تحدي اليوم","التحدي اليومي"]},
    questionHunter:{href:["question-hunter.html"],text:["صائد الأسئلة"]},
    homeworkHonorBoard:{text:["لوحة الشرف في واجبات النقاط المنزلية"]},
    studentHomeworkResults:{text:["عرض نتائج نقاط واجباتي"]}
  };
  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement("style");style.id=STYLE_ID;
    style.textContent="#"+LINK_ID+"{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 18px;border:0;border-radius:14px;background:linear-gradient(135deg,#0f3e66,#1976d2);color:#fff!important;text-decoration:none!important;font-family:Tahoma,Arial,sans-serif;font-size:15px;font-weight:900;box-shadow:0 6px 18px rgba(15,62,102,.25);cursor:pointer;transition:transform .2s,box-shadow .2s;white-space:nowrap}"+
      "#"+LINK_ID+":hover{transform:translateY(-2px);box-shadow:0 9px 22px rgba(15,62,102,.32)}"+
      "#"+LINK_ID+" .ga-icon{font-size:22px}"+
      "#"+LINK_ID+".ga-dashboard{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:48px;padding:12px 20px;border:0;border-radius:14px;background:linear-gradient(135deg,#0f3e66,#1976d2);color:#fff!important;text-decoration:none!important;font-family:Tahoma,Arial,sans-serif;font-size:15px;font-weight:900;box-shadow:0 6px 18px rgba(15,62,102,.20);cursor:pointer;white-space:nowrap;margin:6px auto}"+
      ".ga-launch-row{display:flex;justify-content:center;align-items:center;width:100%;margin:14px auto 4px}"+
      "#"+DIAG_ID+"{position:fixed;z-index:2147483647;right:12px;left:12px;bottom:12px;max-width:760px;margin:0 auto;padding:14px 16px;border:2px solid #d97706;border-radius:12px;background:#fff7ed;color:#7c2d12;font:14px/1.8 Tahoma,Arial,sans-serif;text-align:right;white-space:normal;box-shadow:0 8px 30px rgba(0,0,0,.22)}"+
      "#"+DIAG_ID+" strong{display:block;margin-bottom:4px}";
    document.head.appendChild(style);
  }
  let analysisFeatureAllowed=false;
  function createButton(){
    if(!analysisFeatureAllowed || !window.firebase || !firebase.auth || !firebase.auth().currentUser)return;
    const isVisible=el=>{
      if(!el)return false;
      const cs=getComputedStyle(el);
      return cs.display!=="none"&&cs.visibility!=="hidden"&&Number(cs.opacity||1)>0&&el.getClientRects().length>0;
    };
    // حالة Firebase Auth هي الحاجز الوحيد: لا نظهر الزر قبل تسجيل الدخول.
    // لا نمنع إنشاءه بسبب طبقة تمهيدية قد تبقى ظاهرة بعد اكتمال الدخول.
    const candidates=[
      document.querySelector(".header-buttons"),
      document.querySelector("#mainApp .buttons-grid"),
      document.querySelector(".buttons-grid"),
      document.querySelector("#mainApp")
    ];
    // لا نضع الزر داخل #mainApp إذا كان مخفيًا؛ استخدم body كمسار احتياطي مرئي.
    const host=candidates.find(el=>isVisible(el)) || document.body;
    if(!host)return;
    installStyle();
    let row=document.getElementById(LINK_ID+"-row");
    let link=document.getElementById(LINK_ID);
    if(!row){
      row=document.createElement("div");
      row.className="ga-launch-row";
      row.id=LINK_ID+"-row";
    }
    if(!link){
      link=document.createElement("a");
      link.id=LINK_ID;
      link.href="./grade-analysis.html";
      link.target="_blank";
      link.rel="noopener";
      link.setAttribute("aria-label","فتح تحليل درجات الطلاب");
      link.title="تحليل درجات الطلاب";
      link.innerHTML='<span class="ga-icon">📊</span><span>تحليل درجات الطلاب</span>';
      link.className="ga-dashboard";
      row.appendChild(link);
    }
    if(row.parentElement!==host)host.appendChild(row);
  }
  function removeButton(){document.getElementById(LINK_ID+"-row")?.remove();document.getElementById(LINK_ID)?.remove();}
  function removeDiagnostic(){document.getElementById(DIAG_ID)?.remove();}
  function showDiagnostic(error,attempt=0){
    if(!firebase.auth().currentUser)return;
    const isVisible=el=>!!el&&getComputedStyle(el).display!=="none"&&getComputedStyle(el).visibility!=="hidden"&&el.getClientRects().length>0;
    // التشخيص لا يتوقف بسبب طبقات الدخول/الترحيب؛ وجود مستخدم موثق تحقق أعلاه.
    const host=[document.querySelector(".header-buttons"),document.querySelector("#mainApp .buttons-grid"),document.querySelector(".buttons-grid"),document.querySelector("#mainApp")].find(isVisible) || document.body;
    if(!host)return;
    installStyle();
    let panel=document.getElementById(DIAG_ID);
    if(!panel){panel=document.createElement("div");panel.id=DIAG_ID;panel.setAttribute("role","status");}
    const code=String(error?.code||"").replace(/^functions\//,"");
    const message=String(error?.message||"لم يُرجع الخادم تفاصيل إضافية.").slice(0,260);
    panel.innerHTML="";
    const heading=document.createElement("strong");heading.textContent="تعذر إظهار أيقونة تحليل الدرجات";
    const detail=document.createElement("div");detail.textContent=(code?"رمز الخطأ: "+code+" — ":"")+message;
    const note=document.createElement("div");note.textContent="الباقة PRO يفترض أن تدعم الميزة. أرسل صورة هذه الرسالة لتحديد إعداد الحساب أو الترخيص الذي يحتاج إلى تصحيح.";
    panel.append(heading,detail,note);
    if(panel.parentElement!==host)host.appendChild(panel);
  }
  function hideAllOptionalFeatureLaunchers(){
    const keys=new Set(Object.keys(VISIBILITY_HINTS));
    document.querySelectorAll("[data-feature]").forEach(el=>{
      const key=String(el.dataset?.feature||"").trim();
      if(key&&!key.startsWith("menu"))keys.add(key);
    });
    keys.forEach(key=>applyFeatureLauncherVisibility(key,false));
  }
  async function featureEnabled(featureKey){
    // استخدم نفس مصدر الصلاحيات المعتمد في نسخة المدير.
    // لا نعتمد على features داخل checkAppLicense؛ فهذا كتالوج ترخيص التطبيق
    // وقد لا يحتوي مفاتيح الميزات الإضافية مثل gradeAnalysis.
    const check=firebase.app().functions("us-central1").httpsCallable("checkCustomerFeature");
    const response=await check({feature:featureKey});
    return response.data?.success===true && response.data?.allowed===true;
  }
  function applyFeatureLauncherVisibility(featureKey,enabled){
    const hints=VISIBILITY_HINTS[featureKey]||null;
    const selector='a,button,[role="button"],[onclick],.menu-item,.menu-button,[data-feature]';
    document.querySelectorAll(selector).forEach(el=>{
      if(el.id===LINK_ID)return;
      const href=String(el.getAttribute("href")||"").toLowerCase();
      const text=String(el.innerText||el.textContent||"").replace(/\s+/g," ").trim();
      const dataMatch=String(el.dataset?.feature||"")===featureKey;
      const linkMatch=!!hints && hints.href.some(x=>href.includes(x));
      const textMatch=!!hints && text.length>0 && text.length<=90 && hints.text.some(x=>text.includes(x));
      const matches=dataMatch||linkMatch||textMatch;
      if(!matches)return;
      if(!enabled){
        if(el.dataset.pointsFeatureOriginalDisplay===undefined){
          el.dataset.pointsFeatureOriginalDisplay=el.style.display||"";
        }
        el.dataset.pointsFeatureHidden=featureKey;
        el.style.display="none";
        el.setAttribute("aria-hidden","true");
      }else if(el.dataset.pointsFeatureHidden===featureKey){
        el.style.display=el.dataset.pointsFeatureOriginalDisplay||"";
        delete el.dataset.pointsFeatureHidden;
        delete el.dataset.pointsFeatureOriginalDisplay;
        el.removeAttribute("aria-hidden");
      }
    });
  }
  const registeredFeatureKeys=new Set();
  async function syncNewUiFeatureCatalog(isGlobalAdmin){
    if(!isGlobalAdmin)return;
    const pending=new Map();
    document.querySelectorAll("[data-feature]").forEach(el=>{
      const key=String(el.dataset?.feature||"").trim();
      if(!key||key.startsWith("menu")||registeredFeatureKeys.has(key))return;
      if(!/^[a-zA-Z][a-zA-Z0-9_]{1,49}$/.test(key))return;
      const label=String(el.dataset?.featureLabel||el.getAttribute("aria-label")||el.getAttribute("title")||el.innerText||el.textContent||key).replace(/\s+/g," ").trim().slice(0,100)||key;
      const category=String(el.dataset?.featureCategory||"ميزات إضافية").replace(/\s+/g," ").trim().slice(0,80);
      const description=String(el.dataset?.featureDescription||"").replace(/\s+/g," ").trim().slice(0,300);
      if(!pending.has(key))pending.set(key,{key,label,category,description});
    });
    const items=Array.from(pending.values());
    if(!items.length)return;
    const sync=firebase.app().functions("us-central1").httpsCallable("syncUiFeatureCatalog");
    for(let i=0;i<items.length;i+=100){
      const batch=items.slice(i,i+100);
      try{
        const response=await sync({features:batch});
        if(response.data?.success!==true)throw new Error("Feature catalog synchronization was not confirmed.");
        batch.forEach(item=>registeredFeatureKeys.add(item.key));
      }catch(error){
        console.warn("POINTS automatic feature registration failed:",error);
        break;
      }
    }
  }
  async function syncFeatureLaunchers(isGlobalAdmin){
    await syncNewUiFeatureCatalog(isGlobalAdmin);
    const keySet=new Set(Object.keys(VISIBILITY_HINTS));
    // اكتشاف تلقائي لمفاتيح الواجهات الجديدة؛ مفاتيح menu* تُدار في آلية قائمة الموظفين الحالية.
    document.querySelectorAll("[data-feature]").forEach(el=>{
      const key=String(el.dataset?.feature||"").trim();
      if(key && !key.startsWith("menu"))keySet.add(key);
    });
    const keys=Array.from(keySet);
    const checks=await Promise.all(keys.map(async key=>{
      try{return [key,await featureEnabled(key)];}
      catch(error){console.warn("POINTS feature check failed:",key,error);return [key,false];}
    }));
    checks.forEach(([key,enabled])=>{
      applyFeatureLauncherVisibility(key,enabled);
      if(key==="gradeAnalysis"){
        analysisFeatureAllowed=enabled===true;
        if(enabled)createButton();
        else removeButton();
      }
    });
  }
  function boot(){
    if(!window.firebase||!firebase.apps||!firebase.apps.length||!firebase.auth||!firebase.firestore){
      setTimeout(boot,300);return;
    }
    let uiObserver=null;
    let syncTimer=null;
    let currentUserId=null;
    const scheduleButtonRetry=()=>{
      clearTimeout(syncTimer);
      syncTimer=setTimeout(()=>{
        const activeUser=firebase.auth().currentUser;
        if(!activeUser||activeUser.uid!==currentUserId){removeButton();return;}
        createButton();
      },250);
    };
    firebase.auth().onAuthStateChanged(async user=>{
      analysisFeatureAllowed=false;
      currentUserId=user?.uid||null;
      removeButton();
      removeDiagnostic();
      if(uiObserver){uiObserver.disconnect();uiObserver=null;}
      if(!user)return;
      if(document.body&&window.MutationObserver){
        uiObserver=new MutationObserver(scheduleButtonRetry);
        uiObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class"]});
      }
      try{
        const allowed=await featureEnabled("gradeAnalysis");
        if(!firebase.auth().currentUser||firebase.auth().currentUser.uid!==user.uid)return;
        analysisFeatureAllowed=allowed===true;
        if(analysisFeatureAllowed){removeDiagnostic();createButton();}
        else {removeButton();showDiagnostic(new Error("الخادم لم يمنح صلاحية gradeAnalysis لهذا الحساب رغم تسجيل الدخول."));}
        let isGlobalAdmin=false;
        try{
          const snap=await firebase.firestore().collection("users").doc(user.uid).get();
          const profile=snap.exists?(snap.data()||{}):{};
          isGlobalAdmin=profile.role==="admin";
        }catch(profileError){
          console.warn("POINTS optional profile read failed:",profileError);
        }
        if(isGlobalAdmin)await syncNewUiFeatureCatalog(true);
        await syncFeatureLaunchers(isGlobalAdmin);
        createButton();
        window.addEventListener("focus",scheduleButtonRetry);
      }catch(error){
        analysisFeatureAllowed=false;
        removeButton();
        showDiagnostic(error);
        console.warn("POINTS grade analysis entitlement check unavailable:",error);
      }
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();