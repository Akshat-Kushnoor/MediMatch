# BloodRoute Project - Complete Learning Guide
//shortest distance & expiry date .
## 📋 Overview
**BloodRoute** is a smart blood distribution network simulator that uses routing algorithms and inventory management to optimize blood delivery between hospitals.

---

## 🏗️ PROJECT ARCHITECTURE

```
SIMULATOR                   ROUTING LOGIC              VISUALIZATION
┌─────────────┐            ┌─────────────┐           ┌──────────────┐
│  simulator  │ requests → │  algorithm  │ computes→ │  frontend    │
│  .py        │            │ (Dijkstra + │          │  GUI (Tkinter)
│             │            │  Greedy)    │          │               │
└─────────────┘            └─────────────┘           └──────────────┘
       ↓                           ↓                         ↓
Generate blood     Plan optimal route           Display map &
requests randomly  between hospitals           statistics

DATA LAYER: Hospital Inventory + Network Topology
```

---

## 📁 FILE-BY-FILE BREAKDOWN

### **1. `backend/hospital.py` - Hospital Class**
**Purpose:** Represents each hospital as a node in the network

**Key Concepts:**
- Each hospital has:
  - ID, name, latitude, longitude (location)
  - Blood inventory (8 types: O+, O-, A+, A-, B+, B-, AB+, AB-)
  - Request queue and delivery history

**Main Methods:**
```python
add_blood(blood_type, quantity, expiry_days=42)
# → Adds blood units with expiry date

get_available_blood(blood_type)
# → Returns count of non-expired, available units

remove_blood(blood_type, quantity)
# → Removes blood units (after delivery)

get_inventory_status()
# → Returns complete inventory snapshot
```

**Why it matters:** This is the DATA MODEL - stores what blood each hospital has

---

### **2. `backend/network.py` - Network Topology**
**Purpose:** Manages the network of hospitals and their connections

**Key Concepts:**
- Uses NetworkX library for graph representation
- Hospitals = nodes, Connections = edges with distances
- Bidirectional communication (undirected graph)

**Main Methods:**
```python
add_hospital(hospital)
# → Add a hospital node to network

add_connection(hospital_id_1, hospital_id_2, distance)
# → Create a direct link between hospitals

get_neighbors(hospital_id)
# → Find connected hospitals

get_distance(hospital_id_1, hospital_id_2)
# → Get distance between two hospitals

get_shortest_path(source_id, dest_id)
# → Calculate fastest route using Dijkstra's algorithm
```

**Why it matters:** This is the CONNECTION LAYER - defines who can reach whom

---

### **3. `backend/algorithm.py` - Routing Algorithm**
**Purpose:** Find optimal routes and select best blood sources

**Two Main Algorithms:**

#### **A. Dijkstra's Shortest Path**
```
Problem: Find fastest route from Hospital A to Hospital B

Algorithm:
1. Initialize all distances as infinity (except source = 0)
2. Use min-heap to always explore closest unvisited node
3. Update distances to neighbors
4. Continue until destination reached

Time Complexity: O(E + V log V) - EFFICIENT!

Example:
Hospital 1 → Hospital 3: distance = 12.3 km, time = 12.3 min
```

#### **B. Greedy Blood Selection**
```
Problem: Which hospital should provide the blood?

Score = (expiry_score × 0.6) - (distance_score × 0.4)

Examples:
- Hospital A: Blood expires in 2 days, 8 km away → HIGH SCORE (use this!)
- Hospital B: Blood expires in 30 days, 50 km away → LOW SCORE (too far)

This balances: Don't want expired blood + Don't want long delays
```

**Why it matters:** This is the SMART LOGIC - decides where blood comes from and how to get it there

---

### **4. `backend/inventory.py` - Inventory Manager**
**Purpose:** Track blood movements and statistics

**Key Methods:**
```python
check_total_inventory(blood_type)
# → How much O+ blood exists ACROSS ALL hospitals?

update_inventory(source_id, dest_id, blood_type, quantity)
# → After delivery, remove from source hospital, add to destination

log_transaction(source_id, dest_id, blood_type, quantity, status)
# → Record every transfer in transaction log

get_wastage_stats()
# → Calculate wasted blood (expired units)
```

**Transaction Log Example:**
```
{
  'timestamp': '2024-01-15T10:30:15',
  'source_hospital_id': 1,
  'dest_hospital_id': 3,
  'blood_type': 'O+',
  'quantity': 2,
  'status': 'SUCCESS'
}
```

**Why it matters:** This is the AUDIT TRAIL - records all blood movements

---

