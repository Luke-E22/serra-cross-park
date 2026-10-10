/* @ds-bundle: {"format":4,"namespace":"SerraCross","components":[{"name":"Wordmark"},{"name":"Button"},{"name":"Icon"},{"name":"Ornament"},{"name":"SiteHeader"},{"name":"Hero"},{"name":"SectionHeading"},{"name":"SignPanel"},{"name":"FeatureCard"},{"name":"FactGrid"},{"name":"Steps"},{"name":"Field"},{"name":"ChoiceChips"},{"name":"InquiryForm"},{"name":"GivingForm"},{"name":"Timeline"},{"name":"Gallery"},{"name":"FAQList"},{"name":"Notice"},{"name":"SiteFooter"}]} */
(function () {
var __SC = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../scp-ds/project/components/src/index.tsx
  var index_exports = {};
  __export(index_exports, {
    Button: () => Button,
    ChoiceChips: () => ChoiceChips,
    FAQList: () => FAQList,
    FactGrid: () => FactGrid,
    FeatureCard: () => FeatureCard,
    Field: () => Field,
    Gallery: () => Gallery,
    GivingForm: () => GivingForm,
    Hero: () => Hero,
    Icon: () => Icon,
    InquiryForm: () => InquiryForm,
    Notice: () => Notice,
    Ornament: () => Ornament,
    SectionHeading: () => SectionHeading,
    SignPanel: () => SignPanel,
    SiteFooter: () => SiteFooter,
    SiteHeader: () => SiteHeader,
    Steps: () => Steps,
    Timeline: () => Timeline,
    Wordmark: () => Wordmark
  });

  // ../scp-ds/project/components/src/generated.ts
  var ICONS = {
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "menu": '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
    "minus": '<path d="M5 12h14"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "circle-alert": '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "map-pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    "sunset": '<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
    "accessibility": '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
    "toilet": '<path d="M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18"/><path d="M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/>',
    "droplet": '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    "plug-zap": '<path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="m2 22 3-3"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m18 3-4 4h6l-4 4"/>',
    "wine": '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>',
    "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    "car": '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    "lamp": '<path d="M8 2h8l4 10H4L8 2Z"/><path d="M12 12v6"/><path d="M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    "hand-heart": '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
    "landmark": '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>'
  };
  var O_PATH = "M49.68 30.12Q49.68 26.25 48.2 22.84Q46.72 19.43 44.14 16.86Q41.57 14.29 38.16 12.81Q34.75 11.33 30.89 11.33Q27.03 11.33 23.55 12.81Q20.08 14.29 17.5 16.86Q14.93 19.43 13.45 22.84Q11.97 26.25 11.97 30.12Q11.97 33.98 13.45 37.45Q14.93 40.93 17.5 43.5Q20.08 46.07 23.49 47.55Q26.9 49.03 30.76 49.03Q34.62 49.03 38.1 47.55Q41.57 46.07 44.14 43.5Q46.72 40.93 48.2 37.45Q49.68 33.98 49.68 30.12ZM38.1 100H23.94V87.39H38.1ZM61.39 31.27Q61.39 37.71 59.07 43.11Q56.76 48.52 52.7 52.38Q48.65 56.24 43.11 58.37Q37.58 60.49 31.15 60.49Q24.71 60.49 19.05 58.37Q13.38 56.24 9.14 52.38Q4.89 48.52 2.45 43.11Q0 37.71 0 31.27Q0 24.84 2.25 19.11Q4.5 13.38 8.56 9.14Q12.61 4.89 18.15 2.45Q23.68 0 30.12 0Q36.55 0 42.28 2.45Q48.01 4.89 52.25 9.14Q56.5 13.38 58.94 19.11Q61.39 24.84 61.39 31.27Z";
  var O_WIDTH = 61.39;

  // ../scp-ds/project/components/src/index.tsx
  var cx = (...a) => a.filter(Boolean).join(" ");
  var h = React.createElement;
  function Icon({ name, size = 24, strokeWidth = 1.5, title, className }) {
    const body = ICONS[name];
    if (!body) return null;
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: cx("sc-icon", className),
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        role: title ? "img" : void 0,
        "aria-label": title,
        "aria-hidden": title ? void 0 : true,
        focusable: "false",
        dangerouslySetInnerHTML: { __html: body }
      }
    );
  }
  function Ornament({ variant = "mark", tone = "accent", size = 28, className }) {
    const mark = /* @__PURE__ */ React.createElement("svg", { className: "sc-ornament__mark", viewBox: `0 0 ${O_WIDTH} 100`, height: size, width: size * O_WIDTH / 100, "aria-hidden": "true", focusable: "false" }, /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: O_PATH }));
    if (variant === "rule") {
      return /* @__PURE__ */ React.createElement("div", { className: cx("sc-ornament", "sc-ornament--rule", "sc-tone-" + tone, className), role: "separator", style: { ["--sc-orn-size"]: size + "px" } }, /* @__PURE__ */ React.createElement("span", { className: "sc-ornament__line" }), mark, /* @__PURE__ */ React.createElement("span", { className: "sc-ornament__line" }));
    }
    return /* @__PURE__ */ React.createElement("span", { className: cx("sc-ornament", "sc-tone-" + tone, className), "aria-hidden": "true" }, mark);
  }
  function Wordmark({ size = "md", tone = "ink", nonprofit = false, href, className }) {
    const cls = cx("sc-wordmark", "sc-wordmark--" + size, "sc-wordmark--" + tone, className);
    const inner = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "sc-wordmark__name" }, "Serra Cross Park"), nonprofit && size === "lg" && /* @__PURE__ */ React.createElement("span", { className: "sc-wordmark__np" }, /* @__PURE__ */ React.createElement("span", { className: "sc-wordmark__rule", "aria-hidden": "true" }), "Serra Cross Conservancy", /* @__PURE__ */ React.createElement("span", { className: "sc-wordmark__rule", "aria-hidden": "true" })));
    return href ? /* @__PURE__ */ React.createElement("a", { href, className: cls, "aria-label": "Serra Cross Park, home" }, inner) : /* @__PURE__ */ React.createElement("span", { className: cls }, inner);
  }
  function Button({ variant = "primary", size = "md", onDark = false, href, icon, iconPosition, fullWidth, type, className, children, ...rest }) {
    const pos = iconPosition || (variant === "give" ? "start" : "end");
    const cls = cx("sc-btn", "sc-btn--" + variant, "sc-btn--" + size, onDark && "sc-btn--on-dark", fullWidth && "sc-btn--full", className);
    const ic = icon ? /* @__PURE__ */ React.createElement(Icon, { name: icon, size: size === "lg" ? 22 : 20 }) : null;
    const content = /* @__PURE__ */ React.createElement(React.Fragment, null, pos === "start" && ic, /* @__PURE__ */ React.createElement("span", { className: cx("sc-btn__label", size === "lg" ? "label-lg" : "label") }, children), pos === "end" && ic);
    if (href) return /* @__PURE__ */ React.createElement("a", { href, className: cls, ...rest }, content);
    return /* @__PURE__ */ React.createElement("button", { type: type || "button", className: cls, ...rest }, content);
  }
  var DEFAULT_LINKS = [
    { label: "Weddings", href: "#weddings" },
    { label: "History", href: "#history" },
    { label: "Visit", href: "#visit" },
    { label: "FAQ", href: "#faq" }
  ];
  function SiteHeader({ links = DEFAULT_LINKS, active, overlay = false, homeHref = "#", donateHref = "#donate", bookHref = "#book", bookLabel = "Plan your event", className }) {
    const [open, setOpen] = React.useState(false);
    const menuId = React.useId ? React.useId() : "sc-menu";
    const linkList = (extra) => /* @__PURE__ */ React.createElement("ul", { className: cx("sc-header__links", extra) }, links.map((l) => /* @__PURE__ */ React.createElement("li", { key: l.href }, /* @__PURE__ */ React.createElement("a", { href: l.href, className: cx("sc-header__link", extra ? "label-lg" : "label", active === l.label && "is-active"), "aria-current": active === l.label ? "page" : void 0 }, l.label))));
    return /* @__PURE__ */ React.createElement("header", { className: cx("sc-header", overlay && "sc-header--overlay", open && "is-open", className) }, /* @__PURE__ */ React.createElement("div", { className: "sc-header__inner" }, /* @__PURE__ */ React.createElement(Wordmark, { href: homeHref, size: "sm", tone: overlay && !open ? "paper" : "ink" }), /* @__PURE__ */ React.createElement("nav", { className: "sc-header__nav", "aria-label": "Main" }, linkList()), /* @__PURE__ */ React.createElement("div", { className: "sc-header__actions" }, /* @__PURE__ */ React.createElement(Button, { variant: "give", href: donateHref, icon: "hand-heart" }, "Donate"), /* @__PURE__ */ React.createElement(Button, { variant: overlay ? "secondary" : "primary", onDark: overlay, href: bookHref }, bookLabel)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "sc-header__toggle", "aria-expanded": open, "aria-controls": menuId, onClick: () => setOpen(!open) }, /* @__PURE__ */ React.createElement(Icon, { name: open ? "x" : "menu", size: 26, title: open ? "Close menu" : "Open menu" }))), /* @__PURE__ */ React.createElement("div", { id: menuId, className: "sc-header__menu", hidden: !open }, /* @__PURE__ */ React.createElement("nav", { "aria-label": "Main, mobile" }, linkList("sc-header__links--stacked")), /* @__PURE__ */ React.createElement("div", { className: "sc-header__menu-actions" }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", href: bookHref, fullWidth: true }, bookLabel), /* @__PURE__ */ React.createElement(Button, { variant: "give", href: donateHref, icon: "hand-heart", fullWidth: true }, "Donate"))));
  }
  function Hero({ image, imageAlt = "", eyebrow, title, lede, actions, height = "tall", focal = "50% 50%", caption, header, align = "left" }) {
    return /* @__PURE__ */ React.createElement("section", { className: cx("sc-hero", "sc-hero--" + height, "sc-hero--" + align) }, /* @__PURE__ */ React.createElement("img", { className: "sc-hero__img", src: image, alt: imageAlt, style: { objectPosition: focal } }), /* @__PURE__ */ React.createElement("div", { className: "sc-hero__top", "aria-hidden": "true" }), header && /* @__PURE__ */ React.createElement("div", { className: "sc-hero__header" }, header), /* @__PURE__ */ React.createElement("div", { className: "sc-hero__content" }, /* @__PURE__ */ React.createElement("div", { className: "sc-hero__text" }, eyebrow && /* @__PURE__ */ React.createElement("p", { className: "sc-hero__eyebrow label" }, /* @__PURE__ */ React.createElement(Ornament, { tone: "paper", size: 20 }), /* @__PURE__ */ React.createElement("span", null, eyebrow)), /* @__PURE__ */ React.createElement("h1", { className: "sc-hero__title display-xl" }, title), lede && /* @__PURE__ */ React.createElement("p", { className: "sc-hero__lede lede" }, lede), actions && /* @__PURE__ */ React.createElement("div", { className: "sc-hero__actions" }, actions)), caption && /* @__PURE__ */ React.createElement("p", { className: "sc-hero__caption caption" }, /* @__PURE__ */ React.createElement("span", null, caption))));
  }
  function SectionHeading({ eyebrow, title, intro, size = "lg", align = "left", ornament = false, onDark = false, as = "h2" }) {
    return /* @__PURE__ */ React.createElement("div", { className: cx("sc-sh", "sc-sh--" + align, onDark && "sc-sh--on-dark") }, eyebrow && /* @__PURE__ */ React.createElement("p", { className: "sc-sh__eyebrow label" }, eyebrow), h(as, { className: cx("sc-sh__title", size === "lg" ? "display-lg" : "heading") }, title), ornament && /* @__PURE__ */ React.createElement(Ornament, { variant: "rule", tone: onDark ? "paper" : "accent", size: 22, className: "sc-sh__ornament" }), intro && /* @__PURE__ */ React.createElement("div", { className: "sc-sh__intro lede" }, intro));
  }
  function SignPanel({ tone = "green", title, children, image, imageAlt = "", caption, as = "h3" }) {
    return /* @__PURE__ */ React.createElement("article", { className: cx("sc-sign", "sc-sign--" + tone, image && "sc-sign--with-image") }, h(as, { className: "sc-sign__band heading" }, title), /* @__PURE__ */ React.createElement("div", { className: "sc-sign__body" }, /* @__PURE__ */ React.createElement("div", { className: "sc-sign__text body" }, children), image && /* @__PURE__ */ React.createElement("figure", { className: "sc-sign__figure" }, /* @__PURE__ */ React.createElement("img", { src: image, alt: imageAlt }), caption && /* @__PURE__ */ React.createElement("figcaption", { className: "caption" }, caption))));
  }
  function FeatureCard({ image, imageAlt = "", eyebrow, tone = "navy", title, text, href, linkLabel = "Learn more" }) {
    const body = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sc-card__media" }, /* @__PURE__ */ React.createElement("img", { src: image, alt: imageAlt, loading: "lazy" }), eyebrow && /* @__PURE__ */ React.createElement("span", { className: cx("sc-card__band", "label", "sc-band--" + tone) }, eyebrow)), /* @__PURE__ */ React.createElement("div", { className: "sc-card__body" }, /* @__PURE__ */ React.createElement("h3", { className: "sc-card__title heading-sm" }, title), text && /* @__PURE__ */ React.createElement("p", { className: "sc-card__text body-sm" }, text), href && /* @__PURE__ */ React.createElement("span", { className: "sc-card__more label" }, linkLabel, /* @__PURE__ */ React.createElement(Icon, { name: "arrow-right", size: 18 }))));
    return href ? /* @__PURE__ */ React.createElement("a", { className: "sc-card", href }, body) : /* @__PURE__ */ React.createElement("div", { className: "sc-card" }, body);
  }
  function FactGrid({ items, columns = 4 }) {
    return /* @__PURE__ */ React.createElement("dl", { className: cx("sc-facts", "sc-facts--" + columns) }, items.map((f) => /* @__PURE__ */ React.createElement("div", { className: "sc-fact", key: f.label }, /* @__PURE__ */ React.createElement("dt", { className: "sc-fact__label label" }, f.icon && /* @__PURE__ */ React.createElement(Icon, { name: f.icon, size: 20 }), f.label), /* @__PURE__ */ React.createElement("dd", { className: "sc-fact__value display-lg" }, f.value), f.note && /* @__PURE__ */ React.createElement("dd", { className: "sc-fact__note body-sm" }, f.note))));
  }
  function Steps({ steps, tone = "light" }) {
    return /* @__PURE__ */ React.createElement("ol", { className: cx("sc-steps", "sc-steps--" + tone, "sc-steps--n" + steps.length) }, steps.map((s, i) => /* @__PURE__ */ React.createElement("li", { className: "sc-step", key: i }, /* @__PURE__ */ React.createElement("span", { className: "sc-step__num display-lg", "aria-hidden": "true" }, i + 1), /* @__PURE__ */ React.createElement("h3", { className: "sc-step__title heading-sm" }, s.title), s.text && /* @__PURE__ */ React.createElement("p", { className: "sc-step__text body-sm" }, s.text))));
  }
  function Field({ label, name, type = "text", options = [], optional, help, error, placeholder, value, defaultValue, onChange, rows = 5, min, max, autoComplete, inputMode, className }) {
    const uid = React.useId ? React.useId() : name;
    const id = "f-" + name + "-" + uid.replace(/[^a-zA-Z0-9]/g, "");
    const describedBy = error ? id + "-err" : help ? id + "-help" : void 0;
    const common = { id, name, value, defaultValue, onChange, placeholder, required: !optional, "aria-invalid": error ? true : void 0, "aria-describedby": describedBy, className: "sc-field__control body" };
    let control;
    if (type === "textarea") control = /* @__PURE__ */ React.createElement("textarea", { ...common, rows });
    else if (type === "select")
      control = /* @__PURE__ */ React.createElement("span", { className: "sc-field__select" }, /* @__PURE__ */ React.createElement("select", { ...common }, placeholder && /* @__PURE__ */ React.createElement("option", { value: "" }, placeholder), options.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value }, o.label))), /* @__PURE__ */ React.createElement(Icon, { name: "chevron-down", size: 20 }));
    else control = /* @__PURE__ */ React.createElement("input", { ...common, type, min, max, autoComplete, inputMode });
    return /* @__PURE__ */ React.createElement("div", { className: cx("sc-field", error && "has-error", className) }, /* @__PURE__ */ React.createElement("label", { htmlFor: id, className: "sc-field__label" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, label), optional && /* @__PURE__ */ React.createElement("span", { className: "sc-field__opt body-sm" }, "Optional")), control, help && !error && /* @__PURE__ */ React.createElement("p", { id: id + "-help", className: "sc-field__help body-sm" }, help), error && /* @__PURE__ */ React.createElement("p", { id: id + "-err", className: "sc-field__error body-sm" }, /* @__PURE__ */ React.createElement(Icon, { name: "circle-alert", size: 18 }), /* @__PURE__ */ React.createElement("span", null, error)));
  }
  function ChoiceChips({ label, name, options, value, defaultValue, onChange, columns, hideLabel }) {
    const [inner, setInner] = React.useState(defaultValue != null ? defaultValue : options[0] && options[0].value);
    const current = value !== void 0 ? value : inner;
    const pick = (v) => {
      if (value === void 0) setInner(v);
      if (onChange) onChange(v);
    };
    return /* @__PURE__ */ React.createElement("fieldset", { className: "sc-chips" }, /* @__PURE__ */ React.createElement("legend", { className: cx("sc-chips__legend label", hideLabel && "sc-visually-hidden") }, label), /* @__PURE__ */ React.createElement("div", { className: cx("sc-chips__list", columns && "sc-chips__list--cols"), style: columns ? { ["--sc-cols"]: columns } : void 0 }, options.map((o) => {
      const checked = current === o.value;
      return /* @__PURE__ */ React.createElement("label", { key: o.value, className: cx("sc-chip", checked && "is-checked") }, /* @__PURE__ */ React.createElement("input", { type: "radio", name, value: o.value, checked, onChange: () => pick(o.value) }), /* @__PURE__ */ React.createElement("span", { className: "sc-chip__text body-sm" }, o.label), o.note && /* @__PURE__ */ React.createElement("span", { className: "sc-chip__note caption" }, o.note), checked && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 18, className: "sc-chip__check" }));
    })));
  }
  var EVENT_TYPES = [
    { value: "wedding", label: "Wedding" },
    { value: "vows", label: "Vow renewal" },
    { value: "memorial", label: "Memorial" },
    { value: "gathering", label: "Picnic or gathering" },
    { value: "school", label: "School trip" }
  ];
  var TIME_BLOCKS = [
    { value: "morning", label: "Morning", note: "9 to 12" },
    { value: "afternoon", label: "Afternoon", note: "1 to 4" },
    { value: "evening", label: "Evening", note: "5 to 8" }
  ];
  function InquiryForm({ title = "Tell us about your day", defaultEventType = "wedding", onSubmit, sent: sentProp }) {
    const [sent, setSent] = React.useState(!!sentProp);
    const submit = (e) => {
      e.preventDefault();
      const data = {};
      new FormData(e.currentTarget).forEach((v, k) => data[k] = String(v));
      if (onSubmit) onSubmit(data);
      setSent(true);
    };
    if (sent)
      return /* @__PURE__ */ React.createElement("div", { className: "sc-form sc-form--sent", role: "status" }, /* @__PURE__ */ React.createElement("p", { className: "sc-form__done label" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 22 }), "Inquiry sent"), /* @__PURE__ */ React.createElement("h3", { className: "heading" }, "Thank you"), /* @__PURE__ */ React.createElement("p", { className: "body" }, "The park office will contact you to confirm your date. Once it is confirmed, we hold it for up to 14 days while the site fee arrives."));
    return /* @__PURE__ */ React.createElement("form", { className: "sc-form", onSubmit: submit }, /* @__PURE__ */ React.createElement("h3", { className: "sc-form__title heading" }, title), /* @__PURE__ */ React.createElement("div", { className: "sc-form__grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Your name", name: "name", autoComplete: "name" }), /* @__PURE__ */ React.createElement(Field, { label: "Partner's name", name: "partner", optional: true }), /* @__PURE__ */ React.createElement(Field, { label: "Email", name: "email", type: "email", autoComplete: "email" }), /* @__PURE__ */ React.createElement(Field, { label: "Phone", name: "phone", type: "tel", autoComplete: "tel", optional: true })), /* @__PURE__ */ React.createElement(ChoiceChips, { label: "Type of event", name: "eventType", options: EVENT_TYPES, defaultValue: defaultEventType }), /* @__PURE__ */ React.createElement("div", { className: "sc-form__grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Preferred date", name: "date", type: "date", help: "Weekend events end by 7:30 PM." }), /* @__PURE__ */ React.createElement(Field, { label: "Guests", name: "guests", type: "number", min: 1, max: 500, inputMode: "numeric", help: "Up to 300 seated or 500 standing." })), /* @__PURE__ */ React.createElement(ChoiceChips, { label: "Time of day", name: "block", options: TIME_BLOCKS, defaultValue: "afternoon", columns: 3 }), /* @__PURE__ */ React.createElement(Field, { label: "Anything else", name: "message", type: "textarea", rows: 4, optional: true, placeholder: "Ceremony only, or ceremony and reception? Caterer, rentals, questions." }), /* @__PURE__ */ React.createElement("div", { className: "sc-form__footer" }, /* @__PURE__ */ React.createElement(Button, { type: "submit", variant: "primary", size: "lg", icon: "arrow-right" }, "Send inquiry"), /* @__PURE__ */ React.createElement("p", { className: "body-sm sc-form__note" }, "The park office replies to confirm your date. Rate: $300 per hour, two-hour minimum.")));
  }
  var money = (n) => "$" + n.toLocaleString("en-US");
  var WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  var say = (n) => WORDS[n] || String(n);
  function GivingForm({ defaultTab = "gift", amounts = [50, 100, 250, 500], rate = 300, minHours = 2, maxHours = 11, ein = "20-8615264", onSubmit }) {
    var _a;
    const [tab, setTab] = React.useState(defaultTab);
    const [amount, setAmount] = React.useState(String((_a = amounts[1]) != null ? _a : amounts[0]));
    const [other, setOther] = React.useState("");
    const [hours, setHours] = React.useState(minHours);
    const giftValue = amount === "other" ? Math.max(0, Math.floor(Number(other) || 0)) : Number(amount);
    const fee = hours * rate;
    const base = React.useId ? React.useId().replace(/[^a-zA-Z0-9]/g, "") : "g";
    const tabs = [
      { id: "gift", label: "Make a gift" },
      { id: "fee", label: "Pay a site fee" }
    ];
    const submit = (e) => {
      e.preventDefault();
      if (onSubmit) onSubmit(tab === "gift" ? { kind: "gift", amount: giftValue } : { kind: "fee", amount: fee, hours });
    };
    const hourOptions = [];
    for (let i = minHours; i <= maxHours; i++) hourOptions.push({ value: String(i), label: `${i} hours (${money(i * rate)})` });
    return /* @__PURE__ */ React.createElement("div", { className: "sc-give" }, /* @__PURE__ */ React.createElement("div", { className: "sc-give__tabs", role: "tablist", "aria-label": "Ways to give" }, tabs.map((t) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.id,
        type: "button",
        role: "tab",
        id: base + "-tab-" + t.id,
        "aria-controls": base + "-panel-" + t.id,
        "aria-selected": tab === t.id,
        tabIndex: tab === t.id ? 0 : -1,
        className: cx("sc-give__tab label", tab === t.id && "is-active"),
        onClick: () => setTab(t.id)
      },
      t.label
    ))), /* @__PURE__ */ React.createElement("form", { className: "sc-give__panel", role: "tabpanel", id: base + "-panel-" + tab, "aria-labelledby": base + "-tab-" + tab, onSubmit: submit }, tab === "gift" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "body sc-give__intro" }, "Every gift replants what the Thomas Fire took and keeps the hilltop cared for."), /* @__PURE__ */ React.createElement(
      ChoiceChips,
      {
        label: "Gift amount",
        name: "amount",
        value: amount,
        onChange: setAmount,
        columns: 5,
        options: [...amounts.map((a) => ({ value: String(a), label: money(a) })), { value: "other", label: "Other" }]
      }
    ), amount === "other" && /* @__PURE__ */ React.createElement(Field, { label: "Your amount, in dollars", name: "other", type: "number", min: 1, inputMode: "numeric", value: other, onChange: (e) => setOther(e.target.value) }), /* @__PURE__ */ React.createElement(Button, { type: "submit", variant: "give", size: "lg", icon: "hand-heart", fullWidth: true, disabled: !giftValue }, giftValue ? `Give ${money(giftValue)}` : "Give"), /* @__PURE__ */ React.createElement("p", { className: "sc-give__legal body-sm" }, "Serra Cross Conservancy is a 501(c)(3) nonprofit, Tax ID ", ein, ". Gifts are tax-deductible as allowed by law.")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "body sc-give__intro" }, "The site fee reserves your date once the park office confirms it. ", money(rate), " per hour, ", say(minHours), "-hour minimum."), /* @__PURE__ */ React.createElement("div", { className: "sc-form__grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Name on the reservation", name: "reservation", autoComplete: "name" }), /* @__PURE__ */ React.createElement(Field, { label: "Event date", name: "date", type: "date" })), /* @__PURE__ */ React.createElement(Field, { label: "Hours", name: "hours", type: "select", value: String(hours), onChange: (e) => setHours(Number(e.target.value)), options: hourOptions, help: "Include setup and breakdown time." }), /* @__PURE__ */ React.createElement("div", { className: "sc-give__total" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "Site fee"), /* @__PURE__ */ React.createElement("span", { className: "sc-give__sum display-lg" }, money(fee))), /* @__PURE__ */ React.createElement(Button, { type: "submit", variant: "primary", size: "lg", icon: "arrow-right", fullWidth: true }, `Pay ${money(fee)}`), /* @__PURE__ */ React.createElement("p", { className: "sc-give__legal body-sm" }, "Site fees are non-refundable. Your date is held for up to 14 days while the fee arrives."))));
  }
  function Timeline({ items }) {
    return /* @__PURE__ */ React.createElement("ol", { className: "sc-timeline" }, items.map((it) => /* @__PURE__ */ React.createElement("li", { className: "sc-tl", key: it.year + it.title }, /* @__PURE__ */ React.createElement("p", { className: "sc-tl__year display-lg" }, it.year), /* @__PURE__ */ React.createElement("span", { className: "sc-tl__marker" }, /* @__PURE__ */ React.createElement(Ornament, { size: 26 })), /* @__PURE__ */ React.createElement("div", { className: "sc-tl__body" }, /* @__PURE__ */ React.createElement("h3", { className: "sc-tl__title heading-sm" }, it.title), it.text && /* @__PURE__ */ React.createElement("p", { className: "sc-tl__text body" }, it.text), it.image && /* @__PURE__ */ React.createElement("figure", { className: "sc-tl__figure" }, /* @__PURE__ */ React.createElement("img", { src: it.image, alt: it.imageAlt || "", loading: "lazy" }), it.caption && /* @__PURE__ */ React.createElement("figcaption", { className: "caption" }, it.caption))))));
  }
  function Gallery({ images, rowHeight = 220 }) {
    return /* @__PURE__ */ React.createElement("div", { className: "sc-gallery", style: { gridAutoRows: rowHeight + "px" } }, images.map((im, i) => /* @__PURE__ */ React.createElement("figure", { className: cx("sc-gallery__item", "sc-gallery__item--" + (im.layout || "normal")), key: i }, /* @__PURE__ */ React.createElement("img", { src: im.src, alt: im.alt, loading: "lazy" }), im.caption && /* @__PURE__ */ React.createElement("figcaption", { className: "caption" }, im.caption))));
  }
  function FAQList({ items, defaultOpen = 0 }) {
    return /* @__PURE__ */ React.createElement("div", { className: "sc-faq" }, items.map((it, i) => /* @__PURE__ */ React.createElement("details", { className: "sc-faq__item", key: i, open: i === defaultOpen }, /* @__PURE__ */ React.createElement("summary", { className: "sc-faq__q" }, /* @__PURE__ */ React.createElement("span", { className: "lede" }, it.q), /* @__PURE__ */ React.createElement("span", { className: "sc-faq__icon", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 24, className: "sc-faq__plus" }), /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 24, className: "sc-faq__minus" }))), /* @__PURE__ */ React.createElement("div", { className: "sc-faq__a body" }, it.a))));
  }
  function Notice({ tone = "info", title, icon, children }) {
    return /* @__PURE__ */ React.createElement("aside", { className: cx("sc-notice", "sc-notice--" + tone) }, /* @__PURE__ */ React.createElement(Icon, { name: icon || (tone === "caution" ? "circle-alert" : "info"), size: 24, className: "sc-notice__icon" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "sc-notice__title label" }, title), children && /* @__PURE__ */ React.createElement("div", { className: "sc-notice__text body-sm" }, children)));
  }
  var DEFAULT_COLUMNS = [
    { title: "Explore", links: [{ label: "Weddings", href: "#weddings" }, { label: "History", href: "#history" }, { label: "Visit", href: "#visit" }, { label: "FAQ", href: "#faq" }] },
    { title: "Give", links: [{ label: "Make a gift", href: "#donate" }, { label: "Pay a site fee", href: "#site-fee" }] }
  ];
  function SiteFooter({ columns = DEFAULT_COLUMNS, ein = "20-8615264", email = "admin@serracrosspark.com", location = "Grant Park, above City Hall, Ventura, CA 93001", year = (/* @__PURE__ */ new Date()).getFullYear(), facebookHref = "https://www.facebook.com/groups/222411215009" }) {
    return /* @__PURE__ */ React.createElement("footer", { className: "sc-footer" }, /* @__PURE__ */ React.createElement("div", { className: "sc-footer__inner" }, /* @__PURE__ */ React.createElement("div", { className: "sc-footer__brand" }, /* @__PURE__ */ React.createElement(Wordmark, { size: "lg", tone: "paper", nonprofit: true }), /* @__PURE__ */ React.createElement("p", { className: "body-sm sc-footer__place" }, /* @__PURE__ */ React.createElement(Icon, { name: "map-pin", size: 18 }), location)), /* @__PURE__ */ React.createElement("div", { className: "sc-footer__cols" }, columns.map((c) => /* @__PURE__ */ React.createElement("nav", { className: "sc-footer__col", key: c.title, "aria-label": c.title }, /* @__PURE__ */ React.createElement("p", { className: "label sc-footer__head" }, c.title), /* @__PURE__ */ React.createElement("ul", null, c.links.map((l) => /* @__PURE__ */ React.createElement("li", { key: l.href }, /* @__PURE__ */ React.createElement("a", { className: "body-sm", href: l.href }, l.label)))))), /* @__PURE__ */ React.createElement("div", { className: "sc-footer__col" }, /* @__PURE__ */ React.createElement("p", { className: "label sc-footer__head" }, "Contact"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { className: "body-sm", href: "mailto:" + email }, /* @__PURE__ */ React.createElement(Icon, { name: "mail", size: 18 }), email)), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { className: "body-sm", href: facebookHref }, /* @__PURE__ */ React.createElement(Icon, { name: "facebook", size: 18 }), "Facebook group"))))), /* @__PURE__ */ React.createElement("div", { className: "sc-footer__legal body-sm" }, /* @__PURE__ */ React.createElement(Ornament, { tone: "paper", size: 18 }), /* @__PURE__ */ React.createElement("p", null, "Serra Cross Conservancy is a 501(c)(3) nonprofit. Tax ID ", ein, "."), /* @__PURE__ */ React.createElement("p", null, "© ", year, " Serra Cross Conservancy"))));
  }
  return __toCommonJS(index_exports);
})();

window.SerraCross = Object.assign(window.SerraCross || {}, __SC);
})();
