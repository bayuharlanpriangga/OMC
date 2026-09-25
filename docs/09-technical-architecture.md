# METAPHYSICA

# Technical Architecture Specification

**Document:** `09-technical-architecture.md`
**Version:** 2.0
**Status:** Specification
**Framework:** React
**Language:** TypeScript
**UI Framework:** MUI
**Design Foundation:** Google Material 3
**Architecture Style:** Feature + Domain Oriented

---

# 1. Purpose

This document defines the technical architecture of Metaphysica.

It translates the conceptual architecture defined in:

* `05-data-model.md`
* `06-system-architecture.md`
* `07-design-system.md`
* `08-ui-component-spec.md`

into an implementation-oriented architecture for a React and TypeScript application.

This document defines:

* application structure
* source-code organization
* architectural layers
* dependency rules
* domain boundaries
* feature boundaries
* system module architecture
* calculation architecture
* state management principles
* routing principles
* API boundaries
* UI architecture
* visualization architecture
* validation architecture
* error handling
* testing boundaries
* extensibility rules

This document does not define:

* exact database schema implementation
* backend infrastructure
* deployment infrastructure
* production secrets
* provider-specific infrastructure configuration

Those concerns may be specified separately when the backend architecture is finalized.

---

# 2. Technology Foundation

The implementation foundation is:

```text
Framework
└── React

Language
└── TypeScript

UI
└── MUI

Design Language
└── Google Material 3

Application Architecture
└── Feature + Domain Oriented

Forms
└── React-based form architecture

State
└── Local state + feature/application state as required

Routing
└── React-compatible routing solution

Calculation
└── System-specific calculation modules
```

The architecture must avoid coupling the domain model to a specific UI library.

---

# 3. Architectural Goals

The technical architecture must support:

1. Maintainability
2. Extensibility
3. Separation of concerns
4. Testability
5. System isolation
6. UI consistency
7. Calculation isolation
8. Future metaphysical systems
9. Future Astrology chart types
10. Multiple Birth Profiles
11. Reusable generation workflows

---

# 4. Core Architectural Principle

The most important architectural principle is:

> UI should display domain results, not own domain calculations.

The application should follow:

```text
UI
 ↓
Application
 ↓
Domain
 ↓
Infrastructure
```

The dependency direction must not be reversed.

---

# 5. High-Level Architecture

```text
                         METAPHYSICA
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
           React UI       Application        Domain
              │           Services           Logic
              │               │               │
              └───────────────┼───────────────┘
                              ↓
                       Infrastructure
                              │
                              ↓
                    External Systems / APIs
```

---

# 6. Architectural Layers

Metaphysica uses four conceptual layers.

```text
Layer 1
Presentation

Layer 2
Application

Layer 3
Domain

Layer 4
Infrastructure
```

---

# 7. Presentation Layer

The Presentation Layer contains:

* pages
* layouts
* UI components
* forms
* visualization components
* interaction state
* view models

Responsibilities:

```text
Render
Receive user input
Display state
Trigger application actions
```

The Presentation Layer must not contain complex metaphysical calculations.

---

# 8. Application Layer

The Application Layer coordinates workflows.

Examples:

```text
Generate Chart
Create Birth Profile
Edit Birth Profile
Delete Birth Profile
Select System
Validate Generation
Load Library Content
```

The Application Layer answers:

> What should happen?

It does not answer:

> How does an individual metaphysical system calculate its result?

---

# 9. Domain Layer

The Domain Layer contains product concepts and system-specific logic.

Examples:

```text
BirthProfile
GenerationRequest
GenerationResult
System
AstrologyChartType
SystemRequirement
CalculationResult
```

System-specific calculation logic belongs inside its corresponding domain module.

---

# 10. Infrastructure Layer

Infrastructure handles external concerns such as:

* API clients
* persistence
* authentication provider
* location services
* external calculation services
* browser storage
* backend communication

Infrastructure must not define product rules that belong in the Domain Layer.

