import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

function WebcamCapture() {

  const webcamRef = useRef(null);

  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [age, setAge] = useState("");
  const [confidence, setConfidence] = useState("");
  const [scanning, setScanning] = useState(false);

  const capture = async () => {

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera capture failed");
      return;
    }

    setImage(imageSrc);
    setScanning(true);

    try {

      const response = await fetch(
        "https://gender-detection-backend.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: imageSrc
          })
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

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

      console.error("Prediction Error:", error);
      setPrediction("Error");

    } finally {

      setScanning(false);

    }
  };

  return (
    <div className="scanner-container">

      {!image && (
        <div className="camera-box">

          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user"
            }}
            className="camera"
          />

          {scanning && (
            <div className="scan-line">
              Scanning...
            </div>
          )}

        </div>
      )}

      {!image && (
        <button
          className="capture-btn"
          onClick={capture}
        >
          {scanning ? "Scanning..." : "Scan with AI"}
        </button>
      )}

      {image && (
        <div className="result-box">

          <img
            src={image}
            className="preview"
            alt="Captured"
          />

          <div className="result-text">

            <div className="result-row">
              <span className="label">Gender :</span>
              <span className="value">{prediction}</span>
            </div>

            <div className="result-row">
              <span className="label">Age :</span>
              <span className="value">
                {age ? `${age} years` : "-"}
              </span>
            </div>

            <div className="result-row">
              <span className="label">Confidence :</span>
              <span className="value">
                {confidence ? `${confidence}%` : "-"}
              </span>
            </div>

          </div>

          <button
            className="capture-btn"
            onClick={() => {
              setImage(null);
              setPrediction("");
              setAge("");
              setConfidence("");
            }}
          >
            Scan Again
          </button>

        </div>
      )}

    </div>
  );
}

export default WebcamCapture;