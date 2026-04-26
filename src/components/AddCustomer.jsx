import { useState } from 'react';

export default function CustomerManager() {
  const [step, setStep] = useState('SEARCH'); 
  const [searchNic, setSearchNic] = useState('');
  const [customerData, setCustomerData] = useState(null);

  const [familySearchNic, setFamilySearchNic] = useState('');
  const [foundFamilyMember, setFoundFamilyMember] = useState(null);
  const [isNewMemberForm, setIsNewMemberForm] = useState(false);
  const [newMemberData, setNewMemberData] = useState({ name: '', dob: '', nic: '' });


  const handleSearch = () => {
    if (searchNic === '199012345678') {

      setCustomerData({
        nic: '199012345678',
        name: 'Kamal Perera',
        dob: '1990-05-15',
        mobiles: ['0771234567'],
        addresses: [{ line1: 'No 15', line2: 'Flower Rd', city: 'Colombo', country: 'Sri Lanka' }],
        familyMembers: [{ name: 'Sunil Perera', nic: '196012345678' }]
      });
    } else {
 
      setCustomerData({
        nic: searchNic,
        name: '',
        dob: '',
        mobiles: [''], 
        addresses: [{ line1: '', line2: '', city: '', country: '' }], 
        familyMembers: []
      });
    }
    setStep('FORM');
  };


  const handleMobileChange = (index, value) => {
    const newMobiles = [...customerData.mobiles];
    newMobiles[index] = value;
    setCustomerData({ ...customerData, mobiles: newMobiles });
  };
  const addMobile = () => setCustomerData({ ...customerData, mobiles: [...customerData.mobiles, ''] });
  const removeMobile = (index) => setCustomerData({ ...customerData, mobiles: customerData.mobiles.filter((_, i) => i !== index) });


  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...customerData.addresses];
    newAddresses[index][field] = value;
    setCustomerData({ ...customerData, addresses: newAddresses });
  };
  const addAddress = () => setCustomerData({ ...customerData, addresses: [...customerData.addresses, { line1: '', line2: '', city: '', country: '' }] });
  const removeAddress = (index) => setCustomerData({ ...customerData, addresses: customerData.addresses.filter((_, i) => i !== index) });

  const handleFamilySearch = () => {
    if (familySearchNic === '199511223344') {
      setFoundFamilyMember({ name: 'Nimali Perera', nic: '199511223344' });
      setIsNewMemberForm(false);
    } else {
      setIsNewMemberForm(true);
      setNewMemberData({ name: '', dob: '', nic: familySearchNic });
      setFoundFamilyMember(null);
    }
  };

  const linkExistingFamilyMember = () => {
    if (foundFamilyMember) {
      setCustomerData({ ...customerData, familyMembers: [...customerData.familyMembers, foundFamilyMember] });
      setFoundFamilyMember(null);
      setFamilySearchNic('');
    }
  };

  const addNewFamilyMember = () => {
    setCustomerData({ ...customerData, familyMembers: [...customerData.familyMembers, { ...newMemberData }] });
    setIsNewMemberForm(false);
    setNewMemberData({ name: '', dob: '', nic: '' });
    setFamilySearchNic('');
  };

  const removeFamilyMember = (index) => {
    setCustomerData({ ...customerData, familyMembers: customerData.familyMembers.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-5xl mx-auto mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        {step === 'SEARCH' ? 'Find or Register Customer' : 'Customer Details'}
      </h2>

      {/* --- STEP 1: Main Search --- */}
      {step === 'SEARCH' && (
        <div className="flex flex-col items-center py-10">
          <label className="text-gray-700 font-medium mb-4">Enter Customer NIC</label>
          <div className="flex gap-4 w-full max-w-md">
            <input type="text" placeholder="e.g. 199012345678" value={searchNic} onChange={(e) => setSearchNic(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleSearch} disabled={!searchNic} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300">Search</button>
          </div>
        </div>
      )}

      {/* --- STEP 2: Main Form --- */}
      {step === 'FORM' && customerData && (
        <form className="space-y-8">
          {/* Header Area */}
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
            <span className="text-blue-800 font-medium">Customer NIC: {customerData.nic}</span>
            <button type="button" onClick={() => setStep('SEARCH')} className="text-sm text-blue-600 hover:underline">Change NIC</button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <input type="text" value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <input type="date" value={customerData.dob} onChange={(e) => setCustomerData({...customerData, dob: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* 📱 Mobile Numbers Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Mobile Numbers</h3>
              <button type="button" onClick={addMobile} className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded hover:bg-blue-200">+ Add Mobile</button>
            </div>
            {customerData.mobiles.map((mobile, index) => (
              <div key={index} className="flex gap-4 mb-3">
                <input type="tel" value={mobile} onChange={(e) => handleMobileChange(index, e.target.value)} placeholder={`Mobile ${index + 1}`} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                {customerData.mobiles.length > 1 && (
                  <button type="button" onClick={() => removeMobile(index)} className="text-red-500 px-2 hover:text-red-700">🗑️</button>
                )}
              </div>
            ))}
          </section>

          {/* 🏠 Addresses Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Addresses</h3>
              <button type="button" onClick={addAddress} className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded hover:bg-blue-200">+ Add Address</button>
            </div>
            {customerData.addresses.map((address, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                <input type="text" value={address.line1} onChange={(e) => handleAddressChange(index, 'line1', e.target.value)} placeholder="Address Line 1" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={address.line2} onChange={(e) => handleAddressChange(index, 'line2', e.target.value)} placeholder="Address Line 2" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} placeholder="City" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={address.country} onChange={(e) => handleAddressChange(index, 'country', e.target.value)} placeholder="Country" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <div className="md:col-span-2 text-right">
                  {customerData.addresses.length > 1 && (
                    <button type="button" onClick={() => removeAddress(index)} className="text-sm text-red-500 hover:underline">Remove this address</button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* 👨‍👩‍👧‍👦 Family Members Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">Link Family Members</h3>
            
            {/* Family Search */}
            <div className="flex gap-4 mb-4">
              <input type="text" value={familySearchNic} onChange={(e) => setFamilySearchNic(e.target.value)} placeholder="Enter Family Member NIC..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={handleFamilySearch} disabled={!familySearchNic} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50">Search</button>
            </div>
            
            {/* If Existing Member Found */}
            {foundFamilyMember && (
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <div>
                  <p className="font-medium text-green-800">{foundFamilyMember.name}</p>
                  <p className="text-sm text-green-600">NIC: {foundFamilyMember.nic}</p>
                </div>
                <button type="button" onClick={linkExistingFamilyMember} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Link Existing</button>
              </div>
            )}

            {/* If New Member (Form) */}
            {isNewMemberForm && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3">Customer not found. Add new family member:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <input type="text" placeholder="Full Name" value={newMemberData.name} onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <input type="date" value={newMemberData.dob} onChange={(e) => setNewMemberData({...newMemberData, dob: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <input type="text" value={newMemberData.nic} disabled className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setIsNewMemberForm(false)} className="text-gray-500 mr-4 text-sm hover:underline">Cancel</button>
                  <button type="button" onClick={addNewFamilyMember} disabled={!newMemberData.name} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">Save & Link</button>
                </div>
              </div>
            )}

            {/* Linked Family List */}
            {customerData.familyMembers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm text-gray-500 font-medium mb-2">Currently Linked:</h4>
                <ul className="divide-y border border-gray-200 rounded-lg bg-white">
                  {customerData.familyMembers.map((member, index) => (
                    <li key={index} className="p-3 flex justify-between items-center">
                      <span className="font-medium text-gray-700">{member.name} <span className="text-sm text-gray-400 font-normal ml-2">({member.nic})</span></span>
                      <button type="button" onClick={() => removeFamilyMember(index)} className="text-red-500 text-sm hover:underline">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button type="button" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 shadow-md transition-colors text-lg">
              Save Customer Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
}