---

# 11. Dependency Direction

The preferred dependency direction is:

```text
Presentation
      ↓
Application
      ↓
Domain
      ↓
Infrastructure
```

Lower layers must not depend on higher-level UI implementation.

For example:

```text
Domain
X → React Component

Domain
X → MUI

Calculation
X → Browser UI
```

---

# 12. Recommended Source Structure

The application should use a feature and domain oriented structure.

```text
src/
├── app/
│   ├── App.tsx
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── birth-data/
│   ├── generation/
│   ├── library/
│   ├── profile/
│   └── settings/
│
├── systems/
│   ├── astrology/
│   ├── human-design/
│   ├── numerology/
│   ├── bazi/
│   ├── zi-wei-dou-shu/
│   └── tzolkin/
│
├── domain/
│   ├── birth-data/
│   ├── generation/
│   ├── systems/
│   └── library/
│
├── services/
├── hooks/
├── types/
├── utils/
├── theme/
└── assets/
```

This structure may evolve during implementation, but the architectural boundaries must remain.

---

# 13. Application Directory

`app/` contains application-wide composition.

Example:

```text
app/
├── App.tsx
├── router/
├── providers/
└── layouts/
```

Responsibilities include:

* application bootstrap
* global providers
* routing
* global layout
* theme initialization

Application bootstrap must not contain system calculation logic.

---

# 14. Providers

Global providers may include:

```text
Theme Provider
Router Provider
Authentication Provider
Application State Provider
Query/Data Provider
```

Only providers that are actually required should be introduced.

Avoid creating global providers simply because they are available.

---

# 15. Components Directory

The `components/` directory contains broadly reusable UI.

```text
components/
├── ui/
└── shared/
```

---

# 16. UI Components

`components/ui/` contains low-level reusable UI patterns.

Examples:

```text
Button
Dialog
FormField
EmptyState
LoadingState
ErrorState
```

These components should remain domain-light.

---

# 17. Shared Components

`components/shared/` contains reusable Metaphysica patterns.

Examples:

```text
AppShell
PageHeader
BirthProfileCard
SystemSelector
GenerationStatus
ResultHeader
LibraryContentCard
```

These components may understand Metaphysica concepts, but should not own calculation logic.

---

# 18. Feature Directory

Features represent user-facing product capabilities.

```text
features/
├── birth-data/
├── generation/
├── library/
├── profile/
└── settings/
```

A feature may contain:

```text
components/
hooks/
services/
types/
utils/
pages/
```

only where needed.

Do not create empty folders simply to satisfy a template.

---

# 19. Birth Data Feature

The Birth Data feature owns user interaction around Birth Profiles.

Possible structure:

```text
features/birth-data/
├── components/
│   ├── BirthProfileCard.tsx
│   ├── BirthProfileManager.tsx
│   └── BirthProfileWizard.tsx
├── hooks/
├── pages/
└── services/
```

---

# 20. Birth Data Domain

The domain representation belongs separately:

```text
domain/birth-data/
├── entities/
├── types/
├── validators/
└── rules/
```

The domain defines what a Birth Profile means.

The feature defines how users interact with it.

---

# 21. Generation Feature

The Generation feature coordinates the user-facing generation workflow.

```text
features/generation/
├── components/
├── hooks/
├── pages/
├── state/
└── services/
```

It may contain:

```text
SystemSelector
ProfileSelector
GenerationConfiguration
GenerationStatus
GenerationError
ResultContainer
```

---

# 22. Generation Domain

Generation domain concepts include:

```text
GenerationRequest
GenerationConfiguration
GenerationResult
GenerationStatus
SystemRequirement
```

The domain should not depend on React.

---

# 23. Library Feature

The Library feature owns educational content discovery and presentation.

```text
features/library/
├── components/
├── pages/
├── hooks/
└── services/
```

Library content is independent from Birth Data.

---

# 24. Profile Feature

Profile owns user-level account interactions.

Examples:

