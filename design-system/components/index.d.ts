import type * as React from 'react';

export type IconName =
  | 'arrow-right' | 'arrow-up-right' | 'chevron-down' | 'menu' | 'x' | 'plus' | 'minus' | 'check'
  | 'circle-alert' | 'info' | 'calendar' | 'clock' | 'users' | 'map-pin' | 'sunset' | 'accessibility'
  | 'toilet' | 'droplet' | 'plug-zap' | 'wine' | 'shield-check' | 'car' | 'lamp' | 'mail' | 'phone'
  | 'facebook' | 'hand-heart' | 'landmark';

export interface WordmarkProps { size?: 'sm' | 'md' | 'lg'; tone?: 'ink' | 'paper'; nonprofit?: boolean; href?: string; className?: string }
export declare function Wordmark(props: WordmarkProps): React.ReactElement;

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'give' | 'secondary' | 'link';
  size?: 'md' | 'lg';
  onDark?: boolean;
  href?: string;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconProps { name: IconName; size?: number; strokeWidth?: number; title?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement | null;

export interface OrnamentProps { variant?: 'mark' | 'rule'; tone?: 'accent' | 'ink' | 'paper'; size?: number; className?: string }
export declare function Ornament(props: OrnamentProps): React.ReactElement;

export interface NavLink { label: string; href: string }
export interface SiteHeaderProps { links?: NavLink[]; active?: string; overlay?: boolean; homeHref?: string; donateHref?: string; bookHref?: string; bookLabel?: string; className?: string }
export declare function SiteHeader(props: SiteHeaderProps): React.ReactElement;

export interface HeroProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: React.ReactNode;
  height?: 'full' | 'tall' | 'short';
  /** CSS object-position for the photo, e.g. "50% 30%". */
  focal?: string;
  caption?: string;
  /** Usually <SiteHeader overlay />. */
  header?: React.ReactNode;
  align?: 'left' | 'center';
}
export declare function Hero(props: HeroProps): React.ReactElement;

export interface SectionHeadingProps { eyebrow?: string; title: string; intro?: React.ReactNode; size?: 'lg' | 'md'; align?: 'left' | 'center'; ornament?: boolean; onDark?: boolean; as?: 'h1' | 'h2' | 'h3' }
export declare function SectionHeading(props: SectionHeadingProps): React.ReactElement;

export interface SignPanelProps { tone?: 'green' | 'navy' | 'brick' | 'ochre'; title: string; children?: React.ReactNode; image?: string; imageAlt?: string; caption?: string; as?: 'h2' | 'h3' }
export declare function SignPanel(props: SignPanelProps): React.ReactElement;

export interface FeatureCardProps { image: string; imageAlt?: string; eyebrow?: string; tone?: 'navy' | 'green' | 'brick' | 'ochre'; title: string; text?: React.ReactNode; href?: string; linkLabel?: string }
export declare function FeatureCard(props: FeatureCardProps): React.ReactElement;

export interface Fact { icon?: IconName; label: string; value: string; note?: string }
export interface FactGridProps { items: Fact[]; columns?: 2 | 3 | 4 }
export declare function FactGrid(props: FactGridProps): React.ReactElement;

export interface Step { title: string; text?: React.ReactNode }
export interface StepsProps { steps: Step[]; tone?: 'light' | 'dark' }
export declare function Steps(props: StepsProps): React.ReactElement;

export interface FieldOption { value: string; label: string }
export interface FieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea';
  options?: FieldOption[];
  /** Fields are required unless marked optional; optional ones say so. */
  optional?: boolean;
  help?: React.ReactNode;
  /** Replaces help and adds the alert icon. */
  error?: React.ReactNode;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  rows?: number;
  min?: number | string;
  max?: number | string;
  autoComplete?: string;
  inputMode?: string;
  className?: string;
}
export declare function Field(props: FieldProps): React.ReactElement;

export interface Choice { value: string; label: string; note?: string }
export interface ChoiceChipsProps { label: string; name: string; options: Choice[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; columns?: number; hideLabel?: boolean }
export declare function ChoiceChips(props: ChoiceChipsProps): React.ReactElement;

export interface InquiryFormProps {
  title?: string;
  defaultEventType?: 'wedding' | 'vows' | 'memorial' | 'gathering' | 'school';
  /** Receives name, partner, email, phone, eventType, date, guests, block, message. */
  onSubmit?: (data: Record<string, string>) => void;
  sent?: boolean;
}
export declare function InquiryForm(props: InquiryFormProps): React.ReactElement;

export interface GivingFormProps {
  defaultTab?: 'gift' | 'fee';
  amounts?: number[];
  rate?: number;
  minHours?: number;
  maxHours?: number;
  ein?: string;
  onSubmit?: (data: { kind: 'gift' | 'fee'; amount: number; hours?: number }) => void;
}
export declare function GivingForm(props: GivingFormProps): React.ReactElement;

export interface TimelineItem { year: string; title: string; text?: React.ReactNode; image?: string; imageAlt?: string; caption?: string }
export interface TimelineProps { items: TimelineItem[] }
export declare function Timeline(props: TimelineProps): React.ReactElement;

export interface GalleryImage { src: string; alt: string; caption?: string; layout?: 'normal' | 'wide' | 'tall' }
export interface GalleryProps { images: GalleryImage[]; rowHeight?: number }
export declare function Gallery(props: GalleryProps): React.ReactElement;

export interface FAQItem { q: string; a: React.ReactNode }
export interface FAQListProps { items: FAQItem[]; defaultOpen?: number }
export declare function FAQList(props: FAQListProps): React.ReactElement;

export interface NoticeProps { tone?: 'info' | 'caution'; title: string; icon?: IconName; children?: React.ReactNode }
export declare function Notice(props: NoticeProps): React.ReactElement;

export interface FooterColumn { title: string; links: NavLink[] }
export interface SiteFooterProps { columns?: FooterColumn[]; ein?: string; email?: string; location?: string; year?: number; facebookHref?: string }
export declare function SiteFooter(props: SiteFooterProps): React.ReactElement;

declare global {
  interface Window {
    SerraCross: {
      Wordmark: typeof Wordmark; Button: typeof Button; Icon: typeof Icon; Ornament: typeof Ornament;
      SiteHeader: typeof SiteHeader; Hero: typeof Hero; SectionHeading: typeof SectionHeading; SignPanel: typeof SignPanel;
      FeatureCard: typeof FeatureCard; FactGrid: typeof FactGrid; Steps: typeof Steps; Field: typeof Field;
      ChoiceChips: typeof ChoiceChips; InquiryForm: typeof InquiryForm; GivingForm: typeof GivingForm; Timeline: typeof Timeline;
      Gallery: typeof Gallery; FAQList: typeof FAQList; Notice: typeof Notice; SiteFooter: typeof SiteFooter;
    };
  }
}
