/*
 * Serra Cross Park components.
 * React is the page's global (window.React, 18.x). Styles live in components/bundle.css
 * and read the tokens in tokens.css; type classes (.display-xl, .heading, .body …) come from tokens.json.
 */
import { ICONS, O_PATH, O_WIDTH } from './generated';

import * as React from 'react';
type ReactNode = React.ReactNode;

const cx = (...a: any[]) => a.filter(Boolean).join(' ');
const h = React.createElement;

/** Extra attributes for a component's <img>: srcSet, sizes, width, height, loading, decoding, fetchPriority. */
export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

/* ------------------------------------------------------------------ Icon */
export type IconName =
  | 'arrow-right' | 'arrow-up-right' | 'chevron-down' | 'menu' | 'x' | 'plus' | 'minus' | 'check'
  | 'circle-alert' | 'info' | 'calendar' | 'clock' | 'users' | 'map-pin' | 'sunset' | 'accessibility'
  | 'toilet' | 'droplet' | 'plug-zap' | 'wine' | 'shield-check' | 'car' | 'lamp' | 'mail' | 'phone'
  | 'facebook' | 'hand-heart' | 'landmark' | 'linkedin' | 'instagram';

export interface IconProps { name: IconName; size?: number; strokeWidth?: number; title?: string; className?: string }
/** Lucide icon drawn in currentColor at a 1.5 stroke. */
export function Icon({ name, size = 24, strokeWidth = 1.5, title, className }: IconProps) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg
      className={cx('sc-icon', className)}
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

/* -------------------------------------------------------------- Ornament */
export interface OrnamentProps { variant?: 'mark' | 'rule'; tone?: 'accent' | 'ink' | 'paper'; size?: number; className?: string }
/** The dotted O from the display face, used as a mark or a divider rule. */
export function Ornament({ variant = 'mark', tone = 'accent', size = 28, className }: OrnamentProps) {
  const mark = (
    <svg className="sc-ornament__mark" viewBox={`0 0 ${O_WIDTH} 100`} height={size} width={(size * O_WIDTH) / 100} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={O_PATH} />
    </svg>
  );
  if (variant === 'rule') {
    return (
      <div className={cx('sc-ornament', 'sc-ornament--rule', 'sc-tone-' + tone, className)} role="separator" style={{ ['--sc-orn-size' as any]: size + 'px' }}>
        <span className="sc-ornament__line" />
        {mark}
        <span className="sc-ornament__line" />
      </div>
    );
  }
  return <span className={cx('sc-ornament', 'sc-tone-' + tone, className)} aria-hidden="true">{mark}</span>;
}

/* -------------------------------------------------------------- Wordmark */
export interface WordmarkProps { size?: 'sm' | 'md' | 'lg'; tone?: 'ink' | 'paper'; nonprofit?: boolean; href?: string; className?: string }
/** SERRA CROSS PARK set live in the display face, with the optional Conservancy line. */
export function Wordmark({ size = 'md', tone = 'ink', nonprofit = false, href, className }: WordmarkProps) {
  const cls = cx('sc-wordmark', 'sc-wordmark--' + size, 'sc-wordmark--' + tone, className);
  const inner = (
    <>
      <span className="sc-wordmark__name">Serra Cross Park</span>
      {nonprofit && size === 'lg' && (
        <span className="sc-wordmark__np">
          <span className="sc-wordmark__rule" aria-hidden="true" />
          Serra Cross Conservancy
          <span className="sc-wordmark__rule" aria-hidden="true" />
        </span>
      )}
    </>
  );
  return href ? <a href={href} className={cls} aria-label="Serra Cross Park, home">{inner}</a> : <span className={cls}>{inner}</span>;
}

/* ---------------------------------------------------------------- Button */
export interface ButtonProps {
  variant?: 'primary' | 'give' | 'secondary' | 'link';
  size?: 'md' | 'lg';
  onDark?: boolean;
  href?: string;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: any) => void;
  className?: string;
  children?: ReactNode;
  [rest: string]: any;
}
/** The one button. Labels are short verbs in the display face. */
export function Button({ variant = 'primary', size = 'md', onDark = false, href, icon, iconPosition, fullWidth, type, className, children, ...rest }: ButtonProps) {
  const pos = iconPosition || (variant === 'give' ? 'start' : 'end');
  const cls = cx('sc-btn', 'sc-btn--' + variant, 'sc-btn--' + size, onDark && 'sc-btn--on-dark', fullWidth && 'sc-btn--full', className);
  const ic = icon ? <Icon name={icon} size={size === 'lg' ? 22 : 20} /> : null;
  const content = (
    <>
      {pos === 'start' && ic}
      <span className={cx('sc-btn__label', size === 'lg' ? 'label-lg' : 'label')}>{children}</span>
      {pos === 'end' && ic}
    </>
  );
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>;
  return <button type={type || 'button'} className={cls} {...rest}>{content}</button>;
}

