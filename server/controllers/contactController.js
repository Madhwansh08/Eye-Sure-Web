const nodemailer = require("nodemailer");

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10), 
  secure: process.env.EMAIL_PORT === "465", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.APP_PASS || "", 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

/**
 * Send Email Notification
 */
const sendEmailNotification = async (contact) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: "New Contact Form Submission",
    text: `You have received a new contact form submission:\n\nName: ${contact.firstName} ${contact.lastName}\nEmail: ${contact.email}\nPhone number: ${contact.phoneNumber}\nComment: ${contact.message}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    // Send email notification
    await sendEmailNotification({ firstName, lastName, email, phoneNumber, message });

    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
};
