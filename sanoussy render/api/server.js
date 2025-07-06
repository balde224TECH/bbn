import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Fonction d'envoi Telegram
async function sendTelegramMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const params = new URLSearchParams({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  });

  const response = await fetch(`${url}?${params.toString()}`);
  return response.json();
}

// Route pour commandes aipod
app.post('/api/order', async (req, res) => {
  const { productName, productID, customerName, customerNumber, whatsappNumber, comment } = req.body;

  if (!productName || !productID || !customerName || !customerNumber || !whatsappNumber) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const message = `🎧 *NOUVELLE COMMANDE AIRPOD* 🎧\n\n` +
    `📌 *Produit:* ${productName}\n` +
    `🆔 *ID:* ${productID}\n` +
    `👤 *Nom:* ${customerName}\n` +
    `📞 *Téléphone:* ${customerNumber}\n` +
    `📱 *WhatsApp:* ${whatsappNumber}\n` +
    `✏️ *Message:* ${comment || 'Aucun message'}\n\n` +
    `⏱ *Date:* ${new Date().toLocaleString()}`;

  try {
    const data = await sendTelegramMessage(process.env.AIPOD_BOT_TOKEN, process.env.AIPOD_CHAT_ID, message);
    if (data.ok) {
      res.json({ success: true, message: 'Commande Airpod envoyée avec succès !' });
    } else {
      res.status(500).json({ error: 'Erreur lors de l’envoi du message Telegram.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
});

// Route pour contact général
app.post('/api/contact', async (req, res) => {
  const { name, phone, serviceType, problem } = req.body;

  if (!name || !phone || !serviceType || !problem) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const message = `🔧 *Demande de service TechSolution* 🔧\n\n` +
    `👤 *Nom:* ${name}\n` +
    `📞 *Téléphone:* ${phone}\n` +
    `🛠 *Service demandé:* ${serviceType}\n\n` +
    `❗ *Description du problème:*\n${problem}\n\n` +
    `Nous vous contacterons rapidement pour une solution!`;

  try {
    const data = await sendTelegramMessage(process.env.CONTACT_BOT_TOKEN, process.env.CONTACT_CHAT_ID, message);
    if (data.ok) {
      res.json({ success: true, message: 'Demande de service envoyée avec succès !' });
    } else {
      res.status(500).json({ error: 'Erreur lors de l’envoi du message Telegram.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
});

// Route pour commandes vetement
app.post('/api/vetement', async (req, res) => {
  const { productName, productID, whatsappNumber, customerNumber, comment } = req.body;

  if (!productName || !productID || !whatsappNumber || !customerNumber) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const message = `🛍 *NOUVELLE COMMANDE SANOUSSY FASHION* 🛍\n\n` +
    `📌 *Produit:* ${productName}\n` +
    `🆔 *ID:* ${productID}\n` +
    `📱 *Téléphone:* ${customerNumber}\n` +
    `💬 *WhatsApp:* ${whatsappNumber}\n` +
    `✏️ *Message:* ${comment || 'Aucun message supplémentaire'}\n\n` +
    `⏱ *Date:* ${new Date().toLocaleString()}`;

  try {
    const data = await sendTelegramMessage(process.env.VETEMENT_BOT_TOKEN, process.env.VETEMENT_CHAT_ID, message);
    if (data.ok) {
      res.json({ success: true, message: 'Commande vêtement envoyée avec succès !' });
    } else {
      res.status(500).json({ error: 'Erreur lors de l’envoi du message Telegram.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.', details: err.message });
  }
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
