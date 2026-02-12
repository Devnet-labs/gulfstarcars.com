const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir);

const newAddress = "CIIF SF6657, Ajman Free Zone,<br />PO BOX 84891 DUBAI UAE<br />Ajman - N/A<br />Ajman, United Arab Emirates";
const newPhone1 = "+971-523479535";
const newPhone2 = "+971-555144479";
const newPhone3 = "+971-585147256";
const newEmail = "smartinvestments005@gmail.com";

// Simple label translations (fallback to English if unknown)
const addressLabels = {
    'en.json': "Our Location",
    'ar.json': "موقعنا",
    'fr.json': "Notre Adresse",
    'es.json': "Nuestra Ubicación",
    'pt.json': "Nossa Localização",
    'ru.json': "Наш Адрес",
    'zh.json': "我们的地址"
};

const phoneLabels = {
    'en.json': "Contact Numbers",
    'ar.json': "أرقام التواصل",
    'fr.json': "Numéros de Contact",
    'es.json': "Números de Contacto",
    'pt.json': "Números de Contato",
    'ru.json': "Контактные Номера",
    'zh.json': "联系电话"
};

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(messagesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!content.footer) content.footer = {};
    if (!content.footer.emails) content.footer.emails = {};

    // Update fields
    content.footer.address = newAddress;
    content.footer.phone = newPhone1;
    content.footer.phone2 = newPhone2;
    content.footer.phone3 = newPhone3;
    content.footer.emails.info = newEmail;

    // Update labels if provided, else define them (don't overwrite if existing might be risky, but we want to standardize)
    // Actually, I'll overwrite to ensure they match the multi-phone context
    content.footer.addressLabel = addressLabels[file] || addressLabels['en.json'];
    content.footer.phoneLabel = phoneLabels[file] || phoneLabels['en.json'];

    // Remove old specific emails if we want to clean up, but user didn't explicitly say "delete others", 
    // just "use this address". I'll leave other emails for now to be safe, just updated info.
    // Specially `emails.info` is what's used in footer.

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${file}`);
});
