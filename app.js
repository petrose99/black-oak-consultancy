/* Black Oak Consultancy — CMS-driven content renderer + interactions */
(function () {
  "use strict";

  /* ---- SVG icon library ---- */
  var icons = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    dollar: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 2l2.5 5.5L20 8l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/></svg>',
    bars: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 20V10M10 20V4M16 20v-7M22 20h-2"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 12l5 5L20 6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 21l2.2-5.2A8.5 8.5 0 1121 11.5z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8.1 9.6a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 21s-7-5.7-7-11a7 7 0 0114 0c0 5.3-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  /* ---- fetch helper ---- */
  function load(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " returned " + r.status);
      return r.json();
    });
  }

  /* ---- render all content ---- */
  Promise.all([
    load("content/settings.json"),
    load("content/hero.json"),
    load("content/services.json"),
    load("content/why-us.json"),
    load("content/about.json"),
    load("content/pricing.json"),
    load("content/testimonials.json"),
    load("content/clients.json"),
    load("content/contact.json")
  ]).then(function (data) {
    var settings = data[0], hero = data[1], services = data[2], whyUs = data[3],
        about = data[4], pricing = data[5], testi = data[6], clients = data[7], contact = data[8];

    /* -- Meta -- */
    document.title = settings.title + " — " + settings.tagline;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", settings.description);

    /* -- Hero -- */
    document.getElementById("hero-eyebrow").textContent = hero.eyebrow;
    document.getElementById("hero-headline").innerHTML =
      esc(hero.headline_line1) + '<br /><span class="gold">' + esc(hero.headline_line2) + '</span> ' + esc(hero.headline_line2_suffix);
    document.getElementById("hero-sub").textContent = hero.subtext;
    var ctaPri = document.getElementById("hero-cta-primary");
    ctaPri.insertBefore(document.createTextNode(hero.cta_primary + " "), ctaPri.firstChild);
    document.getElementById("hero-cta-secondary").textContent = hero.cta_secondary;

    var statsHtml = "";
    hero.stats.forEach(function (s) {
      statsHtml += '<div class="hero-stat"><div class="num">' + esc(s.number) + '</div><div class="lbl">' + esc(s.label) + '</div></div>';
    });
    document.getElementById("hero-stats").innerHTML = statsHtml;

    /* -- Philosophy -- */
    document.getElementById("philosophy-text").textContent = settings.philosophy;

    /* -- Services / Practice Areas -- */
    document.getElementById("services-heading").innerHTML = services.heading.replace("\n", "<br />");
    document.getElementById("services-intro").textContent = services.intro;

    var tabsHtml = "", panelsHtml = "";
    services.areas.forEach(function (area, i) {
      tabsHtml += '<button class="tab' + (i === 0 ? " active" : "") + '" data-tab="' + area.id + '" role="tab"><span class="ti">' + area.number + '</span> ' + esc(area.name) + '</button>';

      var valuesHtml = "";
      area.values.forEach(function (v) {
        valuesHtml += '<div class="value-row">' + (icons[v.icon] || icons.check) +
          '<div><b>' + esc(v.title) + '</b><span>' + esc(v.text) + '</span></div></div>';
      });

      var groupsHtml = "";
      area.groups.forEach(function (g) {
        var items = "";
        g.items.forEach(function (item) {
          items += '<li><span class="dash">—</span> ' + esc(item) + '</li>';
        });
        groupsHtml += '<div class="svc-group"><h4>' + esc(g.title) + '</h4><ul class="svc-list">' + items + '</ul></div>';
      });

      panelsHtml += '<div class="panel' + (i === 0 ? " active" : "") + '" id="' + area.id + '" role="tabpanel">' +
        '<div class="panel-left">' +
          '<div class="pa-num">' + area.number + ' / Practice</div>' +
          '<h3>' + esc(area.name) + '</h3>' +
          '<p class="pa-desc">' + esc(area.description) + '</p>' +
          '<div class="value-card">' + valuesHtml + '</div>' +
          '<a href="#contact" class="link-arrow">' + esc(area.cta) + ' →</a>' +
        '</div>' +
        '<div class="panel-right">' + groupsHtml + '</div>' +
      '</div>';
    });
    document.getElementById("services-tabs").innerHTML = tabsHtml;
    document.getElementById("services-panels").innerHTML = panelsHtml;

    /* -- Why Us -- */
    document.getElementById("why-heading").textContent = whyUs.heading;
    var whyHtml = "";
    whyUs.items.forEach(function (w) {
      whyHtml += '<div class="why-cell"><div class="wi">' + esc(w.numeral) + '</div><h4>' + esc(w.title) + '</h4><p>' + esc(w.text) + '</p></div>';
    });
    document.getElementById("why-grid").innerHTML = whyHtml;

    /* -- About -- */
    document.getElementById("about-heading").textContent = about.heading;
    var paraHtml = "";
    about.paragraphs.forEach(function (p) { paraHtml += "<p>" + esc(p) + "</p>"; });
    document.getElementById("about-paragraphs").innerHTML = paraHtml;
    document.getElementById("about-philosophy").innerHTML = "&ldquo;" + esc(about.philosophy_quote) + "&rdquo;";

    var chipHtml = "";
    about.industries.forEach(function (ind) { chipHtml += '<span class="chip">' + esc(ind) + '</span>'; });
    document.getElementById("about-industries").innerHTML = chipHtml;

    /* -- Pricing -- */
    document.getElementById("pricing-heading").textContent = pricing.heading;
    document.getElementById("pricing-intro").textContent = pricing.intro;

    var tiersHtml = "";
    pricing.tiers.forEach(function (t) {
      var featHtml = "";
      t.features.forEach(function (f) {
        featHtml += "<li>" + icons.tick + " " + esc(f) + "</li>";
      });
      var btnClass = t.featured ? "btn btn-gold" : "btn btn-ghost-dark";
      var ctaText = t.featured ? esc(t.cta) + ' <span class="arr">→</span>' : esc(t.cta);
      tiersHtml += '<div class="tier' + (t.featured ? " featured" : "") + '">' +
        '<div class="t-name">' + esc(t.name) + '</div>' +
        '<div class="t-for">' + esc(t.audience) + '</div>' +
        '<div class="t-price"><span class="start">' + (t.per ? "Starting at" : "&nbsp;") + '</span><span class="amt">' + esc(t.price) + '</span>' + (t.per ? ' <span class="per">' + esc(t.per) + '</span>' : '') + '</div>' +
        '<ul>' + featHtml + '</ul>' +
        '<a href="#contact" class="' + btnClass + '">' + ctaText + '</a>' +
      '</div>';
    });
    document.getElementById("pricing-tiers").innerHTML = tiersHtml;

    var alcHtml = '<h3>À la carte services</h3><p class="sub">Flexible individual solutions — engage us for a single project, no subscription required.</p><div class="alc-table">';
    pricing.alacarte.forEach(function (a) {
      var noteHtml = a.note ? ' <em style="opacity:.6;font-style:italic">' + esc(a.note) + '</em>' : '';
      alcHtml += '<div class="alc-row"><span class="svc">' + esc(a.service) + noteHtml + '</span><span class="price">' + esc(a.price) + '</span></div>';
    });
    alcHtml += '</div><p class="alc-note">' + esc(pricing.alacarte_note) + '</p>';
    document.getElementById("pricing-alacarte").innerHTML = alcHtml;

    /* -- Testimonials -- */
    document.getElementById("testi-heading").textContent = testi.heading;
    var testiHtml = "";
    testi.quotes.forEach(function (q) {
      testiHtml += '<div class="quote-card reveal">' +
        '<div class="qm">&ldquo;</div>' +
        '<blockquote>' + esc(q.text) + '</blockquote>' +
        '<div class="who"><span class="av">' + esc(q.initial) + '</span><span class="meta"><b>' + esc(q.company) + '</b><span>' + esc(q.sector) + '</span></span></div>' +
      '</div>';
    });
    document.getElementById("testi-grid").innerHTML = testiHtml;

    /* -- Clients -- */
    document.getElementById("clients-heading").textContent = clients.heading;
    document.getElementById("clients-intro").textContent = clients.intro;
    var cliHtml = "";
    clients.list.forEach(function (c) {
      cliHtml += '<div class="client-card">' +
        '<span class="ci"><span class="material-symbols-outlined">' + esc(c.icon) + '</span></span>' +
        '<span class="sector">' + esc(c.sector) + '</span>' +
        '<span class="cname">' + esc(c.name) + '</span>' +
        '<span class="ctag">' + esc(c.tag) + '</span>' +
      '</div>';
    });
    document.getElementById("clients-grid").innerHTML = cliHtml;

    /* -- Contact -- */
    document.getElementById("contact-heading").textContent = contact.heading;
    var contactIntro = document.getElementById("contact-intro");
    contactIntro.textContent = contact.intro;
    contactIntro.style.color = "var(--on-dark-muted)";
    contactIntro.style.fontSize = "17px";
    contactIntro.style.lineHeight = "1.7";
    contactIntro.style.maxWidth = "44ch";

    var assessHtml = "";
    contact.assessment_items.forEach(function (a) {
      assessHtml += "<li>" + icons.tick + " " + esc(a) + "</li>";
    });
    document.getElementById("contact-assessment").innerHTML = assessHtml;

    var emailSubject = encodeURIComponent("Consultation request — Black Oak Consultancy");
    var emailBody = encodeURIComponent("Hello Black Oak Consultancy,\n\nI'd like to book a free assessment.\n\nName:\nCompany:\nService of interest:\n\nThank you.");
    var mailtoLink = "mailto:" + contact.email_primary + "?subject=" + emailSubject + "&body=" + emailBody;

    var chHtml =
      '<a class="channel" href="' + contact.whatsapp_link + '" target="_blank" rel="noopener">' +
        '<span class="ic">' + icons.whatsapp + '</span>' +
        '<span><span class="c-label">WhatsApp — fastest reply</span><span class="c-val">' + esc(contact.whatsapp) + '</span></span>' +
      '</a>' +
      '<a class="channel" href="tel:' + contact.phone_primary.replace(/\s/g, "") + '">' +
        '<span class="ic">' + icons.phone + '</span>' +
        '<span><span class="c-label">Consultation line</span><span class="c-val">' + esc(contact.phone_primary) + ' · ' + esc(contact.phone_secondary) + '</span></span>' +
      '</a>' +
      '<a class="channel" href="' + mailtoLink + '">' +
        '<span class="ic">' + icons.email + '</span>' +
        '<span><span class="c-label">Email</span><span class="c-val">' + esc(contact.email_primary) + '</span></span>' +
      '</a>' +
      '<a class="channel" href="' + contact.maps_link + '" target="_blank" rel="noopener">' +
        '<span class="ic">' + icons.pin + '</span>' +
        '<span><span class="c-label">Office</span><span class="c-val">' + esc(contact.address) + '</span></span>' +
      '</a>' +
      '<div class="hours"><span>Business hours</span><b>' + esc(contact.hours) + '</b></div>' +
      '<div class="big-cta">' +
        '<a href="' + contact.whatsapp_link + '" target="_blank" rel="noopener" class="btn btn-gold">Book a free consultation <span class="arr">→</span></a>' +
        '<a href="' + mailtoLink + '" class="btn btn-ghost-dark">Email us instead</a>' +
      '</div>';
    document.getElementById("contact-channels").innerHTML = chHtml;

    /* -- Footer contact + socials -- */
    var fContactHtml = '<h5>Contact</h5>' +
      '<a href="tel:' + contact.phone_primary.replace(/\s/g, "") + '">' + esc(contact.phone_primary) + '</a>' +
      '<a href="tel:' + contact.phone_secondary.replace(/\s/g, "") + '">' + esc(contact.phone_secondary) + '</a>' +
      '<a href="mailto:' + contact.email_primary + '">' + esc(contact.email_primary) + '</a>' +
      '<a href="mailto:' + contact.email_secondary + '">' + esc(contact.email_secondary) + '</a>' +
      '<p>' + esc(contact.address) + '</p>';
    document.getElementById("footer-contact").innerHTML = fContactHtml;

    var fSocialsHtml = "";
    if (settings.social.instagram && settings.social.instagram !== "#") fSocialsHtml += '<a href="' + settings.social.instagram + '" target="_blank" rel="noopener">Instagram</a>';
    else fSocialsHtml += '<a href="#" rel="noopener">Instagram</a>';
    if (settings.social.facebook && settings.social.facebook !== "#") fSocialsHtml += '<a href="' + settings.social.facebook + '" target="_blank" rel="noopener">Facebook</a>';
    else fSocialsHtml += '<a href="#" rel="noopener">Facebook</a>';
    if (settings.social.linkedin && settings.social.linkedin !== "#") fSocialsHtml += '<a href="' + settings.social.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>';
    else fSocialsHtml += '<a href="#" rel="noopener">LinkedIn</a>';
    document.getElementById("footer-socials").innerHTML = fSocialsHtml;

    /* ---- init interactions after content is loaded ---- */
    initInteractions();
  }).catch(function (err) {
    console.error("Content load error:", err);
  });

  /* ============================================================
     INTERACTIONS (tabs, nav, scroll reveals)
     ============================================================ */
  function initInteractions() {
    /* ---- nav: background on scroll ---- */
    var nav = document.getElementById("nav");
    function onScroll() {
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- mobile menu ---- */
    var toggle = document.getElementById("navToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
      nav.querySelectorAll(".nav-links a").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("open"); });
      });
    }

    /* ---- practice-area tabs ---- */
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-tab");
        tabs.forEach(function (t) { t.classList.remove("active"); });
        panels.forEach(function (p) { p.classList.remove("active"); });
        tab.classList.add("active");
        var panel = document.getElementById(id);
        if (panel) panel.classList.add("active");
      });
    });

    /* ---- reveal on scroll ---- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---- year ---- */
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }
})();
