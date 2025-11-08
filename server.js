import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// CORS + body
app.use(cors());                 // or restrict to your Vercel domain
app.use(express.json());

// health/root so Render doesn’t 502 on "/"
app.get("/", (_req, res) => res.status(200).send("OK"));
app.head("/", (_req, res) => res.status(200).end()); // optional

// mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, projectType, message } = req.body || {};
  if (!name || !email || !message)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    await transporter.sendMail({
      from: `"Luxury Tech Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `New Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject Type: ${projectType}\n\nMessage:\n${message}`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Mailer error:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5175;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on 0.0.0.0:${PORT}`);
});
