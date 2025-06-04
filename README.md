# GraphiteTrust

A decentralized reputation dashboard for the Graphite Network that provides users with a transparent, real-time interface to assess trust scores and compliance metrics of wallets, DAOs, and DeFi projects.

## Features

- 🔍 Search functionality for wallets, DAOs, and projects
- 📊 Real-time trust score visualization
- 📈 Compliance metrics tracking
- 🔔 Recent activity monitoring
- 🎨 Modern glassmorphic UI design

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Chakra UI
- React Query
- Axios

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/graphite-trust.git
cd graphite-trust
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── components/     # React components
  ├── hooks/         # Custom React hooks
  ├── services/      # API services
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## API Integration

The application integrates with the Graphite API to fetch:
- Trust scores
- Compliance metrics
- Recent activity
- Search results

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.