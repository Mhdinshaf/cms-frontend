# CMS Frontend - Customer Management System

A modern, production-ready React application for managing customer data with bulk import capabilities. Built with React 19, Vite, Tailwind CSS, and Axios.

## ⚡ Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** or **yarn**
- **Backend API** running on `http://localhost:8080`

### Installation

```bash
# 1. Clone and navigate to project
cd cms-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open at **http://localhost:5173** (or 5174 if 5173 is busy).

---

## 🗂️ Project Structure

```
cms-frontend/
├── src/
│   ├── components/
│   │   ├── AddCustomer.jsx        # Add/Edit/Search customer form
│   │   ├── CustomerList.jsx        # Display, search, pagination
│   │   └── BulkUpload.jsx          # File upload & template download
│   ├── App.jsx                     # Main router & state management
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Global styles
│   └── App.css                     # App-specific styles
├── public/                         # Static files
├── package.json                    # Dependencies
├── vite.config.js                  # Build configuration
├── eslint.config.js                # Linting rules
└── index.html                      # HTML entry point
```

---

## 🎯 Features

### 1. **Customer Management**
- ✅ Add new customers with complete data
- ✅ Edit existing customers by NIC
- ✅ Search customers by NIC
- ✅ View all customers with pagination
- ✅ Delete customers

### 2. **Form Features**
- 📱 Multiple mobile numbers per customer
- 👨‍👩‍👧 Family members support (name, DOB, NIC)
- 🏠 Multiple addresses with city/country selection
- 🔀 Cascading dropdowns (Country → City)
- ✔️ Form validation & error handling
- ⏱️ Auto-dismissing success messages

### 3. **Bulk Upload**
- 📤 Drag-and-drop file upload
- 📄 Support for `.xlsx`, `.xls`, `.csv` formats
- 📋 Template download (CSV format)
- 📊 Progress tracking during upload
- 🔄 No file size limits (backend configurable)
- 💾 Batch import thousands of records

### 4. **User Experience**
- 🎨 Clean, modern Tailwind CSS UI
- 📱 Responsive design
- ⚡ Real-time validation
- 🔄 Loading states
- 📢 Clear error messages
- 🌐 CORS-enabled for cross-origin requests

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
- Hot Module Replacement (HMR) enabled
- http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 📡 Backend API Endpoints

**Base URL:** `http://localhost:8080/api/v1`

### Customers
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/customers/GetAll?page=0&size=10` | Fetch all customers with pagination |
| GET | `/customers/GetByNic/{NIC}` | Get customer by NIC |
| POST | `/customers/Add` | Create new customer |
| PUT | `/customers/Update/{NIC}` | Update customer by NIC |
| DELETE | `/customers/Delete/{NIC}` | Delete customer |
| POST | `/customers/bulk-upload` | Bulk upload customers (multipart form-data) |

### Master Data
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/master/countries` | List all countries |
| GET | `/master/cities/{countryName}` | Get cities by country name |

---

## 📋 Backend Configuration (application.yml)

For proper file upload functionality, configure your Spring Boot backend:

