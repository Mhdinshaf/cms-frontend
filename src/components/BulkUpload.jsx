export default function BulkUpload() {
  return (
    <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Bulk Customer Upload</h2>
      <p className="text-gray-500 mb-8 text-sm">Upload your Excel (.xlsx) file to add multiple customers at once.</p>
    
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
        <span className="text-4xl mb-4">📁</span>
        <p className="text-gray-600 font-medium">Click to browse or drag and drop your file here</p>
        <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" />
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          Download Template
        </button>
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Upload and Process
        </button>
      </div>
    </div>
  );
}