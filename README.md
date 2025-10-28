# MovieTeller

A modern visual storytelling application for Fountain screenplay files. Built with Vite, React, TypeScript, and Tailwind CSS.

![MovieTeller](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=flat&logo=tailwind-css)

## Features

### 📝 Fountain Format Support
- Full parser for `.fountain` screenplay files
- Supports all standard Fountain syntax elements:
  - Title pages
  - Scene headings (INT/EXT)
  - Action lines
  - Character names
  - Dialogue
  - Parentheticals
  - Transitions
  - Notes and sections

### 🎬 Visual Scene Exploration
- **Grid View**: Browse scenes as visual cards with key information
- **List View**: Detailed vertical list of all scenes
- **Timeline View**: Chronological flow visualization with connecting lines

### 🔍 Advanced Filtering & Search
- **Search**: Find scenes by location, action text, or scene heading
- **Scene Type Filter**: Filter by INT, EXT, or INT./EXT. scenes
- **Character Filter**: View scenes featuring specific characters
- Real-time filtering with instant results

### 👥 Character Analytics
- Automatic character extraction from dialogue
- Scene appearance tracking for each character
- Dialogue line count per character
- Character-based scene filtering

### 📊 Script Statistics
- Total scene count
- Scene type breakdown (INT/EXT)
- Character count
- Dialogue density metrics

### 🎨 Modern UI/UX
- **Dark Mode**: Automatic system preference detection with manual toggle
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Scene Cards**: Beautiful cards with:
  - Scene number and location
  - Time of day indicators with icons (morning, day, evening, night)
  - Character list
  - Dialogue count
  - Action preview
  - Visual color coding by scene type

### 🔎 Detailed Scene View
- Full scene content display
- Properly formatted screenplay elements
- Character highlighting
- Scene metadata (location, time, characters)
- Easy navigation between scenes

### 💾 Export Functionality
- Export parsed script data as JSON
- Includes all parsed elements and analysis
- Preserves script structure and metadata

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movieteller
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Loading a Script

1. Launch the application
2. Drag and drop a `.fountain` file onto the upload area, or
3. Click "Choose File" to browse for a `.fountain` file

### Exploring Scenes

- **Switch Views**: Use the view toggle buttons in the header (Grid/Timeline/List)
- **Search Scenes**: Type in the search box to filter scenes by content
- **Filter by Type**: Select INT, EXT, or INT./EXT. in the sidebar
- **Filter by Character**: Click a character name to see only their scenes
- **View Details**: Click any scene card to see the full scene content

### Using the Sample Script

A sample script "The Last Signal" is included in `public/sample.fountain`. Use this to explore the app's features.

## Project Structure

```
movieteller/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx       # Drag-and-drop file upload
│   │   ├── Header.tsx            # App header with controls
│   │   ├── Sidebar.tsx           # Filters and statistics
│   │   ├── SceneCard.tsx         # Scene card component
│   │   ├── SceneDetail.tsx       # Detailed scene modal
│   │   └── SceneViews.tsx        # Grid/List/Timeline views
│   ├── context/
│   │   └── ScriptContext.tsx     # Global app state
│   ├── utils/
│   │   └── fountainParser.ts     # Fountain format parser
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/
│   └── sample.fountain           # Sample screenplay
└── package.json
```

## Fountain Format

Fountain is a plain text markup language for writing screenplays. It's designed to be readable and writable in any text editor.

### Example:

```
Title: My Script
Author: John Doe

INT. COFFEE SHOP - DAY

JANE, a writer in her 30s, types furiously on her laptop.

JANE
(to herself)
This is it. The perfect scene.

BARISTA (O.S.)
Venti latte for Jane!
```

Learn more at [fountain.io](https://fountain.io)

## Technologies Used

- **Vite**: Lightning-fast build tool and dev server
- **React 18**: UI framework with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **clsx**: Utility for constructing className strings

## Features in Detail

### Scene Card Visualization

Each scene card displays:
- Scene number and heading
- Location and time of day with contextual icons
- Color-coded by scene type (blue for INT, green for EXT, purple for INT./EXT.)
- Preview of action lines
- Character count and dialogue count
- Character chips showing who appears in the scene

### Timeline View

The timeline view provides a unique visualization:
- Vertical timeline with connecting dots
- Scene numbers on the left
- Full scene cards inline
- Smooth scrolling experience
- Visual flow from scene to scene

### Dark Mode

The app automatically detects your system's color scheme preference and applies dark mode accordingly. You can also manually toggle between light and dark modes using the sun/moon icon in the header.

### Responsive Design

The app is fully responsive and works on:
- Desktop computers (optimized experience)
- Tablets (adjusted layouts)
- Mobile phones (streamlined interface)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Fountain screenplay format by John August and Stu Maschwitz
- Icons by Lucide
- UI inspiration from modern screenplay software

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ for storytellers everywhere