```text
Profile Menu
Account Information
Birth Data Entry Point
Settings Entry Point
Logout
```

Birth Data itself remains a separate domain/feature.

---

# 25. Settings Feature

Settings owns application preferences.

Possible settings include:

```text
Theme
Language
Display preferences
Other application preferences
```

Settings should not contain Birth Profile data.

---

# 26. Systems Directory

The `systems/` directory contains metaphysical system implementations.

```text
systems/
├── astrology/
├── human-design/
├── numerology/
├── bazi/
├── zi-wei-dou-shu/
└── tzolkin/
```

Each system should be isolated.

---

# 27. System Module Structure

A system module may contain:

```text
systems/<system>/
├── calculation/
├── configuration/
├── domain/
├── registry/
├── visualization/
└── index.ts
```

Not every system must contain every directory.

Only create structures that the system actually requires.

---

# 28. System Boundary

Each system must have a clear boundary.

For example:

```text
Astrology
X → directly manipulates Human Design calculation

Human Design
X → directly manipulates BaZi calculation
```

Cross-system behavior must be coordinated through shared application/domain contracts.

---

# 29. System Contract

Every top-level system should conceptually satisfy a common contract.

```text
MetaphysicalSystem
├── id
├── name
├── requirements
├── configuration
├── validate()
├── generate()
└── result mapping
```

The exact TypeScript interface may evolve during implementation.

---

# 30. System Registry

The application should use a system registry.

Conceptually:

```text
System Registry
│
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin
```

The registry provides system discovery without hardcoding every system throughout the application.

---

# 31. Generation Orchestrator

The Generation Orchestrator coordinates the generation workflow.

```text
User
 ↓
Generation Feature
 ↓
Generation Orchestrator
 ↓
System Registry
 ↓
Selected System
 ↓
Validation
 ↓
Configuration
 ↓
Calculation
 ↓
Result
```

---

# 32. Generation Orchestrator Responsibilities

The orchestrator may handle:

* selecting the system
* resolving the system module
* validating requirements
* preparing input
* invoking calculation
* normalizing the result
* returning generation status

It must not contain every system's calculation algorithm.

---

# 33. Anti-Pattern: Giant Calculator

The application must not create a single service such as:

```text
metaphysical-calculator.ts
```

containing:

```text
calculateAstrology()
calculateHumanDesign()
calculateNumerology()
calculateBaZi()
calculateZiWei()
calculateTzolkin()
```

This creates a God Service.

---

# 34. Preferred Calculation Architecture

Use system-specific calculation modules.

```text
Generation Orchestrator
        ↓
System Registry
        ↓
┌──────────────┬──────────────┬──────────────┐
Astrology      Human Design   Numerology
Calculation    Calculation    Calculation
        │
        ├──────────────┐
        ↓              ↓
      BaZi       Zi Wei Dou Shu
                    Calculation
        │
        ↓
      Tzolkin
      Calculation
```

---

# 35. Calculation Boundary

Calculation modules should receive structured input and return structured output.

Conceptually:

```text
Calculation Input
        ↓
System Calculator
        ↓
Calculation Result
```

The calculator should not directly manipulate React components.

---

# 36. Calculation Result

Calculation results should be independent from visual rendering.

Example:

```text
Calculation Result
        ↓
Result Mapper
        ↓
Visualization View Model
        ↓
React Component
```

---

# 37. Visualization Boundary

Visualization components should render data.

They should not calculate domain values.

Bad:

```text
AstrologyChartWheel
→ calculate planetary positions
```

Preferred:

```text
Astrology Calculator
→ planetary positions

Chart Mapper
→ wheel coordinates / visualization data

AstrologyChartWheel
→ render
```

---

# 38. Astrology Architecture

Astrology is a top-level system containing chart modules.

```text
systems/astrology/
├── charts/
│   ├── natal/
│   ├── draconic/
│   ├── solar-return/
│   ├── lunar-return/
│   └── progressed/
│
├── calculation/
├── configuration/
└── visualization/
```

