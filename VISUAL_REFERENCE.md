# 🎨 AlgaEye - Visual Design Reference & Component Gallery

## Color Palette

### Primary Brand Colors
```
╔════════════════════════════════════════════════════════════════╗
║ PRIMARY GREEN - #2E7D6E                                        ║
║ Nature, Growth, Primary Actions                               ║
║ ████████████████████████████████████████                      ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║ PRIMARY BLUE - #0D7BA8                                         ║
║ Water, Secondary Actions, Map Elements                        ║
║ ██████████████████████████████████                           ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║ EARTH TONE - #D4A574                                           ║
║ Warmth, Accent Colors, Highlights                             ║
║ ██████████████████████████████████████████████                ║
╚════════════════════════════════════════════════════════════════╝
```

### Status Colors
```
✓ SUCCESS - #27AE60      Green   ████ Low Severity, Positive
⚠ WARNING - #F39C12      Orange  ████ Medium Severity, Caution
! DANGER  - #E74C3C      Red     ████ High Severity, Critical
ℹ INFO    - #0D7BA8      Blue    ████ Information, Secondary
```

### Neutral & Background Colors
```
Light Background: #F9FAFB  ████ App default background
Card Background:  #FFFFFF  ████ Surface elements
Border:           #E0E0E0  ████ Dividers, outlines
Light Text:       #666666  ████ Secondary text
Dark Text:        #1A1A1A  ████ Primary text

Dark Mode:
Background:       #0F1419  ████ Dark app background
Card:             #1A1F26  ████ Dark surface
Border:           #2A3035  ████ Dark divider
Text:             #ECEDEE  ████ Light text on dark
```

## Typography System

```
╔═══════════════════════════════════════
│ TITLE - 24-28px, Bold (700)         │ Large screen headers
├──────────────────────────────────────┤
│  Subtitle - 14-18px, SemiBold (600) │ Section titles
├──────────────────────────────────────┤
│   Body Text - 13-14px, Regular (500) │ Main content
├──────────────────────────────────────┤
│    Small - 11-12px, Regular (500)   │ Supporting text
├──────────────────────────────────────┤
│     Extra Small - 10px, Regular      │ Labels, timestamps
└──────────────────────────────────────┘
```

## Component States

### Button States
```
┌─────────────────────────────┐
│ PRIMARY BUTTON              │  Normal - Ready for interaction
│ [Report Bloom]              │
├─────────────────────────────┤
│ [Report Bloom]              │  Hover/Press - User feedback
├─────────────────────────────┤
│ ◉ Loading... [spinner]      │  Loading - Action in progress
├─────────────────────────────┤
│ (Disabled Text)             │  Disabled - Inactive
└─────────────────────────────┘

Variants:
│ Primary   │ Secondary │ Outline  │ Ghost    │
│ [Green]   │ [Blue]    │ [Border] │ [Text]   │
```

### Card States
```
Low Elevation      Medium Elevation    High Elevation
┌──────────────┐   ┌─ ──────────┐    ┌──  ────────┐
│ Content      │   │ Content    │    │ Content    │
│              │   │            │    │            │
└──────────────┘   └─ ──────────┘    └──  ────────┘
Subtle shadow      Standard shadow    Prominent shadow
```

### Badge Variants
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ ✓ SUCCESS   │  │ ⚠ WARNING   │  │ ! DANGER    │  │ ℹ INFO      │
│ [Green bg]  │  │ [Orange bg] │  │ [Red bg]    │  │ [Blue bg]   │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
Light shade      Light shade       Light shade      Light shade
```

### Input Field States
```
Normal Input:
┌────────────────────────────────────┐
│ 📧 Email Address                  │  Placeholder visible
└────────────────────────────────────┘

Focused Input:
┌────────────────────────────────────┐
│ 📧 user@example.com               │  Active, green border
└────────────────────────────────────┘

Error Input:
┌────────────────────────────────────┐
│ 🔒 Password                        │  Red border
└────────────────────────────────────┘
✗ Password too short

Filled Input:
┌────────────────────────────────────┐
│ 👤 Sarah Johnson                  │  Populated
└────────────────────────────────────┘
```

## Spacing Scale

```
XS  ▁▁▁▁ 4px    - Tight spacing
S   ▁▁▁▁▁▁▁▁ 8px    - Small gaps
M   ▁▁▁▁▁▁▁▁▁▁▁▁ 12px  - Medium gaps
STD ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 16px  - Standard padding
L   ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 20px  - Large spacing
XL  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 24px  - Extra large
XXL ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 32px  - Huge
```

## Border Radius Specification

```
Sharp Corners:          Slightly Rounded:       More Rounded:
┌──────────┐           ┌─────────┐            ╭─────────╮
│ 0px      │           │ 8px     │            │ 12px    │
└──────────┘           └─────────┘            ╰─────────╯

Fully Rounded:
  ◉ (28-40px)
  Perfect circles
```

## Elevation/Shadow System

```
Level 1 - Low Shadow
░░░░░░░░░░ Blur: 4px, Offset: 0,2px, Opacity: 0.08

Level 2 - Medium Shadow
░░░░░░░░░░░░ Blur: 4px, Offset: 0,2px, Opacity: 0.1

