import { useState } from 'react'
import CustomerList from './components/CustomerList';
import AddCustomer from './components/AddCustomer';
import BulkUpload from './components/BulkUpload';

function App() {
  const [currentView, setCurrentView] = useState('LIST');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('ADD');
  };

  const handleCloseEdit = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-blue-800">CMS Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setCurrentView('LIST');
              setSelectedCustomer(null);
            }}
            className={`px-4 py-2 rounded-md transition ${currentView === 'LIST' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Customer List
          </button>
          <button 
            onClick={() => {
              setCurrentView('ADD');
              setSelectedCustomer(null);
            }}
            className={`px-4 py-2 rounded-md transition ${currentView === 'ADD' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Add Customer
          </button>
          <button 
            onClick={() => setCurrentView('UPLOAD')}
            className={`px-4 py-2 rounded-md transition ${currentView === 'UPLOAD' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Bulk Upload
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {currentView === 'LIST' && <CustomerList onEditCustomer={handleEditCustomer} />}
        {currentView === 'ADD' && <AddCustomer selectedCustomer={selectedCustomer} onCloseEdit={handleCloseEdit} />}
        {currentView === 'UPLOAD' && <BulkUpload />}
      </main>
    </div>
  )
}

export default App