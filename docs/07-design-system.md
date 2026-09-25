# METAPHYSICA

# Design System Specification

**Document:** `07-design-system.md`
**Version:** 2.0
**Status:** Specification
**Design Foundation:** Google Material 3
**Implementation Target:** React + TypeScript + MUI

---

# 1. Purpose

This document defines the visual foundation and design language of Metaphysica.

Metaphysica uses **Google Material 3** as its primary design foundation while maintaining a distinct metaphysical product identity.

The design system defines:

* color
* typography
* shape
* elevation
* spacing
* layout
* responsive behavior
* interaction states
* motion
* iconography
* accessibility
* design tokens
* component visual rules
* Metaphysica-specific visual principles

This document defines **design rules**, not individual page implementations.

Component-level specifications belong to:

`08-ui-component-spec.md`

Technical implementation belongs to:

`09-technical-architecture.md`

---

# 2. Design Foundation

Metaphysica follows the design principles of **Google Material 3**.

Material 3 provides the structural foundation for:

```text
Color
Typography
Shape
Elevation
State
Motion
Components
Accessibility
Responsive behavior
```

However, Metaphysica must not become a generic Material application.

The intended relationship is:

```text
Google Material 3
        ↓
Design language
        ↓
Metaphysica adaptation
        ↓
Product-specific visual identity
```

Material 3 defines how the interface behaves and communicates.

Metaphysica defines what the interface feels like.

---

# 3. Design Philosophy

The primary design philosophy is:

> Material clarity with metaphysical character.

The interface should combine:

```text
Material 3
    +
Modern digital product design
    +
Knowledge-oriented presentation
    +
Metaphysical visual identity
```

The result should feel like a serious digital platform for exploring metaphysical systems rather than:

* a generic dashboard
* a horoscope landing page
* a fantasy game interface
* a cyberpunk interface
* an overly decorative spiritual application

---

# 4. Core Design Goals

The design system must prioritize:

1. Clarity
2. Consistency
3. Readability
4. Accessibility
5. Discoverability
6. Responsive behavior
7. Visual hierarchy
8. Controlled visual expression
9. Extensibility
10. Product identity

Visual beauty must never compromise usability.

---

# 5. Product Personality

Metaphysica should communicate the following characteristics:

```text
Modern
Structured
Knowledge-oriented
Contemplative
Technical
Symbolic
Precise
Premium
```

The visual language should remain restrained.

The interface should feel intentional rather than visually noisy.

---

# 6. Material 3 Adaptation

Material 3 is the foundation, but Metaphysica adapts it according to product context.

```text
Material 3
│
├── Structural foundation
├── Interaction model
├── Component behavior
├── Semantic color roles
├── Typography hierarchy
├── Shape system
├── State system
└── Accessibility principles
        │
        ↓
Metaphysica
│
├── Cosmic visual atmosphere
├── Metaphysical imagery
├── Chart visualizations
├── System-specific visual language
├── Educational presentation
└── Product-specific theme
```

The adaptation must remain systematic.

---

# 7. Design System Layers

The design system is organized into six layers.

```text
Layer 1
Design Tokens

Layer 2
Foundations

Layer 3
Material Components

Layer 4
Shared Metaphysica Components

Layer 5
System-Specific Components

Layer 6
Page Composition
```

---

# 8. Design Tokens

Design tokens are the fundamental values used throughout the interface.

Tokens should exist for:

```text
Color
Typography
Spacing
Shape
Elevation
Motion
Opacity
Breakpoints
Component dimensions
```

Components should consume tokens rather than arbitrary values.

---

# 9. Color System

Metaphysica uses a **semantic color role system** inspired by Material 3.

The interface should not be built around arbitrary color assignments such as:

```text
button = blue
card = purple
background = black
```

Instead, colors have semantic purposes.

---

# 10. Core Color Roles

The system should define roles including:

```text
Primary
On Primary

Primary Container
On Primary Container

Secondary
On Secondary

Secondary Container
On Secondary Container

Tertiary
On Tertiary

Tertiary Container
On Tertiary Container

Error
On Error

Error Container
On Error Container

Surface
On Surface

Surface Variant
On Surface Variant

Outline
Outline Variant
```

