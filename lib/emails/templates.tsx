// ---------------------------------------------------------------------------
// Almone — Email HTML templates (plain string returns for Resend `html`)
// ---------------------------------------------------------------------------

// ---- Shared helpers -------------------------------------------------------

function emailHeader(): string {
  return `
    <div style="background:#0a0a0a;padding:32px;text-align:center;">
      <span style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">almone.</span>
    </div>`;
}

function emailFooter(): string {
  return `
    <div style="background:#F5F5F5;padding:28px 40px;text-align:center;font-size:12px;color:#757575;">
      <p style="margin:0 0 4px 0;">&copy; 2025 Almone Scooter Rental &mdash; Marrakech, Maroc</p>
      <p style="margin:0;">En cas de probl&egrave;me contactez-nous sur WhatsApp</p>
    </div>`;
}

function ctaButton(label: string, href: string): string {
  return `
    <a href="${href}" target="_blank" style="display:inline-block;background:#FF6700;color:#ffffff;border-radius:8px;padding:14px 28px;font-weight:600;text-decoration:none;font-size:15px;">${label}</a>`;
}

function secondaryLink(label: string, href: string): string {
  return `
    <p style="margin:16px 0 0 0;font-size:13px;">
      <a href="${href}" target="_blank" style="color:#FF6700;text-decoration:underline;">${label}</a>
    </p>`;
}

function recapRow(label: string, value: string): string {
  return `
      <div style="margin-bottom:12px;">
        <div style="font-size:13px;color:#757575;margin-bottom:2px;">${label}</div>
        <div style="font-size:15px;color:#0a0a0a;font-weight:500;">${value}</div>
      </div>`;
}

function recapBlock(rows: { label: string; value: string }[]): string {
  return `
    <div style="background:#F5F5F5;border-radius:12px;padding:24px;margin:24px 0;">
      ${rows.map((r) => recapRow(r.label, r.value)).join("")}
    </div>`;
}

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0f0f0;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
    ${emailHeader()}
    ${content}
    ${emailFooter()}
  </div>
