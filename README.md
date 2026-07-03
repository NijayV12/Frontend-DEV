# Frontend-DEV

Welcome to the **Frontend Development Assignments** repository. This project contains a collection of web development tasks, coding exercises, and projects completed systematically day-by-day.

---

## 📁 Repository Structure & Folder Report

Here is a detailed breakdown of the directories and files included in this workspace:

```text
d:\TR
├── 📁 day1/
│   ├── 📄 Resume(day 1).html             # Basic personal portfolio and resume markup
│   ├── 📄 course catalog(day1).html      # Educational course grid/list structure
│   └── 📄 department (day 1).html        # Department hierarchy listing page
├── 📁 day2/
│   ├── 📄 login page(day 2).html         # Login interface structure
│   └── 📄 registration form(day 2).html  # Standard user registration form input fields
├── 📁 day3/
│   ├── 📄 README.txt                     # Day 3 notes and instructions
│   └── 📄 learning platform (day 3).html # Course player or LMS platform dashboard structure
├── 📁 day4/
│   ├── 📄 index.html                     # Main entry HTML file for Day 4 project
│   ├── 📄 style.css                      # Styling for Day 4 components
│   ├── 📄 script.js                      # Client-side dynamic interactivity
│   └── 📄 sample.js                      # JavaScript sandbox testing scripts
├── 📁 day5/
│   ├── 📁 calculator/                    # Polished interactive calculator
│   │   ├── 📄 index.html                 # Calculator layout with fixed Dark Mode theme
│   │   ├── 📄 style.css                  # Modern calculator UI styling with history drawer
│   │   └── 📄 script.js                  # Math parsing logic & local storage history
│   ├── 📁 number guessing/               # Beginner-level interactive guessing game
│   │   ├── 📄 index.html                 # Game container structure with validation output
│   │   ├── 📄 style.css                  # Soft dark-purple clean card stylesheet
│   │   └── 📄 script.js                  # Beginner-friendly game loop and inputs verification
│   └── 📁 to do list/                    # Minimalist To Do List in Calculator theme
│       ├── 📄 index.html                 # App layout with task input and stats
│       ├── 📄 style.css                  # Custom styling matching Calculator Zinc theme
│       └── 📄 script.js                  # Tasks manager with filters and localStorage
├── 📁 day6/
│   └── 📄 Sample.html                    # JavaScript logic sample page
├── 📁 day7/
│   └── 📁 calculator/                    # React & Vite Calculator project
│       ├── 📁 src/                       # React components, styles, and entries
│       └── 📄 vite.config.js             # Vite compiler config
├── 📁 day8/
│   └── 📁 student-management/            # AI & DS Classroom Portal
│       ├── 📁 src/                       # Main React components & custom App.css styles
│       ├── 📁 public/                    # Image assets (portal banner background)
│       └── 📄 vite.config.js             # Vite compiler config
└── 🖼️ department_banner.png             # Visual asset image for department banners
```

---

## 🚀 Projects Spotlight

### 1. React Calculator (`day7/calculator/`)
A responsive interactive calculator built in **React** and compiled via **Vite**. Features simple modular styling, custom state management for operands, and basic mathematical evaluations.

### 2. AI & Data Science Classroom Portal (`day8/student-management/`)
A fully-featured, widescreen workspace portal designed for college-level **Artificial Intelligence & Data Science** (AI & DS) departments. 
* **Futuristic Cosmic Theme**: Features a custom-styled space background combining neon radial glow lights with a technology coordinate grid pattern.
* **Glassmorphic Interfaces**: All panels are designed as frosted-glass elements with translucent outline borders and a backdrop filter blur effect (`backdrop-filter: blur(12px)`).
* **Multi-Tab Workspaces**: Integrated dashboard insights (total students, passing rates, grade distribution charts), student directories, notices feed, enroll forms, and default settings resets.
* **Neon Metric Accents**: Exam score numbers are colored in real-time based on their respective performance ratings (Emerald Green for A, Indigo for B, Blue for C, Amber for D, and Rose Red for F).
* **LocalStorage Persistence**: Full database synchronization to cache configurations, student logs, and notice cards.

### 3. Minimal Legacy Calculator (`day5/calculator/`)
A responsive calculator designed with a sleek, minimalist dark theme. It handles fundamental mathematical calculations, records execution history locally, and lets you copy or recall expressions from a convenient side-drawer.

### 4. Number Guessing Game (`day5/number guessing/`)
An interactive, educational guessing game built with HTML, CSS, and JavaScript. It evaluates guesses, prints attempts history, and gives friendly boundary validation notices.

### 5. Minimalist To Do List (`day5/to do list/`)
A responsive task manager application built with HTML, CSS, and JavaScript.
* **Calculator Visual Sync**: Adopts the same sleek, dark grey Zinc theme (`#09090b` and `#18181b`) and Outfit typography as the legacy calculator.
* **Interactive List Controls**: Supports checkable custom circular checkboxes, quick tasks list filters (All, Active, Completed), and delete/clear operations.
* **Metrics Trackers**: Prints real-time statistics counters showing active items left and completed tasks count.
* **LocalStorage Cache**: Syncs state to local browser databases to maintain task lists upon page reloads.

---

## 🛠️ Technology Stack
* **Framework**: React.js (Day 7, Day 8)
* **Build Tools**: Vite.js compiler environment
* **Styling**: Modern CSS3 (Glassmorphism, linear text-gradients, radial overlays, grid systems)
* **Programming**: Modern ES6+ JavaScript / DOM APIs
* **Database**: LocalStorage key-value sync for state persistence
* **Formatting**: Semantic HTML5 structures