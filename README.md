# ✈️ Tripsy — Smart Travel Planner

> **Plan your trip. Discover places. Organize your itinerary. Track your expenses.**

Tripsy is a full-stack travel planning platform that helps users create personalized multi-day trips based on their **destination, travel duration, interests, and budget**.

Tripsy uses **SerpApi to retrieve real-world travel search data** for places, restaurants, and hotels, and transforms that information into an organized travel-planning experience.

🔗 **Live Demo:** https://tripsy-eight.vercel.app
🔗 **GitHub:** https://github.com/Het-Patel-67/Tripsy

---

## 🌍 Problem

Planning a trip usually requires searching across multiple websites for:

* Places to visit
* Restaurants
* Hotels
* Activities
* Budget information

After collecting this information, travelers still need to manually organize everything into a day-by-day plan.

This makes trip planning time-consuming and fragmented.

---

## 💡 Solution

**Tripsy brings travel discovery and trip organization into one platform.**

A user provides:

* 📍 Destination
* 📅 Number of days
* 💰 Budget
* 🏷️ Travel interests/categories

Tripsy then retrieves relevant travel information using **SerpApi**, processes the results through its backend, and presents the information as an organized itinerary.

Users can then edit their itinerary, rearrange activities, explore hotels and restaurants, save their trips, and track expenses.

---

# 🚀 Features

### 🗺️ Personalized Itinerary Planning

Create a multi-day itinerary based on:

* Destination
* Number of days
* Budget
* Travel categories/interests

### 🔎 SerpApi-Powered Travel Discovery

Tripsy uses SerpApi to retrieve real-world search information related to the selected destination.

The application uses search data for:

* Tourist attractions and places
* Restaurants
* Hotels

This allows Tripsy to work with current search information rather than depending entirely on a manually maintained travel database.

### 📅 Multi-Day Itinerary

Trips are organized into individual days so users can easily understand their travel schedule.

### 🖱️ Drag-and-Drop Itinerary Editing

Users can rearrange activities within their itinerary using drag-and-drop functionality.

### 🏨 Hotel Recommendations

Tripsy provides hotel recommendations according to the selected destination and budget category.

### 🍴 Restaurant Discovery

Relevant restaurants can be discovered as part of the trip-planning workflow.

### 💾 Saved Itineraries

Authenticated users can save their generated trips and access them later.

### 💰 Expense Tracker

Users can track expenses associated with their trip and manage their travel spending.

### 🔐 Authentication

Tripsy includes user authentication and protected routes.

Authenticated functionality is protected using backend authentication middleware.

### 📱 Responsive Interface

The frontend is designed to work across desktop and smaller screen sizes.

---

# 🔥 How SerpApi Powers Tripsy

SerpApi is a **core part of Tripsy's travel-data discovery pipeline**.

The basic workflow is:

```text
User
 │
 │ Destination + Days + Budget + Interests
 ▼
Tripsy Frontend
 │
 ▼
Node.js / Express Backend
 │
 ▼
SerpApi
 │
 ├── Places / Attractions
 ├── Restaurants
 └── Hotels
 │
 ▼
Process & Organize Search Results
 │
 ▼
MongoDB / Cached Data
 │
 ▼
Personalized Itinerary
 │
 ▼
Tripsy User Interface
```

### Why SerpApi?

Travel information changes frequently, and maintaining a complete database of destinations, restaurants, and hotels would be difficult for a small application.

SerpApi provides structured access to search-engine data that Tripsy can consume through its backend.

The application can then process those results and turn them into useful travel-planning information.

---

# 🔄 Tripsy Workflow

```text
1. User logs in
       ↓
2. Selects destination
       ↓
3. Selects trip duration
       ↓
4. Selects budget & interests
       ↓
5. Tripsy requests travel data
       ↓
6. Backend queries SerpApi
       ↓
7. Search results are processed
       ↓
8. Places / restaurants / hotels are organized
       ↓
9. Multi-day itinerary is generated
       ↓
10. User edits and rearranges itinerary
       ↓
11. User saves the trip
       ↓
12. User tracks trip expenses
```

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ • Trip Planning     │
                    │ • Itinerary         │
                    │ • Hotels            │
                    │ • Expenses          │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │      Backend        │
                    └──────┬────────┬─────┘
                           │        │
                    ┌──────▼───┐ ┌──▼──────────┐
                    │ SerpApi  │ │  MongoDB    │
                    │          │ │             │
                    │ Search   │ │ Users       │
                    │ Data     │ │ Trips       │
                    │          │ │ Cached Data │
                    └──────────┘ └─────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* Tailwind CSS
