# BloodRoute - REAL-TIME SLOW SIMULATION GUIDE

## 🎬 How the Simulation Now Works

The simulation now runs **STEP-BY-STEP** with delays, so you can actually SEE and UNDERSTAND what's happening!

---

## 📊 COMPLETE SIMULATION FLOW (For 1 Blood Request)

```
TIME: 0s
  [STEP 1] Hospital needs blood
           ↓ (Hospital turns RED on map)
           Hospital: Central Hospital, Blood: O+, Quantity: 2 units
  ⏱️ WAIT 1.5 seconds

TIME: 1.5s
  [STEP 2] Algorithm searching route
           ↓ (Hospital stays RED, searching...)
           "Finding optimal route..."
  ⏱️ WAIT 1.5 seconds

TIME: 3s
  [STEP 3] Route found and source identified
           ↓ (Route turns ORANGE, source hospital highlights)
           FROM: Blood Bank Institute (H5)
           TO: Central Hospital (H1)
           Distance: 5.2 km, Time: 5.2 mins
  ⏱️ WAIT 1.5 seconds

TIME: 4.5s
  [STEP 4] Transfer in progress (ambulance traveling)
           ↓ (GREEN color shows on receiving hospital, ORANGE path active)
           "Ambulance traveling from H5 to H1"
           "Status: In transit..."
  ⏱️ WAIT 2.6 seconds (half of travel time)

TIME: 7.1s
  [STEP 5] Blood arrived and delivered
           ↓ (Hospital turns back to BLUE, transfer complete)
           "5 units of B- received and stocked"
           "SUCCESS: Transfer completed!"
  ⏱️ WAIT 1.5 seconds

TIME: 8.6s
  [PAUSE] Wait before next request
  ⏱️ WAIT 3 seconds

TIME: 11.6s
  ➡️ NEXT REQUEST BEGINS...
```

---

## 🎨 MAP VISUALIZATION CHANGES

Watch the map as each step happens:

### **STEP 1: Hospital Requests Blood**
```
Hospital turns RED [NEEDS]
All routes stay GRAY (idle)
```

### **STEP 2: Algorithm Searching**
```
Hospital stays RED
Console shows: "Finding optimal route..."
```

### **STEP 3: Route Found**
```
Hospital still RED [NEEDS]
Route line turns ORANGE (highlighted)
Source hospital shows indicator
Distance/time displayed on route
```

### **STEP 4: Transfer In Progress**
```
Source hospital: stays normal color
Receiving hospital: turns GREEN [REC]
Route: ORANGE (active transfer path)
Console: "Ambulance traveling..."
```

### **STEP 5: Transfer Complete**
```
Source hospital: back to BLUE [OK]
Receiving hospital: back to BLUE [OK] 
Route: back to GRAY
Console: "SUCCESS: Transfer completed!"
```

---

## 📋 CONSOLE OUTPUT EXAMPLE

```
============================================================
BLOOD REQUEST #1 / 10
============================================================

  [STEP 1] Hospital Central Hospital (H1) REQUESTS blood
           Blood Type: B- | Quantity: 5 units | Urgency: NORMAL
  ⏱️ Wait 1.5s...

  [STEP 2] Finding optimal route...
  ⏱️ Wait 1.5s...

  [STEP 3] Route FOUND! Source identified:
           FROM: City Medical Center (H2)
           TO: Central Hospital (H1)
           Distance: 8.5 km
           Est. Time: 8.5 mins
  ⏱️ Wait 1.5s...

  [STEP 4] TRANSFERRING blood... (In transit)
           Ambulance traveling from H2 to H1
  ⏱️ Wait 4.25s (half of travel time)...

  [STEP 5] Blood ARRIVED at Central Hospital!
           5 units of B- received and stocked
  [SUCCESS] Transfer completed!
  ⏱️ Wait 1.5s...

  [PAUSE] Waiting 3 seconds before next request...
  ⏱️ Wait 3s...

============================================================
BLOOD REQUEST #2 / 10
============================================================
... (repeat for request #2)
```

---

## ⏱️ TIMING BREAKDOWN

For each request:

| Phase | Duration | What Happens |
|-------|----------|--------------|
| STEP 1 - Hospital Needs | 1.5s | Hospital turns RED, console shows request details |
| STEP 2 - Searching | 1.5s | Algorithm looking for route |
| STEP 3 - Route Found | 1.5s | Best source identified, route highlighted ORANGE |
| STEP 4 - In Transit | ~5s* | Ambulance traveling (half of estimated time) |
| STEP 5 - Arrival | 1.5s | Blood delivered, hospitals back to BLUE |
| PAUSE | 3s | Wait before next request |
| **TOTAL PER REQUEST** | **~14s** | *depends on distance |

**For 10 requests: ~140 seconds = ~2.3 minutes total**

---

## 🔄 WHAT HAPPENS AT EACH STEP

### **STEP 1: Hospital Requests Blood**
```
Event: 'hospital_needs'
UI Update: 
  - Hospital node turns RED
  - Label shows [NEEDS]
  - Hospital ID added to hospital_needs list
Console: Shows hospital name, blood type, quantity, urgency
```

### **STEP 2: Algorithm Searching**  
```
Event: 'searching_route'
UI Update:
  - Hospital stays RED
  - Console: "ALGORITHM: Searching for optimal route..."
Logic:
  - Dijkstra calculates distances from all hospitals
  - Greedy selection picks best source (freshness vs distance)
```

### **STEP 3: Route Found**
```
Event: 'route_found'
UI Update:
  - Route line turns ORANGE
  - Console shows: "ROUTE FOUND: H5 -> H1"
  - Distance and time displayed
Logic:
  - Source hospital identified
  - Path calculated
  - Transfer details shown
```

