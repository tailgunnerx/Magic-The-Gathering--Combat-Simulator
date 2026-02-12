# Technical Specification: HTTrack v2 Modernization

## Project Overview

**Objective**: Modernize HTTrack Website Copier (v3.49.6) with a cutting-edge GUI inspired by modern crypto wallet interfaces and add advanced features including .onion (Tor) support.

**Repository**: httrack-v2 (GitHub)  
**Local Path**: C:\Users\CREED-gaming\Desktop\httrack-v2-master  
**Complexity**: **HARD** - This is a major architectural overhaul involving both frontend modernization and backend feature additions

---

## Current State Analysis

### Technology Stack
- **Language**: C (ANSI C with GNU extensions)
- **Build System**: GNU Autotools (configure, make)
- **GUI Type**: Web-based interface served by embedded HTTP server
- **Server**: Custom HTTP server implementation (htsserver.c)
- **Proxy**: ProxyTrack component for cache-based proxying
- **Version**: 3.49.6
- **License**: GPL v3

### Current Architecture

#### Core Components
1. **HTTrack Engine** (libhttrack)
   - Core downloading engine (htscore.c, htscoremain.c)
   - HTTP/FTP protocol handlers (htsweb.c, htsftp.c)
   - HTML parser (htsparse.c)
   - Cache system (htscache.c)
   - Filter system (htsfilters.c)
   - Robots.txt handler (htsrobots.c)
   - Thread management (htsthread.c)
   - Network layer (htsnet.h, htsbasenet.h)

2. **WebHTTrack GUI**
   - HTML templates in `/html/server/`
   - CSS styling in `style.css` (circa 2007 design)
   - JavaScript minimal (ping.js for connectivity)
   - Templating system with variables like `${LANG_*}`

3. **Internationalization**
   - 30 languages supported
   - Language definitions in lang.def
   - Template-based translation system

4. **Proxy Component**
   - ProxyTrack for cache-based proxying
   - Support for HTTP proxy and ICP protocol

### Current GUI Design (Outdated)

