# BloodRoute Simulation - Visual Flow Diagram

## 🎬 STEP-BY-STEP VISUALIZATION

```
SIMULATION STARTS
       |
       v
================================================================================
INITIALIZATION (1 second)
================================================================================
       |
       v
Create 6 Hospitals with Random Blood Inventory
    ├─ Central Hospital (H1): 8 units O+, 5 units A-, ... 
    ├─ City Medical Center (H2): 10 units O+, 7 units B+, ...
    ├─ State Hospital (H3): 6 units A-, 12 units O+, ...
    ├─ Emergency Care Clinic (H4): 9 units B+, 4 units AB-, ...
    ├─ Blood Bank Institute (H5): 15 units O+, 11 units A+, ...
    └─ Regional Medical Hub (H6): 7 units O-, 8 units B+, ...
       |
       v
   [OK] Initialization Complete
       |
    ⏱️ Wait 1 second
       |
       v

================================================================================
REQUEST #1 - DETAILED BREAKDOWN
================================================================================

TIME: 0s
┌─────────────────────────────────────────────────────────┐
│ [STEP 1] HOSPITAL NEEDS BLOOD                           │
│                                                         │
│  Central Hospital (H1) needs: 2 units of O+             │
│  Urgency: CRITICAL                                      │
│                                                         │
│  MAP UPDATE:                                            │
│      H1 turns RED [NEEDS]                              │
│      Size: LARGE (high urgency)                        │
│      Routes: Stay GRAY (no transfer yet)               │
│                                                         │
│  CONSOLE OUTPUT:                                        │
│      >> Hospital Central Hospital (H1) needs blood     │
│         Blood Type: O+ | Quantity: 2 units             │
│         Urgency: CRITICAL                              │
└─────────────────────────────────────────────────────────┘
        ⏱️ WAIT 1.5 SECONDS
        |
        v

TIME: 1.5s
┌─────────────────────────────────────────────────────────┐
│ [STEP 2] ALGORITHM SEARCHING FOR ROUTE                  │
│                                                         │
│  Dijkstra's Algorithm: Find all distances              │
│                                                         │
│  From Central Hospital (H1) to other hospitals:         │
│    → H2: 8.5 km                                        │
│    → H3: 12.3 km                                       │
│    → H4: 14.6 km (via H2)                              │
│    → H5: 5.2 km (shortest!)                            │
│    → H6: 20.6 km (via H3)                              │
│                                                         │
│  Greedy Selection: Which hospital has O+ blood?        │
│    H1: 8 units ✓ (source itself, but need external)   │
│    H2: 10 units ✓                                      │
│    H3: 12 units ✓                                      │
│    H4: 9 units ✓                                       │
│    H5: 15 units ✓ (BEST - freshest, closest)          │
│    H6: 7 units ✓                                       │
│                                                         │
│  Score for Each:                                        │
│    H2: (10/15)*0.6 - (8.5/20)*0.4 = 0.30              │
│    H3: (12/15)*0.6 - (12.3/20)*0.4 = 0.24             │
│    H5: (15/15)*0.6 - (5.2/20)*0.4 = 0.50 ← WINNER     │
│                                                         │
│  MAP UPDATE:                                            │
│      All hospitals stay their current color            │
│      Console shows: "Calculating..."                   │
└─────────────────────────────────────────────────────────┘
        ⏱️ WAIT 1.5 SECONDS
        |
        v

TIME: 3s
┌─────────────────────────────────────────────────────────┐
│ [STEP 3] ROUTE FOUND & SOURCE CONFIRMED                │
│                                                         │
│  OPTIMAL ROUTE IDENTIFIED:                              │
│    FROM: Blood Bank Institute (H5)                      │
│    TO: Central Hospital (H1)                            │
│    DISTANCE: 5.2 km                                     │
│    TRAVEL TIME: 5.2 mins (at 60 km/h)                  │
│    BLOOD TYPE: O+ (2 units needed, 15 available)       │
│                                                         │
│  PATH: H5 ---5.2km---> H1                              │
│                                                         │
│  MAP UPDATE:                                            │
│      ✓ Route H5-H1 turns ORANGE (highlighted)          │
│      ✓ Route line becomes thicker                      │
│      ✓ H1 stays RED [NEEDS]                            │
│      ✓ H5 shows as source indicator                    │
│      ✓ "5.2 km" label appears on route                 │
│                                                         │
│  CONSOLE OUTPUT:                                        │
│      >> ROUTE FOUND: H5 -> H1                          │
│         Distance: 5.2 km                               │
│         Est. Time: 5.2 mins                            │
└─────────────────────────────────────────────────────────┘
        ⏱️ WAIT 1.5 SECONDS
        |
        v

TIME: 4.5s
┌─────────────────────────────────────────────────────────┐
│ [STEP 4] BLOOD TRANSFER IN PROGRESS                     │
│                                                         │
│  AMBULANCE DEPARTURE:                                   │
│    └─ Departs from Blood Bank Institute (H5)           │
│    └─ Carries: 2 units of O+ blood                     │
│    └─ Destination: Central Hospital (H1)               │
│    └─ Route: 5.2 km on main road                       │
│    └─ Estimated arrival: In 5.2 minutes               │
│                                                         │
│  REAL-TIME TRACKING:                                    │
│    0% ----oooo---- 100% complete                       │
│                                                         │
│  MAP UPDATE:                                            │
│      ✓ H5 (source): stays BLUE [OK]                    │
│      ✓ H1 (dest): turns GREEN [REC] - receiving       │
│      ✓ Route H5-H1: stays ORANGE (active transfer)     │
│      ✓ Pulsing animation on route (wave pattern)       │
│                                                         │
│  CONSOLE OUTPUT:                                        │
│      >> IN TRANSIT: Blood traveling from H5 to H1...   │
│         Ambulance: 60 km/h | Progress: 0% ........ 50%  │
└─────────────────────────────────────────────────────────┘
        ⏱️ WAIT ~2.6 SECONDS (half of travel time)
        |
        v

TIME: 7.1s
┌─────────────────────────────────────────────────────────┐
│ [STEP 5] BLOOD DELIVERED & INVENTORY UPDATED            │
│                                                         │
│  DELIVERY SUCCESS:                                       │
│    ✓ Ambulance arrived at Central Hospital             │
│    ✓ Blood transferred to storage                      │
│    ✓ Inventory updated in database                     │
│                                                         │
│  INVENTORY CHANGE:                                      │
│    Blood Bank Institute (H5):                           │
│      Before: 15 units of O+                            │
│      After:  13 units of O+ (-2 transferred)           │
│                                                         │
│    Central Hospital (H1):                               │
│      Before: 8 units of O+                             │
│      After:  10 units of O+ (+2 received)              │
│                                                         │
│  MAP UPDATE:                                            │
│      ✓ H5: back to BLUE [OK]                           │
│      ✓ H1: back to BLUE [OK] (no longer needs urgent) │
│      ✓ Route H5-H1: back to GRAY (transfer complete)   │
│      ✓ All pulsing/animation stops                     │
│                                                         │
│  STATISTICS UPDATE:                                     │
│      Requests: 1 | Fulfilled: 1 | Rejected: 0         │
│      Distance: 5.2 km | Blood Saved: 1 unit           │
│                                                         │
│  CONSOLE OUTPUT:                                        │
│      >> DELIVERED: 2 units of O+ received!             │
│         [SUCCESS] Transfer completed!                  │
│         Distance traveled: 5.2 km                      │
│         Total time: 5.2 mins                           │
└─────────────────────────────────────────────────────────┘
        ⏱️ WAIT 1.5 SECONDS
        |
        v

TIME: 8.6s
┌─────────────────────────────────────────────────────────┐
│ [PAUSE] WAITING FOR NEXT REQUEST                        │
│                                                         │
│  All hospitals: BLUE [OK]                              │
│  All routes: GRAY (idle)                               │
│  Console: "Waiting 3 seconds before next request..."   │
│                                                         │
│  Current Status:                                        │
│      Requests completed: 1/10                          │
│      Success rate: 100%                                 │
│      Total distance: 5.2 km                            │
└─────────────────────────────────────────────────────────┘
        ⏱️ WAIT 3 SECONDS
        |
        v

TIME: 11.6s
================================================================================
REQUEST #2 - STARTS (repeat steps 1-5)
================================================================================
... (similar process for request #2)

```

