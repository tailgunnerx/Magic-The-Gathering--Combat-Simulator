# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

**Status**: COMPLETED

**Complexity Assessment**: HARD

Technical specification has been created at `.zenflow/tasks/new-task-6d47/spec.md` documenting:
- Current HTTrack v3.49.6 architecture (C-based, web GUI)
- Modern competitor feature analysis
- Proposed React + Vite frontend with Tailwind CSS
- Tor/.onion support implementation plan
- JavaScript rendering capabilities
- API design and integration architecture
- Security considerations and risk assessment

---

## Implementation Steps

### [ ] Phase 1.1: Project Infrastructure Setup
<!-- chat-id: b0794c28-786b-4c01-a71d-e3249a99cbbd -->

**Goal**: Set up the modern frontend development environment and build integration

**Tasks**:
- Create `gui/` directory for modern React frontend
- Initialize Vite + React + TypeScript project
- Set up Tailwind CSS and shadcn/ui
- Configure build output to integrate with C backend
- Add npm scripts to package.json
- Create .gitignore for node_modules
- Update main configure.ac to detect Node.js and build GUI
- Document build process in README

**Verification**:
- `npm run build` produces optimized bundle < 500KB gzipped
- Built assets are accessible from C HTTP server
- Build works on Windows, Linux, and macOS

---

### [ ] Phase 1.2: C Backend API Foundation

**Goal**: Extend the HTTP server with RESTful API and WebSocket support

**Tasks**:
- Add cJSON library for JSON serialization
- Create `src/htsapi.c` and `src/htsapi.h` for API handlers
- Implement core REST endpoints: `/api/v1/projects`, `/api/v1/settings`, `/api/v1/stats`
- Add libwebsockets dependency (optional)
- Implement WebSocket support for real-time progress
- Create API routing system in htsserver.c
- Add CORS headers for development
- Implement request validation and error handling
- Write unit tests for API endpoints

**Verification**:
- All API endpoints return valid JSON
- WebSocket connections stay alive and push updates
- API handles malformed requests gracefully
- Manual testing with curl/Postman
- Unit tests pass

---

### [ ] Phase 1.3: Modern GUI Core Components

**Goal**: Build the foundational UI components and routing

**Tasks**:
- Set up React Router for navigation
- Create main layout component (sidebar + content area)
- Implement dark/light theme switcher
- Build Dashboard page with project list
- Create navigation sidebar with icons
- Implement responsive design (mobile-first)
- Add loading states and error boundaries
- Create toast notification system
- Build settings page skeleton
- Write Storybook stories for components

**Verification**:
- Navigation works smoothly between pages
- Theme switching persists in localStorage
- Responsive design works on mobile/tablet/desktop
- No console errors or warnings
- Lighthouse score > 90

---

### [ ] Phase 1.4: Project Wizard UI

**Goal**: Create the new project creation wizard with modern UX

**Tasks**:
- Build multi-step wizard component
- Implement Step 1: Project name and category
- Implement Step 2: URL input with validation
- Implement Step 3: Basic options selection
- Implement Step 4: Advanced options (accordion UI)
- Add URL validation and suggestions
- Create project template presets
- Connect wizard to `/api/v1/projects` POST endpoint
- Add form validation with react-hook-form
- Create success/error states
- Write integration tests

**Verification**:
- Wizard creates valid project via API
- Form validation prevents invalid input
- URL suggestions work correctly
- Templates populate correct settings
- Integration tests pass

---

### [ ] Phase 1.5: Download Monitor & Progress UI

**Goal**: Real-time download monitoring with beautiful progress visualization

**Tasks**:
- Create download progress card component
- Implement WebSocket connection for real-time updates
- Build progress bars with animation (framer-motion)
- Add download statistics (speed, ETA, files)
- Create pause/resume/stop controls
- Implement log viewer with filtering
- Add download queue management
- Create mini progress indicator for sidebar
- Handle connection loss and reconnection
- Write tests for WebSocket handlers

**Verification**:
- Progress updates in real-time without lag
- Controls (pause/resume/stop) work correctly
- Log viewer filters by level (debug/info/error)
- WebSocket reconnects on connection loss
- Manual download test shows accurate progress

---