### **5. `simulation/simulator.py` - Main Simulation Engine**
**Purpose:** Run the complete simulation loop

**Simulation Flow:**
```
STEP 1: Initialize
├─ Create 6 hospitals with random blood inventory (5-20 units each)
└─ Each hospital gets all 8 blood types

STEP 2: Generate Request (e.g., Hospital 3 needs 2 units of O+)
├─ Urgency: CRITICAL, HIGH, or NORMAL
├─ Blood type: Random from 8 types
└─ Quantity: 1-5 units

STEP 3: Find Best Route
├─ Use algorithm to find best source hospital
├─ Calculate path and delivery time
└─ Check if blood is available

STEP 4: Execute Transfer
├─ Remove blood from source
├─ Add blood to destination
├─ Update statistics
└─ Log transaction

STEP 5: Repeat
└─ Process 10 requests (configurable)
```

**Tracked Statistics:**
```python
{
  'requests': 10,           # Total blood requests
  'fulfilled': 8,           # Successfully delivered
  'rejected': 2,            # Could not find source
  'total_distance': 95.3,   # Total km traveled
  'total_time': 157.2,      # Total minutes
  'wastage_prevented': 8    # Units saved from expiry
}
```

**Why it matters:** This is the ENGINE - coordinates everything

---

### **6. `backend/server.py` - Flask API Server**
**Purpose:** Serve requests from GUI to backend

**Main Endpoints:**
```
GET /hospitals          → List all hospitals
GET /hospital/<id>      → Get hospital details
POST /request           → Submit blood request
GET /statistics         → Get simulation stats
```

---

### **7. `frontend/app.py` - Tkinter GUI**
**Purpose:** Visual interface showing map, hospitals, and live routes

**Features:**
- Map display with hospital locations
- Live route animation (shows ambulance path)
- Statistics panel (requests, fulfilled, wastage)
- Start/Stop simulation buttons

---

### **8. `utils/constants.py` - Global Constants**
**Purpose:** All static values used throughout project

**Key Constants:**
```python
BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

COMPATIBILITY = {
    'O-': can give to anyone
    'AB+': can receive from anyone
    'O+': can give to O+, A+, B+, AB+
    # ... etc
}

URGENCY_LEVELS = {
    'CRITICAL': 1      # Life-threatening, use fastest route!
    'HIGH': 2          # Scheduled surgery
    'NORMAL': 3        # Regular transfusion
}

DELIVERY_SPEED_KMH = 60  # Ambulances travel at 60 km/h
```

**Why it matters:** Single source of truth for all configurations

---

### **9. `utils/logger.py` - Logging System**
**Purpose:** Track all events and debug

**Levels:**
- INFO: Normal operations
- WARNING: Something unusual
- ERROR: Something broke

Example logs:
```
INFO: Added Central Hospital (ID: 1) to network
INFO: Connected H1 <-> H2 (8.5 km)
INFO: Initialized Central Hospital with random inventory
INFO: Request 1: SUCCESS (Route found: 1→5→3)
```

---

### **10. `config/config.py` - Configuration Settings**
**Purpose:** Tunable parameters

```python
NUM_HOSPITALS = 6              # How many hospitals in simulation
DELIVERY_SPEED_KMH = 50        # Ambulance speed
BLOOD_EXPIRY_DAYS = 42         # When does blood expire
MIN_CRITICAL_STOCK = 5         # Min units before alert
SIMULATION_DURATION_MINS = 120 # How long simulation runs
```

---

### **11. `main.py` - Entry Point**
**Purpose:** Initialize everything and start the app

**Execution Order:**
```
1. Create hospital network (6 hospitals + connections)
2. Initialize routing algorithm
3. Initialize inventory manager
4. Initialize simulator
5. Launch GUI (Tkinter)
```

---

## 🎓 LEARNING PATH (Recommended Order)

### **Phase 1: Understand Data (1-2 hours)**
1. Read `utils/constants.py` - Understand blood types, urgency levels
2. Read `backend/hospital.py` - Understand Hospital class and inventory
3. Run: `python main.py` - See how it initializes

### **Phase 2: Understand Connections (1-2 hours)**
4. Read `backend/network.py` - Understand hospital network graph
5. Read `config/config.py` - Understand configuration
6. Draw on paper: 6 hospitals and connections between them

### **Phase 3: Understand Algorithms (2-3 hours)**
7. Read `backend/algorithm.py` - Dijkstra's and Greedy selection
8. Watch video: "Dijkstra's Algorithm in 5 minutes" on YouTube
9. Trace through manually: How would I route O+ from H1 to H5?