/* ------------------------------------------------------------ SiteHeader */
export interface NavLink { label: string; href: string }
export interface SiteHeaderProps {
  links?: NavLink[];
  active?: string;
  overlay?: boolean;
  homeHref?: string;
  donateHref?: string;
  bookHref?: string;
  bookLabel?: string;
  className?: string;
}
const DEFAULT_LINKS: NavLink[] = [
  { label: 'Weddings', href: '#weddings' },
  { label: 'History', href: '#history' },
  { label: 'Visit', href: '#visit' },
  { label: 'FAQ', href: '#faq' },
];
/** Wordmark, four links, Donate and the booking button. Collapses to a menu under 960px. */
export function SiteHeader({ links = DEFAULT_LINKS, active, overlay = false, homeHref = '#', donateHref = '#donate', bookHref = '#book', bookLabel = 'Plan your event', className }: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId ? React.useId() : 'sc-menu';
  const linkList = (extra?: string) => (
    <ul className={cx('sc-header__links', extra)}>
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} className={cx('sc-header__link', extra ? 'label-lg' : 'label', active === l.label && 'is-active')} aria-current={active === l.label ? 'page' : undefined}>{l.label}</a>
        </li>
      ))}
    </ul>
  );
  return (
    <header className={cx('sc-header', overlay && 'sc-header--overlay', open && 'is-open', className)}>
      <div className="sc-header__inner">
        <Wordmark href={homeHref} size="sm" tone={overlay && !open ? 'paper' : 'ink'} />
        <nav className="sc-header__nav" aria-label="Main">{linkList()}</nav>
        <div className="sc-header__actions">
          <Button variant="give" href={donateHref} icon="hand-heart">Donate</Button>
          <Button variant={overlay ? 'secondary' : 'primary'} onDark={overlay} href={bookHref}>{bookLabel}</Button>
        </div>
        <button type="button" className="sc-header__toggle" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'x' : 'menu'} size={26} title={open ? 'Close menu' : 'Open menu'} />
        </button>
      </div>
      <div id={menuId} className="sc-header__menu" hidden={!open}>
        <nav aria-label="Main, mobile">{linkList('sc-header__links--stacked')}</nav>
        <div className="sc-header__menu-actions">
          <Button variant="primary" href={bookHref} fullWidth>{bookLabel}</Button>
          <Button variant="give" href={donateHref} icon="hand-heart" fullWidth>Donate</Button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ Hero */