These roles should be consumed consistently across components.

---

# 11. Primary Color

Primary represents the primary interactive identity of Metaphysica.

It may be derived from a deep cosmic or indigo-based palette.

Primary should generally be used for:

* primary actions
* selected states
* important interactive controls
* key product accents
* active navigation states

Primary should not be used everywhere.

---

# 12. Secondary Color

Secondary supports the primary visual identity.

It can be used for:

* secondary actions
* supporting controls
* secondary emphasis
* supporting visual elements

Secondary should remain visually subordinate to Primary.

---

# 13. Tertiary Color

Tertiary provides additional expressive range.

It may be used for:

* special information
* metaphysical highlights
* selected visualization elements
* expressive product moments

Tertiary should remain controlled.

It should not become another primary color.

---

# 14. Surface System

Surfaces provide the foundation of the application.

Conceptually:

```text
Background
    ↓
Surface
    ↓
Surface Container
    ↓
Elevated Surface
```

Surface differences should be subtle.

The application should not rely on heavy shadows to distinguish every layer.

---

# 15. Dark Theme

A dark theme is strongly compatible with the intended Metaphysica visual identity.

The dark theme should use tonal layering rather than pure black everywhere.

Avoid:

```text
#000000
+
bright neon
+
heavy glow
```

as the default visual language.

Instead:

```text
Dark neutral/cosmic surface
+
controlled tonal hierarchy
+
semantic accent colors
```

---

# 16. Light Theme

If a light theme is provided, it must use the same semantic architecture.

The light theme is not a separate design system.

```text
Same roles
        ↓
Different theme values
```

This allows the application to switch themes without changing component logic.

---

# 17. Color Restrictions

Avoid unnecessary:

* neon colors
* rainbow palettes
* glowing borders
* excessive gradients
* random accent colors
* decorative colored text
* color-coded components without meaning

Color must communicate something.

---

# 18. System-Specific Colors

Metaphysical systems may require additional visualization colors.

Examples:

```text
Astrology
→ planetary / zodiac visualization

Human Design
→ bodygraph visualization

Numerology
→ matrix/value visualization

BaZi
→ elemental visualization

Zi Wei Dou Shu
→ palace visualization

Tzolkin
→ calendar / oracle visualization
```

These colors belong to the visualization layer.

They must not redefine the global application theme.

---

# 19. Typography

Typography follows a clear hierarchy inspired by Material 3.

The primary hierarchy is:

```text
Display
Headline
Title
Body
Label
```

Typography should communicate hierarchy before decorative styling is considered.

---

# 20. Display Typography

Display styles are reserved for major visual statements.

Examples:

* Home hero title
* major product statement
* major result headline

Display text should be used sparingly.

---

# 21. Headline Typography

Headline styles are used for:

* page titles
* major sections
* significant result sections

They should establish strong hierarchy without overpowering the content.

---

# 22. Title Typography

Title styles are used for:

* cards
* subsections
* dialogs
* component headings

---

# 23. Body Typography

Body text is the primary reading style.

It must prioritize:

* readability
* line height
* contrast
* comfortable line length
* clear paragraph separation

This is especially important for Library content.

---

# 24. Label Typography

Labels are used for:

* buttons
* form controls
* metadata
* navigation
* chips
* compact UI elements

Labels should remain concise.

---

# 25. Typography Rules

Avoid excessive font variation.

The hierarchy should primarily come from:

```text
Size
Weight
Line height
Spacing
Contrast
Position
```

rather than introducing many different font families.

---

# 26. Spacing System

Metaphysica uses a tokenized spacing system.

A baseline scale may be structured around:

```text
4
8
12
16
20
24
32
40
48
64
80
```

Exact implementation values may be refined during technical implementation.

The important rule is consistency.

---

# 27. Spacing Hierarchy

Spacing should communicate relationships.

Example:

```text
Title
  ↓ small gap
Description
  ↓ medium gap
Content
  ↓ large gap
Next section
```

