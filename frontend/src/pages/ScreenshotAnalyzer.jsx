import React, { useState } from 'react';
import axios from 'axios';

// ScreenshotAnalyzer lets the user upload and analyze a screenshot
function ScreenshotAnalyzer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setResult(null);
    setError('');
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://127.0.0.1:8000/analyze-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Screenshot Analyzer</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <div style={{ margin: '1rem 0' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 250, border: '1px solid #ccc' }} />
        </div>
      )}
      <button onClick={handleAnalyze} disabled={!file || loading} style={{ padding: '0.5rem 1rem' }}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {result && (
        <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: 8 }}>
          <h3>Analysis Result</h3>
          <div><strong>Category:</strong> {result.category}</div>
          <div><strong>Risk Score:</strong> {result.risk_score}</div>
          <div><strong>Explanation:</strong> {result.explanation}</div>
          <div><strong>Advice:</strong> {result.advice}</div>
          <div><strong>Suggested Action:</strong> {result.suggested_action}</div>
        </div>
      )}
    </div>
  );
}

export default ScreenshotAnalyzer;
