Here is a **ready-to-save `prompt.md` file** for your CN & ADA Blood Donation System project. You can directly copy this into a Markdown file.

---

````md
# 🩸 Blood Donation System Design (CN & ADA Project)

## 📌 Project Title
**Design and Implementation of a Blood Donation System using Dijkstra’s Algorithm and Greedy Matching (Computer Networks + Algorithms Design & Analysis)**

---

## 🎯 Objective
The goal of this project is to design a **distributed Blood Donation Management System** that:

- Finds the **nearest hospitals using Dijkstra’s Algorithm**
- Matches **blood donors and recipients using Greedy Algorithm**
- Uses **local JSON files as a database**
- Demonstrates **Computer Networks concepts via client-server communication (simulated or socket-based)**

---

## 🧠 Core Concepts Used

### 1. Computer Networks (CN)
- Client-server architecture
- Request/response flow between modules
- Simulated API communication or socket programming
- Data exchange using JSON format

### 2. Algorithms Design & Analysis (ADA)
- **Dijkstra’s Algorithm** → shortest path (hospital routing)
- **Greedy Algorithm** → optimal blood donor-recipient matching

---

## 🗂️ System Architecture

### 🔷 Client Side
- Donor registration
- Recipient blood request submission
- Query interface

### 🔷 Server Side
- Graph processing (hospital network)
- Blood matching engine
- JSON database handler
- Response generator

---

## 🗃️ Database Design (Local JSON Files)

### 📄 hospitals.json
Stores hospital details and capacity.

```json
{
  "hospitals": [
    {
      "id": "H1",
      "name": "City Hospital",
      "location": "NodeA",
      "blood_bank_capacity": 500
    }
  ]
}
````

---

### 📄 donors.json

Stores donor information.

```json
{
  "donors": [
    {
      "id": "D1",
      "name": "John Doe",
      "blood_group": "O+",
      "location": "NodeC",
      "availability": true
    }
  ]
}
```

---

### 📄 recipients.json

Stores blood requests.

```json
{
  "requests": [
    {
      "id": "R1",
      "required_blood_group": "A+",
      "urgency": "high",
      "location": "NodeD"
    }
  ]
}
```

---

### 📄 graph.json

Represents hospital/location network graph.

```json
{
  "nodes": ["NodeA", "NodeB", "NodeC", "NodeD"],
  "edges": [
    { "from": "NodeA", "to": "NodeB", "weight": 4 },
    { "from": "NodeB", "to": "NodeC", "weight": 2 },
    { "from": "NodeC", "to": "NodeD", "weight": 3 }
  ]
}
```

---

## 🧭 Algorithm 1: Dijkstra’s Algorithm

### 📌 Purpose

Find the **nearest hospital** from a donor or recipient location.

### 📌 Input

* Graph (nodes + weighted edges)
* Source node (user location)

### 📌 Output

* Shortest distance
* Optimal path to nearest hospital

### 📌 Steps

1. Initialize distances to infinity
2. Set source distance to 0
3. Use priority queue
4. Relax edges iteratively
5. Return shortest path

### 📌 Output Example

```
Shortest Path: NodeC → NodeB → City Hospital
Distance: 6 km
```

---

## 🩸 Algorithm 2: Greedy Matching Algorithm

### 📌 Purpose

Match **best donor for a recipient efficiently**

### 📌 Constraints Considered

* Blood group compatibility
* Distance between donor and recipient
* Urgency level of request
* Availability status

---

### 📌 Blood Compatibility Rules

* O− → Universal donor
* O+ → O+, A+, B+, AB+
* A− → A−, A+, AB−, AB+
* A+ → A+, AB+
* B− → B−, B+, AB−, AB+
* B+ → B+, AB+
* AB− → AB−, AB+
* AB+ → AB+

---

### 📌 Greedy Strategy

1. Filter compatible donors
2. Sort based on:

   * Minimum distance
   * Availability
   * Urgency priority
3. Select best match immediately (no backtracking)

---

### 📌 Output Example

```
Matched Donor: D1 (John Doe)
Blood Group: O+
Distance Score: 2.5 km
Status: Confirmed
```

---

## 🌐 Network Flow (CN Concept)

### 📡 Communication Flow

1. Client sends request (donor/recipient)
2. Server processes JSON database
3. Algorithms executed:

   * Dijkstra → hospital selection
   * Greedy → donor matching
4. Response sent back to client

---

## 🔧 System Modules

### 1. User Module

* Register donors and recipients
* Update availability status

### 2. Graph Module

* Load graph.json
* Run Dijkstra’s algorithm

### 3. Matching Module

* Blood compatibility logic
* Greedy selection algorithm

### 4. Database Module

* Read/write JSON files
* Maintain system state

### 5. Network Module

* Simulated API or socket communication

---

## 📊 System Output

The system should display:

* ✔ Matched donor details
* ✔ Compatibility confirmation
* ✔ Nearest hospital
* ✔ Shortest route
* ✔ Distance/time estimation
* ✔ JSON logs of transactions

---

## 🚀 Optional Enhancements

* GUI dashboard (web/desktop)
* Real-time donor updates
* Map visualization of hospital network
* Priority queue optimization for Dijkstra
* Logging system for requests

---

## 📌 Final Instruction

Implement a **modular, well-documented system** in Python (preferred) that:

* Uses **Dijkstra’s algorithm for routing**
* Uses **Greedy algorithm for blood matching**
* Uses **JSON files as database storage**
* Simulates **client-server architecture**
* Demonstrates both **CN + ADA concepts clearly**

---

## 🧾 End of Project Specification

```