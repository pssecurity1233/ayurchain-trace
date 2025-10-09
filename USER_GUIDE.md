# AyurChain Trace - Complete User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication & Login](#authentication--login)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Collector Features](#collector-features)
5. [Laboratory Features](#laboratory-features)
6. [Manufacturer Features](#manufacturer-features)
7. [Processor Features](#processor-features)
8. [Regulator Features](#regulator-features)
9. [Consumer Features](#consumer-features)
10. [Admin Features](#admin-features)
11. [Analytics System](#analytics-system)
12. [Real-time Features](#real-time-features)
13. [Offline Capabilities](#offline-capabilities)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (offline mode available for collectors)
- Mobile device or desktop computer

### Access the Application
Navigate to your application URL to access AyurChain Trace.

---

## Authentication & Login

### Sign Up Process

1. **Navigate to Sign Up**
   - Click "Sign Up" on the home page
   - Or go to `/auth` and select "Sign Up" tab

2. **Enter Your Details**
   ```
   Required Fields:
   - Full Name
   - Email Address
   - Phone Number
   - Password (min 8 characters)
   - Confirm Password
   - User Role (select from dropdown)
   - Organization Name
   - Address
   ```

3. **Role-Specific Fields**
   - **Collector**: License Number
   - **Lab**: Accreditation Number
   - **Manufacturer**: Manufacturing License
   - **Regulator**: Authority ID

4. **Submit Registration**
   - Click "Create Account"
   - Check email for verification link
   - Click verification link to activate account

### Login Process

1. **Navigate to Login**
   - Go to `/auth`
   - Select "Sign In" tab

2. **Enter Credentials**
   ```
   - Email Address
   - Password
   ```

3. **Access Dashboard**
   - Click "Sign In"
   - Automatically redirected to role-specific dashboard

### Password Reset
1. Go to authentication page
2. Click "Forgot Password?"
3. Enter email address
4. Check email for reset link
5. Create new password

---

## User Roles & Permissions

### Available Roles

| Role | Code | Primary Function |
|------|------|-----------------|
| Collector | `collector` | Harvest herbs, create collection events |
| Laboratory | `lab` | Test samples, issue quality certificates |
| Manufacturer | `manufacturer` | Process herbs, create batches, manage production |
| Processor | `processor` | Process raw materials |
| Regulator | `regulator` | Monitor compliance, issue certifications |
| Consumer | `consumer` | Scan QR codes, view product history |
| Admin | `admin` | Manage system, users, and configurations |

---

## Collector Features

### Dashboard Overview
**Route**: `/collector-dashboard`

#### Key Metrics Displayed
- Total Collections This Month
- Active Species Count
- Sustainability Score
- Pending Quality Tests

### Create Collection Event

1. **Navigate to Collection Form**
   - Click "New Collection" button
   - Or go to `/collect` route

2. **Enter Collection Details**
   ```
   Required Information:
   - Species ID (select from dropdown)
   - Collection Date
   - Quantity (in kg)
   - Collection Method
   - GPS Coordinates (auto-detected or manual)
   - Photos (upload images)
   ```

3. **Validation Checks**
   - System automatically validates:
     - Collection within approved geo-fence
     - Collection during valid season window
     - Species authorization

4. **Submit Collection**
   - Click "Submit Collection Event"
   - Receive confirmation with event ID
   - Collection recorded on blockchain

### View Collection History
- Access "My Collections" tab
- Filter by:
  - Date range
  - Species
  - Status (pending, approved, rejected)
- Export data to CSV/PDF

### Offline Mode
1. **Enable Offline Sync**
   - Go to Settings
   - Toggle "Offline Mode" ON

2. **Work Offline**
   - Create collection events without internet
   - Data stored locally in browser

3. **Sync Data**
   - When online, click "Sync Now"
   - All offline data uploads automatically

### Training & Certification
- View required training modules
- Complete online courses
- Download certificates
- Track certification expiry dates

---

## Laboratory Features

### Dashboard Overview
**Route**: `/lab-dashboard`

#### Key Metrics
- Pending Tests
- Tests Completed Today
- Average Processing Time
- Quality Compliance Rate

### Sample Testing Workflow

1. **Receive Sample**
   - View "Pending Samples" queue
   - Click "Start Test" on sample

2. **Record Test Results**
   ```
   Test Parameters:
   - Active Compound Content (%)
   - Moisture Content (%)
   - Heavy Metals (ppm)
   - Microbial Load (CFU/g)
   - Pesticide Residue (ppm)
   - Adulteration Check (Pass/Fail)
   ```

3. **Quality Assessment**
   - System calculates quality grade (A-F)
   - Based on test parameters
   - Compliance with standards

4. **Issue Certificate**
   - Click "Generate Certificate"
   - Certificate includes:
     - QR code
     - Test results
     - Lab accreditation
     - Blockchain verification hash

5. **Submit Results**
   - Results recorded on blockchain
   - Notification sent to collector
   - Sample marked as "Completed"

### Laboratory Management

#### Equipment Tracking
- View available equipment
- Log maintenance schedules
- Track calibration dates

#### Accreditation Status
- View current accreditations
- Upload renewal documents
- Track expiry dates

### Analytics
- View quality trends over time
- Compare test results by species
- Export compliance reports

---

## Manufacturer Features

### Dashboard Overview
**Route**: `/manufacturer-dashboard`

#### Key Metrics
- Active Batches
- Production Volume (MTD)
- Quality Pass Rate
- Pending Orders

### Batch Creation Workflow

1. **Create New Batch**
   - Click "Create Batch" button
   - Enter batch details:
     ```
     - Product Name
     - Species ID
     - Target Quantity (kg)
     - Manufacturing Date
     - Expected Completion Date
     ```

2. **Select Source Collections**
   - View available approved collections
   - Filter by:
     - Species
     - Quality grade
     - Date range
   - Add collections to batch

3. **Quality Verification**
   - System aggregates quality test results
   - Calculates batch quality grade
   - Shows traceability chain

4. **Generate Batch QR Code**
   - Click "Finalize Batch"
   - System generates:
     - Unique QR code
     - Provenance hash
     - Blockchain transaction
   - QR code includes complete supply chain

5. **Print Labels**
   - Download QR code image
   - Print labels for products
   - Apply to packaging

### Batch Management

#### Track Batches
- View all batches (active, completed, recalled)
- Filter and search functionality
- Export batch reports

#### Batch Recall
1. Navigate to batch details
2. Click "Recall Batch"
3. Enter recall reason
4. Select severity level
5. System notifies:
   - All consumers who scanned QR
   - Regulators
   - Distribution partners

### Production Planning
- View raw material inventory
- Schedule production runs
- Track facility capacity

### Export Certifications
- Request export certificates
- Upload compliance documents
- Track certification status

---

## Processor Features

### Dashboard Overview
**Route**: `/processor-dashboard`

#### Key Metrics
- Processing Queue Length
- Daily Throughput
- Quality Metrics
- Equipment Utilization

### Processing Workflow

1. **View Incoming Materials**
   - Access processing queue
   - See material specifications
   - Check quality certificates

2. **Start Processing**
   - Select material batch
   - Record processing parameters:
     ```
     - Processing Method
     - Temperature
     - Duration
     - Equipment Used
     - Operator ID
     ```

3. **Quality Control**
   - Intermediate testing
   - Document weight loss/yield
   - Photo documentation

4. **Complete Processing**
   - Record final output weight
   - Generate processing certificate
   - Link to source materials

### Equipment Management
- Track processing equipment
- Log maintenance activities
- Monitor equipment status

---

## Regulator Features

### Dashboard Overview
**Route**: `/regulator-dashboard`

#### Key Metrics
- Active Licenses
- Pending Inspections
- Compliance Violations
- Certification Requests

### Compliance Monitoring

1. **Review License Applications**
   - View pending applications
   - Check submitted documents
   - Approve/Reject with comments

2. **Conduct Inspections**
   - Schedule site visits
   - Record inspection findings
   - Issue compliance certificates

3. **Issue Export Certifications**
   ```
   Required Information:
   - Batch ID
   - Destination Country
   - Certificate Type
   - Certification Body
   - Expiry Date
   ```

4. **Monitor Violations**
   - View flagged activities
   - Investigate reports
   - Issue warnings/penalties

### Audit Trail
- Access complete blockchain audit log
- Filter by:
  - User
  - Action type
  - Date range
  - Entity ID

### Reporting
- Generate compliance reports
- Export regulatory data
- Submit to government systems

---

## Consumer Features

### Dashboard Overview
**Route**: `/consumer-dashboard`

#### Features
- Recent Scans
- Favorite Products
- Scan History
- Educational Content

### Scan Product QR Code

1. **Access Scanner**
   - Click "Scan Product" button
   - Or navigate to `/scan`

2. **Scan QR Code**
   - Allow camera access
   - Point camera at QR code
   - System automatically reads code

3. **View Product Information**
   ```
   Displayed Information:
   - Product Name
   - Batch Number
   - Manufacturing Date
   - Quality Grade
   - Complete Supply Chain:
     * Collection Events (location, date, collector)
     * Lab Test Results (all parameters)
     * Manufacturing Details
     * Certifications
   - Blockchain Verification
   ```

4. **Verify Authenticity**
   - Check blockchain hash
   - View "Verified" badge
   - See number of previous scans

### Features on Product Page
- **Share**: Share product information
- **Report Issue**: Flag counterfeit products
- **Save**: Bookmark favorite products
- **Rate**: Provide product feedback

---

## Admin Features

### Dashboard Overview
**Route**: `/admin-dashboard`

#### System Metrics
- Total Users by Role
- System Uptime
- Database Statistics
- API Performance

### User Management

1. **View All Users**
   - Access user list
   - Filter by role
   - Search by name/email

2. **Manage User Roles**
   ```sql
   -- Roles stored in user_roles table
   - View user's current roles
   - Add new role to user
   - Remove role from user
   ```

3. **User Verification**
   - Review verification documents
   - Approve/Reject user accounts
   - Set verification expiry

### System Configuration

#### Species Management
- Add new species
- Configure collection seasons
- Set quality standards

#### Geo-Fence Configuration
- Define approved collection areas
- Upload GeoJSON boundaries
- Link to species

#### Laboratory Settings
- Manage accredited labs
- Configure test parameters
- Set quality thresholds

### Analytics & Reporting
- View system-wide analytics
- Export comprehensive reports
- Monitor blockchain transactions
- Track API usage

### Security Management
- View audit logs
- Monitor suspicious activities
- Manage API keys
- Configure permissions

---

## Analytics System

### Access Analytics
**Route**: `/analytics`

Available to all authenticated users with role-based data filtering.

### Analytics Tabs

#### 1. Harvest Analytics
- **Harvest Volume by Species**
  - Bar chart showing quantity collected
  - Filter by date range
  - Export data

- **Collection Trends**
  - Line chart over time
  - Compare multiple species
  - Seasonal patterns

#### 2. Quality Analytics
- **Quality Distribution**
  - Pie chart of quality grades
  - Pass/Fail rates
  - Compliance trends

- **Test Results Overview**
  - Average values per parameter
  - Standard deviation
  - Outlier detection

#### 3. Supply Chain Analytics
- **Efficiency Metrics**
  - Average time from collection to batch
  - Processing bottlenecks
  - Throughput analysis

- **Geographic Distribution**
  - Map visualization
  - Collection heatmaps
  - Regional performance

#### 4. Collector Performance
- **Scorecard Table**
  - Ranking by metrics
  - Sustainability scores
  - Quality ratings

- **Individual Analytics**
  - Personal performance trends
  - Areas for improvement
  - Certification status

#### 5. Conservation Impact
- **Sustainability Metrics**
  - Biodiversity indicators
  - Collection pressure
  - Regeneration rates

### Real-Time Updates
- All charts refresh every 30 seconds
- Live data from database views
- Automatic cache refresh

---

## Real-time Features

### Notification System

#### Channels
1. **In-App Notifications**
   - Bell icon in navigation
   - Real-time alerts
   - Notification history

2. **SMS Notifications**
   - Critical alerts
   - Batch status updates
   - Certification expiry

3. **Email Notifications**
   - Detailed reports
   - Weekly summaries
   - Important updates

#### Notification Types
- Collection approved/rejected
- Lab test completed
- Batch finalized
- Certificate issued
- Recall initiated
- Training due
- Document expiry warning

### Real-Time Data Sync
- **Supabase Realtime**
  - Auto-refresh tables
  - Live dashboard updates
  - Collaborative editing

### Live Tracking
- Collection GPS tracking
- Batch status updates
- Test progress monitoring

---

## Offline Capabilities

### Offline Sync System

#### For Collectors
1. **Enable Offline Mode**
   - Settings → Enable Offline Sync
   - Downloads essential data
   - Species list, geo-fences, seasons

2. **Work Offline**
   - Create collection events
   - Capture photos
   - Record GPS coordinates
   - All stored in IndexedDB

3. **Automatic Sync**
   - When online, auto-uploads
   - Conflict resolution
   - Status notifications

#### Data Storage
- Uses browser IndexedDB
- Up to 500MB storage
- Persistent across sessions

---

## Security Features

### Authentication
- Email/password with Supabase Auth
- Email verification required
- Session management
- Auto-refresh tokens

### Authorization
- Role-based access control (RBAC)
- Row-level security (RLS)
- `user_roles` table prevents privilege escalation
- `has_role()` security definer function

### Data Security
- All data encrypted at rest
- HTTPS/TLS in transit
- Blockchain verification
- Immutable audit trail

### QR Code Security
- HMAC signatures
- Nonce-based verification
- Access count limits
- Expiry dates

---

## Blockchain Integration

### Hyperledger Fabric

#### What Gets Recorded
- Collection events
- Quality test results
- Batch creation
- Certifications
- Recalls

#### Verification
- Each record gets transaction hash
- Immutable proof
- Timestamped entries
- Complete audit trail

### IPFS Storage
- Large files stored on IPFS
- Photos, certificates, documents
- Content-addressed storage
- Permanent links

---

## Mobile Responsiveness

### Mobile-First Design
- Fully responsive layouts
- Touch-optimized controls
- Mobile camera for QR scanning
- GPS location services

### Progressive Web App (PWA)
- Install on home screen
- Offline functionality
- Push notifications
- App-like experience

---

## Troubleshooting

### Common Issues

#### Cannot Login
- Check email verification
- Reset password if forgotten
- Contact admin for account status

#### Collection Rejected
- Verify within geo-fence
- Check collection season
- Ensure species authorization

#### QR Code Not Scanning
- Clean camera lens
- Ensure good lighting
- Try manual entry option

#### Data Not Syncing
- Check internet connection
- Click "Sync Now" manually
- Check browser storage quota

### Support
- In-app help documentation
- Contact system administrator
- Submit feedback through app

---

## Best Practices

### For Collectors
- ✅ Verify GPS coordinates before submitting
- ✅ Upload clear photos
- ✅ Submit collections promptly
- ✅ Maintain certification status
- ✅ Use offline mode in remote areas

### For Labs
- ✅ Complete tests within SLA
- ✅ Double-check test parameters
- ✅ Maintain equipment calibration
- ✅ Upload certificates promptly

### For Manufacturers
- ✅ Use only approved collections
- ✅ Verify quality grades
- ✅ Generate QR codes for all batches
- ✅ Track batch lineage carefully
- ✅ Respond to recalls immediately

### For Regulators
- ✅ Review applications promptly
- ✅ Conduct regular audits
- ✅ Monitor compliance metrics
- ✅ Issue certifications accurately

---

## API Integration

### For Developers

#### Supabase Client
```typescript
import { supabase } from '@/integrations/supabase/client';

// Query data
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert({ ... });
```

#### Edge Functions
- `/blockchain-integration` - Record on fabric
- `/ipfs-upload` - Upload to IPFS
- `/sms-notifications` - Send SMS
- `/realtime-notifications` - Push notifications
- `/search-engine` - Full-text search

---

## Glossary

- **Batch**: Group of processed materials from multiple collections
- **Collection Event**: Single harvesting activity
- **Geo-fence**: Geographic boundary for approved collection
- **Provenance**: Complete history of material origin
- **Quality Grade**: Rating from A (excellent) to F (fail)
- **Season Window**: Approved dates for species collection
- **Traceability**: Ability to track product through supply chain

---

## Version History

- **v1.0** - Initial release with core features
- **v1.1** - Added analytics system
- **v1.2** - Offline sync capabilities
- **v1.3** - Enhanced real-time features

---

## Contact & Support

For questions or issues:
- Email: support@ayurchain.com
- In-app feedback form
- System administrator

---

**© 2025 AyurChain Trace - Blockchain-Powered Herbal Supply Chain Transparency**
