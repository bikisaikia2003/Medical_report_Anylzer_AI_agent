import { useState } from 'react'
import './App.css'


function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("Select a report first");

    const formData = new FormData();
    formData.append("report", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3000/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

    } catch {
      setResult({ error: "Upload failed" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          🧪 AI Blood Report Parser
        </h1>

        {/* Upload card */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            className="mb-4"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={upload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Parse Report
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-6 animate-pulse text-blue-600">
            Processing OCR + AI…
          </p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-black text-green-400 p-4 rounded-lg overflow-auto max-h-96">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
