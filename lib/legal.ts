// Single source of truth for the details shown across the legal pages (/copyright and
// /privacy) so the contact email, phone and entity name can't drift between them.
//
// TODO before launch: set LEGAL_ENTITY to the registered company/business name once
// incorporated. Have a Nigerian-qualified lawyer review both policies before relying on them.
export const BRAND = "Qitt";
export const LEGAL_ENTITY = "Qitt";
export const CONTACT_EMAIL = "csfun100@gmail.com";

// The phone number is never displayed — we link to it with action text ("Click to call" /
// "Message on WhatsApp"). PHONE_E164 backs the tel: link; WHATSAPP_LINK opens a chat.
export const PHONE_E164 = "+2348078350344";
export const WHATSAPP_LINK = "https://wa.me/2348078350344";

export const LAST_UPDATED = "4 August 2026";