export interface HeroProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
  height?: 'full' | 'tall' | 'short';
  focal?: string;
  caption?: string;
  header?: ReactNode;
  align?: 'left' | 'center';
  imgProps?: ImgProps;
}
/** Full-bleed photo with the title slide set over a navy scrim. */
export function Hero({ image, imageAlt = '', eyebrow, title, lede, actions, height = 'tall', focal = '50% 50%', caption, header, align = 'left', imgProps }: HeroProps) {
  return (
    <div className={cx('sc-hero', 'sc-hero--' + height, 'sc-hero--' + align)}>
      <img className="sc-hero__img" src={image} alt={imageAlt} style={{ objectPosition: focal }} {...imgProps} />
      <div className="sc-hero__top" aria-hidden="true" />
      {header && <div className="sc-hero__header">{header}</div>}
      <div className="sc-hero__content">
        <div className="sc-hero__text">
          {eyebrow && (
            <p className="sc-hero__eyebrow label">
              <Ornament tone="paper" size={20} />
              <span>{eyebrow}</span>
            </p>
          )}
          <h1 className="sc-hero__title display-xl">{title}</h1>
          {lede && <p className="sc-hero__lede lede">{lede}</p>}
          {actions && <div className="sc-hero__actions">{actions}</div>}
        </div>
        {caption && <p className="sc-hero__caption caption"><span>{caption}</span></p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- SectionHeading */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  size?: 'lg' | 'md';
  align?: 'left' | 'center';
  ornament?: boolean;
  onDark?: boolean;
  as?: 'h1' | 'h2' | 'h3';
}
/** Eyebrow, title and intro that open a section. */
export function SectionHeading({ eyebrow, title, intro, size = 'lg', align = 'left', ornament = false, onDark = false, as = 'h2' }: SectionHeadingProps) {
  return (
    <div className={cx('sc-sh', 'sc-sh--' + align, onDark && 'sc-sh--on-dark')}>
      {eyebrow && <p className="sc-sh__eyebrow label">{eyebrow}</p>}
      {h(as, { className: cx('sc-sh__title', size === 'lg' ? 'display-lg' : 'heading') }, title)}
      {ornament && <Ornament variant="rule" tone={onDark ? 'paper' : 'accent'} size={22} className="sc-sh__ornament" />}
      {intro && <div className="sc-sh__intro lede">{intro}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- SignPanel */
export interface SignPanelProps {
  tone?: 'green' | 'navy' | 'brick' | 'ochre';
  title: string;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
  caption?: string;
  as?: 'h2' | 'h3';
  imgProps?: ImgProps;
}
/** A panel built like the park's interpretive sign: a colored band title over serif text. */
export function SignPanel({ tone = 'green', title, children, image, imageAlt = '', caption, as = 'h3', imgProps }: SignPanelProps) {
  return (
    <article className={cx('sc-sign', 'sc-sign--' + tone, image && 'sc-sign--with-image')}>
      {h(as, { className: 'sc-sign__band heading' }, title)}
      <div className="sc-sign__body">
        <div className="sc-sign__text body">{children}</div>
        {image && (
          <figure className="sc-sign__figure">
            <img src={image} alt={imageAlt} {...imgProps} />
            {caption && <figcaption className="caption">{caption}</figcaption>}
          </figure>
        )}
      </div>
    </article>
  );
}

/* ----------------------------------------------------------- FeatureCard */
export interface FeatureCardProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  tone?: 'navy' | 'green' | 'brick' | 'ochre';
  title: string;
  text?: ReactNode;
  href?: string;
  linkLabel?: string;
  imgProps?: ImgProps;
}
/** Photo, sign-band label, title and one line. The whole card is the link. */
export function FeatureCard({ image, imageAlt = '', eyebrow, tone = 'navy', title, text, href, linkLabel = 'Learn more', imgProps }: FeatureCardProps) {
  const body = (
    <>
      <div className="sc-card__media">
        <img src={image} alt={imageAlt} loading="lazy" {...imgProps} />
        {eyebrow && <span className={cx('sc-card__band', 'label', 'sc-band--' + tone)}>{eyebrow}</span>}
      </div>
      <div className="sc-card__body">
        <h3 className="sc-card__title heading-sm">{title}</h3>
        {text && <p className="sc-card__text body-sm">{text}</p>}
        {href && (
          <span className="sc-card__more label">
            {linkLabel}
            <Icon name="arrow-right" size={18} />
          </span>
        )}
      </div>
    </>
  );
  return href ? <a className="sc-card" href={href}>{body}</a> : <div className="sc-card">{body}</div>;
}

/* -------------------------------------------------------------- FactGrid */
export interface Fact { icon?: IconName; label: string; value: string; note?: string }
export interface FactGridProps { items: Fact[]; columns?: 2 | 3 | 4 }
/** The venue's numbers at a glance: guests, rate, hours, view. */
/** Site change (logged): "to" and "or" inside a value drop out of the display capitals. */
const FACT_WORD = /(\bto\b|\bor\b)/;
function factValue(value: string) {
  const parts = value.split(FACT_WORD);
  if (parts.length === 1) return value;
  return parts.map((part, i) => (part === 'to' || part === 'or' ? <span key={i} className="sc-fact__word">{part}</span> : part));
}
export function FactGrid({ items, columns = 4 }: FactGridProps) {
  return (
    <dl className={cx('sc-facts', 'sc-facts--' + columns)}>
      {items.map((f) => (
        <div className="sc-fact" key={f.label}>
          <dt className="sc-fact__label label">
            {f.icon && <Icon name={f.icon} size={20} />}
            {f.label}
          </dt>
          <dd className="sc-fact__value display-lg">{factValue(f.value)}</dd>
          {f.note && <dd className="sc-fact__note body-sm">{f.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

/* ----------------------------------------------------------------- Steps */
export interface Step { title: string; text?: ReactNode }
export interface StepsProps { steps: Step[]; tone?: 'light' | 'dark' }
/** Numbered steps, e.g. how booking works. */
export function Steps({ steps, tone = 'light' }: StepsProps) {
  return (
    <ol className={cx('sc-steps', 'sc-steps--' + tone, 'sc-steps--n' + steps.length)}>
      {steps.map((s, i) => (
        <li className="sc-step" key={i}>
          <span className="sc-step__num display-lg" aria-hidden="true">{i + 1}</span>
          <h3 className="sc-step__title heading-sm">{s.title}</h3>
          {s.text && <p className="sc-step__text body-sm">{s.text}</p>}
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------------------------------- Field */
export interface FieldOption { value: string; label: string }
export interface FieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea';
  options?: FieldOption[];
  optional?: boolean;
  help?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
  rows?: number;
  min?: number | string;
  max?: number | string;
  autoComplete?: string;
  inputMode?: string;
  className?: string;
}
/** Label, control, help or error. Every form on the site is built from these. */
export function Field({ label, name, type = 'text', options = [], optional, help, error, placeholder, value, defaultValue, onChange, rows = 5, min, max, autoComplete, inputMode, className }: FieldProps) {
  const uid = React.useId ? React.useId() : name;
  const id = 'f-' + name + '-' + uid.replace(/[^a-zA-Z0-9]/g, '');
  const describedBy = error ? id + '-err' : help ? id + '-help' : undefined;
  const common = { id, name, value, defaultValue, onChange, placeholder, required: !optional, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, className: 'sc-field__control body' };
  let control;
  if (type === 'textarea') control = <textarea {...common} rows={rows} />;
  else if (type === 'select')
    control = (
      <span className="sc-field__select">
        <select {...common}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" size={20} />
      </span>
    );
  else control = <input {...common} type={type} min={min} max={max} autoComplete={autoComplete} inputMode={inputMode as React.InputHTMLAttributes<HTMLInputElement>['inputMode']} />;
  return (
    <div className={cx('sc-field', error && 'has-error', className)}>
      <label htmlFor={id} className="sc-field__label">
        <span className="label">{label}</span>
        {optional && <span className="sc-field__opt body-sm">Optional</span>}
      </label>
      {control}
      {help && !error && <p id={id + '-help'} className="sc-field__help body-sm">{help}</p>}
      {error && (
        <p id={id + '-err'} className="sc-field__error body-sm">
          <Icon name="circle-alert" size={18} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- ChoiceChips */
export interface Choice { value: string; label: string; note?: string }
export interface ChoiceChipsProps {
  label: string;
  name: string;
  options: Choice[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  columns?: number;
  hideLabel?: boolean;
}
/** A single-choice radio group drawn as chips: time blocks, event types, gift amounts. */
export function ChoiceChips({ label, name, options, value, defaultValue, onChange, columns, hideLabel }: ChoiceChipsProps) {
  const [inner, setInner] = React.useState(defaultValue ?? (options[0] && options[0].value));
  const current = value !== undefined ? value : inner;
  const pick = (v: string) => {
    if (value === undefined) setInner(v);
    if (onChange) onChange(v);
  };
  return (
    <fieldset className="sc-chips">
      <legend className={cx('sc-chips__legend label', hideLabel && 'sc-visually-hidden')}>{label}</legend>
      <div className={cx('sc-chips__list', columns && 'sc-chips__list--cols')} style={columns ? { ['--sc-cols' as any]: columns } : undefined}>
        {options.map((o) => {
          const checked = current === o.value;
          return (
            <label key={o.value} className={cx('sc-chip', checked && 'is-checked')}>
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => pick(o.value)} />
              <span className="sc-chip__text body-sm">{o.label}</span>
              {o.note && <span className="sc-chip__note caption">{o.note}</span>}
              {checked && <Icon name="check" size={18} className="sc-chip__check" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ----------------------------------------------------------- InquiryForm */
export interface InquiryFormProps { title?: string; defaultEventType?: string; onSubmit?: (data: Record<string, string>) => void; sent?: boolean; blockLabel?: string; blockOptions?: Choice[]; timeField?: { name: string; label: string; options: FieldOption[]; help?: string }; dateHelp?: string; sentText?: ReactNode; guestsHelp?: string; guestsMax?: number }
const EVENT_TYPES: Choice[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'vows', label: 'Vow renewal' },
  { value: 'memorial', label: 'Memorial' },
  { value: 'gathering', label: 'Picnic or gathering' },
  { value: 'school', label: 'School trip' },
];
const TIME_BLOCKS: Choice[] = [
  { value: 'morning', label: 'Morning', note: '9 to 12' },
  { value: 'afternoon', label: 'Afternoon', note: '1 to 4' },
  { value: 'evening', label: 'Evening', note: '5 to 8' },
];
/** The event inquiry: who, what, when, how many. The park office follows up to confirm. */
export function InquiryForm({ title = 'Tell us about your day', defaultEventType = 'wedding', onSubmit, sent: sentProp, blockLabel = 'Time of day', blockOptions = TIME_BLOCKS, timeField, dateHelp = 'Weekend events end by 7:30 PM.', sentText = 'The park office will contact you to confirm your date. Once it is confirmed, we hold it for up to 14 days while the site fee arrives.', guestsHelp = 'Up to 300 seated or 500 standing.', guestsMax = 500 }: InquiryFormProps) {
  const [sent, setSent] = React.useState(!!sentProp);
  const submit = (e: any) => {
    e.preventDefault();
    const data: Record<string, string> = {};
    new FormData(e.currentTarget).forEach((v: any, k: string) => (data[k] = String(v)));
    if (onSubmit) onSubmit(data);
    setSent(true);
  };
  if (sent)
    return (
      <div className="sc-form sc-form--sent" role="status">
        <p className="sc-form__done label"><Icon name="check" size={22} />Inquiry sent</p>
        <h3 className="heading">Thank you</h3>
        <p className="body">{sentText}</p>
      </div>
    );
  return (
    <form className="sc-form" onSubmit={submit}>
      <h3 className="sc-form__title heading">{title}</h3>
      <div className="sc-form__grid">
        <Field label="Your name" name="name" autoComplete="name" />
        <Field label="Partner's name" name="partner" optional />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
      </div>
      <ChoiceChips label="Type of event" name="eventType" options={EVENT_TYPES} defaultValue={defaultEventType} />
      <div className="sc-form__grid">
        <Field label="Preferred date" name="date" type="date" help={dateHelp} />
        <Field label="Guests" name="guests" type="number" min={1} max={guestsMax} inputMode="numeric" help={guestsHelp} />
      </div>
      {timeField ? (
        <Field label={timeField.label} name={timeField.name} type="select" options={timeField.options} help={timeField.help} />
      ) : (
        <ChoiceChips label={blockLabel} name="block" options={blockOptions} defaultValue="afternoon" columns={3} />
      )}
      <Field label="Anything else" name="message" type="textarea" rows={4} optional placeholder="Ceremony only, or ceremony and reception? Caterer, rentals, questions." />
      <div className="sc-form__footer">
        <Button type="submit" variant="primary" size="lg" icon="arrow-right">Send inquiry</Button>
        <p className="body-sm sc-form__note">The park office replies to confirm your date. Rate: $300 per hour, two-hour minimum.</p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------ GivingForm */
export interface GivingFormProps {
  defaultTab?: 'gift' | 'fee';
  amounts?: number[];
  rate?: number;
  minHours?: number;
  maxHours?: number;
  ein?: string;
  onSubmit?: (data: { kind: 'gift' | 'fee'; amount: number; [k: string]: any }) => void;
}
const money = (n: number) => '$' + n.toLocaleString('en-US');
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const say = (n: number) => WORDS[n] || String(n);
/** One place to give: a one-time gift, or the site fee that reserves an event. */
export function GivingForm({ defaultTab = 'gift', amounts = [50, 100, 250, 500], rate = 300, minHours = 2, maxHours = 11, ein = '20-8615264', onSubmit }: GivingFormProps) {
  const [tab, setTab] = React.useState(defaultTab);
  const [amount, setAmount] = React.useState(String(amounts[1] ?? amounts[0]));
  const [other, setOther] = React.useState('');
  const [hours, setHours] = React.useState(minHours);
  const giftValue = amount === 'other' ? Math.max(0, Math.floor(Number(other) || 0)) : Number(amount);
  const fee = hours * rate;
  const base = React.useId ? React.useId().replace(/[^a-zA-Z0-9]/g, '') : 'g';
  const tabs: { id: 'gift' | 'fee'; label: string }[] = [
    { id: 'gift', label: 'Make a gift' },
    { id: 'fee', label: 'Pay a site fee' },
  ];
  const submit = (e: any) => {
    e.preventDefault();
    if (onSubmit) onSubmit(tab === 'gift' ? { kind: 'gift', amount: giftValue } : { kind: 'fee', amount: fee, hours });
  };
  const hourOptions: FieldOption[] = [];
  for (let i = minHours; i <= maxHours; i++) hourOptions.push({ value: String(i), label: `${i} hours (${money(i * rate)})` });
  return (
    <div className="sc-give">
      <div className="sc-give__tabs" role="tablist" aria-label="Ways to give">
        {tabs.map((t) => (
          <button
            key={t.id} type="button" role="tab" id={base + '-tab-' + t.id} aria-controls={base + '-panel-' + t.id}
            aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1}
            className={cx('sc-give__tab label', tab === t.id && 'is-active')} onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <form className="sc-give__panel" role="tabpanel" id={base + '-panel-' + tab} aria-labelledby={base + '-tab-' + tab} onSubmit={submit}>
        {tab === 'gift' ? (
          <>
            <p className="body sc-give__intro">Every gift replants what the Thomas Fire took and keeps the hilltop cared for.</p>
            <ChoiceChips
              label="Gift amount" name="amount" value={amount} onChange={setAmount} columns={5}
              options={[...amounts.map((a) => ({ value: String(a), label: money(a) })), { value: 'other', label: 'Other' }]}
            />
            {amount === 'other' && <Field label="Your amount, in dollars" name="other" type="number" min={1} inputMode="numeric" value={other} onChange={(e: any) => setOther(e.target.value)} />}
            <Button type="submit" variant="give" size="lg" icon="hand-heart" fullWidth disabled={!giftValue}>
              {giftValue ? `Give ${money(giftValue)}` : 'Give'}
            </Button>
            <p className="sc-give__legal body-sm">Serra Cross Conservancy is a 501(c)(3) nonprofit, Tax ID {ein}. Gifts are tax-deductible as allowed by law.</p>
          </>
        ) : (
          <>
            <p className="body sc-give__intro">The site fee reserves your date once the park office confirms it. {money(rate)} per hour, {say(minHours)}-hour minimum.</p>
            <div className="sc-form__grid">
              <Field label="Name on the reservation" name="reservation" autoComplete="name" />
              <Field label="Event date" name="date" type="date" />
            </div>
            <Field label="Hours" name="hours" type="select" value={String(hours)} onChange={(e: any) => setHours(Number(e.target.value))} options={hourOptions} help="Include setup and breakdown time." />
            <div className="sc-give__total">
              <span className="label">Site fee</span>
              <span className="sc-give__sum display-lg">{money(fee)}</span>
            </div>
            <Button type="submit" variant="primary" size="lg" icon="arrow-right" fullWidth>{`Pay ${money(fee)}`}</Button>
            <p className="sc-give__legal body-sm">Site fees are non-refundable. Your date is held for up to 14 days while the fee arrives.</p>
          </>
        )}
      </form>
    </div>
  );
}

/* -------------------------------------------------------------- Timeline */
export interface TimelineItem { year: string; title: string; text?: ReactNode; image?: string; imageAlt?: string; caption?: string; imgProps?: ImgProps }
export interface TimelineProps { items: TimelineItem[] }
/** The history of the Cross, year by year, with the dotted O as the marker. */
export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="sc-timeline">
      {items.map((it) => (
        <li className="sc-tl" key={it.year + it.title}>
          <p className="sc-tl__year display-lg">{it.year}</p>
          <span className="sc-tl__marker"><Ornament size={26} /></span>
          <div className="sc-tl__body">
            <h3 className="sc-tl__title heading-sm">{it.title}</h3>
            {it.text && <p className="sc-tl__text body">{it.text}</p>}
            {it.image && (
              <figure className="sc-tl__figure">
                <img src={it.image} alt={it.imageAlt || ''} loading="lazy" {...it.imgProps} />
                {it.caption && <figcaption className="caption">{it.caption}</figcaption>}
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------------- Gallery */
export interface GalleryImage { src: string; alt: string; caption?: string; layout?: 'normal' | 'wide' | 'tall'; imgProps?: ImgProps }
export interface GalleryProps { images: GalleryImage[]; rowHeight?: number }
/** A mosaic of real park photographs with captions on a scrim strip. */
export function Gallery({ images, rowHeight = 220 }: GalleryProps) {
  return (
    <div className="sc-gallery" style={{ gridAutoRows: rowHeight + 'px' }}>
      {images.map((im, i) => (
        <figure className={cx('sc-gallery__item', 'sc-gallery__item--' + (im.layout || 'normal'))} key={i}>
          <img src={im.src} alt={im.alt} loading="lazy" {...im.imgProps} />
          {im.caption && <figcaption className="caption">{im.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- FAQList */
export interface FAQItem { q: string; a: ReactNode }
export interface FAQListProps { items: FAQItem[]; defaultOpen?: number }
/** Questions couples and visitors ask, as an accordion. */
export function FAQList({ items, defaultOpen = 0 }: FAQListProps) {
  return (
    <div className="sc-faq">
      {items.map((it, i) => (
        <details className="sc-faq__item" key={i} open={i === defaultOpen}>
          <summary className="sc-faq__q">
            <span className="lede">{it.q}</span>
            <span className="sc-faq__icon" aria-hidden="true">
              <Icon name="plus" size={24} className="sc-faq__plus" />
              <Icon name="minus" size={24} className="sc-faq__minus" />
            </span>
          </summary>
          <div className="sc-faq__a body">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Notice */
export interface NoticeProps { tone?: 'info' | 'caution'; title: string; icon?: IconName; children?: ReactNode }
/** A short practical note: no water on site, gates lock at eight. */
export function Notice({ tone = 'info', title, icon, children }: NoticeProps) {
  return (
    <aside className={cx('sc-notice', 'sc-notice--' + tone)}>
      <Icon name={icon || (tone === 'caution' ? 'circle-alert' : 'info')} size={24} className="sc-notice__icon" />
      <div>
        <p className="sc-notice__title label">{title}</p>
        {children && <div className="sc-notice__text body-sm">{children}</div>}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------ SiteFooter */
export interface FooterColumn { title: string; links: NavLink[] }
export interface FooterCredit { label: string; href: string }
export interface SiteFooterProps { columns?: FooterColumn[]; ein?: string; email?: string; location?: string; year?: number; facebookHref?: string; instagramHref?: string; credit?: FooterCredit }
const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: 'Explore', links: [{ label: 'Weddings', href: '#weddings' }, { label: 'History', href: '#history' }, { label: 'Visit', href: '#visit' }, { label: 'FAQ', href: '#faq' }] },
  { title: 'Give', links: [{ label: 'Make a gift', href: '#donate' }, { label: 'Pay a site fee', href: '#site-fee' }] },
];
/** Navy footer: lockup, links, contact and the nonprofit line with the Tax ID. */
export function SiteFooter({ columns = DEFAULT_COLUMNS, ein = '20-8615264', email = 'admin@serracrosspark.com', location = 'Grant Park, above City Hall, Ventura, CA 93001', year = new Date().getFullYear(), facebookHref = 'https://www.facebook.com/groups/222411215009', instagramHref, credit }: SiteFooterProps) {
  return (
    <footer className="sc-footer">
      <div className="sc-footer__inner">
        <div className="sc-footer__brand">
          <Wordmark size="lg" tone="paper" nonprofit />
          <p className="body-sm sc-footer__place"><Icon name="map-pin" size={18} />{location}</p>
        </div>
        <div className="sc-footer__cols">
          {columns.map((c) => (
            <nav className="sc-footer__col" key={c.title} aria-label={c.title}>
              <p className="label sc-footer__head">{c.title}</p>
              <ul>{c.links.map((l) => <li key={l.href}><a className="body-sm" href={l.href}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
          <div className="sc-footer__col">
            <p className="label sc-footer__head">Contact</p>
            <ul>
              <li><a className="body-sm" href={'mailto:' + email}><Icon name="mail" size={18} />{email}</a></li>
              <li><a className="body-sm" href={facebookHref}><Icon name="facebook" size={18} />Facebook group</a></li>
              {instagramHref && <li><a className="body-sm" href={instagramHref}><Icon name="instagram" size={18} />Instagram</a></li>}
            </ul>
          </div>
        </div>
        <div className="sc-footer__legal body-sm">
          <Ornament tone="paper" size={18} />
          <p>Serra Cross Conservancy is a 501(c)(3) nonprofit. Tax ID {ein}.</p>
          <p>© {year} Serra Cross Conservancy</p>
          {credit && <p><a href={credit.href}>{credit.label}</a></p>}
        </div>
      </div>
    </footer>
  );
}
