import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const uploadedFile = droppedFiles[0];
      validateAndSetFile(uploadedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];

    if (!allowedTypes.includes(uploadedFile.type)) {
      setMessage({ type: 'error', text: 'Only .xlsx, .xls, and .csv files are supported' });
      return;
    }

    setFile(uploadedFile);
    setMessage({ type: 'success', text: `File selected: ${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)` });
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/customers/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setMessage({ type: 'success', text: response.data || 'Bulk upload started successfully! Processing in background.' });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Upload failed. Please try again.';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      ['Name', 'NIC', 'DOB', 'Mobile Numbers', 'Family Members', 'Address Line 1', 'Address Line 2', 'City', 'Country'],
      ['Kamal Perera', '901234567V', '1990-05-15', '0771234567', 'Nimal Perera', '123 Main Street', 'Apt 5', 'Colombo', 'Sri Lanka'],
      ['Nimali Silva', '856543210V', '1985-08-22', '0719876543', 'Anura Silva', '456 Park Avenue', '', 'Kandy', 'Sri Lanka'],
      ['Sunil Shantha', '199534501234', '1995-12-10', '0701122334', '', '789 Ocean Boulevard', 'Suite 10', 'Galle', 'Sri Lanka']
    ];

    const csvContent = template.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-bulk-upload-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setMessage({ type: 'info', text: 'Template downloaded successfully' });
  };

  const clearMessage = () => setMessage({ type: '', text: '' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Bulk Customer Upload</h2>
        <p className="text-gray-600 mt-1">Upload your Excel or CSV file to add multiple customers at once</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg flex justify-between items-start ${
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          <span>{message.text}</span>
          <button onClick={clearMessage} className="text-lg font-bold opacity-50 hover:opacity-100">×</button>
        </div>
      )}

      {/* Main Upload Area */}
      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        {/* File Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            disabled={loading}
          />
          
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">📁</span>
            <p className="text-gray-700 font-semibold text-lg">
              {file ? file.name : 'Click to browse or drag and drop your file here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  setMessage({ type: '', text: '' });
                }}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
              <span className="text-sm font-semibold text-gray-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleDownloadTemplate}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            📥 Download Template
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? 'Uploading...' : '⬆️ Upload and Process'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">📋 Upload Instructions</h3>
        <ul className="space-y-3 text-sm text-blue-800">
          <li className="flex gap-3">
            <span className="text-lg">1️⃣</span>
            <span><strong>Download the template</strong> to see the required format for your data</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">2️⃣</span>
            <span><strong>Fill in your customer data</strong> following the template structure</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">3️⃣</span>
            <span><strong>Save your file</strong> in Excel (.xlsx) or CSV format</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">4️⃣</span>
            <span><strong>Upload the file</strong> using the drag-and-drop area or file browser</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">5️⃣</span>
            <span><strong>Processing starts automatically</strong> in the background</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BulkUpload;