Related content should be closer together than unrelated sections.

---

# 28. Layout Grid

The application uses a responsive layout grid.

Conceptually:

```text
Viewport
│
├── Outer Margin
│
├── Content Container
│
├── Grid
│
└── Component Layout
```

The grid should support:

* desktop
* tablet
* mobile
* large displays

---

# 29. Content Width

Content should not stretch indefinitely.

Use controlled maximum widths for:

* educational articles
* descriptions
* settings
* forms
* textual interpretations

Visualization-heavy interfaces may use wider containers.

---

# 30. Responsive Design

Responsive behavior must be designed intentionally.

The interface should not simply shrink the desktop layout.

Instead:

```text
Desktop
   ↓
Responsive transformation
   ↓
Tablet
   ↓
Responsive transformation
   ↓
Mobile
```

Components may:

* stack
* collapse
* become horizontally scrollable
* hide secondary information
* change navigation patterns
* change density

---

# 31. Responsive Breakpoints

The application should define breakpoint tokens based on layout requirements.

Breakpoints should not exist merely because a device has a particular name.

The correct question is:

> At what width does the current layout stop being usable?

---

# 32. Shape System

Material 3 shape principles define the component corner system.

Conceptually:

```text
Small Shape
→ compact controls

Medium Shape
→ standard cards and containers

Large Shape
→ prominent containers

Extra Large Shape
→ major expressive surfaces
```

The exact token values belong to implementation.

---

# 33. Shape Consistency

Equivalent components should use equivalent shape roles.

For example:

```text
Card
→ same card shape

Dialog
→ same dialog shape

Text Field
→ same text-field shape

Button
→ same button shape
```

Avoid arbitrary border-radius values inside individual components.

---

# 34. Elevation

Elevation communicates hierarchy and separation.

Use elevation when a component:

* floats above content
* overlays another surface
* requires interaction separation
* represents a temporary layer

Avoid using heavy shadows simply to make components look "premium."

---

# 35. Elevation Hierarchy

Conceptually:

```text
Base Surface
      ↓
Container
      ↓
Elevated Container
      ↓
Floating Element
      ↓
Overlay
```

Elevation should remain visually subtle.

---

# 36. State Layers

Interactive components must visually communicate state.

Required states include:

```text
Default
Hover
Focus
Pressed
Selected
Disabled
Loading
Error
```

State changes should use consistent Material 3 behavior.

---

# 37. Hover State

Hover should provide subtle feedback.

Avoid dramatic changes such as:

* large scale transformations
* strong glow
* major color inversion

A small tonal or state-layer change is preferred.

---

# 38. Focus State

Focus must be clearly visible.

Keyboard users must be able to identify the currently focused element.

Focus cannot rely only on subtle color changes.

---

# 39. Pressed State

Pressed state should provide immediate feedback without causing layout instability.

Avoid large transformations that move surrounding content.

---

# 40. Disabled State

Disabled components should communicate non-interactivity clearly.

However, disabled content must remain understandable.

---

# 41. Loading State

Loading should communicate:

```text
The action was received.
The system is processing.
The user should wait.
```

Loading must not look like an error.

---

# 42. Error State

Errors should be:

* clear
* contextual
* actionable where possible
* visually distinct

Error styling should use the semantic Error role.

---

# 43. Motion

Motion should support comprehension.

Motion can communicate:

* transition
* hierarchy
* state change
* progress
* continuity

Motion should not exist only for decoration.

---

# 44. Motion Principles

Preferred:

```text
Short
Purposeful
Predictable
Subtle
Interruptible
```

Avoid:

```text
Long animations
Constant floating
Excessive particle effects
Unnecessary parallax
Continuous decorative movement
```

---

# 45. Reduced Motion

The application should respect reduced-motion preferences.

When reduced motion is enabled:

```text
Complex transition
        ↓
Simplified transition
```

Decorative animation should be minimized or removed.

---

# 46. Iconography

Icons should follow a consistent visual language.

Preferred characteristics:

* simple
* recognizable
* consistent stroke/fill behavior
* appropriate scale
* semantic meaning