* HTML5
* CSS3
* `@hello-pangea/dnd` for drag-and-drop itinerary management

## Backend

* Node.js
* Express.js
* REST APIs
* JWT-based authentication
* Cookie-based authentication

## Database

* MongoDB
* Mongoose

## External APIs / Services

* **SerpApi** — travel-related search data
* Cloudinary — image storage

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB

---

# 📡 SerpApi Integration

Tripsy communicates with SerpApi through the backend rather than exposing the API key to the frontend.

Conceptually:

```text
React
  │
  │ Request trip
  ▼
Express API
  │
  │ Server-side request
  ▼
SerpApi
  │
  │ Structured search results
  ▼
Tripsy Backend
  │
  │ Process / filter / organize
  ▼
React
```

Keeping the SerpApi request on the backend helps keep the API credentials out of the client-side application.

### Search Categories

Tripsy's search workflow includes:

| Search type | Purpose                               |
| ----------- | ------------------------------------- |
| Places      | Discover attractions and destinations |
| Restaurants | Discover food options                 |
| Hotels      | Discover accommodation options        |

> **Hackathon note:** The exact SerpApi engines and parameters used by the current implementation should be documented here according to the source code.

---

# 🧠 Data Processing

Tripsy does not simply display raw search results.

The backend processes retrieved information before presenting it to the user.

The general pipeline is:

```text
SerpApi Search Results
        ↓
Extract Relevant Information
        ↓
Filter / Organize Results
        ↓
Group According to Trip
        ↓
Store / Cache Relevant Data
        ↓
Display in Itinerary
```

MongoDB can also be used to cache previously retrieved destination information, reducing unnecessary repeated external searches.

---

# 🔐 Authentication & Protected Routes

Tripsy uses authentication to protect user-specific functionality.

The authentication flow includes:

```text
Register / Login
      ↓
Authentication
      ↓
Token / Cookie
      ↓
Backend Verification
      ↓
Protected API Routes
      ↓
User-Specific Data
```

This also helps prevent unauthorized users from directly accessing protected travel-planning operations.

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB
* SerpApi API key

---

## 1. Clone the repository

```bash
git clone https://github.com/Het-Patel-67/Tripsy.git

cd Tripsy
```

---

## 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

The application requires environment variables for the frontend and backend.

Create the required `.env` files based on the variables used in the project.

### Backend

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SERPAPI_KEY=your_serpapi_api_key
JWT_SECRET=your_jwt_secret
```

### Frontend

Add the frontend variables required by the current application.
---

# ▶️ Running Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Then open the local frontend URL shown by Vite.

---

# 🌐 Live Application

**Tripsy:**
https://tripsy-eight.vercel.app

The deployed application demonstrates the complete travel-planning workflow.

---

# 🎯 Example Use Case

Suppose a user wants to plan a **5-day trip to Paris**.

They can provide:

```text
Destination: Paris
Duration: 5 days
Budget: Medium
Interests: Culture / Heritage / Tourist Places
```

Tripsy then uses its backend and SerpApi-powered search workflow to retrieve relevant information.

The application can then organize the discovered places into a multi-day itinerary.

The user can:

* View activities by day
* Rearrange activities
* Explore restaurants
* Explore hotels
* Save the itinerary
* Track expenses

---
### SerpApi's role

SerpApi provides the search data that Tripsy uses to discover real-world:

* Places
* Restaurants
* Hotels

This data becomes part of the application's travel-planning pipeline rather than being used only as a standalone search feature.

---

# 🎥 Demo

website link: [ https://tripsy-eight.vercel.app/ ]

---
 🔮 Future Improvements

Possible future improvements include:

* More travel-data sources
* Flight discovery
* Improved itinerary optimization
* More detailed budget planning
* Real-time travel updates
* Better destination-to-destination recommendations
* More advanced personalization
* Smarter itinerary balancing based on distance and travel time

---

 Author

**Het Patel**

GitHub:
https://github.com/Het-Patel-67

---

# 📄 License

This project is provided for educational and demonstration purposes.

Add the repository's actual license here if a license file is included in the project.
