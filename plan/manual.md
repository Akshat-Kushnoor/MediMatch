You are a senior backend architect. Build a production-grade Blood Donation Backend using:

- Node.js + Express
- TypeScript
- MongoDB Atlas (Hospitals + Blood Banks + Requests)
- Firebase Auth + Firestore (Users / Donors)
- Redis (Caching layer)
- Geospatial + Graph Algorithms (GeoHash + Dijkstra)
- Clean modular architecture
- no comments in any file of this project codebase

--------------------------------------------------
🏗️ CORE SYSTEM ARCHITECTURE
--------------------------------------------------

HYBRID DATABASE SYSTEM:

🔥 Firebase:
- Authentication (ALL users)
- Firestore → Donor profiles

🔥 MongoDB Atlas:
- Hospitals
- Blood Banks
- Blood Inventory
- Requests
- Admin-controlled entities

🔥 Redis:
- Cache nearby blood banks per request
- Cache request states for fast approval workflow

--------------------------------------------------
📁 FEATURE-DRIVEN FOLDER STRUCTURE
--------------------------------------------------

src/
│
├── controllers/
│   ├── user/
│   ├── admin/
│   │   ├── hospital.controller.ts
│   │   ├── bloodBank.controller.ts
│   │   ├── stock.controller.ts
│   │   ├── requestApproval.controller.ts
│   │
│   ├── hospital/
│   │   ├── request.controller.ts
│   │   ├── stock.controller.ts
│   │
│   ├── bloodBank/
│   │   ├── inventory.controller.ts
│   │   ├── donor.controller.ts
│
├── services/
│   ├── admin/
│   ├── firebase/
│   ├── mongo/
│   ├── cache/
│   ├── algorithms/
│   │   ├── dijkstra.service.ts
│   │   ├── greedyDonor.service.ts
│   │
│   ├── stock/
│   │   ├── stockManagement.service.ts
│   │   ├── stockValidation.service.ts
│   │
│   ├── request/
│   │   ├── requestFlow.service.ts
│   │   ├── approval.service.ts
│
├── models/ (MongoDB ONLY)
│   ├── hospital.model.ts
│   ├── bloodBank.model.ts
│   ├── request.model.ts
│
├── firestoreModels/
│   ├── donor.firestore.ts
│
├── middlewares/
│   ├── firebaseAuth.middleware.ts
│   ├── role.middleware.ts
│   ├── admin.middleware.ts
│
├── routes/
│   ├── admin.routes.ts
│   ├── hospital.routes.ts
│   ├── bloodBank.routes.ts
│
└── config/

--------------------------------------------------
🔐 ROLES SYSTEM
--------------------------------------------------

Roles:
- ADMIN
- HOSPITAL
- BLOOD_BANK
- DONOR (Firebase only)

RBAC enforced via middleware.

--------------------------------------------------
🏥 ADMIN FEATURES (NEW)
--------------------------------------------------

ADMIN CAN:

1. CREATE HOSPITAL
- name
- location (GeoJSON)
- contact info
- activation status

2. CREATE BLOOD BANK
- name
- location (GeoJSON)
- geohash
- initial stock setup

3. MANAGE STOCK
- Add blood units
- Reduce blood units
- Transfer stock between banks
- Audit log for all changes

4. APPROVE / REJECT REQUESTS
- Hospital sends request → goes to admin queue
- Admin decides:
    - APPROVE → triggers algorithm flow
    - REJECT → logs reason

--------------------------------------------------
🏥 HOSPITAL FEATURES
--------------------------------------------------

- Create blood request
- View nearby blood banks
- Track request status
- View approved/fulfilled requests
- View available stock (read-only)

--------------------------------------------------
🏦 BLOOD BANK FEATURES
--------------------------------------------------

- Update inventory (restricted)
- View assigned requests
- Accept/decline donor allocation
- View stock levels

--------------------------------------------------
📦 STOCK MANAGEMENT SYSTEM (CORE FEATURE)
--------------------------------------------------

Each Blood Bank has:

inventory: {
  A+: number,
  A-: number,
  B+: number,
  B-: number,
  AB+: number,
  AB-: number,
  O+: number,
  O-: number
}

RULES:
- Only ADMIN can globally modify stock
- Blood Bank can request stock update
- Hospital can only view stock

STOCK OPERATIONS:
- addStock(bankId, bloodGroup, units)
- reduceStock(bankId, bloodGroup, units)
- transferStock(fromBank, toBank)

--------------------------------------------------
📥 REQUEST APPROVAL WORKFLOW
--------------------------------------------------

STEP 1: Hospital sends request
STEP 2: Request stored in MongoDB (status = PENDING)
STEP 3: Admin queue picks request
STEP 4: Admin approves/rejects

IF APPROVED:
→ trigger pipeline:
   1. Geo search blood banks
   2. Cache in Redis
   3. Run Dijkstra (optimal banks)
   4. Check stock availability
   5. Run greedy donor selection (Firestore)

IF REJECTED:
→ store reason + notify hospital

--------------------------------------------------
🧠 CORE ALGORITHM PIPELINE (UNCHANGED BUT ENHANCED)
--------------------------------------------------

1. GEO FILTER (MongoDB $near)
2. CACHE RESULT (Redis)
3. DIJKSTRA SHORTEST PATH (hospital → banks)
4. STOCK VALIDATION (critical new step)
5. FIRESTORE DONOR FETCH
6. GREEDY SELECTION:
   - healthScore
   - availability
   - donation cooldown
   - proximity
7. FINAL MATCH RESULT

--------------------------------------------------
⚙️ NEW SERVICES REQUIRED
--------------------------------------------------

- adminHospital.service.ts
- adminBloodBank.service.ts
- stockManagement.service.ts
- requestApproval.service.ts
- stockAudit.service.ts
- requestQueue.service.ts

--------------------------------------------------
🌐 API ENDPOINTS (UPDATED)
--------------------------------------------------

ADMIN:
- POST /admin/hospital/create
- POST /admin/bloodbank/create
- PATCH /admin/stock/add
- PATCH /admin/stock/reduce
- POST /admin/request/approve
- POST /admin/request/reject

HOSPITAL:
- POST /hospital/request-blood
- GET /hospital/requests

BLOOD BANK:
- GET /bloodbank/inventory
- PATCH /bloodbank/request-stock

--------------------------------------------------
📊 DATA RULES
--------------------------------------------------

- Firebase = identity only
- MongoDB = operational system
- Stock is always authoritative in MongoDB
- Redis = temporary acceleration only

--------------------------------------------------
🎯 FINAL OUTPUT REQUIRED
--------------------------------------------------

Generate:

✔ Full backend code
✔ Admin CRUD system
✔ Stock management system
✔ Request approval workflow
✔ Firebase auth integration
✔ MongoDB schemas
✔ Redis caching layer
✔ Dijkstra implementation
✔ Greedy donor selection
✔ Clean modular architecture
✔ Production-ready TypeScript code
.env.example file & README with setup instructions  
docs folder with API documentation with requset /response examples

System must be scalable, secure, and real-world deployable.