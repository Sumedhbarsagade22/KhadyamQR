# KhadyamQR

Restaurant menu management platform with QR-based dynamic menus. Built with React, Vite, Express, and Supabase.

## Features

- 🍽️ **Restaurant Management** - Add multiple restaurants with logos
- 📋 **Menu Management** - Add/edit/delete menu items with photos and prices
- 📱 **QR Code Generation** - Generate persistent QR codes that link to live menus
- 🔄 **Real-time Updates** - Menu changes reflect instantly on public pages
- 📦 **Image Storage** - Upload logos and menu item photos to Supabase Storage
- 🎨 **Responsive Design** - Mobile-first UI with TailwindCSS

## Tech Stack

- **Frontend**: React 18 + Vite + React Router 6 + TailwindCSS
- **Backend**: Express 5 + Node.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI Components**: Radix UI + shadcn/ui
- **QR Generation**: qrcode.react

## Local Development

### Prerequisites

- Node.js 18+
- pnpm 10+
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/KhadyamQR.git
   cd KhadyamQR
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Set up Supabase database**
   
   Run the SQL schema in Supabase SQL Editor:
   ```bash
   # Copy contents of supabase/khadyamqr.sql
   # Paste and run in: https://supabase.com/dashboard/project/_/sql/new
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```
   
   Open http://localhost:8080

## Project Structure

```
KhadyamQR/
├── client/              # React frontend
│   ├── pages/          # Route components
│   │   ├── Index.tsx   # Landing page
│   │   ├── Admin.tsx   # Admin dashboard
│   │   └── PublicMenu.tsx  # Public menu view
│   ├── components/ui/  # Reusable UI components
│   └── lib/            # Client utilities
├── server/             # Express backend
│   ├── routes/         # API endpoints
│   └── lib/            # Server utilities
├── shared/             # Shared types
├── supabase/           # Database schema
└── public/             # Static assets
```

## API Endpoints

- `GET /api/restaurants` - List all restaurants
- `POST /api/restaurants` - Create restaurant
- `POST /api/restaurants/qr` - Generate and upload QR code
- `GET /api/restaurants/:id/menu-items` - List menu items
- `POST /api/restaurants/:id/menu-items` - Create menu item
- `DELETE /api/menu-items/:id` - Delete menu item
- `PATCH /api/menu-items/:id/availability` - Toggle availability

## Deployment

### Netlify (Recommended)

1. Push to GitHub
2. Connect repo to Netlify
3. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist/spa`
4. Add environment variables
5. Deploy

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

## Database Schema

### Tables

- **restaurants** - Restaurant information (name, slug, logo, QR URL)
- **menu_items** - Menu items (name, description, price, image, availability)
- **admin_users** - Admin access control

### Storage

- **khadyamqr** bucket - Stores logos and QR codes

## Usage

### Admin Dashboard

1. Go to `/admin`
2. Add a restaurant with name and optional logo
3. Click "Generate QR" to create a QR code
4. Click "Manage Menu" to add menu items
5. Upload item photos, set prices, and toggle availability

### Public Menu

- QR codes link to `/menu/[slug]`
- Customers scan QR → see live menu
- Menu updates reflect instantly

## Future Enhancements

- [ ] Admin authentication with Supabase Auth
- [ ] WhatsApp order integration
- [ ] 360° food item views (three.js)
- [ ] Analytics dashboard (QR scans, popular items)
- [ ] Multi-language support
- [ ] Table-specific QR codes

## License

MIT

## Author

Built with ❤️ for restaurants everywhere