### [ ] Phase 1.6: Advanced Options Panels

**Goal**: Modernize the 11 option tabs into searchable, organized panels

**Tasks**:
- Create categorized options layout (accordion/tabs)
- Implement search/filter across all options
- Build option components for each category:
  - Parsing options
  - Limits and quotas
  - Flow control
  - Link handling
  - Build structure
  - Spider settings
  - Browser identity
  - Logging
  - Proxy configuration
  - Expert settings
  - MIME types
- Add tooltips with examples
- Create preset configurations
- Implement save/load custom presets
- Connect to `/api/v1/settings` endpoints
- Write tests for option persistence

**Verification**:
- All options are accessible and functional
- Search finds relevant options quickly
- Tooltips explain each option clearly
- Presets load correct configurations
- Settings persist across sessions
- Integration tests verify API communication

---

### [ ] Phase 1.7: Integration & Polish

**Goal**: Connect all frontend pieces, polish UX, and ensure quality

**Tasks**:
- Integrate all pages into cohesive application
- Add keyboard shortcuts for power users
- Implement drag-and-drop for URL input
- Add export/import project configurations
- Create onboarding tour for new users
- Implement accessibility features (ARIA labels, keyboard nav)
- Add error reporting and crash recovery
- Optimize bundle size (code splitting, lazy loading)
- Run accessibility audit (WCAG 2.1 AA)
- Conduct user testing session
- Write E2E tests with Playwright

**Verification**:
- Full user workflow works end-to-end
- Accessibility score > 90 (axe-core)
- Bundle size < 500KB gzipped
- No critical errors in console
- E2E tests cover main workflows
- Manual testing on all platforms

---

### [ ] Phase 2.1: SOCKS5 Proxy Implementation

**Goal**: Add SOCKS5 protocol support for Tor connectivity

**Tasks**:
- Create `src/htssocks.c` and `src/htssocks.h`
- Implement SOCKS5 handshake protocol
- Add SOCKS5 authentication (username/password)
- Integrate SOCKS5 into network layer (htsnet.c)
- Add configuration options for SOCKS proxy
- Implement connection timeout handling
- Add DNS resolution through SOCKS5
- Create error handling for SOCKS failures
- Write unit tests for SOCKS5 protocol
- Test with SSH tunnel as SOCKS5 proxy

**Verification**:
- SOCKS5 connection succeeds to test proxy
- Authentication works correctly
- DNS queries go through SOCKS5
- Timeouts handled gracefully
- Unit tests pass
- Manual test with SSH SOCKS5 tunnel

---

### [ ] Phase 2.2: Tor Integration & .onion Support

**Goal**: Enable downloading from .onion hidden services

**Tasks**:
- Add .onion domain detection
- Bypass DNS resolution for .onion domains
- Add Tor proxy configuration UI
- Implement Tor connection testing
- Add circuit timeout handling
- Create .onion-specific robots.txt handling
- Add security warnings in UI
- Implement DNS leak prevention
- Add Tor status indicator in UI
- Create user guide for Tor setup
- Write integration tests with test .onion site
- Test with real Tor Browser SOCKS proxy

**Verification**:
- Successfully download test .onion site
- No DNS leaks (verify with Wireshark)
- Tor status shows correctly in UI
- Connection failures are handled gracefully
- User guide is clear and complete
- Integration tests pass
- Manual test with popular .onion site

---

### [ ] Phase 2.3: Tor Documentation & Safety

**Goal**: Ensure safe and legal use of Tor features

**Tasks**:
- Write comprehensive Tor setup guide
- Add legal disclaimer for Tor usage
- Create troubleshooting section
- Document known limitations
- Add security best practices
- Create video tutorial for Tor setup
- Add inline help in UI for Tor options
- Implement usage analytics opt-in
- Add telemetry for error reporting (anonymous)

**Verification**:
- Documentation is clear and accurate
- Legal disclaimers are prominent
- Users understand risks and limitations
- Video tutorial is helpful
- Beta testers successfully set up Tor

---

### [ ] Phase 3.1: JavaScript Rendering - Plugin Architecture

**Goal**: Create plugin system for optional JS rendering

