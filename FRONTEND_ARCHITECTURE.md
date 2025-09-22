# AgriChain Frontend Architecture

## 📁 **Directory Structure**

```
src/
├── components/                 # Reusable UI components
│   ├── Layout/
│   │   ├── Header.jsx         # App header with navigation
│   │   ├── Sidebar.jsx        # Role-based sidebar menu
│   │   ├── Footer.jsx         # App footer
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   └── LoadingSpinner.jsx # Loading component
│   ├── UI/
│   │   ├── Button.jsx         # Custom button component
│   │   ├── Input.jsx          # Form input component
│   │   ├── Modal.jsx          # Modal dialog component
│   │   ├── Card.jsx           # Card container component
│   │   ├── Table.jsx          # Data table component
│   │   └── Badge.jsx          # Status badge component
│   ├── Charts/
│   │   ├── LineChart.jsx      # Custom line chart (SVG-based)
│   │   ├── BarChart.jsx       # Custom bar chart
│   │   ├── PieChart.jsx       # Custom pie chart
│   │   └── AnalyticsCard.jsx  # Stat display card
│   ├── Maps/
│   │   ├── GoogleMap.jsx      # Google Maps integration
│   │   └── LocationPicker.jsx # Location selection component
│   ├── QRCode/
│   │   ├── QRCodeGenerator.jsx # QR code creation
│   │   ├── QRCodeScanner.jsx   # QR code scanning
│   │   └── ProductQR.jsx       # Product-specific QR display
│   └── Forms/
│       ├── ProduceForm.jsx     # Add/edit produce form
│       ├── TransactionForm.jsx # Transaction creation form
│       └── UserForm.jsx        # User registration form
│
├── pages/                      # Main application pages
│   ├── Auth/
│   │   ├── LoginPage.jsx       # User authentication
│   │   ├── RegisterPage.jsx    # User registration
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── Dashboard/
│   │   ├── Dashboard.jsx       # Main dashboard router
│   │   ├── FarmerDashboard.jsx # Farmer-specific dashboard
│   │   ├── DistributorDashboard.jsx
│   │   ├── RetailerDashboard.jsx
│   │   ├── ConsumerDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── Produce/
│   │   ├── ProduceList.jsx     # Browse available produce
│   │   ├── ProduceDetails.jsx  # Individual produce info
│   │   ├── AddProduce.jsx      # Farmer add produce
│   │   └── PurchaseProduce.jsx # Distributor/Retailer purchase
│   ├── Traceability/
│   │   ├── TraceabilityPage.jsx # Main traceability interface
│   │   ├── ProductJourney.jsx   # Journey visualization
│   │   └── BlockchainVerify.jsx # Blockchain verification
│   ├── Transactions/
│   │   ├── TransactionHistory.jsx # Transaction list
│   │   ├── TransactionDetails.jsx # Individual transaction
│   │   └── CreateTransaction.jsx  # New transaction form
│   ├── Analytics/
│   │   ├── AnalyticsDashboard.jsx # Main analytics page
│   │   ├── FarmerAnalytics.jsx    # Farmer-specific metrics
│   │   ├── ConsumerAnalytics.jsx  # Consumer analytics
│   │   └── AdminAnalytics.jsx     # Platform-wide metrics
│   └── Profile/
│       ├── UserProfile.jsx     # User profile management
│       ├── EditProfile.jsx     # Profile editing
│       └── Settings.jsx        # User preferences
│
├── context/                    # React Context providers
│   ├── AuthContext.jsx         # Authentication state
│   ├── BlockchainContext.jsx   # Blockchain data
│   ├── NotificationContext.jsx # App notifications
│   └── ThemeContext.jsx        # UI theme management
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.js             # Authentication hook
│   ├── useBlockchain.js       # Blockchain interactions
│   ├── useLocalStorage.js     # Local storage management
│   ├── useDebounce.js         # Debounced values
│   └── useApi.js              # API call management
│
├── services/                   # API and external services
│   ├── authService.js         # Authentication API
│   ├── blockchainService.js   # Hyperledger Fabric API
│   ├── produceService.js      # Produce management API
│   ├── transactionService.js  # Transaction API
│   ├── userService.js         # User management API
│   ├── analyticsService.js    # Analytics data API
│   └── mapService.js          # Google Maps integration
│
├── utils/                      # Utility functions
│   ├── constants.js           # App constants
│   ├── helpers.js             # General helper functions
│   ├── validators.js          # Form validation
│   ├── formatters.js          # Data formatting
│   └── api.js                 # Axios configuration
│
├── styles/                     # Styling files
│   ├── globals.css            # Global styles
│   ├── components.css         # Component-specific styles
│   └── tailwind.config.js     # Tailwind configuration
│
├── assets/                     # Static assets
│   ├── images/                # Image files
│   ├── icons/                 # Icon files
│   └── fonts/                 # Custom fonts
│
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
└── router.jsx                  # Routing configuration
```

