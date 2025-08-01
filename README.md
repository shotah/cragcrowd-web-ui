# CragCrowd Web UI - Frontend Dashboard

React/TypeScript frontend application for the CragCrowd crag traffic monitoring system.

## 🏗️ Architecture

Modern React application with:
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Query** for server state management
- **React Router** for client-side routing
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- CragCrowd API running (local or remote)

### Development Setup
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Or use Make commands
make setup
make dev
```

### Docker Setup
```bash
# Development with hot reload
make docker-build
make docker-run

# Or use docker-compose from root
cd ..
make dev-start
```

## 🌐 Application Features

### Dashboard
- **Real-time monitoring**: Live crag activity data
- **Wall overview**: All monitored climbing walls
- **Activity status**: Color-coded busy/moderate/quiet indicators
- **Last update times**: When each wall was last monitored

### Wall Detail View
- **24-hour activity chart**: Interactive time series visualization
- **Current statistics**: Live device count and averages
- **Historical data**: Trends and patterns over time
- **Real-time updates**: Automatic data refresh every minute

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Easy navigation on mobile devices
- **Accessible**: Proper ARIA labels and keyboard navigation

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Application Configuration
VITE_APP_TITLE=CragCrowd
VITE_APP_DESCRIPTION=Privacy-respecting crag traffic monitoring

# Development Configuration
VITE_DEV_SERVER_PORT=3001
```

### API Integration
The app automatically proxies API requests in development:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main application layout
├── pages/              # Route components
│   ├── Dashboard.tsx   # Main dashboard view
│   └── WallDetail.tsx  # Individual wall detail
├── services/           # API client and utilities
│   └── api.ts         # Axios-based API client
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### Key Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing & Quality
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI
npm run lint         # ESLint checking
npm run lint:fix     # Auto-fix linting issues
npm run typecheck    # TypeScript type checking

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run container
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Layout.tsx`
4. Add API calls in `src/services/api.ts` if needed

Example:
```typescript
// src/pages/NewPage.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function NewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['newData'],
    queryFn: api.getNewData,
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* Page content */}</div>;
}

// src/App.tsx
import { NewPage } from './pages/NewPage';

function App() {
  return (
    <Routes>
      <Route path="/new" element={<NewPage />} />
      {/* existing routes */}
    </Routes>
  );
}
```

## 📊 Data Visualization

### Chart Components
Using Recharts for responsive, accessible charts:

```typescript
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Time series chart with automatic formatting
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={chartData}>
    <XAxis dataKey="time" />
    <YAxis label={{ value: 'Devices', angle: -90 }} />
    <Line type="monotone" dataKey="devices" stroke="#2563eb" />
  </LineChart>
</ResponsiveContainer>
```

### Chart Features
- **Responsive**: Adapts to container size
- **Interactive**: Hover tooltips and zoom
- **Accessible**: Screen reader compatible
- **Real-time**: Updates with live data

## 🎨 Styling

### Tailwind CSS
Using utility-first CSS framework:
```typescript
// Status indicators
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
  deviceCount > 10 
    ? 'bg-red-100 text-red-800'     // Busy
    : deviceCount > 5 
    ? 'bg-yellow-100 text-yellow-800' // Moderate  
    : 'bg-green-100 text-green-800'   // Quiet
}`}>
```

### Component Styling
- **Consistent spacing**: Using Tailwind spacing scale
- **Color system**: Semantic color usage (red=busy, yellow=moderate, green=quiet)
- **Typography**: Consistent font sizes and weights
- **Shadows**: Subtle depth for card components

## 🧪 Testing

### Testing Setup
- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **JSDOM**: Browser environment simulation

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Using Make
make test
```

### Test Structure
```
src/
├── __tests__/         # Test files
├── components/
│   └── __tests__/     # Component tests
└── pages/
    └── __tests__/     # Page tests
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

test('renders dashboard title', () => {
  render(<Dashboard />);
  expect(screen.getByText('Crag Activity Dashboard')).toBeInTheDocument();
});
```

## 🔄 State Management

### React Query
Handling server state with automatic caching and updates:

```typescript
// Automatic refetching every minute
const { data: walls } = useQuery({
  queryKey: ['walls'],
  queryFn: api.getWalls,
  refetchInterval: 60000,
});

// Background updates
const { data: sensorData } = useQuery({
  queryKey: ['sensorData', wallId],
  queryFn: () => api.getSensorData({ wall_id: wallId }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Benefits
- **Automatic caching**: Reduces API calls
- **Background updates**: Fresh data without user action
- **Loading states**: Built-in loading and error handling
- **Optimistic updates**: Immediate UI feedback

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile Optimization
- **Touch targets**: Minimum 44px tap targets
- **Readable text**: 16px minimum font size
- **Thumb navigation**: Important actions within thumb reach
- **Viewport meta**: Proper mobile viewport configuration

## 🚀 Performance

### Optimization Features
- **Code splitting**: Route-based lazy loading
- **Tree shaking**: Unused code elimination
- **Asset optimization**: Image and bundle size optimization
- **Service worker**: (TODO) Offline functionality

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --mode analyze

# View build output
npm run preview
```

## 🐛 Troubleshooting

### Common Issues

#### API Connection Failed
```bash
# Check API status
curl http://localhost:3000/api/health

# Verify proxy configuration
# Check vite.config.ts proxy settings

# Check environment variables
echo $VITE_API_URL
```

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Type check
npm run typecheck

# Clear Vite cache
rm -rf .vite
```

#### Styling Issues
```bash
# Rebuild CSS
npm run build

# Check Tailwind configuration
npx tailwindcss --help
```

### Debug Mode
```bash
# Enable verbose logging
VITE_LOG_LEVEL=debug npm run dev

# React DevTools
# Install React Developer Tools browser extension
```

## 🔐 Security

### Security Features
- **Content Security Policy**: Configured in nginx
- **XSS Protection**: React's built-in XSS prevention
- **Environment separation**: Different configs per environment
- **API proxy**: Avoid CORS issues in development

### Production Security
```nginx
# Security headers in nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Docker production
make docker-build
```

### Environment-Specific Builds
```bash
# Development
VITE_API_URL=http://localhost:3000/api npm run build

# Production
VITE_API_URL=https://api.cragcrowd.com npm run build
```

### Nginx Configuration
The production Docker image uses nginx with:
- **Gzip compression**: Reduced bundle size
- **Cache headers**: Optimized static asset caching
- **SPA routing**: Proper handling of client-side routes
- **API proxy**: Backend API integration

## 📈 Analytics

### User Experience Metrics
- **Page load time**: Monitor with browser dev tools
- **Chart render time**: Performance of data visualization
- **API response time**: Network tab in dev tools
- **Bundle size**: Impact on initial load

### Monitoring
```bash
# Lighthouse audit
npx lighthouse http://localhost:3001

# Bundle size analysis
npm run build && npx bundlesize
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🔗 Related Projects

- **Sensor**: [cragcrowd-firmware](../cragcrowd-firmware/)
- **Gateway**: [cragcrowd-gateway](../cragcrowd-gateway/)
- **API**: [cragcrowd-api](../cragcrowd-api/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for new components
4. Ensure all tests pass: `npm test`
5. Check types: `npm run typecheck`
6. Lint code: `npm run lint:fix`
7. Test build: `npm run build`
8. Commit changes: `git commit -m 'Add amazing feature'`
9. Push branch: `git push origin feature/amazing-feature`
10. Open Pull Request

## 📧 Support

- **UI issues**: Check browser console for errors
- **API integration**: Verify API endpoints and network connectivity
- **Performance**: Use React DevTools and browser performance tools