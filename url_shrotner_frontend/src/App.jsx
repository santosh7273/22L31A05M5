import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [url, setUrl] = useState("");
  const [validityminutes, setValidityMinutes] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [response, setResponse] = useState(null);
  const [details, setDetails] = useState(null);
  const [searchCode, setSearchCode] = useState("");

  const handleSubmit = async (e) => {
    
    try {
      e.preventDefault();
      let res = await axios.post("http://localhost:3000/shorturls", {
        url,
        validityminutes,
        shortcode,
      });
      setResponse(res.data);
      setDetails(null);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleCheckDetails = async () => {
    if (!searchCode) return;
    try {
      let res = await axios.get(
        `http://localhost:3000/shorturls/${searchCode}`
      );
      setDetails(res.data);
      setResponse(null);
    } catch (err) {
      alert(err.response?.data?.error || "Shortcode not found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🔗 URL Shortener
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter original URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Validity in minutes (default 30)"
            value={validityminutes}
            onChange={(e) => setValidityMinutes(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Custom shortcode (optional)"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Generate Short URL
          </button>
        </form>

        {/* Response */}
        {response && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p>
              ✅ Short URL:{" "}
              <a
                href={response.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {response.shortUrl}
              </a>
            </p>
            <p>⏳ Expiry: {response.expiry}</p>
          </div>
        )}

        {/* Check details */}
        <div className="mt-8">
          <h2 className="font-semibold mb-2">Check Shortcode Details</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter shortcode"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
            />
            <button
              onClick={handleCheckDetails}
              className="bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700 transition"
            >
              Check
            </button>
          </div>
        </div>

        {/* Details */}
        {details && (
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p>🔗 URL: {details.url}</p>
            <p>👆 Clicks: {details.clickcount}</p>
            <p>🕒 Validity: {details.validityminutes} minutes</p>
            <p>📅 Created: {new Date(details.creationdate).toLocaleString()}</p>
            <p>⏳ Expiry: {new Date(details.expirydate).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