---

## 📊 TIMING SUMMARY FOR ALL 10 REQUESTS

```
REQUEST  | STEP 1 | STEP 2 | STEP 3 | STEP 4 | STEP 5 | PAUSE | TOTAL
---------|--------|--------|--------|--------|--------|-------|--------
#1       | 1.5s   | 1.5s   | 1.5s   | 4.3s   | 1.5s   | 3s    | 13.3s
#2       | 1.5s   | 1.5s   | 1.5s   | 5.2s   | 1.5s   | 3s    | 14.2s
#3       | 1.5s   | 1.5s   | 1.5s   | 6.1s   | 1.5s   | 3s    | 15.1s
#4       | 1.5s   | 1.5s   | 1.5s   | 3.8s   | 1.5s   | 3s    | 12.8s
#5       | 1.5s   | 1.5s   | 1.5s   | 7.7s   | 1.5s   | 3s    | 16.2s
#6       | 1.5s   | 1.5s   | 1.5s   | 4.5s   | 1.5s   | 3s    | 13.5s
#7       | 1.5s   | 1.5s   | 1.5s   | 6.0s   | 1.5s   | 3s    | 15.0s
#8       | 1.5s   | 1.5s   | 1.5s   | 5.1s   | 1.5s   | 3s    | 14.1s
#9       | 1.5s   | 1.5s   | 1.5s   | 4.0s   | 1.5s   | 3s    | 12.9s
#10      | 1.5s   | 1.5s   | 1.5s   | 6.9s   | 1.5s   | 0*    | 12.4s*

TOTAL TIME ESTIMATE: ~138 seconds (~2 minutes 18 seconds)
*Request #10 has no pause after
```