---

# 39. Astrology Chart Registry

Astrology chart types should use a chart registry.

```text
Astrology
    ↓
Chart Registry
    ├── Natal
    ├── Draconic
    ├── Solar Return
    ├── Lunar Return
    ├── Progressed
    └── Future Chart Types
```

This prevents chart types from becoming hardcoded branches throughout the application.

---

# 40. Astrology Chart Module Contract

Each chart type should conceptually provide:

```text
Chart Module
├── id
├── name
├── requirements
├── configuration
├── validate()
├── calculate()
└── mapResult()
```

---

# 41. Adding a New Astrology Chart Type

Adding a future chart type should primarily require:

```text
1. Create chart module
2. Define requirements
3. Define configuration
4. Implement calculation
5. Implement result mapping
6. Register chart
7. Add visualization if required
```

The core Generation Orchestrator should not need major modification.

---

# 42. Other System Modules

Human Design:

```text
systems/human-design/
├── calculation/
├── configuration/
└── visualization/
```

Numerology:

```text
systems/numerology/
├── calculation/
├── configuration/
└── visualization/
```

BaZi:

```text
systems/bazi/
├── calculation/
├── configuration/
└── visualization/
```

Zi Wei Dou Shu:

```text
systems/zi-wei-dou-shu/
├── calculation/
├── configuration/
└── visualization/
```

Tzolkin:

```text
systems/tzolkin/
├── calculation/
├── configuration/
└── visualization/
```

---

# 43. Domain Types

Shared domain types should live in appropriate domain modules.

Examples:

```text
BirthProfile
BirthTime
BirthPlace
GenerationRequest
GenerationResult
System
SystemRequirement
```

Avoid placing every type into one giant:

```text
types.ts
```

file.

---

# 44. Type Organization

Preferred:

```text
domain/
├── birth-data/
│   └── types/
├── generation/
│   └── types/
├── systems/
│   └── types/
└── library/
    └── types/
```

System-specific types belong inside the relevant system.

---

# 45. Birth Time Type

The architecture must distinguish:

```text
Known
Unknown
```

Conceptually:

```text
BirthTime
├── known: true
│   └── time
│
└── known: false
    └── null
```

Unknown must never be represented by a fake time.

---

# 46. System Requirement Validation

Requirements must be system-aware.

Example:

```text
Human Design
→ birth time required
```

Another system may allow:

```text
birth time unknown
```

The application must ask the selected system rather than globally assuming every system has identical requirements.

---

# 47. Validation Architecture

Validation should exist at multiple levels.

```text
Input Validation
        ↓
Domain Validation
        ↓
System Requirement Validation
        ↓
Calculation Validation
```

---

# 48. Input Validation

UI validation handles immediate user errors.

Examples:

```text
Required field
Invalid date
Missing place
Invalid profile name
```

---

# 49. Domain Validation

Domain validation handles business rules.

Examples:

```text
BirthProfile must have valid date
BirthPlace must contain required location data
Unknown time must be represented explicitly
```

---

# 50. System Validation

System validation handles system-specific requirements.

Example:

```text
Human Design
→ known birth time required
```

---

# 51. Calculation Validation

Calculation modules may validate whether their required structured input is valid before calculation.

Calculation failures should produce structured errors.

---

# 52. Error Architecture

Errors should be categorized.

```text
Error
├── Input Error
├── Domain Error
├── Requirement Error
├── Calculation Error
├── Infrastructure Error
└── Unknown Error
```

---

# 53. Error Translation

Internal technical errors should not automatically be displayed to users.

Example internal error:

```text
CalculationDependencyException
```

User-facing result:

```text
We couldn't generate this chart.
Please try again.
```

Detailed technical information may be logged separately.

---

# 54. Loading Architecture

Loading state should exist at the appropriate scope.

```text
Application Loading
Feature Loading
Component Loading
Generation Loading
```

