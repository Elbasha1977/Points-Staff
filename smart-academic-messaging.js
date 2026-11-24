(() => {
  "use strict";
  const PERIODS = [
    ["mid_term1","منتصف الفصل الدراسي الأول","30"],
    ["final_term1","نهاية الفصل الدراسي الأول","50"],
    ["mid_term2","منتصف الفصل الدراسي الثاني","30"],
    ["final_term2","نهاية الفصل الدراسي الثاني","50"]
  ];
  const LEVELS = [
    {id:"weak",label:"ضعيف الأداء",min:0,max:50},
    {id:"low",label:"متدني الأداء",min:50,max:70},
    {id:"average",label:"متوسط الأداء",min:70,max:90},
    {id:"elevated",label:"مرتفع الأداء",min:90,max:95},
    {id:"high",label:"عالي الأداء",min:95,max:101}
  ];
  const GROUPS = [
    {id:"lowGroup",label:"ضعيفو ومتدنو الأداء",levels:["weak","low"],subject:"متابعة المستوى الدراسي لنجلكم",message:"السيد ولي الأمر الفاضل،\nتحية طيبة وبعد،\nنحيطكم علمًا بأن مستوى نجلكم الدراسي في مادة اللغة الإنجليزية يحتاج إلى مزيد من الاهتمام والمتابعة، ونأمل منكم التعاون مع المدرسة وتشجيعه على بذل المزيد من الجهد والمثابرة والانتظام في المذاكرة وأداء الواجبات.\nونؤكد لكم أن المدرسة حريصة على تقديم الدعم والمساعدة اللازمة له، ونعمل معًا على تحسين مستواه الدراسي وتجاوز الصعوبات التي تواجهه، حتى يتمكن بإذن الله من الوصول إلى درجة النجاح وتحقيق نتائج أفضل.\nإن تعاونكم ومتابعتكم المستمرة له سيكون لهما أثر كبير في تحقيق هذا الهدف.\nشاكرين لكم حسن تعاونكم واهتمامكم.\nمعلم اللغة الإنجليزية\nعبد الباسط عطية"},
    {id:"averageGroup",label:"متوسطو الأداء",levels:["average"],subject:"نحو مستوى دراسي أفضل لنجلكم",message:"السيد ولي الأمر الفاضل،\nتحية طيبة وبعد،\nنحيطكم علمًا بأن نجلكم يحقق مستوى دراسيًا متوسطًا في مادة اللغة الإنجليزية، وهو مستوى جيد يمكن تطويره والارتقاء به من خلال المزيد من الاجتهاد والمثابرة والاهتمام بالمذاكرة والتدريب المستمر.\nونأمل منكم تشجيعه على بذل جهد أكبر، ومتابعة واجباته ودروسه بانتظام، حتى يتمكن من تنمية مهاراته وتحقيق درجات أعلى والوصول إلى مستويات متميزة.\nونحن في المدرسة نحرص على دعمه ومساندته، ونتطلع إلى استمرار تعاونكم معنا لتحقيق أفضل النتائج له.\nشاكرين لكم حسن تعاونكم واهتمامكم.\nمعلم اللغة الإنجليزية\nعبد الباسط عطية"},
    {id:"highGroup",label:"مرتفعو وعاليو الأداء",levels:["elevated","high"],subject:"تقدير المستوى الدراسي المتميز لنجلكم",message:"السيد ولي الأمر الفاضل،\nتحية طيبة وبعد،\nيسعدنا أن نحيطكم علمًا بأن نجلكم يحقق مستوى دراسيًا مرتفعًا ومتميزًا في مادة اللغة الإنجليزية، وهو أمر يستحق التقدير والتشجيع.\nونأمل منكم مواصلة دعمه وتحفيزه على الاجتهاد والمثابرة والاستمرار في المحافظة على هذا المستوى الجميل، والعمل على تطوير مهاراته وتحقيق المزيد من التفوق والتميز.\nونؤكد لكم أن استمرار التعاون بين الأسرة والمدرسة هو أساس المحافظة على هذا النجاح والارتقاء به إلى مستويات أفضل.\nمع خالص الشكر والتقدير لجهودكم واهتمامكم.\nمعلم اللغة الإنجليزية\nعبد الباسط عطية"}
  ];
  let analyzed = null;
  let selectedGroup = null;
  let selectedQatarGroup = "lowGroup";
  let activePeriod = "";
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function ensureModal(){
    if($("smartAcademicContactModal")) return;
    const parent=$("parentContactModal");
    const existing=$("openBulkEmailBtn");
    if(!parent||!existing)return;
    const row=existing.parentElement;
    const button=document.createElement("button");
    button.type="button";button.id="openSmartAcademicContactBtn";
    button.className="send-btn email-send-btn";
    button.style.cssText="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:12px 22px;";
    button.textContent="🎯 التواصل الذكي حسب الأداء";
    button.addEventListener("click",openModal);
    row.appendChild(button);
    const modal=document.createElement("div");
    modal.id="smartAcademicContactModal";modal.className="modal";modal.style.zIndex="1300";
    modal.innerHTML=`
      <div class="modal-content large" style="max-width:920px;position:relative;">
       <button class="modal-close-x" type="button" id="smartContactCloseX">✕</button>
       <h2 style="text-align:center;color:#4338ca;">🎯 التواصل الذكي حسب الأداء الأكاديمي</h2>
       <p style="text-align:center;color:#475569;margin:8px 0 16px;">اختر فترة الاختبار أولًا؛ سيقرأ النظام درجات الطلاب المسجلة في «المتابعة الأكاديمية» ويصنفهم تلقائيًا.</p>
       <div class="select-group"><label for="smartExamPeriod">📚 ما فترة الاختبار المطلوبة؟</label>
        <select id="smartExamPeriod" style="width:100%;padding:13px;border:2px solid #818cf8;border-radius:12px;font-size:16px;">
         <option value="">-- اختر فترة الاختبار --</option>
         ${PERIODS.map(p=>`<option value="${p[0]}">${p[1]} (من ${p[2]})</option>`).join("")}
        </select>
       </div>
       <div style="text-align:center;margin:12px 0;"><button id="smartAnalyzeBtn" class="close-modal confirm-btn" style="background:#4338ca;padding:12px 24px;">🔍 تحليل درجات الفترة المختارة</button></div>
       <div id="smartAnalysisSummary" style="display:none;background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;padding:14px;margin:14px 0;"></div>
       <div id="smartEmailGroups" style="display:none;">
        <h3 style="text-align:center;margin:16px 0 10px;">📧 اختر فئة البريد الإلكتروني</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px;">
         <button type="button" data-smart-group="lowGroup" style="padding:13px;border:0;border-radius:12px;background:#fee2e2;color:#991b1b;font-weight:900;">🔴 إرسال بريد لضعيفي ومتدني الأداء</button>
         <button type="button" data-smart-group="averageGroup" style="padding:13px;border:0;border-radius:12px;background:#fef3c7;color:#92400e;font-weight:900;">🟠 إرسال بريد لمتوسطي الأداء</button>
         <button type="button" data-smart-group="highGroup" style="padding:13px;border:0;border-radius:12px;background:#dcfce7;color:#166534;font-weight:900;">🟢 إرسال بريد لمرتفعي وعالي الأداء</button>
        </div>
        <div id="smartGroupPreview" style="display:none;margin-top:12px;padding:13px;border:1px solid #cbd5e1;border-radius:12px;background:#fff;"></div>
        <div id="smartEmailActions" style="display:none;margin-top:12px;">
         <label for="smartEmailSubject" style="font-weight:bold;">عنوان البريد:</label>
         <input id="smartEmailSubject" style="width:100%;padding:11px;border:1px solid #cbd5e1;border-radius:10px;margin:6px 0 10px;">
         <label for="smartEmailBody" style="font-weight:bold;">نص الرسالة (يمكن تعديله):</label>
         <textarea id="smartEmailBody" rows="6" style="width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;margin:6px 0;"></textarea>
         <button id="smartSendBccBtn" class="send-btn email-send-btn" style="background:#2563eb;width:100%;">📧 فتح البريد ووضع الطلاب في BCC</button>
        </div>
       </div>
       <div id="smartQatarSection" style="display:none;margin-top:22px;border-top:2px dashed #cbd5e1;padding-top:16px;">
        <h3 style="text-align:center;color:#0f766e;">🎓 تجهيز رسالة جماعية لمنصة قطر للتعليم</h3>
        <p style="text-align:center;color:#475569;">اختر فئة الأداء، ثم انسخ عناوين أولياء الأمور إلى خانة BCC داخل المنصة. نص الرسالة موجه إلى ولي أمر طالب واحد بصيغة المفرد.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin:10px 0;">
         <button type="button" data-qatar-group="lowGroup" style="padding:12px;border:0;border-radius:10px;background:#fee2e2;color:#991b1b;font-weight:900;">🔴 ضعيفو ومتدنو الأداء</button>
         <button type="button" data-qatar-group="averageGroup" style="padding:12px;border:0;border-radius:10px;background:#fef3c7;color:#92400e;font-weight:900;">🟠 متوسطو الأداء</button>
         <button type="button" data-qatar-group="highGroup" style="padding:12px;border:0;border-radius:10px;background:#dcfce7;color:#166534;font-weight:900;">🟢 مرتفعو وعاليو الأداء</button>
        </div>
        <div id="smartQatarNamesPreview" style="background:#f0fdfa;padding:10px;border-radius:10px;white-space:pre-wrap;direction:rtl;margin:8px 0;max-height:150px;overflow:auto;"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
         <button id="smartCopyNamesBtn" class="send-btn" style="background:#0f766e;">📋 نسخ عناوين أولياء الأمور إلى BCC</button>
         <button id="smartOpenQatarBtn" class="send-btn" style="background:#0891b2;">🎓 فتح تعليم قطر ونسخ الرسالة</button>
        </div>
        <label for="smartQatarMessage" style="font-weight:bold;display:block;margin-top:12px;">نص الرسالة:</label>
        <textarea id="smartQatarMessage" rows="5" style="width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;margin-top:6px;"></textarea>
        <p style="font-size:12px;color:#64748b;margin-top:8px;">انسخ عناوين البريد والصقها في BCC، ثم انسخ نص الرسالة والصقه في متن الرسالة. الإرسال النهائي يتم من داخل منصة قطر للتعليم.</p>
       </div>
       <div style="display:flex;justify-content:center;margin-top:18px;"><button id="smartContactClose" class="close-modal cancel-btn">إغلاق</button></div>
      </div>`;
    document.body.appendChild(modal);
    $("smartContactCloseX").onclick=closeModal;$("smartContactClose").onclick=closeModal;
    $("smartAnalyzeBtn").onclick=analyzePeriod;
    $("smartExamPeriod").onchange=()=>{$("smartAnalysisSummary").style.display="none";$("smartEmailGroups").style.display="none";$("smartQatarSection").style.display="none";analyzed=null;};
    modal.querySelectorAll("[data-smart-group]").forEach(btn=>btn.addEventListener("click",()=>selectEmailGroup(btn.dataset.smartGroup)));
    $("smartSendBccBtn").onclick=launchBccDraft;
    modal.querySelectorAll("[data-qatar-group]").forEach(btn=>btn.addEventListener("click",()=>{selectedQatarGroup=btn.dataset.qatarGroup;renderQatarNames();}));
    $("smartCopyNamesBtn").onclick=copyQatarNames;
    $("smartOpenQatarBtn").onclick=openQatarAndCopyMessage;
  }
  function openModal(){
    ensureModal();
    if(!$("smartAcademicContactModal"))return;
    analyzed=null;selectedGroup=null;
    $("smartExamPeriod").value="";
    $("smartAnalysisSummary").style.display="none";
    $("smartEmailGroups").style.display="none";
    $("smartQatarSection").style.display="none";
    $("smartGroupPreview").style.display="none";
    $("smartEmailActions").style.display="none";
    $("smartAcademicContactModal").style.display="flex";
  }
  function closeModal(){if($("smartAcademicContactModal"))$("smartAcademicContactModal").style.display="none";}
  function analyzePeriod(){
    const period=$("smartExamPeriod").value;
    if(!period){alert("اختر فترة الاختبار أولًا.");return;}
    if(typeof getCurrentStudents!=="function"||typeof academicScores==="undefined"||typeof examDefinitions==="undefined"){alert("تعذر الوصول إلى درجات المتابعة الأكاديمية. أعد تحميل البرنامج وحاول مرة أخرى.");return;}
    const exam=examDefinitions[period],className=currentClass;
    if(!exam||!className){alert("تعذر تحديد بيانات الصف أو الاختبار.");return;}
    const students=getCurrentStudents()||[];
    const scoreMap=(academicScores[className]||{})[period]||{};
    const classified=[],incomplete=[];
    students.forEach(student=>{
      if(!student||!student.name)return;
      const row=scoreMap[student.name];
      if(!row||typeof row!=="object"){incomplete.push(student.name);return;}
      let total=0,complete=true;
      exam.items.forEach(item=>{
        if(!Object.prototype.hasOwnProperty.call(row,item.id)||row[item.id]===""||row[item.id]===null||!Number.isFinite(Number(row[item.id]))){complete=false;return;}
        total+=Number(row[item.id]);
      });
      if(!complete){incomplete.push(student.name);return;}
      const pct=(total/exam.total)*100;
      const level=LEVELS.find(l=>pct>=l.min&&pct<l.max)||LEVELS[LEVELS.length-1];
      classified.push({name:student.name,total,percentage:pct,level:level.id,levelLabel:level.label});
    });
    analyzed={period,exam,className,students:classified,incomplete};
    const counts=LEVELS.map(l=>({label:l.label,count:classified.filter(s=>s.level===l.id).length,color:l.id}));
    const summary=$("smartAnalysisSummary");
    summary.innerHTML=`<strong>الصف: ${esc(className)} — ${esc(exam.name)} (من ${exam.total})</strong><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:7px;margin-top:10px;">${counts.map(c=>`<div style="background:#fff;border:1px solid #e2e8f0;border-radius:9px;padding:9px;text-align:center;"><b>${esc(c.label)}</b><div style="font-size:22px;font-weight:900;color:#4338ca;">${c.count}</div></div>`).join("")}</div><div style="margin-top:9px;color:#475569;">طلاب اكتملت درجاتهم: ${classified.length} — درجات غير مكتملة: ${incomplete.length}</div>${incomplete.length?`<details style="margin-top:7px;"><summary>عرض الطلاب غير مكتملة درجاتهم</summary><div>${incomplete.map(esc).join("، ")}</div></details>`:""}`;
    summary.style.display="block";$("smartEmailGroups").style.display="block";$("smartQatarSection").style.display="block";
    selectedQatarGroup="lowGroup";renderQatarNames();
    $("smartGroupPreview").style.display="none";$("smartEmailActions").style.display="none";
  }
  function getLevelStudents(levelId){return analyzed?analyzed.students.filter(s=>s.level===levelId):[];}
  function selectEmailGroup(groupId){
    if(!analyzed){alert("حلل فترة الاختبار أولًا.");return;}
    const group=GROUPS.find(g=>g.id===groupId);if(!group)return;
    selectedGroup=group;
    const people=analyzed.students.filter(s=>group.levels.includes(s.level));
    const preview=$("smartGroupPreview");
    preview.innerHTML=`<strong>${esc(group.label)} — ${people.length} طالبًا</strong><div style="margin-top:7px;line-height:1.9;">${people.length?people.map(s=>`${esc(s.name)} <small style="color:#64748b">(${s.percentage.toFixed(1)}% — ${esc(s.levelLabel)})</small>`).join("<br>"):"لا يوجد طلاب مكتملة درجاتهم في هذه الفئة."}</div>`;
    preview.style.display="block";
    $("smartEmailActions").style.display=people.length?"block":"none";
    $("smartEmailSubject").value=group.subject+" - "+analyzed.exam.name;
    $("smartEmailBody").value=group.message;
  }
  function selectedEmailStudents(){return selectedGroup&&analyzed?analyzed.students.filter(s=>selectedGroup.levels.includes(s.level)):[];}
  function launchBccDraft(){
    const people=selectedEmailStudents();if(!people.length){alert("لا يوجد طلاب في الفئة المحددة.");return;}
    const subject=$("smartEmailSubject").value.trim(),body=$("smartEmailBody").value.trim();
    if(!body){alert("اكتب نص الرسالة أولًا.");return;}
    const contacts=typeof getCurrentParentContacts==="function"?(getCurrentParentContacts()||{}):{};
    const missing=people.filter(s=>!String((contacts[s.name]||{}).email||"").trim());
    if(missing.length){alert("لا يمكن تجهيز البريد؛ لا توجد عناوين بريد مسجلة لـ "+missing.length+" من أولياء الأمور.\n"+missing.map(s=>s.name).join("، "));return;}
    const bcc=people.map(s=>String(contacts[s.name].email).trim()).join("; ");
    const url="mailto:?bcc="+encodeURIComponent(bcc)+"&subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
    const win=window.open(url,"_self");
    if(!win){alert("تعذر فتح تطبيق البريد. تحقق من إعداد تطبيق البريد الافتراضي.");return;}
    const reason=selectedGroup.label+" — "+analyzed.exam.name;
    people.forEach(p=>{
      const contact=(typeof getCurrentParentContacts==="function"?getCurrentParentContacts():{})[p.name]||{};
      try{logParentMessage(p.name,contact.phone||"",contact.email||"",body,reason,selectedGroup.id==="highGroup"?"positive":"negative","email_bulk","تم فتح مسودة Outlook — بانتظار الإرسال",subject);}
      catch(e){console.warn("smart email log failed",e);}
    });
    alert("تم تجهيز مسودة البريد ووضع أسماء الطلاب في BCC. راجع تعرف تطبيق البريد على جميع الأسماء ثم اضغط إرسال. لم يتم إرسال الرسالة تلقائيًا.");
  }
  function qatarGroupStudents(){return analyzed?analyzed.students.filter(s=>selectedQatarGroup&&GROUPS.find(g=>g.id===selectedQatarGroup)?.levels.includes(s.level)):[];}
  function renderQatarNames(){
    if(!analyzed)return;
    const group=GROUPS.find(g=>g.id===selectedQatarGroup)||GROUPS[0];
    const people=qatarGroupStudents();
    const contacts=typeof getCurrentParentContacts==="function"?(getCurrentParentContacts()||{}):{};
    const emails=people.map(s=>({name:s.name,email:String((contacts[s.name]||{}).email||"").trim()}));
    const missing=emails.filter(x=>!x.email);
    $("smartQatarNamesPreview").textContent=emails.length?emails.map(x=>x.email?x.name+" — "+x.email:x.name+" — لا يوجد بريد مسجل").join("\n"):"لا يوجد طلاب مكتملة درجاتهم في هذه الفئة.";
    $("smartQatarMessage").value=group.message;
    $("smartCopyNamesBtn").disabled=!emails.length||missing.length>0;
    $("smartCopyNamesBtn").title=missing.length?"توجد عناوين بريد غير مسجلة":"نسخ عناوين البريد إلى BCC";
    $("smartQatarNamesPreview").dataset.missing=String(missing.length);
  }
  async function copyText(text){
    if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return;}
    const box=document.createElement("textarea");box.value=text;box.style.position="fixed";box.style.opacity="0";document.body.appendChild(box);box.select();const ok=document.execCommand("copy");box.remove();if(!ok)throw new Error("copy_failed");
  }
  async function copyQatarNames(){
    if(!analyzed)return;
    const people=qatarGroupStudents();
    const contacts=typeof getCurrentParentContacts==="function"?(getCurrentParentContacts()||{}):{};
    const emails=people.map(s=>String((contacts[s.name]||{}).email||"").trim());
    const missing=people.filter((s,i)=>!emails[i]);
    if(!people.length){alert("لا يوجد طلاب في فئة الأداء المحددة.");return;}
    if(missing.length){alert("لا يمكن نسخ القائمة؛ توجد عناوين بريد غير مسجلة للأسماء التالية:\n"+missing.map(s=>s.name).join("، "));return;}
    try{await copyText(emails.join("; "));alert("تم نسخ "+emails.length+" عنوان بريد. افتح تعليم قطر والصقها في خانة BCC.");}
    catch(e){alert("تعذر نسخ العناوين تلقائيًا. حاول مرة أخرى.");}
  }
  async function openQatarAndCopyMessage(){
    if(!analyzed)return;
    const people=qatarGroupStudents();
    if(!people.length){alert("لا يوجد طلاب في هذه الفئة.");return;}
    const portal=window.open("https://qeducation.edu.gov.qa/inbox","_blank");
    if(!portal){alert("اسمح بالنوافذ المنبثقة لموقع POINTS ثم أعد المحاولة.");return;}
    try{
      await copyText($("smartQatarMessage").value.trim());
      const reason=(GROUPS.find(g=>g.id===selectedQatarGroup)||GROUPS[0]).label+" — "+analyzed.exam.name;
      const contacts=typeof getCurrentParentContacts==="function"?(getCurrentParentContacts()||{}):{};
      people.forEach(p=>{const c=contacts[p.name]||{};try{logParentMessage(p.name,c.phone||"",c.email||"",$("smartQatarMessage").value,reason,selectedQatarGroup==="highGroup"?"positive":"negative","qeducation","تم فتح المنصة ونسخ نص الرسالة — بانتظار لصق BCC والإرسال");}catch(e){}});
      alert("تم فتح منصة قطر ونسخ نص الرسالة. اضغط «نسخ عناوين أولياء الأمور إلى BCC» والصق العناوين في خانة BCC، ثم الصق نص الرسالة وأرسلها من المنصة.");
    }catch(e){alert("فُتحت المنصة، لكن تعذر نسخ الرسالة تلقائيًا.");}
  }
  function boot(){ensureModal();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
  const observer=new MutationObserver(()=>{if(!$("openSmartAcademicContactBtn"))ensureModal();});
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
})();