---

## 🎨 COLOR TRANSITIONS IN DETAIL

### Hospital Colors:

```
DEFAULT (BLUE) → Hospital has adequate blood [OK]
      ↓
      └─→ RED [NEEDS] ← When a request comes in
          └─→ ORANGE during route calculation
              └─→ GREEN [REC] ← During transfer
                  └─→ BLUE [OK] ← After successful transfer
```

### Route Colors:

```
GRAY (idle) → No active transfer
    ↓
    └─→ ORANGE (active) ← During transfer
        └─→ GRAY (idle) ← After transfer complete
```

---

## 🎯 COMPLETE 10-REQUEST TIMELINE

```
0:00 - SIM START
  └─ Initialization (1s)

0:01 - REQUEST #1
  ├─ Step 1: Hospital needs (1.5s) → Hospital RED
  ├─ Step 2: Searching (1.5s)
  ├─ Step 3: Route found (1.5s) → Route ORANGE
  ├─ Step 4: In transit (4.3s) → Rec hospital GREEN
  ├─ Step 5: Delivered (1.5s) → Back to BLUE
  └─ Pause (3s)

0:14 - REQUEST #2
  ├─ [Similar flow]
  └─ Pause (3s)

0:28 - REQUEST #3
  ├─ [Similar flow]
  └─ Pause (3s)

... (continue for requests 4-10)

2:18 - SIM COMPLETE
  └─ Print final statistics
```

---

## 💡 WHAT ACTUALLY HAPPENS

When you click [START]:

1. **GUI stays responsive** - Simulation runs in background thread
2. **Console updates in real-time** - You see each step immediately
3. **Map updates live** - Watch hospitals change color as transfers happen
4. **Delays between steps** - You have time to see what's happening

Example: You can watch hospital #3 (RED) needing blood, see the algorithm find hospital #5 has it (route ORANGE), watch hospital #3 turn GREEN as blood travels, then back to BLUE when delivered. All visually, step by step!

---

## 🔄 ALGORITHM AT STEP 2: Dijkstra Calculation

```
Graph of 6 hospitals:
         
    H1 ---8.5km--- H2
    |\ \          / |
    | \ \12.3km  /  |
    |5.2|  \    / 6.1|
    |   |   \ H3   / |
    |   |    \|   3.8 |
    H5--+-----X------H4
     |      / \    |
     |15.4 /   \ 7.2 |
     |   /      \ |
     H6---8.9km-----

Finding path H1 to all:
  H1→H1: 0 km (start)
  H1→H5: 5.2 km (direct)
  H1→H2: 8.5 km (direct)
  H1→H3: 12.3 km (direct)
  H1→H5→H4: 5.2 + 7.2 = 12.4 km
  H1→H3→H6: 12.3 + 8.9 = 21.2 km

Greedy selects best source:
  Available sources with O+: H2, H3, H4, H5, H6
  Scoring = (expiry_freshness × 0.6) - (distance × 0.4)
  Winner: H5 (fresh blood, only 5.2 km away)
```

This is what happens at STEP 2 before it shows the result at STEP 3!

---

## 📌 KEY TAKEAWAY

**Before**: Simulation was instant - you saw output all at once
**Now**: Simulation is SLOW and VISUAL - you can see EXACTLY what's happening:

✅ When hospital needs blood
✅ When algorithm searches
✅ When route is found
✅ When blood is being transferred
✅ When blood arrives
✅ When hospitals update status

**This is a REAL SIMULATION** - not just a calculator! 🎬
