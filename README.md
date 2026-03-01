# Appointments Dashboard 🗓️

A modern, responsive, and internationalized (i18n) administrative dashboard built with Next.js App Router for managing medical appointments and AI-driven call agents.

## 🚀 Features

- **Modern Architecture**: Built with Next.js 16 (App Router) and React.
- **Premium UI**: Styled with Tailwind CSS v4, featuring a Dark Mode aesthetic and Glassmorphism components.
- **Smooth Animations**: Powered by `framer-motion` for fluid modal transitions and sidebar interactions.
- **Internationalization (i18n)**: Native multi-language support out-of-the-box (`next-intl`), with Spanish (`es`) as the default language and English (`en`) as the fallback.
- **Responsive Design**: Designed Mobile-First but scales natively to Desktop views for medical administrative desks.
- **Automation Ready**: Prepared interfaces to hook via Webhooks to **n8n** workflows for triggering external services like Google Calendar.
- **AI Integration Config**: Included settings panel to manage optional settings and API configurations for **RetellAI** agents.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **i18n**: next-intl
- **Linting & Formatting**: ESLint + Prettier standards

## 📥 Getting Started

### Prerequisites

You need Node.js 18.17+ installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Carlos1200/appointments-dashboard.git
   cd appointments-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `/src/app/[locale]`: Contains the Next.js page routes, separated by the locale path for proper generic i18n support.
- `/src/components`: Reusable UI components like `Sidebar`, `DashboardLayout`, and `CreateAppointmentModal`.
- `/src/i18n`: Configuration files and middleware for `next-intl`.
- `/messages`: JSON translation dictionaries (`es.json`, `en.json`).

## 🔗 n8n & RetellAI Workflow (Context)

This application serves as the visual administrative interface and the entry point for data. It is intended to complement an backend automation layer managed by **n8n**. 

- **Creating an Appointment**: When a user submits an appointment via this dashboard, it sends a payload to an n8n webhook.
- n8n then manages the creation of the event in Google Calendar and optional scheduling/parameter adjusting within a [RetellAI](https://retellai.com/) agent.
- **Database (TBD)**: It is recommended to use Supabase, Firebase, or MongoDB in conjunction with n8n to persist historical records (especially those created autonomously by RetellAI via phone calls) to populate the *Appointments List* dynamically.

## 📄 License

This project is licensed under the MIT License.
