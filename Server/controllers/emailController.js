import EmailTemplate from "../models/EmailTemplate.js";
import cloudinary from "cloudinary";
import multer from "multer";
import fs from 'fs'

// Multer configuration for handling file uploads
const upload = multer({
  dest: 'uploads/', // Temporary folder to store uploaded images
}).single('image'); // Make sure to handle a single image at a time

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.cloud_name , // Use env variables for security
  api_key: process.env.api_key,
  api_secret: process.env.api_secret ,
});

// Get layout HTML (email template structure)
export const getEmailLayout = (req, res) => {
  const layoutHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .content { margin: 20px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: gray; }
        .image-container { 
          width: 100%; 
          max-width: 100px; /* Make image width 100% of the container, with max width of 600px */
          height: auto;
          object-fit: contain; 
          display: block;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>{{title}}</h1>
      <div class="content">{{content}}</div>
      <div class="image-container">{{imageUrls}}</div>
      <div class="footer">{{footer}}</div>
    </body>
  </html>
  `;
  res.send(layoutHTML);
};


// Upload image to Cloudinary (via multer)
export const uploadImage = async (req, res) => {
  // Multer middleware to handle image upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Error uploading image" });
    }

    try {
      const file = req.file; // Access the uploaded file from multer
      if (!file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      // Upload the image to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
        folder: "email-builder",
      });

      // Optionally, delete the image from the local server after uploading it to Cloudinary
      
      fs.unlinkSync(file.path);

      // Return the Cloudinary image URL
      res.json({ imageUrl: uploadResponse.secure_url });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
};

// Save email template to database
export const uploadEmailConfig = async (req, res) => {
  try {
    const emailTemplate = new EmailTemplate(req.body);
    await emailTemplate.save();
    res.status(201).json({ message: "Email template saved successfully!" });
  } catch (error) {
    console.error("Error saving email template:", error);
    res.status(500).json({ error: "Failed to save email template" });
  }
};

// Render and download email template
export const renderAndDownloadTemplate = (req, res) => {
  const emailConfig = req.body;

  // Layout HTML for the email
  const layoutHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .content { margin: 20px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: gray; }
      </style>
    </head>
    <body>
      <h1>{{title}}</h1>
      <div class="content">{{content}}</div>
      <div>{{imageUrls}}</div>
      <div class="footer">{{footer}}</div>
    </body>
  </html>
  `;

  let renderedHTML = layoutHTML
    .replace(/{{title}}/g, emailConfig.title || "Default Title")
    .replace(/{{content}}/g, emailConfig.content || "Default Content")
    .replace(/{{footer}}/g, emailConfig.footer || "Default Footer")
    .replace(
      /{{imageUrls}}/g,
      emailConfig.imageUrls && emailConfig.imageUrls.length > 0
        ? emailConfig.imageUrls
            .map((url) => `<img src="${url}" alt="Uploaded Image" />`)
            .join("")
        : ""
    );

  // Set headers to download the file as an attachment
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=email-template.html"
  );
  res.setHeader("Content-Type", "text/html");
  res.send(renderedHTML);
};