Icons should not be used merely to fill empty space.

---

# 47. Icon + Text

When an action may be ambiguous, combine icon and text.

Example:

```text
[Edit] Edit Profile
```

is preferable to an unexplained edit icon alone when context is insufficient.

---

# 48. Navigation

Navigation should follow Material 3 principles while respecting Metaphysica's information architecture.

Primary navigation should provide access to the major product areas.

Conceptually:

```text
Home
Library
Generate
```

Profile-related actions remain associated with the profile area.

---

# 49. Application Shell

The application shell should provide consistent:

```text
Navigation
Page container
Theme
Responsive behavior
Global feedback
Modal layer
```

The shell should remain stable while page content changes.

---

# 50. Home Visual Language

Home is an introductory brand experience.

It should not resemble an administrative dashboard.

The hero should establish:

```text
Metaphysica
What it is
Why it exists
Primary action
```

The hero title should maintain strong visual hierarchy.

---

# 51. Library Visual Language

Library prioritizes reading and exploration.

The design should support:

```text
Category
    ↓
Topic
    ↓
Article
    ↓
Educational content
```

Cards may be used for discovery, but article pages should prioritize typography and reading comfort.

---

# 52. Birth Data Visual Language

Birth Data is a functional product area.

The interface should prioritize:

* clarity
* data correctness
* form usability
* selection
* editing
* confirmation

Decorative elements must not interfere with data entry.

---

# 53. Birth Profile Cards

Birth Profile cards should communicate:

```text
Profile Name
Birth Date
Birth Time
Birth Place
Relationship
Selection State
Available Actions
```

The card should make profile selection immediately understandable.

---

# 54. Unknown Birth Time

Unknown birth time must have a distinct semantic state.

It must not be represented as:

```text
00:00
```

unless the user actually entered midnight.

Visual representation should clearly communicate:

```text
Birth time unknown
```

---

# 55. Generation Interface

The Generation experience should follow:

```text
Select Birth Data
        ↓
Select System
        ↓
Configure
        ↓
Validate
        ↓
Generate
        ↓
Result
```

Each stage should have clear hierarchy.

---

# 56. System Selector

The System Selector should visually distinguish the six top-level systems:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

Astrology should not visually appear as six separate top-level systems.

Astrology chart types belong underneath Astrology.

---

# 57. Astrology Chart Selector

The hierarchy must communicate:

```text
Astrology
    ↓
Chart Type
    ├── Natal
    ├── Draconic
    ├── Solar Return
    ├── Lunar Return
    ├── Progressed
    └── Future chart types
```

The interface must allow additional chart types without redesigning the entire generation interface.

---

# 58. Configuration Interfaces

System-specific configuration must use the same global design language.

For example:

```text
Material 3 form components
        +
System-specific configuration
```

The system may introduce specialized controls, but they must still respect:

* typography
* spacing
* color roles
* shape
* state
* accessibility

---

# 59. Result Interfaces

Generated results may be visually richer than standard application screens.

However, the result interface still follows the same design system.

```text
Global Material 3 foundation
        +
System-specific visualization
```

---

# 60. Metaphysical Visualization Principle

Charts and visualizations are allowed to break from conventional UI patterns where necessary.

Examples:

```text
Astrology Chart Wheel
Human Design Bodygraph
BaZi Pillars
Numerology Matrix
Zi Wei Dou Shu Palace Grid
Tzolkin Visualization
```

These are specialized visualization components.

They are not required to look like ordinary Material cards.

However, surrounding controls and information architecture must remain consistent.

---

# 61. Visualization Hierarchy

A result page should separate:

```text
Result Header
        ↓
Visualization
        ↓
Controls
        ↓
Interpretation
        ↓
Supporting Information
```

Visualization should not obscure the surrounding interface.

---

# 62. Cards

Cards should be used to group related information.

Good uses:

* Birth Profiles
* Library content
* system selection
* summary information
* settings groups
* result sections

Cards should not be used for every piece of content.

---

# 63. Dialogs

Dialogs are appropriate for focused tasks that require attention without leaving the current context.

