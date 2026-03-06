# Frontend Exercise: Kanban (fex-kanban)

## Overview

Build identical-featured Kanban boards seven times with framework-idiomatic implementations across separate repositories to learn frontend development through comparison. Each implementation showcases framework-specific patterns, state management, and best practices.

## Goal

Master frontend frameworks by building the same production-quality Kanban board application, learning through hands-on comparison of approaches, patterns, and tradeoffs.

## LLM Policy

Since this exercise is about learning. It is built primarily by hand. However I did use an LLM to design and refine the exercise itself.

I will also allow myself to use LLMs:

* If google searches and manual trial/error resolution for errors does not succeed
* To see if the code I'm writing follows best-practices and is idomatic
* To automate boilerplate or busy-work that don't help me learn anything new
  * Ex: I wrote the first API handlers by hand, then used an LLM to write the boilerplate (not the implementation) for the rest of the handlers.

> The goal is to find the correct trade-off between learning and conserving my limited free time.

## Phases

- Backend (express.js)
- Frontend
  - Vanilla JS
  - Lit
  - React
  - HTMX
  - Solid.js
  - Vue 3
  - Svelte
  - Angular + retrospective

## Tech Stack

### Backend (Shared)

- **Language**: Node.js (TypeScript)
- **Database**: PostgreSQL
- **API**: REST
- **Auth**: JWT (15min access token + 7-day httpOnly refresh cookie)
- **WebSockets**: ws or socket.io (for Angular only initially)
- **Type Sharing**: Shared TypeScript types between backend and frontend

### Frontend Frameworks & Patterns

1. **Vanilla JS** - HTML5 DnD + custom state management + CSS modules
2. **Lit** - Web Components + lit-dnd + shadow DOM + standards-based approach
3. **React** - dnd-kit + Zustand + styled-components + Testing Library
4. **HTMX** - Hypermedia-driven + server-side rendering + minimal JavaScript
5. **Solid.js** - solid-dnd + createStore + fine-grained reactivity comparison
6. **Vue 3** - vue-draggable + Pinia + transition-group + Composition API
7. **Svelte** - svelte-dnd-action + stores + built-in animations
8. **Angular** - CDK DnD + NgRx + Material + RxJS + WebSockets

### Styling

- **Shared**: Tailwind CSS for consistent base styling
- **Per-framework**: Framework-specific component libraries and patterns

## Features (Identical Across All Implementations)

### Core Features

- Multi-board support (list, create, update, delete boards)
- Columns (Todo, In Progress, Done - customizable)
- Cards with CRUD operations
- Drag-and-drop (cards within/between columns)
- Card reordering within columns

### Accessibility (Required for All Implementations)

- Keyboard navigation (Tab, Enter, Arrow keys, Escape)
- ARIA labels and roles (drag handles, modals, lists)
- Focus management (trapped in modals, restored after actions)
- Screen reader announcements (card moved, created, deleted)
- Color contrast compliance (WCAG AA minimum)
- Skip links and landmark regions

### Advanced Features

- JWT authentication (login, logout, token refresh)
- Card details modal with:
  - Title and description
  - Due dates with visual indicators
  - Priority levels (high/medium/low)
  - Labels/tags
  - Subtasks with progress tracking
  - Comments/activity log
- Search and filter (by title, label, assignee, status)
- Data persistence (backend API)
- Error handling and loading states
- Responsive design

### Angular-Specific

- Real-time updates via WebSockets (`CARD_MOVED`, `CARD_UPDATED`, `CARD_CREATED`, `CARD_DELETED`)

## Testing Strategy

### Comprehensive E2E (Playwright)

- **Vanilla JS**: All user flows, validates API contract and DOM fundamentals
- **Angular**: Framework-specific patterns (NgRx, RxJS, services, DI) - assumes API validated

### Component/Integration Focus

- **Lit**: Web Component Testing Library, shadow DOM testing, lifecycle testing
- **React**: Testing Library philosophy, hooks testing, custom hook patterns
- **HTMX**: Server-side template testing, hypermedia assertions
- **Solid.js**: Signal/effect testing, fine-grained reactivity
- **Svelte**: Reactive statement testing, store testing

### Minimal (Smoke Tests Only)

- **Vue**: Familiar patterns after React/Solid/Lit

### Shared E2E Scenarios

All implementations must pass these scenarios:
- User registration and login
- Create/edit/delete boards
- Create/edit/delete cards
- Drag-and-drop cards between columns
- Card details CRUD operations
- Search and filter
- Token refresh on 401
- Logout

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login (returns access token, sets refresh cookie)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate refresh token

### Boards

- `GET /api/boards` - List user's boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board with columns and cards
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Columns

- `POST /api/boards/:boardId/columns` - Create column
- `PUT /api/columns/:id` - Update column
- `DELETE /api/columns/:id` - Delete column

### Cards