#### Visual Design Issues
- **Layout**: Table-based layout (pre-CSS3)
- **Color Scheme**: Blue/purple gradient (#77b, #ccd, #99c, #448)
- **Typography**: Trebuchet MS, Verdana fallbacks, 14px base
- **Navigation**: Tab-based with black backgrounds
- **Responsiveness**: None - fixed width 76% tables
- **Styling**: Inline styles, outdated patterns
- **Images**: GIF-based backgrounds and headers
- **Forms**: Basic HTML forms with minimal styling

#### Options Menu Structure
Currently 11 option tabs:
- option1.html: Parsing options
- option2.html: Limits
- option3.html: Flow control
- option4.html: Links
- option5.html: Build options
- option6.html: Spider
- option7.html: Browser ID
- option8.html: Log/errors
- option9.html: Proxy
- option10.html: Expert
- option11.html: MIME types

---

## Modern Competitor Feature Analysis

### Features HTTrack Currently Has
✅ Recursive website downloading  
✅ Link structure preservation  
✅ Resume/update capabilities  
✅ Proxy support (HTTP)  
✅ Robots.txt compliance  
✅ HTTP/FTP protocols  
✅ Filters and rules  
✅ Multi-threading  
✅ Internationalization  

### Features HTTrack Lacks (Modern Competitors Have)

#### 1. JavaScript/SPA Rendering
- **Tools with this**: Website Copier Pro, Browsertrix, mirror-web-cli
- **Technology**: Headless Chrome/Chromium integration
- **Use Cases**: React, Vue, Angular apps, dynamic content, lazy loading

#### 2. Tor/.onion Support
- **Current**: No native support
- **Workaround**: Manual proxy configuration with Tor Browser
- **Needed**: SOCKS5 proxy support, built-in Tor integration option

#### 3. Modern Authentication
- **Session management**: Cookie handling, OAuth flows
- **Login automation**: Automated form filling, session persistence
- **2FA handling**: Manual intervention support

#### 4. Cloud Integration
- **Backup**: Direct upload to S3, Azure, Google Cloud
- **Scheduling**: Cloud-based scheduled mirrors
- **Distribution**: CDN integration

#### 5. Advanced Media Handling
- **Video**: HLS/DASH stream downloading
- **Images**: WebP, AVIF format support
- **Fonts**: Modern font format handling

#### 6. API & Automation
- **REST API**: Remote control and monitoring
- **WebSocket**: Real-time progress updates
- **CLI improvements**: JSON output, scripting-friendly

#### 7. Modern Archive Formats
- **WARC**: Web ARChive format support
- **EPUB**: E-book format export
- **Single file**: MHTML/MAFF support

---

## Proposed Modernization Plan

### Phase 1: GUI Modernization

#### Technology Choice: Embedded Modern Web Stack

**Approach**: Replace old HTML/CSS/JS with modern framework while keeping the C backend

**Option A - React + Vite (Recommended)**
- **Frontend**: React 18 + TypeScript
- **Build**: Vite for fast development
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand or Context API
- **Icons**: Lucide React
- **Theme**: Dark/light mode with crypto wallet aesthetic

**Option B - Svelte + SvelteKit**
- Lighter weight, easier C integration
- Better performance for embedded use
- Less bundle size

**Option C - Vue 3 + Vite**
- Progressive enhancement
- Easier migration path

**Recommendation**: **React + Vite** for:
- Largest ecosystem for modern UI components
- Best crypto wallet UI component libraries
- Excellent TypeScript support
- Easy to find developers

#### GUI Design Inspiration

**Modern Crypto Wallet Aesthetic**:
- **Color Schemes**: 
  - Dark mode primary: Deep blacks (#0a0a0a), accent gradients (blue-purple-pink)
  - Light mode: Clean whites (#ffffff), subtle grays (#f5f5f5)
- **Typography**: 
  - Modern: Inter, Poppins, or Space Grotesk
  - Monospace for technical data: JetBrains Mono
- **Layout**:
  - Sidebar navigation (collapsible)
  - Card-based content areas
  - Floating action buttons
  - Bottom sheets for mobile
- **Animations**:
  - Smooth transitions (framer-motion)
  - Micro-interactions
  - Progress indicators with visual flair
- **Components**:
  - Glass-morphism cards
  - Neon accent lines
  - Gradient backgrounds
  - 3D button effects
  - Toast notifications

#### Key UI Components to Build

1. **Dashboard**
   - Active downloads with real-time progress
   - Queue management
   - Recent projects
   - Statistics cards

2. **Project Wizard**
   - Multi-step form with progress indicator
   - URL input with validation
   - Smart suggestions
   - Template presets

3. **Advanced Options**
   - Categorized accordion panels
   - Search/filter options
   - Presets and saved configurations
   - Tooltips with visual examples

4. **Monitor/Logs**
   - Real-time log streaming
   - Filterable log levels
   - Visual error highlighting
   - Export capabilities

5. **Settings**
   - Modern settings panel
   - Profile management
   - Theme customization
   - Import/export preferences

#### Integration Architecture

```
┌─────────────────────────────────────┐
│   Modern Frontend (React + Vite)   │
│  - TypeScript                       │
│  - Tailwind CSS                     │
│  - shadcn/ui components             │
└────────────┬────────────────────────┘
             │ HTTP/WebSocket
┌────────────▼────────────────────────┐
│   Enhanced HTTP Server (C)          │
│  - RESTful API endpoints            │
│  - WebSocket for real-time updates  │
│  - JSON serialization               │
│  - CORS handling                    │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   HTTrack Core Engine (C)           │
│  - Existing libhttrack              │
│  - Enhanced with new features       │
└─────────────────────────────────────┘
```

#### API Design

**REST Endpoints**:
```
GET    /api/v1/projects               - List all projects
POST   /api/v1/projects               - Create new project
GET    /api/v1/projects/:id           - Get project details
PUT    /api/v1/projects/:id           - Update project
DELETE /api/v1/projects/:id           - Delete project
POST   /api/v1/projects/:id/start     - Start download
POST   /api/v1/projects/:id/pause     - Pause download
POST   /api/v1/projects/:id/resume    - Resume download
POST   /api/v1/projects/:id/stop      - Stop download
GET    /api/v1/projects/:id/status    - Get status
GET    /api/v1/projects/:id/logs      - Get logs
GET    /api/v1/settings               - Get settings
PUT    /api/v1/settings               - Update settings
GET    /api/v1/stats                  - Get statistics
```

**WebSocket Channels**:
```
/ws/progress/:project_id   - Real-time download progress
/ws/logs                   - Log streaming
/ws/notifications          - System notifications
```

---

### Phase 2: Feature Additions

#### Feature 1: Tor/.onion Support

**Technical Requirements**:
1. **SOCKS5 Proxy Support**
   - Implement SOCKS5 protocol in network layer
   - Modify htsnet.c/htsbasenet.h
   - Add SOCKS5 authentication support

2. **Tor Integration Options**:
   - **Option A**: External Tor (user runs Tor Browser/daemon)
     - Simpler implementation
     - User controls Tor instance
     - Configuration: point to 127.0.0.1:9050
   
   - **Option B**: Embedded Tor (Advanced)
     - Bundle tor library
     - Automatic Tor startup
     - More complex but better UX

3. **.onion Domain Handling**:
   - DNS resolution bypass for .onion
   - Direct SOCKS connection
   - Handle Tor circuit timeouts
   - Respect .onion-specific robots.txt

4. **Security Considerations**:
   - Warn users about Tor usage
   - No DNS leaks
   - Respect exit node policies
   - Optional: Stream isolation

**Implementation**:
```c
// New file: src/htssocks.c
typedef struct {
    char host[256];
    int port;
    char username[64];
    char password[64];
} socks5_config_t;

int hts_socks5_connect(socks5_config_t* config, 
                       const char* dest_host, 
                       int dest_port);
```

#### Feature 2: JavaScript Rendering

**Approach**: Headless Browser Integration

**Technology Options**:
1. **Playwright/Puppeteer via Node.js bridge**
   - Most feature-complete
   - Heavy dependency
   
2. **CEF (Chromium Embedded Framework)**
   - C++ library
   - Better C integration
   - Large binary size

3. **WebKit2GTK (for Linux)**
   - Native Linux integration
   - Smaller footprint

**Recommendation**: **Optional plugin architecture**
- Make it opt-in due to size/complexity
- Download renderer plugin separately
- Fallback to traditional parsing

**Implementation**:
- New option: "Enable JavaScript rendering"
- Pre-render pages before parsing
- Cache rendered HTML
- Configurable timeout per page

#### Feature 3: Modern Archive Formats

**WARC Support**:
```c
// src/htswarc.c
int hts_warc_init(const char* filename);
int hts_warc_write_record(warc_record_t* record);
int hts_warc_close();
```

**MHTML Support**:
- Single-file output option
- MIME multipart format
- Better for sharing

#### Feature 4: Enhanced API

**New Endpoints**:
```
POST   /api/v1/analyze              - Analyze URL before download
GET    /api/v1/templates            - Get project templates
POST   /api/v1/import               - Import project config
GET    /api/v1/export/:id           - Export project config
POST   /api/v1/schedule/:id         - Schedule download
GET    /api/v1/health               - Health check
```

#### Feature 5: Cloud Storage Integration

**Supported Providers**:
- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- Dropbox
- OneDrive

**Implementation**:
- Plugin architecture for storage backends
- Streaming upload during download
- Automatic sync after completion

---

## Data Model Changes

### Project Configuration (Enhanced)

```c
typedef struct {
    // Existing fields...
    
    // New fields
    int enable_js_rendering;
    int use_tor;
    char socks5_proxy[256];
    int socks5_port;
    char archive_format[32];  // "httrack", "warc", "mhtml"
    int cloud_upload;
    char cloud_provider[64];
    char cloud_bucket[256];
    int schedule_enabled;
    time_t schedule_time;
    int schedule_interval;
} httrackp;
```

### New Tables/Files

1. **projects.db** (SQLite)
   - Better than file-based storage
   - Easier queries
   - Transaction support

2. **settings.json**
   - Global application settings
   - User preferences
   - Theme configuration

3. **cache.db** (SQLite)
   - Enhanced caching
   - Better indexing
   - Query capabilities

---

## Build System Enhancements

### Current Build
```
./configure && make && make install
```

### Enhanced Build

**Add npm/Node.js build**:
```bash
# Frontend build
cd gui/
npm install
npm run build

# Backend build
./configure --with-gui=modern
make
make install
```

**CMake Option** (Alternative to Autotools):
- Modern cross-platform builds
- Better Windows support
- Easier dependency management

---

## Verification Approach

### Testing Strategy

1. **Unit Tests**
   - Test new SOCKS5 implementation
   - Test WARC format generation
   - Test API endpoints

2. **Integration Tests**
   - Test full download workflows
   - Test GUI ↔ backend communication
   - Test Tor connectivity

3. **E2E Tests**
   - Playwright tests for GUI
   - Real download scenarios
   - Cross-browser compatibility

4. **Performance Tests**
   - Download speed benchmarks
   - Memory usage profiling
   - Concurrent download limits

### Manual Verification

1. **GUI Testing**
   - Visual inspection on multiple screens
   - Dark/light mode switching
   - Responsive design checks
   - Accessibility audit

2. **Feature Testing**
   - Download regular websites
   - Download .onion sites via Tor
   - Test JS-heavy sites with renderer
   - Test various archive formats

3. **Cross-Platform Testing**
   - Windows 10/11
   - Linux (Ubuntu, Fedora, Arch)
   - macOS

---

## Security Considerations

### New Attack Surfaces

1. **WebSocket connections**: Validate all messages
2. **API endpoints**: Rate limiting, authentication
3. **Tor integration**: DNS leak prevention
4. **Cloud credentials**: Secure storage (OS keyring)
5. **JavaScript rendering**: Sandbox untrusted content

### Mitigations

- Input validation on all API endpoints
- CSRF tokens for state-changing operations
- Content Security Policy for GUI
- Secure defaults (disable Tor/JS rendering by default)
- Audit third-party dependencies

---

## Dependencies

### New Runtime Dependencies

**Required**:
- libcurl (enhanced, for SOCKS5)
- OpenSSL/LibreSSL (existing)
- zlib (existing)
- SQLite3 (new, for database)
- cJSON (new, for API)

**Optional**:
- Tor (for .onion support)
- Node.js runtime (for JS rendering plugin)
- libwebsockets (for WebSocket support)

### Build Dependencies

**Required**:
- Node.js 18+ & npm
- Modern C compiler (C11 support)
- pkg-config
- cmake (if switching from autotools)

**Optional**:
- Chromium for testing
- Playwright for E2E tests

---

## Migration Strategy

### Backward Compatibility

1. **Keep old GUI available**
   - `--classic-gui` flag
   - Allow users to choose

2. **Import old projects**
   - Parser for old project format
   - Automatic migration wizard

3. **Configuration migration**
   - Convert old .ini files to new JSON
   - Preserve all settings

### Rollout Plan

1. **Alpha**: Core developers
2. **Beta**: Early adopters via GitHub releases
3. **RC**: Public beta testing
4. **Stable**: Full release

---

## Performance Considerations

### Frontend Performance

- **Bundle size target**: < 500KB gzipped
- **Initial load**: < 2 seconds on slow 3G
- **Code splitting**: Route-based lazy loading
- **Asset optimization**: Image compression, font subsetting

### Backend Performance

- **Memory**: No regression vs current version
- **CPU**: JS rendering is opt-in (expensive)
- **Network**: Connection pooling, HTTP/2 support
- **Disk**: Async I/O for better throughput

---

## Documentation Requirements

### User Documentation

1. **Migration guide**: Old → New interface
2. **Tor setup guide**: How to download .onion sites
3. **API documentation**: OpenAPI/Swagger spec
4. **Video tutorials**: Key workflows

### Developer Documentation

1. **Architecture guide**: System overview
2. **API reference**: Complete endpoint documentation
3. **Plugin development**: How to extend
4. **Build guide**: All platforms

---

## Timeline Estimates (Rough)

### Phase 1: GUI Modernization
- **Setup & Architecture**: 1 week
- **Core UI Components**: 2-3 weeks
- **API Implementation**: 2 weeks
- **Integration & Testing**: 1-2 weeks
- **Total**: ~6-8 weeks

### Phase 2: Tor Support
- **SOCKS5 Implementation**: 1 week
- **.onion Handling**: 1 week
- **Testing & Hardening**: 1 week
- **Total**: ~3 weeks

### Phase 3: JavaScript Rendering
- **Plugin Architecture**: 1 week
- **Browser Integration**: 2 weeks
- **Testing**: 1 week
- **Total**: ~4 weeks

### Phase 4: Additional Features
- **WARC Format**: 1 week
- **Cloud Integration**: 2 weeks
- **Scheduling**: 1 week
- **Total**: ~4 weeks

**Grand Total**: ~17-19 weeks for full implementation

---

## Risk Assessment

### High Risks

1. **Complexity**: This is a major rewrite
   - **Mitigation**: Incremental approach, keep old code working
   
2. **Performance**: New GUI might be slower
   - **Mitigation**: Thorough profiling, lightweight framework choice

3. **Security**: New attack surface with API/WebSocket
   - **Mitigation**: Security audit, penetration testing

4. **Tor Integration**: Complex protocol, legal concerns
   - **Mitigation**: Make opt-in, clear disclaimers, thorough testing

### Medium Risks

1. **Cross-platform compatibility**: Node.js + C integration
   - **Mitigation**: Extensive testing on all platforms

2. **User adoption**: Users might prefer old interface
   - **Mitigation**: Keep both available, gradual transition

3. **Maintenance burden**: More code to maintain
   - **Mitigation**: Good documentation, modular architecture

---

## Success Metrics

### Quantitative

- ✅ 90%+ of users switch to new GUI within 6 months
- ✅ No performance regression (< 5% slower)
- ✅ Successfully download 95%+ of .onion test sites
- ✅ JS rendering works on 90%+ of test SPA sites
- ✅ Bundle size < 500KB gzipped
- ✅ API response times < 100ms (p95)

### Qualitative

- ✅ Positive user feedback on GUI aesthetics
- ✅ Easier to use than competitors
- ✅ Modern, professional appearance
- ✅ Good accessibility scores (WCAG 2.1 AA)

---

## Open Questions

1. **Windows Native UI**: Should we also create a native Windows GUI (WPF/WinUI)?
2. **Mobile Apps**: iOS/Android apps for remote control?
3. **Browser Extension**: Chrome/Firefox extension for "download this site"?
4. **Premium Features**: Any features behind a paywall/donation?
5. **Plugin Marketplace**: Allow third-party plugins?
6. **Default Theme**: Dark mode default or light mode?
7. **Tor Bundle**: Include Tor binary or require separate install?

---

## Conclusion

This is a **HARD** complexity project requiring significant architectural changes, new technology integration, and careful execution. The modernization will bring HTTrack into 2025+ with a stunning GUI and powerful new features, while maintaining its core strengths as a robust website copier.

**Key Challenges**:
- Integrating modern web frontend with C backend
- Implementing Tor/SOCKS5 support securely
- Adding JS rendering without bloating the application
- Maintaining backward compatibility
- Ensuring cross-platform support

**Key Opportunities**:
- Dramatically improved user experience
- Competitive feature set vs modern alternatives
- Active development community growth
- Potential for monetization/sustainability

**Recommended Priority**:
1. ✅ **Phase 1**: GUI Modernization (highest impact, most visible)
2. ✅ **Phase 2**: Tor Support (unique differentiator)
3. ⏸️ **Phase 3**: JS Rendering (opt-in, lower priority)
4. ⏸️ **Phase 4**: Cloud/Scheduling (nice-to-have)
