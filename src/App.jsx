import { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  const [layoutHTML, setLayoutHTML] = useState("");
  const [emailConfig, setEmailConfig] = useState({
    title: "",
    content: "",
    footer: "",
    imageUrls: [],
  });

  useEffect(() => {
    fetchLayout();
  }, []);

  const fetchLayout = async () => {
    try {
      //console.log("url",import.meta.env.VITE_API_BASE_URL)
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/getEmailLayout`
      );
      
      setLayoutHTML(data); 
    } catch (error) {
      console.error("Error fetching layout:", error);
    }
  };

  // Handle input changes for text fields
  const handleInputChange = (field, value) => {
    setEmailConfig({ ...emailConfig, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    // console.log("url",import.meta.env.VITE_API_BASE_URL)
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/uploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEmailConfig({
        ...emailConfig,
        imageUrls: [...emailConfig.imageUrls, data.imageUrl],
      });
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  // Replace placeholders in layoutHTML with user inputs
  const renderTemplate = () => {
    if (!layoutHTML) return "Loading...";

    let renderedHTML = layoutHTML;
    renderedHTML = renderedHTML
      .replace(/{{title}}/g, emailConfig.title || "Default Title")
      .replace(/{{content}}/g, emailConfig.content || "Default Content")
      .replace(/{{footer}}/g, emailConfig.footer || "Default Footer")
      .replace(
        /{{imageUrls}}/g,
        emailConfig.imageUrls.length > 0
          ? emailConfig.imageUrls
              .map((url) => `<img src="${url}" alt="Uploaded Image" style="width: 200px; height: auto;" />`)
              .join("")
          : ""
      );
    return renderedHTML;
  };

  // Render and download the final HTML template
  const handleRenderAndDownload = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/renderAndDownloadTemplate`,
        emailConfig,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "email-template.html");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error rendering and downloading template:", error);
    }
  };

  // Save email configuration (upload template)
  const handleSaveEmailConfig = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/uploadEmailConfig`,
        emailConfig
      );
      alert("Email template saved successfully!");
    } catch (error) {
      console.error("Error saving email template:", error);
      alert("Failed to save email template.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Email Builder</h1>

      <label className="block font-semibold">Title:</label>
      <input
        type="text"
        className="w-full p-2 border mb-4"
        value={emailConfig.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
      />

      <label className="block font-semibold">Content:</label>
      <ReactQuill
        theme="snow"
        value={emailConfig.content}
        onChange={(value) => handleInputChange("content", value)}
      />

      <label className="block font-semibold mt-4">Footer:</label>
      <input
        type="text"
        className="w-full p-2 border mb-4"
        value={emailConfig.footer}
        onChange={(e) => handleInputChange("footer", e.target.value)}
      />

      <label className="block font-semibold mt-4">Upload Image:</label>
      <input
        type="file"
        onChange={handleImageUpload}
        className="mb-4"
        accept="image/png, image/gif, image/jpeg"
      />

      <div className="flex space-x-4 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleRenderAndDownload}
        >
          Render & Download
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSaveEmailConfig} // Add the save email config button
        >
          Save Template
        </button>
      </div>

      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        <div
          className="preview"
          dangerouslySetInnerHTML={{
            __html: renderTemplate() || "Loading preview...",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
