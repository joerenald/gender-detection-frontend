import React, { useState } from "react";

function UploadImage() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [age, setAge] = useState("");
  const [confidence, setConfidence] = useState("");

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result);
      setPrediction("");
      setAge("");
      setConfidence("");
    };

    reader.readAsDataURL(file);
  };

  const sendImage = async () => {

    if (!image) {
      alert("Please select an image first");
      return;
    }

    try {

      const response = await fetch(
        "https://joereno-gender-age-detector-api.hf.space",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: image
          })
        }
      );

      if (!response.ok) {
  throw new Error("Server Error");
}

const data = await response.json();

      if (data.gender === "No Face Detected") {

        setPrediction("No Face Detected");
        setAge("");
        setConfidence("");

      } else {

        setPrediction(data.gender || "Unknown");
        setAge(data.age || "");
        setConfidence(data.confidence || "");

      }

    } catch (error) {

      console.log("Error:", error);
      alert("Prediction failed");

    }

  };

  return (

    <div className="upload-section">

      <h2 className="upload-title">Upload Image</h2>

      <div className="upload-box">

        <label htmlFor="fileInput" className="upload-label">

          <div className="upload-icon">📤</div>

          <div className="upload-text">
            Drag & Drop or Click to Upload Image
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />

        </label>

      </div>

      {preview && (
        <div className="preview-container">
          <img
            src={preview}
            alt="preview"
            className="preview-img"
          />
        </div>
      )}

      {preview && (
        <div className="action-container">

          <button
            className="predict-btn"
            onClick={sendImage}
          >
            Predict
          </button>

          {prediction && (

            <div className="result-box">

              <div className="result-row">
                <span className="label">Gender</span>
                <span className="value">{prediction}</span>
              </div>

              {age && (
                <div className="result-row">
                  <span className="label">Age</span>
                  <span className="value">{age} years</span>
                </div>
              )}

              {confidence && (
                <div className="result-row">
                  <span className="label">Confidence</span>
                  <span className="value">{confidence}%</span>
                </div>
              )}

            </div>

          )}

        </div>
      )}

    </div>

  );

}

export default UploadImage;