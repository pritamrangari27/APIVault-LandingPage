# APIVault Frontend

APIVault is a modern, deterministic security audit tool for APIs. It allows developers to upload OpenAPI specifications and instantly receive a comprehensive security report. The system combines a fast static rule engine (mapping to OWASP API Top 10) with an AI heuristic layer to catch complex business logic flaws.

This repository contains the frontend application for APIVault, built with a "Premium Developer" aesthetic for maximum clarity and a sophisticated user experience.

## Features

- **Sleek IDE-style Interface:** An elegant, tightly-tracked interface with an embedded "code editor" style report viewer.
- **Instant Audits:** Connects to the APIVault backend to display vulnerability diffs and automated fixes.
- **OWASP Integration:** Automatically maps findings like Broken Object Level Authorization (BOLA), mass assignment, and excessive data exposure.
- **Premium Design System:** Uses Tailwind CSS, `Inter` for UI typography, and `JetBrains Mono` for code blocks, set against an OLED Black and Emerald Green palette.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React (Icons)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd APIVault/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Design Philosophy

The APIVault frontend avoids generic "AI-generated" templates and harsh brutalist layouts. Instead, it adopts a **Premium Developer / Editorial** look:
- Hairline borders and soft geometry (`rounded-2xl`).
- High-contrast OLED dark mode with minimal, deliberate splashes of color (Emerald and Rose).
- Precision spacing and readable, data-dense layouts inspired by modern IDEs.
