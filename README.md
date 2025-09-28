# WellnessSpace - Mental Health Support Platform

![WellnessSpace](https://img.shields.io/badge/Status-Development-yellow.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)

A comprehensive mental health support platform designed specifically for Indian students, providing crisis intervention, AI-powered counseling, peer support, and wellness resources.

## 🌟 Features

### Core Features

- **🤖 AI Chatbot**: Intelligent mental health support with crisis detection
- **📋 Mental Health Assessments**: PHQ-9, GAD-7, and GHQ-12 questionnaires
- **👥 Peer Support Community**: Anonymous forum for student discussions
- **📚 Resource Hub**: Educational materials, worksheets, and crisis support
- **📅 Counselor Booking**: Professional counseling appointment system
- **🚨 Crisis Intervention**: 24/7 crisis support with KIRAN helpline integration
- **📊 Admin Dashboard**: Analytics and moderation tools

### Technical Features

- **🔐 Secure Authentication**: Email-based auth with anonymous options
- **⚡ Real-time Updates**: Live chat and notifications
- **📱 Responsive Design**: Mobile-first PWA design
- **🌐 Multi-language Ready**: Framework for Hindi and regional languages
- **🛡️ Privacy-First**: Anonymous usage options and data protection

## 🏗️ Architecture

### Frontend Stack

- **React 18.3.1** with TypeScript
- **Vite 5.4.19** for fast development and building
- **TailwindCSS** + **Radix UI** for modern, accessible UI
- **React Router DOM** for navigation
- **TanStack React Query** for server state management
- **React Hook Form** + **Zod** for form handling and validation

### Backend Stack

- **Supabase** (PostgreSQL + Auth + Real-time + Storage)
- **Row Level Security (RLS)** for data protection
- **Edge Functions** for AI integration and serverless logic
- **Real-time subscriptions** for live features

### AI Integration

- **Google Gemini API** for intelligent chat responses
- **Crisis detection algorithms** for risk assessment
- **Personalized recommendations** based on assessment results

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/priyanksachdeva/solace-connect-flow.git
   cd solace-connect-flow
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your credentials:

   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Database Setup**

   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli

   # Initialize Supabase
   supabase init

   # Run migrations
   supabase db push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:8080` to see the application.

## 📁 Project Structure

```
solace-connect-flow/
├── 📄 README.md
├── 📄 package.json
├── 📄 index.html
├── 📄 tailwind.config.ts
├── 📄 vite.config.ts
├── 📁 public/
│   ├── 🖼️ icons/ (PWA icons)
│   └── 📄 manifest.webmanifest
├── 📁 src/
│   ├── 📄 App.tsx (Main app component)
│   ├── 📄 main.tsx (Entry point)
│   ├── 📄 index.css (Global styles)
│   ├── 📁 components/
│   │   ├── 📁 ui/ (Reusable UI components)
│   │   ├── 📁 providers/ (Context providers)
│   │   └── 📁 crisis-alert/ (Crisis intervention)
│   ├── 📁 pages/
│   │   ├── 📄 Index.tsx (Landing page)
│   │   ├── 📄 ChatInterface.tsx (AI chatbot)
│   │   ├── 📄 AuthPage.tsx (Authentication)
│   │   ├── 📄 AssessmentPage.tsx (Mental health assessments)
│   │   ├── 📄 CommunityPage.tsx (Peer support forum)
│   │   ├── 📄 CounselingPage.tsx (Counselor booking)
│   │   ├── 📄 ResourcesPage.tsx (Educational resources)
│   │   └── 📄 AdminDashboard.tsx (Analytics & moderation)
│   ├── 📁 hooks/
│   │   ├── 📄 useAuth.ts (Authentication logic)
│   │   ├── 📄 useCommunity.ts (Forum functionality)
│   │   ├── 📄 useCounseling.ts (Appointment booking)
│   │   └── 📄 useAnalytics.ts (Admin dashboard)
│   ├── 📁 contexts/
│   │   ├── 📄 CrisisMonitoringContext.tsx
│   │   ├── 📄 PWAContext.tsx
│   │   └── 📄 I18nContext.tsx
│   ├── 📁 integrations/
│   │   └── 📁 supabase/
│   │       ├── 📄 client.ts (Supabase client)
│   │       └── 📄 types.ts (Database types)
│   └── 📁 lib/
│       ├── 📄 utils.ts (Utility functions)
│       ├── 📄 constants.ts (App constants)
│       ├── 📄 validation.ts (Form validation)
│       └── 📄 i18n.ts (Internationalization)
├── 📁 supabase/
│   ├── 📄 config.toml
│   ├── 📁 migrations/ (Database schemas)
│   └── 📁 functions/
│       ├── 📁 ai/ (AI chatbot endpoint)
│       ├── 📁 crisis-analysis/ (Crisis detection)
│       └── 📁 advanced-analytics/ (Analytics processing)
└── 📁 .github/
    └── 📁 workflows/ (CI/CD pipelines)
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase db reset    # Reset database
supabase db push     # Push migrations
supabase functions serve # Serve edge functions locally
```

### Environment Variables

| Variable                        | Description              | Required |
| ------------------------------- | ------------------------ | -------- |
| `VITE_SUPABASE_URL`             | Supabase project URL     | ✅       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | ✅       |
| `VITE_SUPABASE_PROJECT_ID`      | Supabase project ID      | ✅       |
| `GEMINI_API_KEY`                | Google Gemini API key    | ✅       |

### Database Schema

The application uses PostgreSQL with the following main tables:

- `profiles` - User profiles and crisis contacts
- `chat_conversations` - AI chat sessions
- `chat_messages` - Chat message history
- `psychological_assessments` - Assessment results
- `community_posts` - Forum posts and discussions
- `counselors` - Counselor information
- `appointments` - Appointment bookings

## 🚀 Deployment

### Production Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**

   - **Vercel**: Connect GitHub repo and deploy automatically
   - **Netlify**: Drag and drop `dist` folder or connect repo
   - **Railway/Render**: Connect repo and configure build settings

3. **Configure environment variables** in your hosting platform

4. **Set up Supabase production environment**
   - Create production project
   - Run migrations: `supabase db push --linked`
   - Deploy edge functions: `supabase functions deploy`

### Environment Setup

**Development:**

```bash
VITE_SUPABASE_URL=https://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=local_anon_key
```

**Production:**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_production_anon_key
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Maintain test coverage
- Update documentation for new features
- Ensure accessibility compliance (WCAG 2.1)

## 📋 Roadmap

### Phase 1: Core Features ✅

- [x] User authentication and profiles
- [x] AI chatbot with crisis detection
- [x] Mental health assessments
- [x] Basic peer support forum
- [x] Resource hub with educational content

### Phase 2: Enhanced Features 🚧

- [ ] Real-time chat notifications
- [ ] Advanced community features (voting, comments)
- [ ] Counselor video calling integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, regional languages)

### Phase 3: Advanced Analytics 📋

- [ ] Population health trends
- [ ] Predictive risk modeling
- [ ] Institutional dashboard
- [ ] Research data export (anonymized)

### Phase 4: Integrations 📋

- [ ] Calendar system integration
- [ ] SMS/WhatsApp notifications
- [ ] Email automation
- [ ] Third-party mental health tools

## 🛡️ Security & Privacy

- **Data Encryption**: All data encrypted in transit and at rest
- **Anonymous Options**: Full anonymity available for sensitive features
- **GDPR Compliance**: Data protection and user rights compliance
- **Crisis Protection**: Immediate escalation for high-risk situations
- **Professional Standards**: Follows mental health care guidelines

## 📞 Crisis Support

**Immediate Help:**

- **KIRAN Helpline**: 1800-599-0019 (24/7 toll-free)
- **National Emergency**: 112
- **Suicide Prevention**: Available through app interface

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Government**: KIRAN helpline integration
- **Mental Health Professionals**: Advisory and validation
- **Student Communities**: User feedback and testing
- **Open Source Community**: Libraries and frameworks used

## 📞 Support

- **Documentation**: Check this README and inline documentation
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact development team for urgent matters

---

**Built with ❤️ for student mental health and wellness**