Examples:

* Create Birth Profile
* Edit Birth Profile
* Delete confirmation
* requirement warning
* focused configuration

---

# 64. Birth Profile Wizard

The Birth Profile wizard uses a modal/dialog-based experience.

The visual hierarchy is:

```text
Wizard Header
        ↓
Step Indicator
        ↓
Current Step
        ↓
Input
        ↓
Navigation Actions
```

Three conceptual steps:

```text
1. Birth Date
2. Birth Place
3. Name & Relationship
```

---

# 65. Forms

Forms should prioritize:

```text
Label
Input
Helper Text
Validation
Error
Action
```

Validation messages should appear close to the relevant field.

---

# 66. Form Validation

Validation must be understandable.

Bad:

```text
Invalid input.
```

Preferred:

```text
Birth date is required.
```

or:

```text
Please select a birth place.
```

Errors should tell the user what needs to change.

---

# 67. Buttons

Button hierarchy must be consistent.

Conceptually:

```text
Primary
→ main action

Secondary
→ supporting action

Tertiary/Text
→ low-emphasis action

Destructive
→ irreversible or dangerous action
```

---

# 68. Primary Action

Every major interaction should have a visually identifiable primary action.

Examples:

```text
Create Profile
Save Profile
Generate Chart
```

The interface should avoid multiple visually dominant actions competing with each other.

---

# 69. Destructive Actions

Destructive actions must be visually distinguishable.

Examples:

```text
Delete Birth Profile
Logout
```

Deletion should require appropriate confirmation.

---

# 70. Menus

Menus should provide contextual actions without cluttering the main interface.

Profile menu may contain:

```text
Birth Data
Settings
Logout
```

Menu items should use clear labels.

---

# 71. Snackbar and Feedback

Transient feedback may be used for non-critical actions.

Examples:

```text
Profile saved.
Profile deleted.
Settings updated.
```

Critical errors should not rely solely on transient feedback.

---

# 72. Empty States

Empty states should explain:

```text
What is empty?
Why is it empty?
What can the user do?
```

Example:

```text
Birth Data

No birth data yet.

Create a birth profile to use it for
your metaphysical charts.

[Create New]
```

---

# 73. Error States

Error states should communicate:

```text
What happened
What can be done
Whether retry is possible
```

Example:

```text
Unable to generate chart.

The selected birth data could not be processed.

[Try Again]
[Edit Birth Data]
```

---

# 74. Requirement Errors

System-specific requirements must be communicated before generation when possible.

Example:

```text
Birth time required

Human Design requires a known birth time.

[Edit Birth Data]
[Choose Another Profile]
[Cancel]
```

The interface must not silently substitute missing information.

---

# 75. Accessibility

Accessibility is a mandatory design requirement.

The design system must support:

* keyboard navigation
* visible focus
* semantic HTML
* accessible names
* readable contrast
* sufficient touch target sizes
* form labels
* error association
* screen-reader compatibility
* reduced motion

---

# 76. Keyboard Interaction

All interactive elements must be reachable through keyboard navigation.

Focus order should follow the logical visual order.

Keyboard users must not become trapped in unexpected interface regions.

---

# 77. Touch Interaction

Interactive controls should provide comfortable touch targets.

Mobile interfaces should not require precision tapping for essential actions.

---

# 78. Screen Reader Considerations

Important visual information must have meaningful semantic equivalents.

For example:

```text
Chart visualization
```

should not be the only source of critical information.

Supporting textual information should exist where appropriate.

---

# 79. Density

The interface should avoid excessive information density.

For complex systems, information may be dense by necessity, but hierarchy must remain clear.

Use:

```text
Grouping
Spacing
Typography
Tabs
Sections
Progressive disclosure
```

to manage complexity.

---

# 80. Progressive Disclosure

Complex information should not be displayed all at once unless necessary.

Example:

```text
Chart Summary
      ↓
Primary Interpretation
      ↓
Detailed Interpretation
      ↓
Technical Details
```

This allows beginners and advanced users to consume the same system at different depths.

---

# 81. Metaphysical Visual Language

