import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Transporter using Gmail + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, projectType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const mailOptions = {
    from: `"Luxury Tech Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject Type: ${projectType}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5175;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
