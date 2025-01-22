import express from "express";
import {
  getEmailLayout,
  uploadImage,
  uploadEmailConfig,
  renderAndDownloadTemplate,
} from "../controllers/emailController.js";

const router = express.Router();

router.get("/getEmailLayout", getEmailLayout);
router.post("/uploadImage", uploadImage);
router.post("/uploadEmailConfig", uploadEmailConfig);
router.post("/renderAndDownloadTemplate", renderAndDownloadTemplate);

export default router;
