import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const CustomerList = ({ onEditCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const mockCustomers = [
    {
      id: 1,
      name: 'Kamal Perera',
      dob: '1990-05-15',
      nic: '901234567V',
      mobileNumbers: ['0771234567'],
      addresses: [{ addressLine1: '123 Main St', city: { name: 'Colombo' }, country: { name: 'Sri Lanka' } }]
    },
    {
      id: 2,
      name: 'Nimali Silva',
      dob: '1985-08-22',
      nic: '856543210V',
      mobileNumbers: ['0719876543'],
      addresses: [{ addressLine1: '456 Park Ave', city: { name: 'Kandy' }, country: { name: 'Sri Lanka' } }]
    },
    {
      id: 3,
      name: 'Sunil Shantha',
      dob: '1995-12-10',
      nic: '199534501234',
      mobileNumbers: ['0701122334'],
      addresses: [{ addressLine1: '789 Ocean Blvd', city: { name: 'Galle' }, country: { name: 'Sri Lanka' } }]
    },
    {
      id: 4,
      name: 'Anura Jayasekara',
      dob: '1988-03-25',
      nic: '880325678V',
      mobileNumbers: ['0765432109', '0771122334'],
      addresses: [{ addressLine1: '321 Hill Road', city: { name: 'Nuwara Eliya' }, country: { name: 'Sri Lanka' } }]
    },
    {
      id: 5,
      name: 'Priya Wijetunge',
      dob: '1992-07-18',
      nic: '920718901V',
      mobileNumbers: ['0712345678'],
      addresses: [{ addressLine1: '654 Valley Lane', city: { name: 'Colombo' }, country: { name: 'Sri Lanka' } }]
    }
  ];

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customers/GetAll`, {
        params: { page: currentPage, size: pageSize }
      });

      if (res.data.content) {
        setCustomers(res.data.content);
        setTotalElements(res.data.totalElements);
        setMessage({ type: 'success', text: `Loaded ${res.data.content.length} customers` });
      } else {
        setCustomers(res.data);
        setMessage({ type: 'success', text: `Loaded ${res.data.length} customers` });
      }
    } catch (err) {
      setMessage({ type: 'info', text: 'Using mock data' });
      setCustomers(mockCustomers);
      setTotalElements(mockCustomers.length);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = customers.filter(
      customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.nic.toLowerCase().includes(searchLower) ||
        customer.mobileNumbers?.[0]?.toLowerCase().includes(searchLower)
    );
    setFilteredCustomers(filtered);
  };

  const handleEdit = (customer) => {
    if (onEditCustomer) {
      onEditCustomer(customer);
    }
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      const updatedCustomers = customers.filter(c => c.id !== customer.id);
      setCustomers(updatedCustomers);
      setMessage({ type: 'success', text: `${customer.name} deleted successfully` });
    }
  };

  const clearMessage = () => setMessage({ type: '', text: '' });

  const totalPages = Math.ceil(totalElements / pageSize);
  const displayedCustomers = searchTerm.trim() ? filteredCustomers : customers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customer List</h2>
          <p className="text-gray-600 mt-1">Manage all customers in your system</p>
        </div>
        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <input
          type="text"
          placeholder="Search by name, NIC, or mobile number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading customers...</p>
          </div>
        )}

        {!loading && displayedCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Date of Birth</th>
                  <th className="px-6 py-4 font-semibold">NIC Number</th>
                  <th className="px-6 py-4 font-semibold">Mobile Number</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Country</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4">
                      {new Date(customer.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{customer.nic}</td>
                    <td className="px-6 py-4">
                      {customer.mobileNumbers && customer.mobileNumbers.length > 0
                        ? customer.mobileNumbers.join(', ')
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {customer.addresses?.[0]?.city?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {customer.addresses?.[0]?.country?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-gray-400 hover:text-blue-600 transition-colors text-lg"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="text-gray-400 hover:text-red-600 transition-colors text-lg"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && displayedCustomers.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{displayedCustomers.length}</span> of{' '}
            <span className="font-semibold">{totalElements}</span> customers
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <label className="mr-2">Page size:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(0);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