Level 3 - High Shadow
░░░░░░░░░░░░░░░░ Blur: 4px, Offset: 0,2px, Opacity: 0.15
```

## Navigation Structure

```
┌─────────────────────────────────────────┐
│  AlgaEye - Home Dashboard               │
├─────────────────────────────────────────┤
│ Welcome, Sarah!    👤                  │
│ Today is a good day to track water     │
├─────────────────────────────────────────┤
│  [📸 Report]  [🗺️ Map]  [📊 Analytics] │
├─────────────────────────────────────────┤
│ 🚨 Active Alerts                        │
│ ├─ High Bloom Activity - Lake SF [HIGH] │
│ └─ Medium Activity - Bay Waters [MED]   │
├─────────────────────────────────────────┤
│ 📸 Your Recent Reports                  │
│ ├─ Report #24 - 1 day ago [HIGH]       │
│ ├─ Report #23 - 2 days ago [MED]       │
│ └─ Report #22 - 3 days ago [LOW]       │
├─────────────────────────────────────────┤
│ 💡 Did you know?                        │
│ Algae blooms help scientists understand │
│ [Learn More]                            │
├─────────────────────────────────────────┤
│  🏠 Home │ 🗺️ Map │ 📸 Capture │ 📊 Analytics │ 👤 Profile │
└─────────────────────────────────────────┘
```

## Screen Layouts

### Home Dashboard Layout
```
┌─────────────────────────┐
│ ↑ Safe Area             │
├─────────────────────────┤
│ Header Section (54px)   │ [Greeting + Avatar]
├─────────────────────────┤
│ Quick Actions (68px)    │ [3 Buttons]
├─────────────────────────┤
│ Scrollable Content ∞    │
│ ├─ Alerts Cards         │
│ ├─ Reports Cards        │
│ └─ Tips Card            │
├─────────────────────────┤
│ ↓ Tab Bar (56px)        │ [5 Navigation Items]
└─────────────────────────┘
```

### Map View Layout
```
┌─────────────────────────┐
│ ↑ Safe Area             │
├─────────────────────────┤
│ Map Container (40%)     │ [Interactive Map with Dots]
│ ├─ Legend (12px)        │ [Low/Med/High indicators]
│ └─ Markers              │ [Color-coded locations]
├─────────────────────────┤
│ Details Panel (55%)     │
│ ├─ Location Header      │ [Name + Severity Badge]
│ ├─ Statistics          │ [Confidence + Reports]
│ └─ Recent Reports      │ [Activity Feed]
├─────────────────────────┤
│ ↓ Tab Bar (56px)        │
└─────────────────────────┘
```

### Analytics Layout
```
┌─────────────────────────┐
│ Title: Analytics        │
├─────────────────────────┤
│ Time Range Selector     │ [Week/Month/Year]
├─────────────────────────┤
│ Overview Stats (80px)   │ [3 Metrics]
├─────────────────────────┤
│ Chart Card (140px)      │ [Bar Chart]
├─────────────────────────┤
│ Distribution Card       │ [Progress Bars]
├─────────────────────────┤
│ Locations Card ∞        │ [List Items]
├─────────────────────────┤
│ ↓ Tab Bar (56px)        │
└─────────────────────────┘
```

## Responsive Breakpoints

```
Small Devices:     Medium Devices:    Large Devices:
320px - 480px      481px - 768px      769px+
┌──────┐          ┌────────┐         ┌──────────┐
│      │          │        │         │          │
│ Full │          │ Full   │         │ Full     │
│Width │          │ Width  │         │ Width    │
│      │          │        │         │          │
└──────┘          └────────┘         └──────────┘

Touch targets: min 48px
Margins: 16px padding
Line height: 1.5x font size
```

## Dark Mode Example

```
Light Mode          →          Dark Mode
┌──────────────┐               ┌──────────────┐
│ White bg     │               │ Dark bg      │
│ Dark text    │               │ Light text   │
│ Green border │               │ Green border │
│              │               │              │
│ [Green BTN]  │               │ [Green BTN]  │
└──────────────┘               └──────────────┘
```

## Accessibility Features

```
Touch Targets:     48px minimum height & width
Color Contrast:    4.5:1 for text (WCAG AA)
Focus Indicators:  Clear visual feedback
Icons + Text:      Always paired
Error States:      Clear messaging
Loading States:    Spinner feedback
```

## Component Size Reference

```
Height Reference:
Small Button:    36px
Medium Button:   48px ← Standard
Large Button:    56px
Input Field:     48px ← Standard
Card Height:     Variable
Tab Bar:         56px
Avatar:          56px (width)
Icon:            24px (typical)
```

## Animation Speeds

```
Fast:    100-150ms   (Hover effects, small transitions)
Medium:  300-350ms   (Screen transitions, modal opens)
Slow:    500-700ms   (Complex animations, page loads)
```

## Quality Checklist

- ✅ Colors meet WCAG AA contrast ratios
- ✅ Touch targets are at least 48px
- ✅ Typography is readable at all scales
- ✅ Spacing is consistent
- ✅ Components scale responsively
- ✅ Dark mode is supported
- ✅ States are clearly visible
- ✅ Loading states present
- ✅ Error states clear
- ✅ Animations are smooth

## Brand Voice

The design conveys:
- 🌱 Environmental consciousness
- 📊 Scientific precision
- 🎯 User empowerment
- 👥 Community participation
- 🔬 Data-driven decisions

---

**Design System Version**: 1.0  
**Last Updated**: April 2026  
**Status**: Production Ready ✅