### **Phase 4: Understand Simulation (1-2 hours)**
10. Read `simulation/simulator.py` - Understand simulation loop
11. Read `backend/inventory.py` - Understand inventory tracking
12. Trace: What happens when a request is made?

### **Phase 5: Run & Experiment (1-2 hours)**
13. Run simulator and watch output
14. Modify constants and see what happens
15. Try: Add a 7th hospital, change distances, etc.

---

## 🔄 DATA FLOW EXAMPLE

```
BLOOD REQUEST ARRIVES AT SIMULATOR:
┌─────────────────────────────────────────────────────────┐
│ Hospital 3 needs: 2 units of O+, CRITICAL urgency       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ ALGORITHM.find_best_source() evaluates all hospitals:   │
│                                                         │
│ Hospital 1: Has 8 units O+, 9 km away, expires in 2 d  │
│   Score = 0.9 × 0.6 - 0.5 × 0.4 = 0.34 ← BEST SOURCE  │
│                                                         │
│ Hospital 2: Has 3 units O+, 15 km away, expires in 20 d│
│   Score = 0.5 × 0.6 - 0.8 × 0.4 = 0.02                 │
│                                                         │
│ Hospital 5: Has 0 units O+                              │
│   Score = 0 ✗ Can't use                                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ NETWORK.get_shortest_path(1, 3):                        │
│                                                         │
│ Dijkstra finds: 1 → 5 → 3 (distance = 12.3 km)          │
│ Time = 12.3 km ÷ 60 km/h × 60 = 12.3 minutes            │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ INVENTORY.update_inventory():                           │
│                                                         │
│ - Remove 2 units O+ from Hospital 1                     │
│ - Add 2 units O+ to Hospital 3                          │
│ - Log transaction with timestamp                        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ SIMULATOR updates statistics:                           │
│                                                         │
│ requests = 1                                            │
│ fulfilled = 1                                           │
│ total_distance = 12.3 km                                │
│ total_time = 12.3 mins                                  │
│ wastage_prevented = 1 (saved near-expiry blood)         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ FRONTEND displays:                                      │
│                                                         │
│ - Animated ambulance traveling 1→5→3 on map             │
│ - Live route shown as glowing path                      │
│ - Time counter: 12.3 minutes                            │
│ - Distance: 12.3 km                                     │
│ - Hospitals' inventory updated                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 KEY CONCEPTS TO MASTER

### **1. Dijkstra's Algorithm**
- Find shortest path in a weighted graph
- Used: Route ambulances between hospitals
- Why: Guarantees optimal path, efficient (O(E + V log V))

### **2. Greedy Selection**
- Select best option at each step
- Used: Choose which hospital provides blood
- Why: Balances freshness (expiry) vs. delivery speed

### **3. Inventory Management**
- Track blood units across network
- Consider: Expiry dates, blood types, compatibility
- Goal: Minimize wastage, maximize availability

### **4. Graph Theory**
- Hospitals = nodes
- Routes = edges with distances
- Operations: shortest path, neighbors, reachability

### **5. Real-time Simulation**
- Time-stepped events
- Random request generation
- State tracking (who has what, where)

---

## 🚀 NEXT STEPS

Once you understand these files:

1. **Run the simulator** and watch the output
2. **Modify constants** - add more hospitals, change urgency levels
3. **Experiment with GUI** - see how routes display on map
4. **Trace algorithms** - manually calculate Dijkstra for a path
5. **Extend features** - add new blood types, new hospitals, new urgency levels

---

## 💡 QUICK REFERENCE

| File | Purpose | Key Methods |
|------|---------|-------------|
| hospital.py | Store blood inventory | add_blood(), get_available_blood(), remove_blood() |
| network.py | Connect hospitals | add_hospital(), add_connection(), get_shortest_path() |
| algorithm.py | Find routes & sources | dijkstra_shortest_path(), greedy_blood_selection() |
| inventory.py | Track transfers | update_inventory(), log_transaction(), get_wastage_stats() |
| simulator.py | Run simulation | initialize_inventory(), generate_blood_request(), process_request() |
| constants.py | Static values | BLOOD_TYPES, URGENCY_LEVELS, COMPATIBILITY |
| config.py | Settings | NUM_HOSPITALS, DELIVERY_SPEED_KMH, BLOOD_EXPIRY_DAYS |

---

## 🎯 PROJECT GOAL

**Optimize blood distribution** across hospitals by:
- ✅ Find shortest delivery routes
- ✅ Select sources with freshest blood
- ✅ Balance distance vs. expiry
- ✅ Minimize blood waste
- ✅ Respond to urgent requests first

Good luck! 🚀
