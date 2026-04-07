# 🌊 AlgaEye - Mobile App UI Design Showcase

## Project Overview

**AlgaEye** is a modern, responsive mobile application designed for environmental citizen science. The app empowers users to track, monitor, and report algae blooms in water bodies, contributing to scientific understanding and environmental protection.

## 🎨 Design System Highlights

### Color Palette
```
Primary Green:    #2E7D6E (Nature, Growth, Primary Actions)
Primary Blue:     #0D7BA8 (Water, Secondary Actions)
Earth Tone:       #D4A574 (Warmth, Accent)
Success:          #27AE60 (Low Severity, Positive)
Warning:          #F39C12 (Medium Severity, Caution)
Danger:           #E74C3C (High Severity, Critical)
```

### Typography
- **Headers**: 24-28px, Bold (700)
- **Titles**: 14-18px, SemiBold (600)
- **Body**: 13-14px, Regular (500)
- **Small**: 11-12px, Regular (500)

### Design Principles
✨ **Clean & Minimalist**: Flat design with soft gradients
🌿 **Nature-Inspired**: Colors reflect water and environmental themes
📊 **Data-Driven**: Clear visualization of environmental metrics
♿ **Accessible**: High contrast, readable typography, touch-friendly

## 📱 Complete Screen Suite

### 1. **Onboarding Screen**
- **Purpose**: Welcome and educate new users
- **Components**: 
  - 3-slide carousel with emoji icons
  - Animated progress dots
  - Next/Get Started CTA
- **Key Features**:
  - Horizontal scrolling navigation
  - Professional introduction
  - Clear value proposition

### 2. **Authentication Screens**
- **Purpose**: User login and registration
- **Components**:
  - Email and password inputs
  - Name field (sign-up)
  - Social login option
  - Toggle between sign-in/sign-up
- **Key Features**:
  - Icon-enhanced input fields
  - Clean form hierarchy
  - Social login integration
  - Easy account switching

### 3. **Home Dashboard**
- **Purpose**: Central hub with key information
- **Sections**:
  - Personalized greeting header
  - Quick action buttons (Report, Map, Analytics)
  - Active alerts display
  - Recent user reports
  - Educational tips
- **Key Features**:
  - Color-coded severity alerts
  - Quick navigation to all main features
  - Recent activity history
  - User engagement tips

### 4. **Photo Capture Screen**
- **Purpose**: Submit new bloom reports
- **Components**:
  - Prominent camera button
  - Photo preview area
  - Location display (GPS)
  - Severity level selector
  - Submit button
- **Key Features**:
  - Visual severity feedback
  - GPS location display
  - Easy photo change
  - Clear submission flow

### 5. **Map View Screen**
- **Purpose**: Visualize and explore blooms
- **Sections**:
  - Interactive map with markers
  - Severity legend
  - Location details panel
  - Statistics (confidence, reports)
  - Recent activity feed
- **Key Features**:
  - Color-coded severity dots
  - Tap to select locations
  - Detailed information cards
  - Report history display

### 6. **Analytics Screen**
- **Purpose**: Historical trends and insights
- **Sections**:
  - Time range selector
  - Overview statistics
  - Weekly activity chart
  - Severity distribution
  - Top locations ranking
- **Key Features**:
  - Multiple metric views
  - Bar chart visualization
  - Progress indicators
  - Location rankings

### 7. **Profile Screen**
- **Purpose**: User account and settings
- **Sections**:
  - User profile card
  - Statistics (reports, impact, streak)
  - Achievement badges
  - Settings toggles
  - Account actions
- **Key Features**:
  - Gamification elements
  - Achievement unlocking
  - Settings management
  - Account controls

## 🎯 Component Library

### Button System
```typescript
<Button 
  variant="primary" | "secondary" | "outline" | "ghost"
  size="small" | "medium" | "large"
  title="Action"
  onPress={() => {}}
  icon={<Icon />}
  fullWidth={true}
/>
```

### Card Component
```typescript
<Card 
  elevation="low" | "medium" | "high"
  onPress={() => {}}
>
  {children}
</Card>
```

### Badge Component
```typescript
<Badge 
  label="Status"
  variant="success" | "warning" | "danger" | "info"
  size="small" | "medium"
/>
```

### Input Component
```typescript
<Input 
  placeholder="Enter text"
  icon={<Icon />}
  error="Error message"
/>
```

## 🎬 Navigation Flow

```
┌─ Onboarding (First Visit)
│
├─ Authentication (Login/Signup)
│
└─ Main App
   ├─ Home Dashboard
   │  ├─ Report Bloom → Capture Screen
   │  ├─ View Map → Map Screen
   │  └─ Analytics → Analytics Screen
   │
   ├─ Explore Tab → Map Screen
   ├─ Capture Tab → Capture Screen
   ├─ Analytics Tab → Analytics Screen
   └─ Profile Tab → Profile Screen
```

