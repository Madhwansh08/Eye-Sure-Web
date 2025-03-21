const express = require("express");
const { submitContactForm } = require("../controllers/contactController");

const router = express.Router();

/**
 * @swagger
 * /api/contact/submit:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *       400:
 *         description: Bad request
 */
router.post('/submit', submitContactForm);

module.exports = router;