- `POST /api/columns/:columnId/cards` - Create card
- `GET /api/cards/:id` - Get card details
- `PUT /api/cards/:id` - Update card
- `PATCH /api/cards/:id/move` - Move card (column/order)
- `DELETE /api/cards/:id` - Delete card

### WebSocket (Angular)

- `WS /ws?token=JWT&boardId=ID` - Real-time board updates

## Implementation Workflow (Per Framework)


### Week 1: Core Features

- [ ] Project setup (bundler, TypeScript, linting)
- [ ] Import shared types from backend
- [ ] Basic routing (board list, board detail)
- [ ] API client layer (fetch/axios with types)
- [ ] Board CRUD UI
- [ ] Column and card display
- [ ] Drag-and-drop implementation
- [ ] Basic styling with Tailwind

### Week 2: Advanced Features

- [ ] JWT authentication flow
  - [ ] Login/register forms
  - [ ] Token storage (memory + refresh cookie)
  - [ ] Request interceptors for auth headers
  - [ ] Protected routes
  - [ ] Auto token refresh on 401
- [ ] State management library integration
- [ ] Card details modal with all fields
- [ ] Subtasks functionality
- [ ] Labels and filtering
- [ ] Search functionality
- [ ] Due date handling

### Week 3: Testing & Optimization

- [ ] Test suite implementation (per testing strategy)
- [ ] Error boundaries/handling
- [ ] Loading states and skeletons
- [ ] Optimistic updates (where applicable)
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Framework-specific best practices
- [ ] README documentation with:
  - [ ] What this framework teaches
  - [ ] Key patterns used
  - [ ] Unique features/approaches
  - [ ] Performance characteristics
  - [ ] Developer experience notes

## Learning Focus Areas by Framework


### Vanilla JS

- DOM manipulation and event delegation
- Manual state management patterns
- Performance without framework overhead
- Understanding what frameworks abstract away

### Lit

- Web Components standards (Custom Elements, Shadow DOM)
- Lit's reactive properties and lifecycle
- Framework-agnostic component architecture
- Browser-native encapsulation
- Bridge between vanilla and frameworks

### React

- Component composition and hooks
- Context API and prop drilling solutions
- Virtual DOM and reconciliation
- Testing Library philosophy
- Ecosystem and tooling

### HTMX

- Hypermedia-driven architecture (HATEOAS)
- Server-side rendering vs client-side
- Minimal JavaScript approach
- Progressive enhancement
- HTML-over-the-wire patterns
- Stateless client paradigm

### Solid.js

- Fine-grained reactivity without re-renders
- Signals vs stores
- JSX without virtual DOM
- Performance comparison with React
- Minimal abstraction

### Vue 3

- Composition API vs Options API
- Reactive data system
- Template-based rendering
- Two-way binding patterns
- Progressive enhancement approach

### Svelte

- Compiler-based approach
- Built-in reactivity and animations
- Minimal boilerplate
- Stores for state management
- Performance benefits

### Angular

- Dependency injection architecture
- RxJS and reactive programming
- Opinionated structure and CLI
- Enterprise patterns (NgRx)
- Real-time with WebSockets
- Change detection strategies

## Success Metrics


### Performance Benchmarking (Consistent Across All)

Using Lighthouse CI on standardized test board (10 columns, 50 cards):
- **First Contentful Paint (FCP)**: Target <1.5s
- **Time to Interactive (TTI)**: Target <3.5s
- **Total Blocking Time (TBT)**: Target <300ms
- **Cumulative Layout Shift (CLS)**: Target <0.1
- **Bundle Size**: JS + CSS gzipped, document uncompressed size
- **Runtime Performance**: Chrome DevTools Performance profile for drag operation

### Technical

- All implementations have identical features
- Each implementation follows framework best practices
- Test coverage meets strategy requirements
- Performance benchmarks meet or document deviation from targets

### Learning

- Can explain when to use each framework
- Understand tradeoffs between approaches
- Comfortable with state management patterns across paradigms
- Can implement features idiomatically in each framework
- Ready to make informed framework decisions

## Post-Completion (Week 21+)


### Comprehensive Retrospective Document

- Feature implementation comparison table
- Bundle size comparison
- Performance benchmarks with deviation analysis
- Developer experience ratings
- State management complexity comparison
- Testing experience comparison
- Learning curve analysis
- Pros/cons of each framework
- Recommendations for different use cases

### Optional Extensions

- Add WebSockets to 2-3 other frameworks
- Add offline-first capabilities (IndexedDB, service workers)
- Deploy all implementations (Vercel, Netlify, AWS)
- Accessibility audit with automated tooling (axe-core)
- Internationalization (i18n)

### Future Deep Dives (If Pursuing Further)

- **State Management Patterns**: Compare Context vs Zustand vs Redux vs XState within React to understand state tradeoffs within a single framework
- **CI/CD Integration**: Add GitHub Actions workflows from project start to learn deployment pain points per framework (build times, SSR deployment, static hosting)
- **Mobile Native**: React Native or Flutter implementation to explore cross-platform mobile patterns (separate from web comparison)
