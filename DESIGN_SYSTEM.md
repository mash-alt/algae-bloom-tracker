# AlgaEye - Environmental Citizen Science App UI/UX Design

## 🌊 Design Overview

AlgaEye is a modern, responsive mobile app designed to track and monitor algae blooms in water bodies. The design emphasizes environmental awareness, scientific collaboration, and intuitive user experience.

### Design Philosophy
- **Nature-Inspired**: Color palette reflects water, nature, and environmental care
- **Clean & Minimalist**: Flat design with soft gradients and rounded corners
- **Data-Driven**: Clear visualization of environmental data and trends
- **Accessible**: High contrast, readable typography, intuitive navigation

## 🎨 Color Palette

### Primary Colors
- **Primary Green**: `#2E7D6E` - Main brand color, represents nature and growth
- **Primary Blue**: `#0D7BA8` - Secondary brand color, represents water
- **Earth Tone**: `#D4A574` - Accent color, adds warmth

### Status Colors
- **Success**: `#27AE60` - Green, indicates low severity or positive status
- **Warning**: `#F39C12` - Orange/Yellow, indicates medium severity or caution
- **Danger**: `#E74C3C` - Red, indicates high severity or critical status

### Neutral Colors
- **Dark Text**: `#1A1A1A` - Primary text color (light mode)
- **Light Text**: `#666666` - Secondary text color (light mode)
- **Border**: `#E0E0E0` - UI borders and dividers (light mode)
- **Background**: `#F9FAFB` - App background (light mode)
- **Card Background**: `#FFFFFF` - Card surfaces (light mode)

### Light Backgrounds
- **Light Aqua**: `#E8F4F8` - Light blue overlay for aquatic elements
- **Light Green**: `#E8F5E9` - Light green for growth-related elements

## 🎯 Component System

### Buttons
**Variants:**
- **Primary** - Main action buttons (Green background, white text)
- **Secondary** - Alternative actions (Blue background, white text)
- **Outline** - Tertiary actions (transparent background, green border)
- **Ghost** - Subtle actions (transparent background, no border)

**Sizes:**
- Small: 8px vertical, 16px horizontal padding
- Medium: 12px vertical, 20px horizontal padding
- Large: 16px vertical, 24px horizontal padding

**Features:**
- Rounded corners (12px border radius)
- Subtle shadow elevation
- Haptic feedback support
- Loading state with spinner
- Icon support with spacing

### Cards
**Elevation Levels:**
- Low: Minimal shadow for subtle content
- Medium: Standard elevation for interactive content
- High: Strong elevation for important cards

**Properties:**
- Rounded corners (16px)
- Padding: 16px
- Smooth shadows
- Touchable variant with ripple effect

### Input Fields
- Border radius: 12px
- Height: 48px
- Icon support on left side
- Error state styling
- Placeholder text

### Badge
**Variants:**
- Success (green background, 20% opacity)
- Warning (orange background, 20% opacity)
- Danger (red background, 20% opacity)
- Info (blue background, 20% opacity)

**Sizes:**
- Small: 10px font, 4px padding
- Medium: 12px font, 6px padding

## 📱 Screen Layouts

### 1. Onboarding Screen
**Purpose:** Introduce app functionality and build user interest

**Components:**
- Carousel with 3 slides
- Icon emojis (💧, 📸, 📊)
- Descriptive titles and subtitles
- Animated dot indicators
- Call-to-action button (Next/Get Started)

**Key Features:**
- Smooth horizontal scrolling
- Progress indicators
- Professional yet approachable tone

### 2. Authentication Screen
**Purpose:** User login and registration

**Components:**
- Logo header with app icon (🌊)
- Email and password inputs
- Name input (sign-up only)
- Primary submit button
- Social login option (Google)
- Toggle between sign-in/sign-up

**Key Features:**
- Clean form layout
- Divider with "or" text
- Icon inputs for visual interest
- Easy account switching

### 3. Home Dashboard
**Purpose:** Central hub showing key information and quick actions

**Sections:**
- **Header**: Personalized greeting with avatar
- **Quick Actions**: Three prominent buttons (Report, Map, Analytics)
- **Active Alerts**: High-priority bloom alerts with cards
- **Recent Reports**: User's recent submissions
- **Tips Section**: Educational content about algae

**Color Coding:**
- High severity: Red background
- Medium severity: Orange background
- Low severity: Green background

### 4. Photo Capture Screen
**Purpose:** Submit new algae bloom reports