</body>
</html>`;
}

// ---- 1. Confirmation de réservation (client) ------------------------------

interface ConfirmationReservationProps {
  clientName: string;
  scooterName: string;
  startDate: string;
  endDate: string;
  rentalType: string;
  duration: string;
  totalPrice: number;
  phone: string;
  reservationId: string;
  whatsappUrl: string;
}

export function confirmationReservationHtml(props: ConfirmationReservationProps): string {
  const {
    clientName,
    scooterName,
    startDate,
    endDate,
    rentalType,
    duration,
    totalPrice,
    phone,
    reservationId,
    whatsappUrl,
  } = props;

  const body = `
    <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
      <h1 style="font-size:28px;font-weight:700;margin:0 0 24px 0;">Demande re&ccedil;ue &#10003;</h1>
      <p>Bonjour ${clientName},</p>
      <p>Votre demande de r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e. Notre &eacute;quipe va la traiter dans les plus brefs d&eacute;lais et vous contactera au ${phone} pour confirmer.</p>
      ${recapBlock([
        { label: "Num&eacute;ro", value: `#${reservationId.slice(0, 8).toUpperCase()}` },
        { label: "Scooter", value: scooterName },
        { label: "Type", value: `${rentalType} &mdash; ${duration}` },
        { label: "Dates", value: `${startDate} &rarr; ${endDate}` },
        { label: "Total", value: `${totalPrice} MAD` },
      ])}
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton("Nous contacter sur WhatsApp", whatsappUrl)}
      </div>
      <p>Nous vous confirmons votre r&eacute;servation sous 24h.</p>
    </div>`;

  return wrap(body);
}

// ---- 2. Réservation confirmée (client) ------------------------------------

interface ReservationConfirmeeProps {
  clientName: string;
  scooterName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationId: string;
  whatsappUrl: string;
  siteUrl: string;
}

export function reservationConfirmeeHtml(props: ReservationConfirmeeProps): string {
  const {
    clientName,
    scooterName,
    startDate,
    endDate,
    totalPrice,
    reservationId,
    whatsappUrl,
    siteUrl,
  } = props;

  const body = `
    <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
      <h1 style="font-size:28px;font-weight:700;margin:0 0 24px 0;">R&eacute;servation confirm&eacute;e&nbsp;!</h1>
      <p>Bonne nouvelle ${clientName}&nbsp;! Votre r&eacute;servation est confirm&eacute;e. Voici tout ce que vous devez savoir.</p>
      ${recapBlock([
        { label: "Num&eacute;ro", value: `#${reservationId.slice(0, 8).toUpperCase()}` },
        { label: "Scooter", value: scooterName },
        { label: "Dates", value: `${startDate} &rarr; ${endDate}` },
        { label: "Total", value: `${totalPrice} MAD` },
      ])}
      <h2 style="font-size:18px;font-weight:600;margin:32px 0 12px 0;">Le jour J</h2>
      <ul style="padding-left:20px;margin:0 0 24px 0;">
        <li style="margin-bottom:8px;">Pr&eacute;sentez-vous au point de retrait &agrave; l&rsquo;heure convenue</li>
        <li style="margin-bottom:8px;">Munissez-vous d&rsquo;une pi&egrave;ce d&rsquo;identit&eacute;</li>
        <li style="margin-bottom:8px;">Un casque et un antivol vous seront remis</li>
      </ul>
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton("Voir mes r\u00e9servations", `${siteUrl}/compte`)}
        ${secondaryLink("Nous contacter", whatsappUrl)}
      </div>
    </div>`;

  return wrap(body);
}

// ---- 3. Réservation annulée (client) --------------------------------------

interface ReservationAnnuleeProps {
  clientName: string;
  scooterName: string;
  startDate: string;
  reservationId: string;
  whatsappUrl: string;
  siteUrl: string;
}

export function reservationAnnuleeHtml(props: ReservationAnnuleeProps): string {
  const { clientName, scooterName, startDate, reservationId, whatsappUrl, siteUrl } = props;

  const body = `
    <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
      <h1 style="font-size:28px;font-weight:700;margin:0 0 24px 0;">R&eacute;servation annul&eacute;e</h1>
      <p>Bonjour ${clientName}, votre r&eacute;servation du ${startDate} pour le scooter ${scooterName} a &eacute;t&eacute; annul&eacute;e.</p>
      <p>Si vous avez des questions, contactez-nous sur WhatsApp.</p>
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton("Faire une nouvelle r\u00e9servation", `${siteUrl}/scooters`)}
        ${secondaryLink("Nous contacter", whatsappUrl)}
      </div>
    </div>`;

  return wrap(body);
}

// ---- 4. Nouvelle réservation (admin) --------------------------------------

interface NouvelleReservationAdminProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  scooterName: string;
  startDate: string;
  endDate: string;
  rentalType: string;
  duration: string;
  totalPrice: number;
  reservationId: string;
  adminUrl: string;
}

export function nouvelleReservationAdminHtml(props: NouvelleReservationAdminProps): string {
  const {
    clientName,
    clientEmail,
    clientPhone,
    scooterName,
    startDate,
    endDate,
    rentalType,
    duration,
    totalPrice,
    reservationId,
    adminUrl,
  } = props;

  const body = `
    <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
      <h1 style="font-size:28px;font-weight:700;margin:0 0 16px 0;">Nouvelle demande de r&eacute;servation</h1>
      <div style="margin-bottom:24px;">
        <span style="display:inline-block;background:#FF6700;color:#ffffff;border-radius:6px;padding:4px 12px;font-size:11px;font-weight:600;text-transform:uppercase;">EN ATTENTE</span>
      </div>
      ${recapBlock([
        { label: "Num&eacute;ro", value: `#${reservationId.slice(0, 8).toUpperCase()}` },
        { label: "Client", value: clientName },
        { label: "Email", value: clientEmail },
        { label: "T&eacute;l&eacute;phone", value: clientPhone },
        { label: "Scooter", value: scooterName },
        { label: "Type", value: `${rentalType} &mdash; ${duration}` },
        { label: "Dates", value: `${startDate} &rarr; ${endDate}` },
        { label: "Total", value: `${totalPrice} MAD` },
      ])}
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton("Voir dans l'admin", adminUrl)}
      </div>
    </div>`;

  return wrap(body);
}

// ---- 5. Bienvenue (client) ------------------------------------------------

interface BienvenuProps {
  clientName: string;
  confirmationUrl: string;
}

export function bienvenuHtml(props: BienvenuProps): string {
  const { clientName, confirmationUrl } = props;

  const body = `
    <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
      <h1 style="font-size:28px;font-weight:700;margin:0 0 24px 0;">Bienvenue ${clientName}&nbsp;!</h1>
      <p>Votre compte Almone est cr&eacute;&eacute;. Confirmez votre email pour commencer &agrave; r&eacute;server.</p>
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton("Confirmer mon email", confirmationUrl)}
      </div>
      <h2 style="font-size:18px;font-weight:600;margin:32px 0 12px 0;">Pourquoi Almone&nbsp;?</h2>
      <ul style="padding-left:20px;margin:0;">
        <li style="margin-bottom:8px;">Scooters &eacute;lectriques premium, entretenus chaque jour</li>
        <li style="margin-bottom:8px;">Livraison &agrave; votre h&ocirc;tel ou riad</li>
        <li style="margin-bottom:8px;">Assistance 7j/7 par WhatsApp</li>
      </ul>
    </div>`;

  return wrap(body);
}

// ---- 6. Réinitialisation mot de passe (client) ----------------------------

interface ResetMotDePasseProps {
  clientName: string;
  resetUrl: string;
}

export function resetMotDePasseHtml(props: ResetMotDePasseProps): string {
  const { clientName, resetUrl } = props;

  const body = `
    <div style="padding:40px;font-size:15px;line-height:1.6;color:#0a0a0a;">
      <h1 style="font-size:28px;font-weight:700;margin:0 0 24px 0;">R&eacute;initialisation du mot de passe</h1>
      <p>Bonjour ${clientName}, vous avez demand&eacute; &agrave; r&eacute;initialiser votre mot de passe.</p>
      <div style="text-align:center;margin:32px 0;">
        ${ctaButton("R\u00e9initialiser mon mot de passe", resetUrl)}
      </div>
      <p style="font-size:13px;color:#757575;">Ce lien expire dans 24h. Si vous n&rsquo;avez pas fait cette demande, ignorez cet email.</p>
    </div>`;

  return wrap(body);
}