### **STEP 4: Transfer In Progress**
```
Event: 'transfer_in_progress'
UI Update:
  - Source: stays BLUE (or normal)
  - Destination: turns GREEN [REC]
  - Route: stays ORANGE (ambulance on route)
  - Console: "IN TRANSIT: Blood traveling..."
Wait: Half of estimated travel time (simulating journey)
```

### **STEP 5: Transfer Complete**
```
Event: 'transfer_complete'
UI Update:
  - All hospitals back to BLUE [OK]
  - Route back to GRAY
  - Hospital removed from hospital_needs
  - Console shows success/failure
Action:
  - Inventory updated
  - Statistics recorded
  - Success/failure logged
```

---

## 💻 Code Flow

```python
run_simulation(num_requests=10)
  ↓
Initialize inventory (1 sec)
  ↓
FOR each request (1-10):
  ├─ STEP 1: emit('hospital_needs') → UI shows RED
  ├─ wait 1.5s
  ├─ STEP 2: emit('searching_route') → UI shows searching
  ├─ wait 1.5s
  ├─ Call algorithm.find_best_source()
  ├─ STEP 3: emit('route_found') → UI shows ORANGE path
  ├─ wait 1.5s
  ├─ STEP 4: emit('transfer_in_progress') → UI shows GREEN receiving
  ├─ wait travel_time/2 (e.g., 5s)
  ├─ STEP 5: emit('transfer_complete') → UI back to BLUE
  ├─ Update inventory in database
  ├─ wait 1.5s
  ├─ PAUSE: wait 3s before next request
  └─ Repeat for next request
  ↓
print_statistics() → Final report
```

---

## 🔍 UI EVENT TYPES

The simulator sends these events to the UI:

```python
# When hospital needs blood
emit_ui_event('hospital_needs', {
    'hospital_id': 1,
    'blood_type': 'O+',
    'quantity': 2
})

# When searching for route
emit_ui_event('searching_route', {
    'hospital_id': 1
})

# When route is found
emit_ui_event('route_found', {
    'source_id': 5,
    'dest_id': 1,
    'distance': 5.2,
    'time': 5.2
})

# When transfer is in progress
emit_ui_event('transfer_in_progress', {
    'source_id': 5,
    'dest_id': 1
})

# When transfer is complete
emit_ui_event('transfer_complete', {
    'source_id': 5,
    'dest_id': 1,
    'blood_type': 'O+',
    'quantity': 2,
    'success': True
})
```

---

## 🎯 What You Should See When Running

1. **Click [START]** button
2. **Console shows:**
   - "SIMULATION STARTED"
   - Initialization message
   
3. **First request starts:**
   - Console: "BLOOD REQUEST #1 / 10"
   - [STEP 1] Hospital turns RED on map
   - Wait 1.5s
   - [STEP 2] "Finding optimal route..."
   - Wait 1.5s
   - [STEP 3] Route lights up ORANGE
   - Wait 1.5s
   - [STEP 4] Receiving hospital turns GREEN
   - Wait 5s (travel time)
   - [STEP 5] Hospitals turn BLUE, "SUCCESS!"
   - Wait 3s

4. **Second request starts:**
   - Same process repeats for request #2
   
5. **Pattern continues** for all 10 requests

6. **Final report shows:**
   - Total fulfilled: 8/10
   - Total distance: 95.3 km
   - Success rate: 80%

---

## 📊 REAL-WORLD ANALOGY

Think of it like a **real hospital blood bank system:**

```
13:00 - Hospital A urgently needs O+
        ↓ Hospitals across city are searched
13:01 - Hospital C has O+ blood that expires soon
        ↓ Perfect match! Route calculated (25 km away)
13:02 - Ambulance departs from Hospital C
        ↓ Drives at 60 km/h
13:27 - Ambulance arrives at Hospital A  
        ↓ Blood transferred to patient
13:28 - Blood Bank A updated with new O+ supply
        ↓ Old blood at Hospital C saved from waste!
```

Each step in this real-world scenario is now visualized in your UI!

---

## 🎓 KEY CONFIGURATION VALUES

In `simulation/simulator.py`:

```python
self.step_delay = 1.5        # seconds between steps
self.request_delay = 3       # seconds between requests
```

**Want faster simulation?** Change these values:
- `step_delay = 0.5` → Faster steps
- `request_delay = 1` → Faster between requests
- `step_delay = 3` → Slower steps  
- `request_delay = 5` → Slower between requests

---

## 📁 Files That Enable This

| File | Change |
|------|--------|
| `simulation/simulator.py` | Added `emit_ui_event()`, delays, step-by-step logic |
| `frontend/app.py` | Added `handle_simulation_event()` to process events |
| `utils/logger.py` | Already had console color coding |

---

## ✨ THE DEMO YOU WANTED

Now when you run it, you get:

✅ **Slow processing** - Not all at once
✅ **Step-by-step visualization** - See each phase
✅ **Live map updates** - Hospitals change color as it happens
✅ **Console logging** - Every detail shown
✅ **One request at a time** - Clear what's happening
✅ **Real-time understanding** - Perfect for learning AND demonstrating

**Perfect for:**
- 🎓 Learning how blood routing works
- 📊 Demoing to others
- 🎬 Making videos or presentations
- 📱 Understanding the algorithm step-by-step

---

## 🚀 HOW TO RUN

```bash
cd demo
python main.py

# Then click [START] and watch!
```

Sit back and watch your blood distribution network in action! 🏥💉