Do not block the entire application when only one component is loading.

---

# 55. State Architecture

State should be divided according to ownership.

```text
Local UI State
        ↓
Feature State
        ↓
Application State
        ↓
Server / Persistent State
```

---

# 56. Local UI State

Examples:

```text
Dialog open/closed
Selected tab
Input focus
Temporary form value
Expanded section
```

Keep these local whenever possible.

---

# 57. Feature State

Examples:

```text
Birth Profile selection
Generation configuration
Library filters
Generation status
```

Feature state should remain within the feature unless another part of the application genuinely needs it.

---

# 58. Application State

Application-wide state may include:

```text
Authenticated user
Theme
Global preferences
Current application context
```

Only truly global state belongs here.

---

# 59. Server State

Server-owned data should be treated separately from UI state.

Examples:

```text
Birth Profiles
Library Content
Generation Results
User Settings
```

The implementation may use a server-state/query solution if needed.

The exact library is intentionally not locked in this document.

---

# 60. State Anti-Pattern

Do not put everything into one global store.

Bad:

```text
GlobalStore
├── modal
├── selectedTab
├── formInput
├── birthProfiles
├── library
├── chartResult
├── theme
├── tooltip
└── every UI state
```

Global state should have clear ownership.

---

# 61. Routing

Routing should reflect product-level navigation.

Conceptually:

```text
/
├── home
├── library
├── generate
└── profile
```

Birth Data may be exposed through the Profile flow rather than requiring a standalone top-level navigation destination.

Exact URL conventions may be finalized during implementation.

---

# 62. Route Responsibility

Routes should compose features.

A route should not become a giant business-logic container.

Preferred:

```text
Route
 ↓
Page
 ↓
Feature Components
 ↓
Application Actions
```

---

# 63. Page vs Feature

Pages answer:

> What screen is being displayed?

Features answer:

> What capability does the user interact with?

This distinction prevents page components from becoming monolithic.

---

# 64. Data Access

Data access should be isolated behind application/infrastructure services.

Components should not directly contain raw API calls.

Bad:

```text
Component
→ fetch(...)
→ transform
→ calculate
→ render
```

Preferred:

```text
Component
 ↓
Application Hook / Action
 ↓
Service
 ↓
Infrastructure
```

---

# 65. Service Boundaries

Services should have focused responsibilities.

Examples:

```text
BirthProfileService
LibraryService
GenerationService
SystemRegistry
```

Avoid services that contain unrelated domains.

---

# 66. Hook Architecture

React hooks may provide feature-level interaction APIs.

Examples:

```text
useBirthProfiles()
useGeneration()
useLibrary()
useSystemSelection()
```

Hooks may coordinate UI state and application actions.

They must not become giant replacements for architecture layers.

---

# 67. Theme Architecture

The theme should be centralized.

Conceptually:

```text
theme/
├── index.ts
├── colors.ts
├── typography.ts
├── shape.ts
├── spacing.ts
└── components.ts
```

The exact file split may vary.

---

# 68. MUI Theme

MUI should consume Metaphysica design tokens.

```text
Metaphysica Tokens
        ↓
MUI Theme
        ↓
MUI Components
        ↓
Shared Components
```

Do not define unrelated colors directly inside individual components when theme tokens exist.

---

# 69. Assets

Assets should be organized according to purpose.

```text
assets/
├── brand/
├── icons/
├── illustrations/
├── backgrounds/
└── system/
```

System-specific visualization assets should remain isolated where practical.

---

# 70. Utility Architecture

`utils/` should contain genuinely generic utilities.

Examples:

```text
date formatting
number formatting
string helpers
small pure transformations
```

Do not place domain logic into `utils/`.

Bad:

```text
utils/calculateAstrology.ts
```

Domain calculation belongs in Astrology.

---

# 71. Repository Dependency Rules

The following dependency direction should be maintained:

```text
components
   ↓
features
   ↓
application/domain
   ↓
infrastructure
```

