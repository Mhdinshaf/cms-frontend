import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AddCustomer = () => {
  const [step, setStep] = useState('SEARCH');
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchNic, setSearchNic] = useState('');
  const [countries, setCountries] = useState([]);
  const [citiesMap, setCitiesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const initialFormState = {
    nic: '',
    name: '',
    dob: '',
    mobileNumbers: [''],
    familyMembers: [{ name: '', dob: '', nic: '', mobileNumbers: [], addresses: [] }],
    addresses: [{ addressLine1: '', addressLine2: '', city: null, country: null }]
  };

  const [customerData, setCustomerData] = useState(initialFormState);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/master/countries`);
      setCountries(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load countries' });
    }
  };

  const handleSearch = async () => {
    if (!searchNic.trim()) {
      setMessage({ type: 'error', text: 'Please enter NIC' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customers/GetByNic/${searchNic}`);
      const customer = res.data;
      setCustomerData({
        nic: customer.nic,
        name: customer.name,
        dob: customer.dob,
        mobileNumbers: customer.mobileNumbers || [''],
        familyMembers: customer.familyMembers || [{ name: '', dob: '', nic: '', mobileNumbers: [], addresses: [] }],
        addresses: customer.addresses || [{ addressLine1: '', addressLine2: '', city: null, country: null }]
      });
      setIsEditMode(true);
      setStep('FORM');
      setMessage({ type: 'success', text: 'Customer found' });
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage({ type: 'info', text: 'Customer not found. Creating new customer.' });
        setCustomerData({ ...initialFormState, nic: searchNic });
        setIsEditMode(false);
        setStep('FORM');
      } else {
        setMessage({ type: 'error', text: 'Search failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressCountryChange = async (index, countryId) => {
    const selectedCountry = countries.find(c => c.id === parseInt(countryId));
    const newAddresses = [...customerData.addresses];
    newAddresses[index].country = selectedCountry;
    newAddresses[index].city = null;
    setCustomerData({ ...customerData, addresses: newAddresses });

    if (countryId && selectedCountry) {
      try {
        const res = await axios.get(`${API_BASE_URL}/master/cities/${selectedCountry.name}`);
        setCitiesMap(prev => ({ ...prev, [index]: res.data }));
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load cities' });
      }
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...customerData.addresses];
    newAddresses[index][field] = value;
    setCustomerData({ ...customerData, addresses: newAddresses });
  };

  const handleCityChange = (index, cityId) => {
    const cities = citiesMap[index] || [];
    const selectedCity = cities.find(c => c.id === parseInt(cityId));
    const newAddresses = [...customerData.addresses];

    if (selectedCity) {
      newAddresses[index].city = {
        id: selectedCity.id,
        name: selectedCity.name,
        country: newAddresses[index].country
      };
    }

    setCustomerData({ ...customerData, addresses: newAddresses });
  };

  const addAddress = () => {
    setCustomerData({
      ...customerData,
      addresses: [...customerData.addresses, { addressLine1: '', addressLine2: '', city: null, country: null }]
    });
  };

  const removeAddress = (index) => {
    if (customerData.addresses.length > 1) {
      const newAddresses = customerData.addresses.filter((_, i) => i !== index);
      setCustomerData({ ...customerData, addresses: newAddresses });
    }
  };

  const addMobileNumber = () => {
    setCustomerData({
      ...customerData,
      mobileNumbers: [...customerData.mobileNumbers, '']
    });
  };

  const removeMobileNumber = (index) => {
    if (customerData.mobileNumbers.length > 1) {
      const newMobiles = customerData.mobileNumbers.filter((_, i) => i !== index);
      setCustomerData({ ...customerData, mobileNumbers: newMobiles });
    }
  };

  const updateMobileNumber = (index, value) => {
    const newMobiles = [...customerData.mobileNumbers];
    newMobiles[index] = value;
    setCustomerData({ ...customerData, mobileNumbers: newMobiles });
  };

  const addFamilyMember = () => {
    setCustomerData({
      ...customerData,
      familyMembers: [...customerData.familyMembers, { name: '', dob: '', nic: '', mobileNumbers: [], addresses: [] }]
    });
  };

  const removeFamilyMember = (index) => {
    const newMembers = customerData.familyMembers.filter((_, i) => i !== index);
    setCustomerData({ ...customerData, familyMembers: newMembers });
  };

  const updateFamilyMember = (index, field, value) => {
    const newMembers = [...customerData.familyMembers];
    newMembers[index][field] = value;
    setCustomerData({ ...customerData, familyMembers: newMembers });
  };

  const prepareSubmitData = () => {
    return {
      nic: customerData.nic,
      name: customerData.name,
      dob: customerData.dob,
      mobileNumbers: customerData.mobileNumbers.filter(m => m.trim()),
      familyMembers: customerData.familyMembers.filter(f => f.name && f.name.trim()),
      addresses: customerData.addresses.map((addr) => ({
        id: null,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        country: addr.country
      }))
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerData.nic || !customerData.name || !customerData.dob) {
      setMessage({ type: 'error', text: 'Please fill required fields: NIC, Name, DOB' });
      return;
    }

    const submitData = prepareSubmitData();
    setLoading(true);

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/customers/Update/${customerData.nic}`, submitData);
        setMessage({ type: 'success', text: 'Customer updated successfully!' });
      } else {
        await axios.post(`${API_BASE_URL}/customers/Add`, submitData);
        setMessage({ type: 'success', text: 'Customer added successfully!' });
      }
      setTimeout(() => {
        setStep('SEARCH');
        setCustomerData(initialFormState);
        setSearchNic('');
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Operation failed';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => setMessage({ type: '', text: '' });

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-5xl mx-auto mb-10">
      {/* Message Alert */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex justify-between items-start ${
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          <span>{message.text}</span>
          <button onClick={clearMessage} className="text-lg font-bold opacity-50 hover:opacity-100">×</button>
        </div>
      )}

      {/* SEARCH STEP */}
      {step === 'SEARCH' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search or Add Customer</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter NIC to search or add new customer"
              value={searchNic}
              onChange={(e) => setSearchNic(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}

      {/* FORM STEP */}
      {step === 'FORM' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Update Customer' : 'Add New Customer'}
          </h2>

          {/* Basic Info Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC *</label>
                <input
                  type="text"
                  value={customerData.nic}
                  onChange={(e) => setCustomerData({ ...customerData, nic: e.target.value })}
                  disabled={isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={customerData.dob}
                  onChange={(e) => setCustomerData({ ...customerData, dob: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Mobile Numbers Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Mobile Numbers</h3>
              <button
                type="button"
                onClick={addMobileNumber}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              >
                + Add Mobile
              </button>
            </div>
            <div className="space-y-2">
              {customerData.mobileNumbers.map((mobile, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => updateMobileNumber(index, e.target.value)}
                    placeholder="Mobile number"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {customerData.mobileNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMobileNumber(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Addresses Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Addresses</h3>
              <button
                type="button"
                onClick={addAddress}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              >
                + Add Address
              </button>
            </div>
            <div className="space-y-6">
              {customerData.addresses.map((address, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={address.addressLine1}
                        onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                        placeholder="Street address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={address.addressLine2}
                        onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)}
                        placeholder="Apt, suite, etc (optional)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        value={address.country?.id || ''}
                        onChange={(e) => handleAddressCountryChange(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Country</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <select
                        value={address.city?.id || ''}
                        onChange={(e) => handleCityChange(index, e.target.value)}
                        disabled={!address.country}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select City</option>
                        {(citiesMap[index] || []).map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {customerData.addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Remove Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Family Members Section */}
          <section className="p-5 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Family Members</h3>
              <button
                type="button"
                onClick={addFamilyMember}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              >
                + Add Member
              </button>
            </div>
            <div className="space-y-4">
              {customerData.familyMembers.map((member, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                        placeholder="Family member name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                      <input
                        type="text"
                        value={member.nic}
                        onChange={(e) => updateFamilyMember(index, 'nic', e.target.value)}
                        placeholder="NIC"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={member.dob}
                        onChange={(e) => updateFamilyMember(index, 'dob', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Remove Member
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => {
                setStep('SEARCH');
                setCustomerData(initialFormState);
                setSearchNic('');
                clearMessage();
              }}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : isEditMode ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddCustomer;
