/* ======== EDITE AQUI SEUS DADOS ======== */
export const CONFIG = {
  whatsapp: '5512996492304', // DDI + DDD + número, só dígitos
  whatsappTexto: '(12) 99649-2304',
  instagram: 'caue_gabriiel',
  email: 'gabrielcaue83@gmail.com',
  msgPadrao: 'Oi, Cauê! Vi seu site e quero conversar sobre um projeto.',
}
/* ======================================= */

export const waLink = (texto: string = CONFIG.msgPadrao) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export const igLink = `https://instagram.com/${CONFIG.instagram}`
export const mailLink = `mailto:${CONFIG.email}`