System modules may expose controlled contracts to the Generation domain/application layer.

---

# 72. Forbidden Dependencies

The following patterns are prohibited:

```text
Domain → React
Domain → MUI
Calculation → React
Calculation → MUI
Visualization → Calculation Engine
UI → Database
UI → raw external API
```

---

# 73. System Isolation Rule

A system must be independently understandable.

For example:

```text
systems/astrology/
```

should contain enough system-specific code to understand the Astrology implementation without searching through unrelated systems.

---

# 74. Cross-System Communication

Systems should communicate through shared contracts rather than directly accessing each other's internals.

Preferred:

```text
Generation
 ↓
System Contract
 ↓
Selected System
```

Avoid:

```text
Astrology
 → HumanDesignService
 → BaZiService
 → NumerologyService
```

unless a future domain feature explicitly requires cross-system analysis.

---

# 75. Multi-Profile Architecture

Generation must not globally assume one Birth Profile.

The architecture must allow:

```text
Generation Request
├── Profile A
```

and future operations such as:

```text
Generation Request
├── Profile A
└── Profile B
```

This allows future features such as comparison, compatibility, synastry, or relationship-oriented calculations.

---

# 76. Generation Request

Conceptually:

```text
GenerationRequest
├── systemId
├── profileIds[]
└── configuration
```

The exact type belongs to the domain model.

---

# 77. Generation Result Isolation

A generated result should represent a specific generation operation.

Conceptually:

```text
GenerationResult
├── request
├── system
├── configuration
├── calculatedData
└── presentationData
```

Results should not silently change when the source Birth Profile changes.

---

# 78. Result Snapshot Principle

A result should be treated as a snapshot of the generation operation.

```text
Birth Profile
      ↓
Generation
      ↓
Result Snapshot
```

Future changes to the profile should not retroactively alter an already generated result.

---

# 79. Result Mapping

System calculations should not return UI-specific structures unnecessarily.

Preferred:

```text
Calculation Result
        ↓
Result Mapper
        ↓
UI View Model
```

This allows visualization to evolve independently of calculation.

---

# 80. Example: Astrology

```text
Birth Profile
      ↓
Generation Request
      ↓
Astrology Registry
      ↓
Natal Chart Module
      ↓
Calculation
      ↓
Natal Calculation Result
      ↓
Chart View Model
      ↓
AstrologyChartWheel
```

---

# 81. Example: Human Design

```text
Birth Profile
      ↓
Generation Request
      ↓
Human Design Module
      ↓
Requirement Validation
      ↓
Calculation
      ↓
Bodygraph Result
      ↓
Bodygraph View Model
      ↓
HumanDesignBodygraph
```

---

# 82. Example: BaZi

```text
Birth Profile
      ↓
Generation Request
      ↓
BaZi Module
      ↓
Calculation
      ↓
Pillars Result
      ↓
Visualization Mapper
      ↓
BaZiPillars
```

---

# 83. Testing Architecture

Testing should exist at multiple levels.

```text
Unit Tests
Integration Tests
Feature Tests
Component Tests
End-to-End Tests
```

---

# 84. Domain Unit Tests

Calculation modules should have strong unit test coverage.

Examples:

```text
Astrology calculation
Human Design calculation
Numerology calculation
BaZi calculation
Zi Wei Dou Shu calculation
Tzolkin calculation
```

Domain rules should be tested independently from React.

---

# 85. Component Tests

Component tests should verify:

* rendering
* interaction
* states
* accessibility
* validation
* responsive behavior where practical

---

# 86. Feature Tests

Feature tests should verify workflows.

Example:

```text
Create Birth Profile
→ Save
→ Select
→ Generate
```

---

# 87. End-to-End Tests

Critical user journeys should be tested end-to-end.

Examples:

```text
Create Birth Profile
Generate Astrology Natal Chart
Generate Human Design with known time
Handle missing Human Design birth time
Browse Library
Edit Birth Profile
Delete Birth Profile
```

