# BugBuster

## ✨ Overview

BugBuster is a powerful browser extension designed to streamline and enhance your exploratory testing sessions. It helps you systematically explore web applications, capture critical evidence, and organize your findings, all without leaving your browser. BugBuster empowers testers, developers, and QA professionals to uncover bugs more efficiently and report them with clarity and precision.

## 🚀 Features

- **Screenshot Capture & Annotation**: Easily capture full-page or selected-area screenshots and annotate them directly within the extension.

  - Benefit: Visually highlight issues, add notes, and draw attention to specific elements.

- **Bug Report Generation**: Quickly compile all your captured evidence into a structured report.

  - Benefit: Saves time in writing detailed bug reports and ensures all necessary information is included.

- **Test Notes & Observations**: Add free-form text notes and observations at any point during your session.
  - Benefit: Document hypotheses, insights, and areas for further investigation.
- **Session Management**: Use and manage multiple testing sessions.

  - Benefit: Keeps your testing organized and allows you to switch contexts easily.

- **Export and Import Data**: Export and import your testing sessions and notes.
  - Benefit: Save time and effort by reusing your testing sessions and notes across different devices.

## 📦 Installation

### (🛠️ Work in Progress) ~~Chrome Web Store~~

~~The easiest way to install BugBuster is directly from your browser's official store:~~

- Chrome: 🛠️ Work in Progress...

### Manual Installation

If you prefer to install the extension manually from source:

1. Clone the repository:

   ```bash
   git clone https://github.com/yusborinchit/bug-buster.git
   cd bug-buster
   ```

2. Install dependencies:

   ```bash
   pnpm install # or npm install or yarn install
   ```

3. Build the extension:

   ```bash
   pnpm build # or npm run build or yarn build
   ```

   This will generate the build files in the `build/[browser-name]` directory (e.g., `build/chrome-mv3`).

4. Load the unpacked extension:

   - **Chrome**:

     1. Open the Chrome browser and navigate to `chrome://extensions`.
     2. Enable "Developer mode" by clicking the toggle switch in the top right corner.
     3. Click "Load unpacked".
     4. Select the build/[browser-name] folder (e.g., build/chrome-mv3).

## 🤝 Contributing

We welcome contributions! If you'd like to contribute to BugBuster, feel free to submit a pull request or open an issue on the GitHub repository.