## 🔄 **Component Flow & Data Flow**

### **Authentication Flow**

```
1. User visits app → ProtectedRoute checks auth
2. If not authenticated → Redirect to LoginPage
3. LoginPage → AuthService → Backend API → Blockchain verification
4. Success → AuthContext updates → Redirect to role-based dashboard
```

### **Produce Management Flow**

```
1. Farmer → AddProduce form → Google Maps location
2. Form submission → ProduceService → Backend API
3. Backend → Hyperledger Fabric → CouchDB world state
4. Success → QR code generated → Transaction recorded
```

### **Traceability Flow**

```
1. Consumer → TraceabilityPage → QR scan or Product ID
2. ProductJourney → BlockchainService → Query CouchDB
3. Fetch complete journey → Display with blockchain hashes
4. BlockchainVerify → Validate transaction authenticity
```

## 🚀 **Routing Structure**

### **Public Routes**

- `/` → Home/Landing page
- `/login` → LoginPage
- `/register` → RegisterPage
- `/forgot-password` → ForgotPasswordPage
- `/reset-password` → ResetPasswordPage

### **Protected Routes (Role-based)**

- `/dashboard` → Dashboard (role-specific)
- `/produce` → ProduceList (Distributors/Retailers)
- `/add-produce` → AddProduce (Farmers only)
- `/traceability` → TraceabilityPage (All users)
- `/transactions` → TransactionHistory (All users)
- `/analytics` → AnalyticsDashboard (Role-specific)
- `/profile` → UserProfile (All users)

### **Admin Routes**

- `/admin/users` → User management
- `/admin/transactions` → All transactions
- `/admin/system` → System monitoring

## 🎨 **UI/UX Design Principles**

### **Color Scheme**

```css
Primary: Emerald Green (#10b981) - Agriculture/Growth
Secondary: Blue (#3b82f6) - Trust/Technology
Accent: Orange (#f59e0b) - Energy/Action
Success: Green (#22c55e)
Warning: Yellow (#eab308)
Error: Red (#ef4444)
Neutral: Gray (#6b7280)
```

### **Component Design System**

1. **Cards** → Clean white backgrounds with subtle shadows
2. **Buttons** → Rounded corners, hover effects, loading states
3. **Forms** → Clear labels, validation feedback, progressive disclosure
4. **Charts** → Interactive, responsive, color-coded by data type
5. **Navigation** → Breadcrumbs, active states, role indicators

## 📱 **Responsive Design Strategy**

### **Breakpoints**

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### **Responsive Components**

- Sidebar → Collapses to hamburger menu on mobile
- Charts → Stack vertically on smaller screens
- Tables → Horizontal scroll with sticky headers
- Forms → Single column on mobile, multi-column on desktop

## 🔗 **State Management Strategy**

### **Context Providers**

1. **AuthContext** → User authentication, permissions
2. **BlockchainContext** → Blockchain data, transaction status
3. **NotificationContext** → Toast messages, alerts
4. **ThemeContext** → Dark/light mode, accessibility

### **Component State**

- Local state for form inputs, UI interactions
- Derived state for computed values
- Optimistic updates for better UX

## 🛡️ **Security & Best Practices**

### **Authentication**

- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Protected route validation
- Session timeout handling

### **Data Validation**

- Client-side form validation
- Server-side validation backup
- Input sanitization
- XSS prevention

### **Performance Optimization**

- Code splitting by routes
- Lazy loading for heavy components
- Memoization for expensive calculations
- Virtual scrolling for large lists

## 🔧 **API Integration Points**

### **Backend Endpoints**

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh

// Produce Management
GET /api/produce (with filters)
POST /api/produce (create)
PUT /api/produce/:id (update)
GET /api/produce/:id/trace (traceability)

// Transactions
GET /api/transactions
POST /api/transactions
GET /api/transactions/:id

// Analytics
GET /api/analytics/farmer/:id
GET /api/analytics/platform
GET /api/analytics/consumer/:id

// Blockchain
GET /api/blockchain/verify/:hash
GET /api/blockchain/transaction/:id
```

### **Real-time Updates**

- WebSocket connection for live transaction updates
- Polling for blockchain confirmation status
- Push notifications for important events

This architecture provides a scalable, maintainable foundation for your AgriChain application that can grow with your SIH project requirements.
