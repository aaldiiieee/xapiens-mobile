# **React Native User Management with Expo Router**

This project is a **React Native application** built using **Expo Router**. It demonstrates a user management interface with two main views: a **list view with infinite scrolling** and a **table view with pagination**. Users can view details for each user by navigating to a dedicated detail page.

---

## **Features**

- **Login Page**:
  - Authenticates users using the **POST /login** endpoint from Reqres API.
  - Displays success or error messages based on the API response.
  - Stores a token on successful login.

- **Sample Credentials**:
  - Email: `eve.holt@reqres.in`
  - Password: `cityslicka`
 
- **Login OAuth**:
  - Development Only

- **List View**: 
  - Infinite scroll to fetch users dynamically.
  - Displays user details such as avatar, name, and email.

- **Table View**:
  - Responsive and scrollable horizontally for better usability.
  - Pagination to navigate between pages.

- **Detail Page**:
  - Displays detailed information about a user.
  - Includes avatar, name, and email with a "Go Back" button.

---

## **Tech Stack**

- **React Native**
- **Expo Router**
- **React Native Paper**
- **TypeScript**
- **Axios** for API calls
- **Reqres API** as a mock backend service

---

## **Getting Started**

### **Prerequisites**

- Node.js (>=16.x)
- Expo CLI (install globally using `npm install -g expo-cli`)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm run start
   ```