**Components:**
- Large camera button (prominent)
- Photo preview area with success state
- Location section with GPS toggle
- Severity level selector (Low/Medium/High)
- Submit button

**Features:**
- Visual feedback for selected severity
- GPS coordinates display
- Photo change option
- Clear call-to-action

### 5. Map View Screen
**Purpose:** Visualize bloom locations and severity

**Sections:**
- **Map Area**: Interactive map with water body markers
- **Legend**: Color-coded severity indicator
- **Details Panel**: Expandable information about selected location
- **Statistics**: Confidence score, report count
- **Recent Reports**: Latest activity for selected area

**Interactions:**
- Tap markers to select water bodies
- View detailed information cards
- See report history
- Color-coded severity dots

### 6. Analytics Screen
**Purpose:** Historical trends and data visualization

**Components:**
- **Time Range Selector**: Week/Month/Year buttons
- **Overview Stats**: Total reports, trend percentage, active areas
- **Chart**: Bar chart showing weekly activity
- **Distribution**: Severity distribution pie-like visualization
- **Top Locations**: Most active water bodies list

**Features:**
- Progress bars for severity distribution
- Multiple metrics display
- Easy time range switching
- Location rankings

### 7. Profile Screen
**Purpose:** User account and settings

**Sections:**
- **Profile Card**: Avatar, name, email, member since date
- **Stats**: Reports count, impact score, streak days
- **Achievements**: Badges showing user milestones
- **Settings**: Notification and GPS tracking toggles
- **Actions**: About, Terms & Privacy, Sign Out

**Features:**
- Achievement unlock system
- Gamification elements
- Easy settings management
- Account controls

## 📐 Typography

### Font Sizes
- Title: 24-28px, Bold (700)
- Subtitle: 14-18px, SemiBold (600)
- Body: 13-14px, Regular (500)
- Small: 11-12px, Regular (500)
- Extra Small: 10px, Regular

### Font Weights
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700

## 🔲 Spacing & Layout

### Standard Spacing
- Extra Small: 4px
- Small: 8px
- Medium: 12px
- Standard: 16px
- Large: 20px
- Extra Large: 24px
- Huge: 32px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- Round: 28-40px (avatars, buttons)

## 🌙 Dark Mode Support

The app includes full dark mode support with:
- Adjusted color scheme for better readability
- Darker background: `#0F1419`
- Card background: `#1A1F26`
- Adjusted shadows for dark surfaces
- Maintained color contrast ratios

## 📏 Responsive Design

### Mobile First
- Optimized for screens 360px and up
- Flexible layouts using flexbox
- Touch-friendly hit targets (48px minimum)
- Proper padding and margins for mobile

### Orientation
- Supports both portrait and landscape
- Maintains usability in either mode
- Responsive components adjust to screen size

## ✨ Interactive Elements

### Buttons
- 80% opacity on press (activeOpacity)
- Haptic feedback on interaction
- Clear visual feedback

### Cards
- Touchable variants with opacity change
- Elevation on interaction
- Smooth transitions

### Input Fields
- Focus states with border color change
- Keyboard-aware positioning
- Error state styling

## 📊 Data Visualization

### Status Indicators
- Color-coded severity levels
- Clear visual hierarchy
- Icon combinations (emojis + colors)

### Charts
- Bar charts for activity trends
- Progress bars for distributions
- Simple, clean aesthetics

### Maps
- Colored dots for locations
- Severity-based color coding
- Interactive markers

## 🎯 Navigation Flow

```
Onboarding
    ↓
Authentication
    ↓
Home Dashboard
├── Report Bloom → Capture Screen
├── View Map → Map Screen
└── Analytics → Analytics Screen
    ├── Profile → Profile Screen
    └── Explore → Map Screen
```

## ⚡ Performance Considerations

- Lightweight animations
- Optimized image rendering
- Efficient scrolling with showsVerticalScrollIndicator={false}
- Debounced navigation transitions
- Lazy loading for list items

## ♿ Accessibility

- High contrast colors (WCAG AA standard)
- Clear typography hierarchy
- Descriptive labels and placeholders
- Touch-friendly button sizes (48px minimum)
- Semantic color coding for status
- Icon + text combinations

## 🚀 Future Enhancements

- Animated transitions between screens
- Gesture-based interactions
- Real-time notification animations
- Camera integration for photo capture
- Maps API integration for real locations
- Push notifications for alerts
- Social sharing features
- Offline support

---

**Design System Version**: 1.0  
**Last Updated**: April 2026  
**Platform**: React Native / Expo (iOS, Android, Web)