```yaml
server:
  port: 8080
  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 100MB
  tomcat:
    max-http-post-size: 1000000000
    max-http-request-header-size: 1000000

spring:
  web:
    cors:
      allowed-origins: http://localhost:5173,http://localhost:5174
      allowed-methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
      allowed-headers: '*'
      allow-credentials: true
      max-age: 3600
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Add Customer
- [ ] Enter valid NIC (not existing)
- [ ] Fill name, DOB
- [ ] Add multiple mobile numbers
- [ ] Select country & city
- [ ] Add address details
- [ ] Add family member
- [ ] Submit form
- [ ] Verify success message

#### Search & Edit
- [ ] Enter existing NIC
- [ ] Click search
- [ ] Verify data loads
- [ ] Edit a field
- [ ] Submit update
- [ ] Verify NIC field is read-only during edit

#### Customer List
- [ ] View all customers
- [ ] Test pagination (page size dropdown)
- [ ] Search by name/NIC/mobile
- [ ] Click Edit button (should navigate to AddCustomer)
- [ ] Click Delete button (should remove from list)

#### Bulk Upload
- [ ] Download CSV template
- [ ] Create test CSV with sample data
- [ ] Drag-drop file
- [ ] Verify progress bar shows
- [ ] Confirm file accepted

---

## 📊 Data Structure

### Customer DTO
```json
{
  "nic": "199901234567",
  "name": "John Doe",
  "dob": "1999-01-15",
  "mobileNumbers": ["0771234567", "0712345678"],
  "familyMembers": [
    {
      "name": "Jane Doe",
      "nic": "199903214567",
      "dob": "1999-03-20",
      "mobileNumbers": ["0779876543"],
      "addresses": []
    }
  ],
  "addresses": [
    {
      "id": null,
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4",
      "city": {
        "id": 1,
        "name": "Colombo",
        "country": {
          "id": 1,
          "name": "Sri Lanka",
          "code": "LK"
        }
      },
      "country": {
        "id": 1,
        "name": "Sri Lanka",
        "code": "LK"
      }
    }
  ]
}
```

**Important Notes:**
- ⚠️ `city` object must include nested `country` object
- ⚠️ Cities endpoint uses `country.name` (string), not `country.id` (number)
- ⚠️ Family members are full CustomerDTO objects, not just strings
- ⚠️ Mobile numbers must be string array, not objects

---

## 🔧 Components Guide

### AddCustomer.jsx
**Purpose:** Add new or edit existing customer

**Props:**
```javascript
{
  selectedCustomer: Object|null,  // Customer object when editing
  onCloseEdit: Function           // Callback to close edit mode
}
```

**State Management:**
- `step`: Controls SEARCH or FORM display
- `isEditMode`: Boolean flag for edit vs. add
- `customerData`: Form state object
- `countries`: Dropdown options

**Key Methods:**
- `fetchCountries()` - Load country master data
- `handleSearch()` - Search customer by NIC
- `handleAddressCountryChange()` - Cascading city dropdown
- `handleSubmit()` - Save/update customer

---

### CustomerList.jsx
**Purpose:** Display customers with pagination and search

**Props:**
```javascript
{
  onEditCustomer: Function  // Called when Edit button clicked
}
```

**Features:**
- Pagination (10 items per page, configurable)
- Search across name, NIC, mobile number
- Edit/Delete action buttons
- Mock data fallback when API unavailable

**Key Methods:**
- `fetchCustomers()` - API call to /GetAll
- `handleSearch()` - Client-side filtering
- `handleEdit()` - Emit selected customer to parent

---

### BulkUpload.jsx
**Purpose:** Upload multiple customers from Excel/CSV

**Accepted Formats:**
- `.xlsx` - Excel 2007+
- `.xls` - Legacy Excel
- `.csv` - Comma-separated values

**Features:**
- Drag-and-drop upload zone
- File validation (type, not size)
- Progress bar during upload
- Template CSV download
- Error/success notifications

**Expected CSV Columns:**
```
NIC,Name,DOB,MobileNumbers,AddressLine1,AddressLine2,City,Country
199901234567,John Doe,1999-01-15,"0771234567,0712345678",123 Main St,Apt 4,Colombo,Sri Lanka
```

---

## ⚙️ Configuration

### API Base URL
Edit in each component (`AddCustomer.jsx`, `CustomerList.jsx`, `BulkUpload.jsx`):
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

### Pagination Size
Edit in `CustomerList.jsx`:
```javascript
const PAGE_SIZE = 10;  // Items per page
```

### Success Message Duration
Edit in components:
```javascript
setTimeout(() => { /* action */ }, 2000);  // 2 seconds
```

---

## 🐛 Troubleshooting

### CORS Error
```
Cross-Origin Request Blocked: CORS header missing
```
**Solution:** Enable CORS in backend `application.yml` (see Backend Configuration section)

### File Upload Fails (>10MB)
```
SizeLimitExceededException: size exceeds configured maximum
```
**Solution:** 
1. Update `server.servlet.multipart.max-file-size` in backend
2. Restart backend service
3. Try again

### Cities Dropdown Empty
**Cause:** Backend cities endpoint needs country NAME, not ID

**Already Fixed:** Frontend sends `country.name` to `/master/cities/{countryName}`

### 404 on Countries Load
**Cause:** Backend endpoint doesn't exist or returns wrong structure

**Check:**
```bash
curl http://localhost:8080/api/v1/master/countries
```

---

## 📦 Dependencies

- **react** (19.2.5) - UI framework
- **axios** (1.15.2) - HTTP client
- **tailwindcss** (4.2.4) - Utility CSS
- **vite** (8.0.10) - Build tool
- **react-router-dom** (7.14.2) - Routing (if needed)

---

## 📝 Development Notes

### Adding New Features
1. Create component in `src/components/`
2. Import in `App.jsx`
3. Add route/navigation
4. Test with mock data first
5. Integrate with API endpoints

### Modifying API Endpoints
1. Update `API_BASE_URL` constant
2. Update `axios` calls with new URL
3. Adjust error handling if response structure changes

### Styling
- Uses **Tailwind CSS v4** utility classes
- Custom colors defined in component className
- Mobile-first responsive design

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] Dependencies installed: `npm install`
- [ ] No CORS errors in browser console
- [ ] Can view customer list
- [ ] Can add new customer
- [ ] Can search and edit customer
- [ ] Can upload file
- [ ] Pagination works
- [ ] Search filter works

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs
3. Verify API endpoints are accessible
4. Confirm database is running
5. Review Backend Configuration section

---

## 📄 License

This project is part of the CMS Frontend initiative.

**Built with ❤️ using React + Vite + Tailwind CSS**
