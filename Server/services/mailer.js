import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import dotenv from 'dotenv';

dotenv.config();

// Logo embarqué dans le message (référencé par `cid:`) plutôt que pointé par une
// URL : il s'affiche sans dépendre d'un déploiement du front, y compris en local.
// C'est un PNG et non le SVG d'origine, que Gmail et Outlook ne savent pas afficher.
export const BRAND_LOGO_CID = 'labstore-logo';

const brandLogoAttachment = {
    filename: 'labstore-logo.png',
    path: fileURLToPath(new URL('../assets/labstore-logo.png', import.meta.url)),
    cid: BRAND_LOGO_CID,
};

// Nombre d'articles affichés dans l'aperçu d'une commande par courriel.
export const MAIL_ITEMS_LIMIT = 3;

const MAIL_FROM = `"Labstore" <contact@labstore.ca>`;

const DEFAULT_LOCALE = 'fr-TG';

// L'en-tête Accept-Language n'est pas forcément une étiquette BCP-47 exploitable :
// '*' (envoyé par plusieurs clients HTTP) ou un reliquat de facteur q font lever
// toLocaleDateString(), ce qui faisait échouer le rendu du courriel entier.
function safeLocale(locale) {
    try {
        return Intl.getCanonicalLocales(locale).length ? locale : DEFAULT_LOCALE;
    } catch {
        return DEFAULT_LOCALE;
    }
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASS,
    },
    tls: {
        rejectUnauthorized: true
    }
});

const hbsOptions = {
    viewEngine: {
        extname: ".hbs",
        partialsDir: "views",
        layoutsDir: "views",
        defaultLayout: "baseMessage",
        helpers: {
            isEqual: function (a, b, options) {
                return (a === b) ? options.fn(this) : options.inverse(this);
            },
            isPlural: function (a, options) {
                return (a > 1) ? options.fn(this) : options.inverse(this);
            },
            isOvered: function (array, options) {
                return (array.length > MAIL_ITEMS_LIMIT) ? options.fn(this) : options.inverse(this);
            },
            isNotOvered: function (index, options) {
                return (index <= MAIL_ITEMS_LIMIT - 1) ? options.fn(this) : options.inverse(this);
            },
            isRemainingItemsCountPlural: function(items, options) {
                return (items.length - MAIL_ITEMS_LIMIT > 1) ? options.fn(this) : options.inverse(this);
            },
            getRemainingItemsCount: function(items) {
                return items.length - MAIL_ITEMS_LIMIT;
            },
            getLocalYear: function(options) {
                const locale = safeLocale(options.data.root.userLocality);
                const today = new Date();
                const thisYear = today.toLocaleDateString(locale, { year: 'numeric'} )
                return thisYear;
            },
            // Base des liens du pied de page. Dérivée de FRONT_END_URL comme le lien
            // de suivi de commande : le domaine était codé en dur et avait dérivé
            // (labstore.tg) par rapport au vrai front. S'utilise {{getSiteURL}} pour
            // la racine, {{getSiteURL 'faq'}} pour une page.
            getSiteURL: function(path, options) {
                const base = (process.env.FRONT_END_URL ?? '').replace(/\/+$/, '');
                // Appelé sans argument, `path` reçoit l'objet d'options de Handlebars.
                return typeof path === 'string' ? `${base}/${path.replace(/^\/+/, '')}` : base;
            },
            getOrderURLPath: function(options) {
                const homaPagePath = process.env.FRONT_END_URL;
                const orderNumber = options.data.root.orderNumber;
                const endPoint = 'checkOrder';
                return `${homaPagePath}/${endPoint}/${orderNumber}`;
            },
            getLocalFormattedDate: function(date, options) {
                const locale = safeLocale(options.data.root.userLocality);
                let newDate = new Date(date);
                const formatOptions = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                let formattedDate = newDate.toLocaleDateString(locale, formatOptions);
                formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                return formattedDate;
            },
        }
    },
    viewPath: "views",
    extName: ".hbs",
}

transporter.use('compile', hbs(hbsOptions));

// Envoie un courriel Handlebars. Rejette si le SMTP échoue : c'est à l'appelant
// de décider si l'échec doit faire échouer l'opération métier ou juste être journalisé.
// `withBrandLogo` joint le logo : à activer pour les gabarits qui affichent
// <img src="cid:labstore-logo">, sinon la pièce jointe voyage pour rien.
export async function sendMail(to, subject, template, context, { withBrandLogo = false } = {}) {
    return transporter.sendMail({
        from: MAIL_FROM,
        to,
        subject,
        template,
        context,
        ...(withBrandLogo ? { attachments: [brandLogoAttachment] } : {}),
    });
}
