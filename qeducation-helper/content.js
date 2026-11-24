(function () {
  'use strict';
  if (window.top !== window) return;

  const STORAGE_KEY = 'pointsQEducationDraftV1';
  const INBOX_URL = '/inbox';
  let started = false;

  function toast(message, kind) {
    let box = document.getElementById('points-qeducation-helper-status');
    if (!box) {
      box = document.createElement('div');
      box.id = 'points-qeducation-helper-status';
      box.dir = 'rtl';
      box.style.cssText = 'position:fixed;z-index:2147483647;top:16px;right:16px;max-width:420px;padding:14px 18px;border-radius:12px;background:#0f172a;color:#fff;font: bold 14px Tahoma,Arial;box-shadow:0 8px 28px #0005;line-height:1.7';
      document.documentElement.appendChild(box);
    }
    box.style.background = kind === 'error' ? '#991b1b' : '#0f766e';
    box.textContent = message;
  }

  function readDraftFromHash() {
    const marker = '#points-draft=';
    if (!location.hash.startsWith(marker)) return null;
    try {
      const raw = decodeURIComponent(location.hash.slice(marker.length));
      const draft = JSON.parse(raw);
      if (!draft || draft.version !== 1 || !draft.studentName || !draft.message) return null;
      history.replaceState(null, '', location.pathname + location.search);
      return draft;
    } catch (_) {
      return null;
    }
  }

  function setNativeValue(element, value) {
    const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(element, value);
    else element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function visible(element) {
    return !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }

  function clickNewMessageIfNeeded() {
    const popup = document.querySelector('.messageSendPopup, .facebox-content.messageSendPopup, [id*="messageSendPopup"]');
    if (popup) return true;
    const candidates = Array.from(document.querySelectorAll('a,button,[role="button"]'));
    const button = candidates.find(el => visible(el) && /رسالة\s*جديدة/.test((el.innerText || el.textContent || '').trim()));
    if (button) {
      button.click();
      return true;
    }
    return false;
  }

  async function waitFor(getter, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const value = getter();
      if (value) return value;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    return null;
  }

  async function chooseRecipient(studentName) {
    const recipientType = document.querySelector('select#field');
    if (recipientType) {
      const toOption = Array.from(recipientType.options).find(o => /^to$/i.test(o.text.trim()));
      if (toOption && recipientType.value !== toOption.value) {
        recipientType.value = toOption.value;
        recipientType.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    const select2Container = await waitFor(() => {
      const el = document.querySelector('#s2id_field, .select2-container');
      return el && visible(el) ? el : null;
    }, 5000);
    if (select2Container) select2Container.click();

    const search = await waitFor(() => {
      const fields = Array.from(document.querySelectorAll('input.select2-input, input[id^="s2id_autogen"]'));
      return fields.find(visible) || null;
    }, 7000);
    if (!search) return { ok: false, reason: 'لم يظهر مربع البحث عن المستلم؛ اختر To ثم ابحث عن الطالب يدويًا.' };

    setNativeValue(search, studentName);
    search.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'a' }));

    const exact = await waitFor(() => {
      const results = Array.from(document.querySelectorAll('.select2-results li, .select2-result-selectable, .select2-result'));
      return results.find(el => visible(el) && (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() === studentName)
        || results.find(el => visible(el) && (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().includes(studentName));
    }, 9000);
    if (!exact) return { ok: false, reason: 'لم أجد تطابقًا مؤكدًا لاسم الطالب. اختر الاسم الصحيح من نتائج البحث يدويًا.' };
    exact.click();
    return { ok: true };
  }

  function splitRecipientNames(raw) {
    return Array.from(new Set(String(raw || "")
      .split(/[\\r\\n;；,،|]+/)
      .map(name => name.replace(/^[\\s•\\-]+|[\\s•\\-]+$/g, "").replace(/\\s+/g, " ").trim())
      .filter(name => name.length >= 3)));
  }

  async function chooseBccField() {
    const field = document.querySelector("select#field");
    if (!field) return false;
    const option = Array.from(field.options).find(o => /^bcc$/i.test(o.text.trim()) || /نسخة مخفية/.test(o.text.trim()));
    if (!option) return false;
    if (field.value !== option.value) {
      field.value = option.value;
      field.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 350));
    }
    return true;
  }

  async function addOneBccRecipient(name) {
    const container = await waitFor(() => {
      const el = document.querySelector("#s2id_field, .select2-container");
      return el && visible(el) ? el : null;
    }, 5000);
    if (!container) return { ok: false, reason: "لم يظهر حقل BCC" };
    container.click();

    const search = await waitFor(() => {
      const fields = Array.from(document.querySelectorAll("input.select2-input, input[id^='s2id_autogen']"));
      return fields.find(visible) || null;
    }, 5000);
    if (!search) return { ok: false, reason: "لم يظهر مربع البحث" };

    setNativeValue(search, name);
    search.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "a" }));
    const exact = await waitFor(() => {
      const results = Array.from(document.querySelectorAll(".select2-results li, .select2-result-selectable, .select2-result"));
      return results.find(el => visible(el) &&
        (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim() === name);
    }, 7000);
    if (!exact) return { ok: false, reason: "لم يظهر تطابق دقيق للاسم: " + name };
    exact.click();
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ok: true };
  }

  async function addBccRecipientsSequentially(names) {
    if (!await chooseBccField()) {
      toast("تعذر تحديد خانة BCC تلقائيًا. اختر BCC يدويًا ثم أعد لصق القائمة.", "error");
      return;
    }
    let added = 0;
    const failed = [];
    for (const name of names) {
      const result = await addOneBccRecipient(name);
      if (result.ok) added++;
      else failed.push(result.reason);
    }
    toast("تمت إضافة " + added + " من " + names.length + " إلى BCC." +
      (failed.length ? " تعذر العثور على " + failed.length + " اسم؛ راجع الأسماء وأكمل يدويًا." : " راجع القائمة قبل الإرسال."),
      failed.length ? "error" : "ok");
  }

  function installMultiPasteHandler() {
    document.addEventListener("paste", event => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) ||
          !(target.matches("input.select2-input") || (target.id || "").startsWith("s2id_autogen"))) return;
      const raw = event.clipboardData && event.clipboardData.getData("text");
      const names = splitRecipientNames(raw);
      if (names.length < 2) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      addBccRecipientsSequentially(names).catch(error =>
        toast("تعذر إدراج قائمة الأسماء: " + (error.message || error), "error"));
    }, true);
  }

  async function fillSubject(subject) {
    const field = await waitFor(() => {
      const el = document.querySelector('input#subject.textInput, input[id="subject"], input[name="subject"]');
      return el && visible(el) ? el : null;
    }, 7000);
    if (!field) return false;
    setNativeValue(field, subject);
    return true;
  }

  async function fillMessage(message) {
    const body = await waitFor(() => {
      const frames = Array.from(document.querySelectorAll('iframe'));
      for (const frame of frames) {
        try {
          const doc = frame.contentDocument;
          const target = doc && (doc.querySelector('body#tinymce') || doc.querySelector('body.mce-content-body[contenteditable="true"]'));
          if (target) return target;
        } catch (_) {}
      }
      return null;
    }, 10000);
    if (!body) return false;
    body.innerHTML = message.split(/\r?\n/).map(line => line ? line.replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])) : '<br>').join('<br>');
    body.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: message }));
    body.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  async function waitForComposeAfterLogin() {
    const deadline = Date.now() + 120000;
    let clickedNewMessage = false;
    while (Date.now() < deadline) {
      const popup = document.querySelector('.messageSendPopup, .facebox-content.messageSendPopup, [id*="messageSendPopup"]');
      if (popup) return true;

      if (!clickedNewMessage) {
        const candidates = Array.from(document.querySelectorAll('a,button,[role="button"]'));
        const button = candidates.find(el => visible(el) && /رسالة\s*جديدة/g.test((el.innerText || el.textContent || '').trim()));
        if (button) {
          clickedNewMessage = true;
          button.click();
          await new Promise(resolve => setTimeout(resolve, 700));
          continue;
        }
      }

      toast('سجّل الدخول إلى منصة قطر للتعليم إذا طُلب منك ذلك؛ سأتابع تجهيز الرسالة تلقائيًا بعد ظهور صندوق الرسائل.');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
  }

  async function runDraft(draft) {
    if (started) return;
    started = true;
    toast('POINTS: جارٍ فتح نافذة رسالة جديدة…');
    const composeReady = await waitForComposeAfterLogin();
    if (!composeReady) {
      toast('لم تظهر نافذة «رسالة جديدة» خلال دقيقتين. افتحها يدويًا ثم أعد المحاولة من POINTS.', 'error');
      await chrome.storage.local.remove(STORAGE_KEY);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    const recipient = await chooseRecipient(draft.studentName);
    const subjectOk = await fillSubject(draft.subject || 'اللغة الإنجليزية');
    const messageOk = await fillMessage(draft.message);

    const results = [];
    results.push(recipient.ok ? 'تم اختيار المستلم' : recipient.reason);
    results.push(subjectOk ? 'تم إدراج مادة اللغة الإنجليزية' : 'تعذر تحديد حقل المادة؛ أدخلها يدويًا');
    results.push(messageOk ? 'تم إدراج نص الرسالة' : 'تعذر تحديد محرر الرسالة؛ الصق النص يدويًا');
    toast(results.join(' • ') + ' — راجع البيانات ثم اضغط إرسال بنفسك.', recipient.ok && subjectOk && messageOk ? 'ok' : 'error');
    await chrome.storage.local.remove(STORAGE_KEY);
  }

  async function init() {
    const fromHash = readDraftFromHash();
    if (fromHash) await chrome.storage.local.set({ [STORAGE_KEY]: fromHash });
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    if (stored[STORAGE_KEY] && (Date.now() - (stored[STORAGE_KEY].createdAt || 0) < 60 * 60 * 1000)) {
      await runDraft(stored[STORAGE_KEY]);
    } else if (stored[STORAGE_KEY]) {
      await chrome.storage.local.remove(STORAGE_KEY);
    }
  }

  installMultiPasteHandler();
  init().catch(error => toast('تعذر تجهيز الرسالة: ' + (error.message || error), 'error'));
})();