## 🌙 Light & Dark Mode

The app features complete dark mode support with:
- Automatic theme detection
- Adjusted color schemes for readability
- Consistent brand colors across modes
- Maintained WCAG contrast ratios

**Dark Mode Colors:**
- Background: `#0F1419`
- Card: `#1A1F26`
- Border: `#2A3035`
- Text: `#ECEDEE`

## 📐 Responsive Design

- **Mobile-first approach**: Optimized for 360px+
- **Flexible layouts**: Flexbox-based responsive design
- **Touch-friendly**: 48px+ minimum touch targets
- **Orientation support**: Works in portrait and landscape

## ✨ Key Features

### Interactive Elements
- ✅ Smooth button transitions and haptic feedback
- ✅ Touchable cards with elevation changes
- ✅ Focus states on input fields
- ✅ Error state validation
- ✅ Loading states with spinners

### Visual Feedback
- ✅ Color-coded severity indicators
- ✅ Progress bars and charts
- ✅ Animated transitions
- ✅ Badge notifications
- ✅ Shadow elevation system

### Data Visualization
- ✅ Bar charts for trends
- ✅ Progress indicators
- ✅ Status color coding
- ✅ Location rankings
- ✅ Statistical overviews

## 🚀 Technical Stack

- **Framework**: React Native / Expo
- **Routing**: Expo Router
- **Styling**: StyleSheet (inline styles)
- **State Management**: React Hooks
- **Icons**: Expo Symbols
- **Safe Area**: react-native-safe-area-context
- **Platforms**: iOS, Android, Web

## 📁 Project Structure

```
algae-bloom-tracker/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab navigation
│   │   ├── index.tsx          # Home dashboard
│   │   └── explore.tsx        # Map view
│   ├── onboarding.tsx         # Onboarding flow
│   ├── auth.tsx               # Login/signup
│   ├── capture.tsx            # Photo upload
│   ├── map.tsx                # Map visualization
│   ├── analytics.tsx          # Trends & insights
│   └── profile.tsx            # User profile
├── components/
│   ├── ui/
│   │   ├── button.tsx         # Button component
│   │   ├── input.tsx          # Input field
│   │   ├── card.tsx           # Card & Badge
│   │   └── ...
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ...
├── constants/
│   └── theme.ts               # Color palette
├── hooks/
│   ├── use-color-scheme.ts
│   └── ...
└── DESIGN_SYSTEM.md           # Documentation
```

## 🎨 UI Component Examples

### Button Variants
```
[Primary Green]    [Secondary Blue]    [Outline Green]    [Ghost]
  Report            View Map            Learn More       Settings
```

### Card States
```
┌─ Normal Card ─┐
├─ Low Shadow   ├─ Medium Shadow ├─ High Shadow ─┐
└─────────────┘
```

### Badge Status
```
✓ Success (Green)  ⚠ Warning (Orange)  ! Danger (Red)  ℹ Info (Blue)
```

## 🎯 User Experience Highlights

1. **Intuitive Navigation**: Tab-based navigation with clear icons
2. **Quick Actions**: Home screen provides immediate access to key features
3. **Real-time Data**: Map and analytics show live bloom information
4. **Gamification**: Achievements and streaks encourage engagement
5. **Accessibility**: High contrast, readable text, touch-friendly
6. **Social Impact**: Clear visualization of contribution and impact

## 📊 Design Metrics

- **Color Palette**: 6 primary colors + 3 status colors
- **Typography Scales**: 8 distinct sizes
- **Component Types**: 4 main components (Button, Card, Input, Badge)
- **Screens**: 7 main screens
- **Spacing Scale**: 7 standard spacing values
- **Shadow Elevation**: 3 levels
- **Border Radius**: 4 sizes

## 🔄 Design Consistency

- ✅ Consistent component styling
- ✅ Unified color usage
- ✅ Standard spacing and padding
- ✅ Coherent typography hierarchy
- ✅ Predictable interactions
- ✅ Familiar patterns across screens

## 🌱 Future Enhancements

- 🎬 Animated screen transitions
- 🎯 Gesture-based interactions
- 🔔 Push notification animations
- 📸 Real camera integration
- 🗺️ Maps API integration
- 🌐 Real location data
- 👥 Social sharing features
- 💾 Offline mode support

## 📝 Documentation

For detailed design specifications, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

**App Version**: 1.0  
**Design System**: v1.0  
**Platform**: React Native / Expo  
**Last Updated**: April 2026

### 🌍 AlgaEye - Tracking Water Health for a Better Future

*Contributing to environmental science, one report at a time.*