---

# 88. Testing Rule

Calculation correctness must not depend on visual component tests.

Likewise, visual rendering tests must not be responsible for validating complex metaphysical algorithms.

---

# 89. Performance Architecture

Performance considerations include:

* lazy loading
* route-level code splitting
* system-level code splitting
* visualization optimization
* memoization where justified
* avoiding unnecessary global rerenders

---

# 90. System-Level Code Splitting

Metaphysical systems can be loaded independently where practical.

Conceptually:

```text
Initial Application
        ↓
Core UI
        ↓
Selected System
        ↓
Load System Module
```

This prevents every system's calculation and visualization code from being unnecessarily loaded at application startup.

---

# 91. Visualization Performance

Complex visualizations may require:

* memoization
* selective rendering
* canvas/SVG optimization
* virtualization where appropriate
* controlled updates

Visualization optimization must not compromise correctness.

---

# 92. Security Boundary

The frontend must not be treated as a trusted security boundary.

Sensitive validation and authorization must be enforced by the backend when applicable.

Client-side validation exists primarily for usability.

---

# 93. Authentication Boundary

Authentication should be abstracted from feature components.

Preferred:

```text
Authentication Provider
        ↓
Application Session
        ↓
Features
```

Components should not implement authentication protocol details.

---

# 94. Persistence Boundary

Persistence should be accessed through an abstraction.

```text
Feature
 ↓
Application Service
 ↓
Repository / API Client
 ↓
Persistence
```

The UI must not depend directly on database implementation.

---

# 95. Location Data Architecture

Birth Place selection may require an external location provider.

The architecture should separate:

```text
Location Search
        ↓
Location Result
        ↓
Birth Place
```

The Birth Profile should store the normalized location data required by the application rather than relying permanently on a provider-specific UI object.

---

# 96. Configuration Architecture

System-specific configuration should remain isolated.

Example:

```text
Astrology Configuration
        ≠
Human Design Configuration
```

The generic Generation workflow should only know that configuration exists.

The selected system defines its actual configuration requirements.

---

# 97. Extensibility: New Top-Level System

Adding a new system should involve:

```text
1. Create system module
2. Define domain types
3. Define requirements
4. Define configuration
5. Implement calculation
6. Implement result mapping
7. Implement visualization
8. Register system
9. Add feature UI where required
10. Add tests
```

Existing systems should not require major modification.

---

# 98. Extensibility: New Astrology Chart

Adding a new Astrology chart type should involve:

```text
1. Create chart module
2. Define requirements
3. Define configuration
4. Implement calculation
5. Implement result mapping
6. Register chart type
7. Implement visualization
8. Add tests
```

The main Astrology architecture should remain stable.

---

# 99. Technical Anti-Patterns

The following patterns are prohibited.

## 99.1 God Service

One service containing every system calculation.

---

## 99.2 God Component

One React component containing:

* routing
* API calls
* calculation
* forms
* state
* visualization

---

## 99.3 Generic Utils Dump

A huge `utils/` folder containing unrelated domain logic.

---

## 99.4 Global State Dump

Putting all application and UI state into one global store.

---

## 99.5 UI-Driven Domain Logic

Calculation logic embedded in React components.

---

## 99.6 System Leakage

Astrology internals directly imported into unrelated system modules.

---

## 99.7 Hardcoded System Branches

Avoid repeated structures such as:

```text
if system === "astrology"
else if system === "human-design"
else if system === "bazi"
...
```

throughout the entire application.

Use registries and contracts.

---

# 100. Implementation Sequence

Implementation should generally follow:

```text
1. Application Shell
        ↓
2. Theme
        ↓
3. Shared UI Components
        ↓
4. Domain Models
        ↓
5. Birth Data
        ↓
6. Generation Architecture
        ↓
7. System Registry
        ↓
8. System Modules
        ↓
9. Visualization
        ↓
10. Library
        ↓
11. Settings
        ↓
12. Testing
```

