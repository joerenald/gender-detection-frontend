import WebCamCapture from "../components/WebCamCapture";
import UploadImage from "../components/UploadImage";

function Home() {
  return (
    <div className="container">

      <div className="card">

        <h1>Gender Age Detector AI</h1>

        <p className="subtitle">
          Capture your image or upload one and let AI predict the gender
        </p>

        {/* Webcam Scanner */}
        <WebCamCapture />

        <hr style={{ margin: "30px 0" }} />

        {/* Upload Image */}
        <UploadImage />
        <div className="watermark">
    Developed with ❤️ by <span>Joe Renald</span>
  </div>

      </div>

    </div>
  );
}

export default Home;