**Tasks**:
- Design plugin API interface
- Create plugin loader system
- Add plugin configuration in settings
- Create plugin directory structure
- Implement plugin enable/disable functionality
- Add plugin marketplace UI (future)
- Document plugin development guide
- Create example plugin

**Verification**:
- Plugins can be loaded and unloaded
- Plugin settings persist correctly
- Plugin API is well-documented
- Example plugin works as expected

---

### [ ] Phase 3.2: Headless Browser Plugin (Optional)

**Goal**: Implement JavaScript rendering via headless browser

**Tasks**:
- Choose headless browser solution (Playwright/Puppeteer)
- Create JS renderer plugin
- Implement page pre-rendering before parsing
- Add configurable timeout per page
- Implement screenshot capture
- Add JS error detection
- Create render cache to avoid re-rendering
- Add UI toggle for JS rendering
- Handle browser binary downloads
- Write tests for rendering

**Verification**:
- JS-heavy sites render correctly
- React/Vue/Angular SPAs work
- Performance is acceptable (< 5s per page)
- Browser binary downloads work
- Cache prevents redundant rendering
- Tests verify correct rendering

---

### [ ] Phase 4.1: WARC Archive Format Support

**Goal**: Add industry-standard WARC format export

**Tasks**:
- Study WARC 1.1 specification
- Create `src/htswarc.c` and `src/htswarc.h`
- Implement WARC record writing
- Add metadata headers
- Implement compression (gzip)
- Add UI option for WARC output
- Create WARC validation tests
- Document WARC format usage

**Verification**:
- Generated WARC files are valid (warc-tools)
- Archives can be replayed in Wayback Machine
- Metadata is complete and accurate
- Compression works correctly
- Unit tests pass

---

### [ ] Phase 4.2: Cloud Storage Scraping Support

**Goal**: Add support for downloading from cloud storage providers (S3, Azure Blob, GCS)

**Tasks**:
- Add S3 bucket crawling support (public buckets)
- Add Azure Blob container support
- Add Google Cloud Storage bucket support
- Implement cloud storage authentication (API keys)
- Handle cloud-specific URL patterns
- Add cloud storage file listing
- Implement pagination for large buckets
- Create cloud storage protocol handlers
- Write tests for cloud storage downloads
- Document cloud storage scraping

**Verification**:
- Can download from public S3 buckets
- Authentication works for private buckets
- Handles large buckets efficiently
- Tests verify cloud downloads
- Documentation explains usage

---

### [ ] Phase 4.3: Scheduling System

**Goal**: Allow scheduled downloads and automatic updates

**Tasks**:
- Design scheduling data model
- Implement cron-like scheduler
- Add scheduling UI (calendar picker)
- Implement recurring download schedules
- Add email/notification on completion
- Create schedule management page
- Implement background service/daemon
- Add schedule conflict detection
- Write tests for scheduler
- Document scheduling features

**Verification**:
- Scheduled downloads start automatically
- Recurring schedules work correctly
- Notifications are sent
- Conflicts are detected and warned
- Background service runs reliably
- Tests verify scheduling logic

---

### [ ] Phase 5: Testing, Documentation & Release

**Goal**: Comprehensive testing, documentation, and release preparation

**Tasks**:
- Run full E2E test suite
- Conduct security audit
- Perform penetration testing
- Fix all critical and high-priority bugs
- Complete all user documentation
- Create migration guide from old UI
- Create video tutorial series
- Set up CI/CD pipeline
- Build release packages for all platforms
- Create release notes
- Prepare GitHub release
- Announce on website and social media

**Verification**:
- All tests pass (unit, integration, E2E)
- Security audit passes
- Documentation is complete
- Packages build successfully on all platforms
- Migration guide is clear
- Beta testers approve
- Release notes are comprehensive

---

### [ ] Phase 6: Post-Release Support

**Goal**: Monitor release, fix issues, and gather feedback

**Tasks**:
- Monitor GitHub issues and discussions
- Fix critical bugs quickly
- Gather user feedback
- Create FAQ based on common questions
- Plan next iteration features
- Write retrospective
- Update roadmap
- Celebrate success! 🎉

**Verification**:
- Critical bugs fixed within 48 hours
- User feedback is positive
- FAQ answers common questions
- Roadmap is updated with learnings
