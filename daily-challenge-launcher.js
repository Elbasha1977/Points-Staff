(() => {
  "use strict";

  if (document.getElementById("points-staff-daily-challenge-launcher")) return;
  if (/\/daily-challenge\.html$/i.test(window.location.pathname)) return;

  const mount = () => {
    if (!document.body || document.getElementById("points-staff-daily-challenge-launcher")) return;

    const style = document.createElement("style");
    style.id = "points-staff-daily-challenge-style";
    style.textContent = `
      #points-staff-daily-challenge-launcher {
        position: fixed;
        left: 18px;
        bottom: 18px;
        z-index: 2147483000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: min(290px, calc(100vw - 36px));
        padding: 12px 17px;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 16px;
        background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
        color: #fff !important;
        text-decoration: none !important;
        direction: rtl;
        text-align: right;
        font-family: inherit;
        box-shadow: 0 8px 24px rgba(127,29,29,.28);
        transition: transform .18s ease, box-shadow .18s ease;
        -webkit-tap-highlight-color: transparent;
      }
      #points-staff-daily-challenge-launcher:hover {
        transform: translateY(-2px);
        box-shadow: 0 11px 28px rgba(127,29,29,.34);
      }
      #points-staff-daily-challenge-launcher:focus-visible {
        outline: 3px solid #fbbf24;
        outline-offset: 3px;
      }
      #points-staff-daily-challenge-launcher .pc-fire {
        font-size: 25px;
        line-height: 1;
        flex: 0 0 auto;
      }
      #points-staff-daily-challenge-launcher .pc-copy {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      #points-staff-daily-challenge-launcher .pc-title {
        font-size: 14px;
        line-height: 1.35;
        font-weight: 800;
        white-space: nowrap;
      }
      #points-staff-daily-challenge-launcher .pc-subtitle {
        font-size: 11px;
        line-height: 1.35;
        font-weight: 500;
        opacity: .94;
        white-space: nowrap;
      }
      @media (max-width: 520px) {
        #points-staff-daily-challenge-launcher {
          left: 12px;
          bottom: 12px;
          padding: 10px 14px;
          border-radius: 14px;
        }
      }
    `;

    const link = document.createElement("a");
    link.id = "points-staff-daily-challenge-launcher";
    link.href = new URL("./daily-challenge.html", window.location.href).href;
    link.setAttribute("role", "button");
    link.setAttribute("aria-label", "فتح إدارة تحدي اليوم");
    link.innerHTML = '<span class="pc-fire" aria-hidden="true">🔥</span><span class="pc-copy"><span class="pc-title">تحدي اليوم</span><span class="pc-subtitle">إعداد سؤال لطلاب صفك</span></span>';

    document.head.appendChild(style);
    document.body.appendChild(link);
  };

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();