Actual roadmap sequencing is defined separately in `10-roadmap.md`.

---

# 101. Architecture Definition of Done

The technical architecture is considered complete when:

* [ ] React is established as the application framework
* [ ] TypeScript is established as the language
* [ ] MUI is established as the UI implementation foundation
* [ ] Material 3 is established as the design foundation
* [ ] layer boundaries are defined
* [ ] source structure is defined
* [ ] feature boundaries are defined
* [ ] domain boundaries are defined
* [ ] system boundaries are defined
* [ ] System Registry architecture is defined
* [ ] Generation Orchestrator is defined
* [ ] calculation architecture is defined
* [ ] Astrology Chart Registry is defined
* [ ] visualization boundary is defined
* [ ] state ownership principles are defined
* [ ] routing principles are defined
* [ ] validation architecture is defined
* [ ] error architecture is defined
* [ ] testing architecture is defined
* [ ] performance principles are defined
* [ ] extensibility rules are defined
* [ ] anti-patterns are documented

---

# 102. Complete Architecture

The complete technical architecture is:

```text
                              METAPHYSICA
                                   │
                                   ↓
                           React + TypeScript
                                   │
                ┌──────────────────┼──────────────────┐
                ↓                  ↓                  ↓
           Presentation       Application          Domain
                │                  │                  │
                │                  ↓                  │
                │          Generation Orchestrator   │
                │                  │                  │
                │                  ↓                  │
                │            System Registry         │
                │                  │                  │
                │       ┌──────────┼──────────┐       │
                │       ↓          ↓          ↓       │
                │   Astrology   Human       Other    │
                │               Design      Systems  │
                │       │          │          │       │
                │       ↓          ↓          ↓       │
                │   Calculation Modules              │
                │              │                      │
                │              ↓                      │
                │        Calculation Result           │
                │              │                      │
                │              ↓                      │
                │         Result Mapper               │
                │              │                      │
                ↓              ↓                      │
          React Visualization Components             │
                │                                     │
                └─────────────────────────────────────┘
                                  │
                                  ↓
                           Infrastructure
                                  │
                   ┌──────────────┼──────────────┐
                   ↓              ↓              ↓
                 API         Persistence     External Services
```

---

# 103. Final Architectural Principles

The architecture follows these fundamental rules:

```text
1. React renders the interface.
2. MUI provides the Material component foundation.
3. Material 3 defines the design language.
4. Features represent user-facing capabilities.
5. Domains represent product rules.
6. Systems own their metaphysical logic.
7. Generation coordinates systems.
8. Registries provide extensibility.
9. Calculations never belong inside UI components.
10. Visualizations render results rather than calculate them.
11. Birth Data remains reusable and system-agnostic.
12. Generation results remain isolated snapshots.
13. Global state is used only when genuinely global.
14. New systems should not require rewriting the core generation engine.
15. New Astrology chart types should not require rewriting the core Astrology architecture.
```

---

# 104. Final Technical Model

The final technical model is:

```text
                        REACT APPLICATION
                              │
                              ↓
                         APP SHELL
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
          Features         Shared UI       Theme / MUI
              │               │               │
              └───────────────┼───────────────┘
                              ↓
                         APPLICATION
                              │
                    Generation Orchestrator
                              │
                       System Registry
                              │
        ┌─────────────┬───────┴───────┬─────────────┐
        ↓             ↓               ↓             ↓
    Astrology    Human Design     Numerology      BaZi
        │             │               │             │
        └─────────────┴───────┬───────┴─────────────┘
                              ↓
                       System Calculation
                              │
                              ↓
                       Calculation Result
                              │
                              ↓
                        Result Mapper
                              │
                              ↓
                     Visualization Layer
                              │
                              ↓
                         React UI
```

The architecture is intentionally modular so that Metaphysica can grow from six initial metaphysical systems into a larger platform without turning the application core into a collection of system-specific conditionals.

---

**Next Document:** `10-roadmap.md`
