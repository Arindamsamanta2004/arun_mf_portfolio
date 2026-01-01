# Arun Bikash Samanta - Mutual Fund Distributor Website

A professional portfolio and appointment booking website for a Mutual Fund Distributor.

## Features

*   **Responsive Design**: Modern, mobile-friendly interface.
*   **Authentication**:
    *   **User Login/Register**: Allow clients to book appointments.
    *   **Admin Portal**: Secure dashboard for managing contacts and appointments.
    *   **Role-Based Access Control (RBAC)**: Strict separation between User and Admin data.
*   **Contact Form**: Inquiry form integrated with Supabase database.
*   **Appointment Booking**: Users can schedule meetings; Admins can view schedule.
*   **Content Management**: Services, About Me, and Verification (AMFI ARN) sections.
*   **AMFI Verification**: Direct link to AMFI distributor locator with copy-to-clipboard ARN.

## Tech Stack

*   **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
*   **Backend/Database**: Supabase (PostgreSQL, Authentication).
*   **Deployment**: Vercel.

## Project Structure

```
├── admin.html          # Admin Dashboard (Protected)
├── admin_login.html    # Dedicated Admin Login Page
├── appointment.html    # User Appointment Booking (Protected)
├── assets/
│   ├── css/            # Stylesheets
│   ├── images/         # Logo, Hero images, icons
│   └── js/             # JavaScript logic
│       ├── appointment.js  # Booking logic
│       ├── auth.js         # Authentication & RBAC logic
│       ├── config.js       # Supabase credentials
│       └── script.js       # General site interactions
├── contact.html        # Contact Page
├── db/
│   └── database_schema.sql # SQL commands for Database setup
├── index.html          # Landing Page
├── login.html          # User Login Page
└── register.html       # User Registration Page
```

## Setup Instructions

### 1. Database Setup (Supabase)

This project requires a Supabase project.
1.  Create a project at [Supabase.com](https://supabase.com).
2.  Go to the **SQL Editor**.
3.  Copy and run the contents of [`db/database_schema.sql`](db/database_schema.sql).
    *   *This will create the `contacts`, `profiles`, and `appointments` tables and set up security policies.*
4.  **Important**: To create your first **Admin Account**:
    *   Register a new user at `/register.html`.
    *   Run the following SQL manually in Supabase to promote that user:
        ```sql
        insert into public.profiles (id, email, role)
        select id, email, 'admin'
        from auth.users
        where email = 'YOUR_EMAIL@EXAMPLE.COM'
        on conflict (id) do update set role = 'admin';
        ```

### 2. Configuration

Update `assets/js/config.js` with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 3. Local Development

You can run the site using any static file server.

Python:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.

### 4. Deployment

Push to GitHub and connect the repository to **Vercel**.

*   **Build Command**: (None / Empty)
*   **Output Directory**: (Root)
*   **Install Command**: (None / Empty)

The `vercel.json` file handles clean URLs (removing `.html` extensions).
