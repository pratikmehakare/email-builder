import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  footer: { type: String, required: true },
  imageUrls: [{ type: String }],
});

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
