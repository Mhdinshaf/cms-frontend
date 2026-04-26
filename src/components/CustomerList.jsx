import { useState, useEffect } from 'react';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const dummyData = [
      { id: 1, name: 'Kamal Perera', dob: '1990-05-15', nic: '901234567V', mobile: '0771234567', city: 'Colombo', country: 'Sri Lanka' },
      { id: 2, name: 'Nimali Silva', dob: '1985-08-22', nic: '856543210V', mobile: '0719876543', city: 'Kandy', country: 'Sri Lanka' },
      { id: 3, name: 'Sunil Shantha', dob: '1995-12-10', nic: '199534501234', mobile: '0701122334', city: 'Galle', country: 'Sri Lanka' }
    ];
    setCustomers(dummyData);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Date of Birth</th>
              <th className="px-6 py-4 font-medium">NIC Number</th>
              <th className="px-6 py-4 font-medium">Mobile Number</th>
              <th className="px-6 py-4 font-medium">City</th>
              <th className="px-6 py-4 font-medium">Country</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4">{customer.dob}</td>
                <td className="px-6 py-4">{customer.nic}</td>
                <td className="px-6 py-4">{customer.mobile}</td>
                <td className="px-6 py-4">{customer.city}</td>
                <td className="px-6 py-4">{customer.country}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-4">
                  <button className="text-gray-400 hover:text-blue-500 transition-colors" title="Edit">📝</button>
                  <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}