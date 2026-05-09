<!-- <img width="1906" height="918" alt="image" src="https://github.com/user-attachments/assets/d640aa30-1534-4175-a3ba-3068e6c6efa4" /># User Management Dashboard (Frontend)

<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/f8773b16-5762-4461-b5f5-ab22cfc1a2be" />

<img width="1914" height="911" alt="image" src="https://github.com/user-attachments/assets/29119b67-d7da-4735-8d04-2ed608ff18a9" />

<img width="1909" height="912" alt="image" src="https://github.com/user-attachments/assets/c1b0739e-876b-4e99-813c-7340d734c97f" /> -->


A premium, high-fidelity User Management Dashboard built with React 19, Vite, and Redux Toolkit. This application features a professional design system with high-contrast accessibility, smooth micro-interactions, and robust state management.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation
```bash
# Clone the repository (if applicable)
# git clone <repository-url>

# Navigate to the frontend directory
cd frontend-task

# Install dependencies
npm install or npm i --force
```

### Running the Application
```bash
# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production
```bash
# Create a production build
npm run build

# Preview the production build
npm run preview
```

## 🛠 Tech Stack

- **Core**: React 19, TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (Async Thunks)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4 (with modern CSS variables)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## ✨ Key Features Implemented

- **Full CRUD Operations**: Create, Read, Update, and Delete users via a RESTful API integration.
- **Advanced Filtering & Search**: Real-time server-side filtering by role and search by name/email.
- **Dynamic Routing**: Detail views for individual users with state-aware navigation.
- **Robust Error Boundary**: Centralized error handling and API response normalization.
- Toast notifications custom 
- Skeleton loader custom
- Dark mode 
- Sticky header 
- Pagination custom

## 📂 Folder Structure

- **`src/assets`**: Static assets including images, fonts, and global style tokens.
- **`src/components`**: Reusable UI components like Modals, Buttons, and Form elements.
- **`src/constants`**: Application-wide constants including API endpoints, configuration, and static text.
- **`src/hooks`**: Custom React hooks for shared logic, lifecycle management, and UI states.
- **`src/layouts`**: Structural layout components that wrap pages (e.g., AppLayout with Sidebar/Nav).
- **`src/pages`**: Top-level route components representing full-screen views.
- **`src/redux`**: Centralized state management including slices, async thunks, and store configuration.
- **`src/services`**: API abstraction layer and Axios instance configurations.
- **`src/types`**: Global and domain-specific TypeScript interfaces and type definitions.
- **`src/utils`**: Pure utility functions for data formatting, error parsing, and API response normalization.

## 🏗 Implementation Overview

### 1. State Management (Redux Toolkit)
The application uses a "Single Source of Truth" pattern via Redux. We implemented `createAsyncThunk` to handle asynchronous API lifecycles (pending, fulfilled, rejected). This ensures the UI stays reactive and consistent during data fetching.
-> in redux we use createAsyncThunk for api caliing 

### 2. API Integration & Error Handling
We built a robust API service layer using Axios. Key implementations include:
- **Response Normalization**: A custom `handleApiResponse` utility to standardize backend data.
- **Global Error Handling**: Centralized catch-all logic to provide user-friendly error messages and logging.
- **Request Cancellation**: Implementation of `AbortController` to prevent race conditions during rapid filtering/searching.

### 3. Component Architecture
The UI is built with a focus on reusability and maintainability:
- **Controlled Components**: Form inputs are strictly controlled to ensure data integrity.
- **Memoization**: Strategic use of `React.memo`, `useMemo`, and `useCallback` to optimize rendering performance in large lists.
- **Dynamic Modals**: A versatile modal system for User Creation and Editing to reduce code duplication.

### 4. Styling & Design System
We moved beyond standard boilerplate to create a "Pro Max" design:
- **Tailwind CSS 4**: Leveraging the latest features like CSS variable integration and improved JIT compilation.
- **Tactile UI**: Focus on micro-interactions, hover states, and transitions that make the app feel alive and premium.
- **Accessibility**: High-contrast color palettes and semantic HTML ensure the dashboard is usable by everyone.

### 5. Routing Strategy
Using React Router 7, we implemented a state-aware routing system. This allows for deep linking into user details while maintaining context of the previous list view, improving the overall UX flow.

---