Metaphysical imagery should be used as a supporting layer.

Possible visual motifs:

```text
Celestial bodies
Geometric structures
Constellations
Symbolic diagrams
Astronomical textures
Abstract cosmic forms
```

The visual language must remain controlled.

---

# 82. Decorative Elements

Decorative elements may be used in:

* Home
* system introductions
* major result headers
* empty states
* educational illustrations

They should be minimized inside:

* forms
* settings
* data management
* validation
* dense information interfaces

---

# 83. Gradients

Gradients may be used as expressive visual elements.

They should not become the default treatment of every component.

Good use:

```text
Hero background
Major visual atmosphere
Special illustration
```

Poor use:

```text
Every card
Every button
Every border
Every text heading
```

---

# 84. Glass and Transparency

Transparent or glass-like surfaces may be used selectively.

They should not become the global component style.

Material 3 surface hierarchy should remain understandable even when transparency is used.

---

# 85. Component Hierarchy

The design system defines three component levels.

```text
Level 1
Material Components

Level 2
Metaphysica Shared Components

Level 3
System-Specific Components
```

---

# 86. Material Components

These are standard interface primitives such as:

* Button
* Icon Button
* Text Field
* Select
* Checkbox
* Radio
* Switch
* Card
* Dialog
* Menu
* Tabs
* Chip
* Tooltip
* Snackbar
* Progress Indicator

Implementation target:

```text
MUI
```

---

# 87. Shared Metaphysica Components

Examples:

```text
BirthProfileCard
SystemSelector
AstrologyChartSelector
GenerationConfiguration
GenerationStatus
ResultHeader
LibraryContentCard
ProfileMenu
EmptyState
RequirementWarning
```

These components combine Material primitives into product-specific patterns.

---

# 88. System-Specific Components

Examples:

```text
AstrologyChartWheel
HumanDesignBodygraph
NumerologyMatrix
BaZiPillars
ZiWeiPalacesGrid
TzolkinOracle
```

These components belong to their respective system modules.

They must not be placed into the generic UI component layer.

---

# 89. Component Styling Principle

Component styling should follow:

```text
Design Tokens
      ↓
Material 3 Theme
      ↓
MUI Components
      ↓
Metaphysica Shared Components
      ↓
System Components
```

Avoid independent styling systems for every feature.

---

# 90. Theme Architecture

The application should have a centralized theme.

Conceptually:

```text
Metaphysica Theme
│
├── Color Tokens
├── Typography Tokens
├── Shape Tokens
├── Spacing Tokens
├── Component Overrides
└── Responsive Rules
```

Components should consume the theme rather than hardcoding global visual values.

---

# 91. Theme Variants

If multiple themes are supported:

```text
Theme
├── Dark
└── Light
```

Both must implement the same semantic roles.

Future variants may be added without changing component structure.

---

# 92. Component Overrides

MUI component defaults may be adapted to the Metaphysica design language.

Overrides should be centralized.

Avoid scattered component-specific global overrides throughout the application.

---

# 93. Design Token Naming

Tokens should use semantic names.

Preferred:

```text
color.primary
color.surface
color.onSurface
shape.medium
spacing.md
elevation.level1
```

Avoid names tied to arbitrary colors:

```text
purpleButton
blueCard
darkBox
```

---

# 94. Design System Dependency Model

The design dependency should flow downward:

```text
Design Tokens
      ↓
Theme
      ↓
Material Components
      ↓
Shared Components
      ↓
System Components
      ↓
Pages
```

Pages should not redefine the design system.

---

# 95. Page-Level Design Rules

Pages are responsible for composition.

Pages should not define:

* new global colors
* new typography systems
* arbitrary shape systems
* unrelated spacing scales

If a new visual pattern is needed repeatedly, it should become part of the design system.

---

# 96. Consistency Rule

If two screens perform similar tasks, their visual interaction model should remain consistent.

For example:

```text
Create Profile
Edit Profile
```

should use compatible form patterns.

Likewise:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

should share the same generation interaction framework even though their result visualizations differ.

---

# 97. Extensibility

The design system must support future additions without requiring redesign of the entire product.

Future additions may include:

* additional Astrology chart types
* new metaphysical systems
* new Library categories
* new result visualizations
* comparison tools
* multi-profile analysis
* additional themes

New features should consume existing design tokens and components whenever possible.

---

# 98. Anti-Patterns

The following patterns are prohibited unless specifically justified.

### 98.1 Random styling

```text
Page A → 24px radius
Page B → 17px radius
Page C → 31px radius
```

---

### 98.2 Hardcoded colors

```text
color: #7B2FFF
```

inside arbitrary components when a semantic theme token exists.

---

### 98.3 Component-specific design systems

Every feature must not create its own:

* button style
* typography
* spacing
* card style
* color palette

---

### 98.4 Decorative overload

Avoid:

```text
Glow
+
Particles
+
Gradient
+
Blur
+
Animation
+
Neon
```

all applied simultaneously without functional purpose.

---

### 98.5 Material imitation without Material principles

Simply adding rounded corners and shadows does not constitute Material 3.

The system must apply:

* semantic color
* hierarchy
* state
* accessibility
* interaction
* responsive behavior

---

# 99. Design Quality Criteria

A screen is considered visually aligned with Metaphysica when:

* Material 3 principles are recognizable
* hierarchy is immediately understandable
* interactive states are clear
* semantic colors are used correctly
* typography is consistent
* spacing is systematic
* components behave consistently
* metaphysical identity is visible
* decoration does not overpower content
* responsive behavior is intentional
* accessibility requirements are respected

---

# 100. Design System Definition of Done

The design system is considered complete when:

* [ ] Material 3 is established as the foundation
* [ ] semantic color roles are defined
* [ ] dark theme rules are defined
* [ ] light theme rules are defined if supported
* [ ] typography hierarchy is defined
* [ ] spacing system is defined
* [ ] shape system is defined
* [ ] elevation principles are defined
* [ ] interaction states are defined
* [ ] motion principles are defined
* [ ] iconography rules are defined
* [ ] responsive principles are defined
* [ ] accessibility principles are defined
* [ ] Material component usage is defined
* [ ] shared Metaphysica component principles are defined
* [ ] system-specific visualization principles are defined
* [ ] theme architecture is defined
* [ ] design token principles are defined
* [ ] anti-patterns are documented
* [ ] extensibility rules are documented

---

# 101. Relationship With UI Component Specification

This document defines **what the design system is**.

The next document defines **how individual UI components should behave and be structured**.

Therefore:

```text
07-design-system.md
        ↓
Design rules
        ↓
08-ui-component-spec.md
        ↓
Component specifications
        ↓
09-technical-architecture.md
        ↓
React implementation
```

---

# 102. Relationship With Technical Architecture

The design system does not define:

* React application structure
* routing implementation
* state management implementation
* API architecture
* calculation engine implementation
* database
* deployment
* backend architecture

Those concerns belong to the technical architecture documentation.

The implementation target is:

```text
React
+
TypeScript
+
MUI
+
Material 3 design principles
```

---

# 103. Final Design Model

The complete Metaphysica design model is:

```text
                    METAPHYSICA
                         │
                         ↓
                 GOOGLE MATERIAL 3
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
      Tokens          Components       Principles
        │                │                │
        ↓                ↓                ↓
      Theme          MUI Components   Accessibility
        │                │                │
        └────────────────┼────────────────┘
                         ↓
              METAPHYSICA COMPONENTS
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
       Shared Components      System Components
             │                       │
             ↓                       ↓
        Product UI            Metaphysical UI
             │                       │
             └───────────┬───────────┘
                         ↓
                       Pages
```

---

# 104. Final Principle

Metaphysica should not attempt to compete with Material 3 by inventing an entirely independent interface language.

Instead:

```text
Material 3
provides the system.

Metaphysica
provides the identity.

React + MUI
provide the implementation.
```

The resulting interface should be recognizable as a coherent Material-based product while remaining distinctly Metaphysica.

---

**Next Document:** `08-ui-component-spec.md`
