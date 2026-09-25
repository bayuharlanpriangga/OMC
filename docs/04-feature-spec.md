# Metaphysica

## Feature Specification

**Document:** 04-feature-spec.md
**Version:** 1.1
**Status:** Product Feature Definition

---

# 1. Purpose

This document defines the functional features of Metaphysica.

It describes:

* what each feature does;
* who or what it interacts with;
* required inputs;
* expected outputs;
* business rules;
* validation rules;
* states;
* dependencies;
* boundaries between features;
* acceptance criteria.

This document is intentionally product-focused.

Technical implementation details such as framework structure, database technology, API architecture, folder structure, and specific libraries belong to later technical documents.

---

# 2. Product Feature Architecture

Metaphysica is organized around several major feature domains.

```text
METAPHYSICA
│
├── Navigation & Shell
│
├── Home
│
├── Profile
│   ├── Account
│   ├── Birth Data
│   └── Settings
│
├── Library
│
├── Chart Generation
│   ├── Birth Data Selection
│   ├── System Selection
│   ├── Validation
│   ├── System Configuration
│   ├── Generation
│   └── Result
│
└── Metaphysical Systems
    ├── Astrology
    │   └── Chart Modules
    ├── Human Design
    ├── Numerology
    ├── BaZi
    ├── Zi Wei Dou Shu
    └── Tzolkin
```

---

# 3. Feature Classification

Features are divided into four levels.

## Level 1: Global Features

Features available across the application.

Examples:

```text
Navigation
Authentication State
Profile Menu
Notifications
Error Handling
```

---

## Level 2: Product Features

Core Metaphysica functionality.

Examples:

```text
Birth Data
Library
Chart Generation
```

---

## Level 3: System Features

Features belonging to a metaphysical system.

Examples:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

---

## Level 4: System Modules

Specialized functionality inside a system.

Example:

```text
Astrology
│
├── Natal Chart
├── Draconic Chart
├── Solar Return
├── Lunar Return
└── Progressed Chart
```

---

# 4. Feature: Application Shell

## Feature ID

```text
F-001
```

## Name

Application Shell

## Purpose

Provides the persistent structural framework around the application.

## Responsibilities

The shell manages:

* global navigation;
* application branding;
* profile access;
* responsive layout;
* global loading state;
* global error boundaries where necessary.

## Does Not Manage

The shell should not contain:

* chart calculation logic;
* birth profile business logic;
* system-specific calculations;
* Library content logic.

## Acceptance Criteria

### AC-001.1: Persistent Shell

**Given** the user is on any primary application page
**When** the page loads
**Then** the global application shell is available according to the page's responsive layout.

### AC-001.2: Global Navigation Access

**Given** the user is on a page where primary navigation is applicable
**When** the page is displayed
**Then** the user can access the primary navigation.

### AC-001.3: Separation of Responsibilities

**Given** the application shell is rendered
**When** system-specific functionality executes
**Then** chart calculation and system-specific business logic are not owned by the shell.

### AC-001.4: Responsive Behavior

**Given** the application is viewed at supported viewport sizes
**When** the viewport changes
**Then** the shell adapts without breaking primary navigation or critical actions.

---

# 5. Feature: Primary Navigation

## Feature ID

```text
F-002
```

## Purpose

Provides access to the main product areas.

Initial navigation:

```text
Home
Library
Profile
```

## Rules

1. Navigation must remain globally accessible where appropriate.
2. Navigation must not expose internal implementation states.
3. System-specific pages do not need to appear as primary navigation items.
4. New metaphysical systems should not automatically require a new primary navigation item.

## Acceptance Criteria

### AC-002.1: Primary Items

**Given** the user can access primary navigation
**When** the navigation is displayed
**Then** Home and Library are available as primary destinations and Profile is available through the profile control.

### AC-002.2: Home Navigation

**Given** the user selects Home
**When** navigation completes
**Then** the user arrives at the Home experience.

### AC-002.3: Library Navigation

**Given** the user selects Library
**When** navigation completes
**Then** the user arrives at the Library experience.

### AC-002.4: No System Explosion

**Given** a new metaphysical system is added
**When** the system becomes available
**Then** the primary navigation does not automatically gain a new navigation item.

---

# 6. Feature: Home

## Feature ID

```text
F-003
```

## Purpose

Introduce the Metaphysica product and provide the main entry point into the generation experience.

## Inputs

No required user data.

## Outputs

User may:

```text
Start Generation
Explore Library
Open Profile
```

## Rules

Home must not become the user's data-management dashboard.

## Acceptance Criteria

### AC-003.1: Home Loads Without Birth Data

**Given** the user has no saved Birth Profile
**When** the Home page loads
**Then** the Home page remains usable.

### AC-003.2: Start Action

**Given** the user is on Home
**When** the user selects Start
**Then** the application enters the chart generation flow.

### AC-003.3: Library Action

**Given** the user is on Home
**When** the user selects Library
**Then** the application navigates to Library.

### AC-003.4: No Dashboard Creep

**Given** the user opens Home
**When** the page renders
**Then** Birth Profile management is not presented as the primary Home experience.

---

# 7. Feature: Profile Menu

## Feature ID

```text
F-004
```

## Purpose

Provide access to user-level functionality.

## Menu

```text
Birth Data
Settings
Logout
```

## Rules

The Profile Menu is a contextual navigation surface.

It does not itself own the underlying functionality.

For example:

```text
Profile Menu
   ↓
Birth Data
   ↓
Birth Data Feature
```

## Acceptance Criteria

### AC-004.1: Menu Opens

**Given** the profile control is available
**When** the user activates it
**Then** the Profile Menu is displayed.

### AC-004.2: Birth Data Access

**Given** the Profile Menu is open
**When** the user selects Birth Data
**Then** the Birth Data experience opens.

### AC-004.3: Settings Access

**Given** the Profile Menu is open
**When** the user selects Settings
**Then** the Settings experience opens.

### AC-004.4: Logout

**Given** the Profile Menu is open
**When** the user selects Logout
**Then** the application executes the defined logout flow.

### AC-004.5: Contextual Surface

**Given** the Profile Menu is closed
**When** the user has not activated the profile control
**Then** the menu is not persistently displayed as page content.

---

# 8. Feature: Birth Data Management

## Feature ID

```text
F-005
```

## Purpose

Allow users to create, store, edit, select, and delete reusable birth profiles.

Birth Data is one of the foundational features of Metaphysica.

## Acceptance Criteria

### AC-005.1: Open Birth Data

**Given** the user opens Profile
**When** the user selects Birth Data
**Then** the Birth Data modal is displayed.

### AC-005.2: Empty State

**Given** the user has no saved Birth Profiles
**When** Birth Data is opened
**Then** the empty state is displayed with an action to create a new profile.

### AC-005.3: Saved Profiles

**Given** the user has one or more saved Birth Profiles
**When** Birth Data is opened
**Then** the saved profiles are displayed.

### AC-005.4: Reusability

**Given** a Birth Profile exists
**When** the user starts a compatible generation flow
**Then** the profile can be selected without recreating its data.

### AC-005.5: System Independence

**Given** a Birth Profile exists
**When** the user uses it with different supported systems
**Then** the same underlying profile can be reused.

---

# 9. Birth Profile Concept

A birth profile represents a person and their birth information.

Conceptually:

```text
Birth Profile
│
├── Identity
│   └── Profile Name
│
├── Birth Date
│
├── Birth Time
│
├── Birth Time Knowledge State
│
├── Birth Place
│
└── Relationship
```

The profile is independent of any metaphysical system.

The system should not store:

```text
Astrology Birth Data
Human Design Birth Data
BaZi Birth Data
```

as separate copies.

Instead:

```text
Birth Profile
      ↓
System
      ↓
System-specific interpretation
```

## Acceptance Criteria

### AC-009.1: System-Agnostic Profile

**Given** a Birth Profile is stored
**When** the profile is inspected
**Then** it does not require a system-specific duplicate representation.

### AC-009.2: Reusable Birth Information

**Given** the same person is used for multiple systems
**When** the user selects the profile
**Then** the same core birth information is reused.

---

# 10. Birth Profile: Required Data

A birth profile must contain:

```text
Profile Name
Birth Date
Birth Place
Who It Is For
```

Birth time is optional at the profile level.

## Acceptance Criteria

### AC-010.1: Required Fields

**Given** the user creates a Birth Profile
**When** a required field is missing
**Then** the profile cannot be saved.

### AC-010.2: Optional Birth Time

**Given** the user does not know the birth time
**When** creating the profile
**Then** the profile can still be saved if all other profile-level requirements are satisfied.

---

# 11. Birth Time State

Birth time has at least two states:

```text
KNOWN
UNKNOWN
```

If known:

```text
birthTime = valid time
```

If unknown:

```text
birthTime = null
birthTimeKnown = false
```

The system must never represent an unknown birth time as:

```text
00:00
```

unless the user explicitly entered midnight.

## Acceptance Criteria

### AC-011.1: Known Time

**Given** the user knows the birth time
**When** the user enters a valid time
**Then** the profile stores the time as a known birth time.

### AC-011.2: Unknown Time

**Given** the user does not know the birth time
**When** the user selects the unknown option
**Then** the profile stores the birth time as unknown.

### AC-011.3: Unknown Is Not Midnight

**Given** the user selects unknown birth time
**When** the profile is saved
**Then** the stored state is not interpreted as `00:00`.

### AC-011.4: Explicit Midnight

**Given** the user explicitly enters `00:00`
**When** the profile is saved
**Then** the system treats it as a known midnight birth time rather than unknown.

---

# 12. Birth Place

Birth Place represents the location associated with the birth event.

A selected location should be capable of containing:

```text
Place Name
Country
Latitude
Longitude
Timezone
```

## Acceptance Criteria

### AC-012.1: Location Selection

**Given** the user is creating a Birth Profile
**When** the user selects a birth location
**Then** the selected location is associated with the profile.

### AC-012.2: Structured Location

**Given** a location requires structured geographic data for downstream calculations
**When** the user saves the profile
**Then** sufficient structured location information is retained.

### AC-012.3: Invalid Location

**Given** the system cannot establish a valid required location
**When** the user attempts to save
**Then** the user is informed that a valid birth place is required.

---

# 13. Birth Profile Relationship

The profile may represent:

```text
Myself
Someone Else
```

The initial product should support at least these two categories.

## Acceptance Criteria

### AC-013.1: Relationship Selection

**Given** the user creates a profile
**When** the user reaches the relationship step
**Then** the user can identify whether the profile represents themselves or someone else.

### AC-013.2: Extensible Relationship Model

**Given** additional relationship categories are introduced later
**When** they are added
**Then** the underlying Birth Profile concept does not require system-specific duplication.

---

# 14. Create Birth Profile

## Feature ID

```text
F-006
```

## Flow

```text
Create New
    ↓
Birth Date
    ↓
Birth Place
    ↓
Name & Relationship
    ↓
Save
```

## Validation

The system must validate each step before allowing completion.

## Acceptance Criteria

### AC-006.1: Start Creation

**Given** Birth Data is open
**When** the user selects Create New
**Then** the three-step creation flow begins.

### AC-006.2: Step Order

**Given** the user is creating a profile
**When** progressing through the wizard
**Then** the steps follow the defined order unless the user navigates backward.

### AC-006.3: Required Validation

**Given** a required field is invalid or missing
**When** the user attempts to continue
**Then** the user remains on the current step and receives actionable validation feedback.

### AC-006.4: Successful Save

**Given** all required profile data is valid
**When** the user selects Save
**Then** the Birth Profile is stored and becomes available in the Birth Data collection.

### AC-006.5: Cancel

**Given** the user is creating a profile
**When** the user cancels
**Then** no incomplete Birth Profile is saved.

---

# 15. Create Profile: Step 1

Fields:

```text
Birth Date
Birth Time
Birth Time Unknown
```

Rules:

* Birth Date is required.
* Birth Time is optional.
* User may explicitly mark birth time as unknown.
* If unknown is selected, the time input must not be interpreted as midnight.
* Invalid dates must be rejected.

## Acceptance Criteria

### AC-015.1: Valid Birth Date

**Given** a valid birth date is entered
**When** the user continues
**Then** the date passes validation.

### AC-015.2: Missing Birth Date

**Given** no birth date is entered
**When** the user continues
**Then** the system prevents progression and identifies the missing required field.

### AC-015.3: Unknown Time

**Given** the user selects unknown birth time
**When** the user continues
**Then** the time field is treated as unknown rather than midnight.

### AC-015.4: Known Time

**Given** the user enters a valid birth time
**When** the user continues
**Then** the time is retained as known.

---

# 16. Create Profile: Step 2

Field:

```text
Birth Place
```

The user should select a location rather than manually entering an arbitrary text string when structured location information is required.

The system should preserve enough location information for downstream calculations.

## Acceptance Criteria

### AC-016.1: Valid Place

**Given** the user selects a valid birth place
**When** the user continues
**Then** the place information is retained for the next step.

### AC-016.2: Missing Place

**Given** no valid birth place has been selected
**When** the user attempts to continue
**Then** progression is blocked and the user is informed that a birth place is required.

### AC-016.3: Location Search

**Given** the user needs to find a location
**When** they use the location search
**Then** they can select a result rather than relying on arbitrary unstructured input.

---

# 17. Create Profile: Step 3

Fields:

```text
Profile Name
Who is this for?
```

Rules:

* Profile Name is required.
* Relationship category is required.
* User should be able to review their entered data before saving.

## Acceptance Criteria

### AC-017.1: Profile Name

**Given** the user enters a valid profile name
**When** they continue or save
**Then** the profile name is retained.

### AC-017.2: Missing Name

**Given** the profile name is empty
**When** the user attempts to save
**Then** saving is blocked.

### AC-017.3: Relationship

**Given** the relationship category has not been selected
**When** the user attempts to save
**Then** saving is blocked.

### AC-017.4: Review

**Given** all three steps contain valid data
**When** the user reaches the final step
**Then** the user can review the information before saving.

---

# 18. Edit Birth Profile

## Feature ID

```text
F-007
```

Users can edit an existing birth profile.

Editable information includes:

```text
Profile Name
Birth Date
Birth Time
Birth Time Knowledge State
Birth Place
Relationship
```

After editing, affected future calculations should use the updated profile data.

Existing generated results should not silently mutate.

## Acceptance Criteria

### AC-007.1: Open Edit

**Given** a saved Birth Profile exists
**When** the user selects Edit
**Then** the edit flow opens with the current values populated.

### AC-007.2: Save Changes

**Given** the user changes valid profile data
**When** the user saves
**Then** the stored Birth Profile reflects the new values.

### AC-007.3: Validation

**Given** an edited required field becomes invalid
**When** the user saves
**Then** saving is blocked and validation feedback is displayed.

### AC-007.4: Existing Result Isolation

**Given** a generated result was previously created from the profile
**When** the user edits the profile
**Then** the previous generated result does not silently recalculate or mutate.

### AC-007.5: Future Generation

**Given** the user edits a Birth Profile
**When** they start a new compatible generation
**Then** the new generation uses the updated profile data.

---

# 19. Delete Birth Profile

## Feature ID

```text
F-008
```

Users can delete a saved birth profile.

Deletion must require confirmation.

## Acceptance Criteria

### AC-008.1: Confirmation

**Given** a saved Birth Profile exists
**When** the user selects Delete
**Then** a confirmation surface is displayed before deletion occurs.

### AC-008.2: Cancel Deletion

**Given** the deletion confirmation is displayed
**When** the user cancels
**Then** the Birth Profile remains available.

### AC-008.3: Confirm Deletion

**Given** the deletion confirmation is displayed
**When** the user confirms
**Then** the Birth Profile is removed from the available Birth Data collection.

### AC-008.4: No Accidental Deletion

**Given** the user has not confirmed deletion
**When** the confirmation is displayed
**Then** the system does not delete the profile.

---

# 20. Birth Profile Selection

## Feature ID

```text
F-009
```

Users can select saved birth profiles during chart generation.

Selection is separate from profile management.

```text
Manage Profiles
```

is different from:

```text
Select Profiles for Generation
```

The same stored profiles can be reused across multiple generation sessions.

## Acceptance Criteria

### AC-009.1: Available Profiles

**Given** saved Birth Profiles exist
**When** generation begins
**Then** the available profiles can be selected.

### AC-009.2: Selected State

**Given** a user selects a profile
**When** the selection is made
**Then** the UI clearly reflects the selected state.

### AC-009.3: Continue With Selection

**Given** the selected profile set satisfies the current flow's minimum requirements
**When** the user continues
**Then** the selection is passed to the next generation step.

### AC-009.4: No Profile

**Given** no Birth Profiles exist
**When** the user starts generation
**Then** the application provides a path to create a Birth Profile before continuing.

---

# 21. Multiple Profile Selection

The product architecture allows multiple profiles to be selected.

However, the number of profiles actually permitted must be determined by the selected metaphysical system.

Therefore:

```text
Profile Selection
      ↓
System Selection
      ↓
Validate Selection Count
```

must be possible.

## Acceptance Criteria

### AC-021.1: Multiple Selection Capability

**Given** a system supports multiple profiles
**When** the user selects profiles
**Then** the generation flow can retain the required number of selected profiles.

### AC-021.2: System-Specific Count

**Given** a system has a profile-count requirement
**When** the selected profile count does not satisfy that requirement
**Then** generation cannot proceed.

### AC-021.3: No Global Assumption

**Given** different systems have different profile-count requirements
**When** users move between systems
**Then** the application validates profile count according to the selected system.

---

# 22. Feature: Chart Generation

## Feature ID

```text
F-010
```

## Purpose

Generate a metaphysical result from selected birth data and a selected system.

Core flow:

```text
Birth Profile Selection
        ↓
System Selection
        ↓
Requirement Validation
        ↓
System Configuration
        ↓
Generation
        ↓
Result
```

## Acceptance Criteria

### AC-010.1: Complete Flow

**Given** valid profile data exists
**When** the user completes the required generation steps
**Then** the selected system produces a result.

### AC-010.2: No Premature Generation

**Given** required inputs are incomplete
**When** the user attempts to generate
**Then** generation does not begin.

### AC-010.3: System Context

**Given** a generation request is created
**When** calculation begins
**Then** exactly one top-level system is associated with the request.

### AC-010.4: Result

**Given** calculation succeeds
**When** generation completes
**Then** a system-specific result is displayed.

---

# 23. Top-Level System Selection

## Feature ID

```text
F-011
```

The user selects exactly one top-level metaphysical system per generation operation.

Available systems:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

## Acceptance Criteria

### AC-011.1: Six Initial Systems

**Given** the system selection surface is displayed
**When** the initial product is implemented
**Then** the six defined top-level systems are available.

### AC-011.2: One System Per Request

**Given** the user is creating one generation request
**When** they select a system
**Then** only one top-level system is associated with that request.

### AC-011.3: Separate Generation

**Given** the user wants results from multiple top-level systems
**When** they complete one generation
**Then** another system can be generated through a separate generation operation.

### AC-011.4: Astrology Is Top-Level

**Given** the user selects Astrology
**When** the Astrology experience opens
**Then** Astrology chart types are handled inside Astrology rather than as separate top-level systems.

---

# 24. System Registry

The application should conceptually maintain a registry of available systems.

Example:

```text
SYSTEM REGISTRY
│
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin
```

Each system should expose enough metadata for the generation framework to understand:

```text
System Name
System ID
Availability
Required Data
Configuration
Generator
Result Type
```

## Acceptance Criteria

### AC-024.1: Registered System

**Given** a system is available for generation
**When** the generation framework loads available systems
**Then** the system exposes the information required to initiate its flow.

### AC-024.2: System Isolation

**Given** one system is selected
**When** its generation process runs
**Then** unrelated systems are not executed as part of the same request.

### AC-024.3: Extensibility

**Given** a new system is added
**When** it conforms to the defined system contract
**Then** it can be registered without rewriting unrelated system implementations.

---

# 25. System Requirement Validation

## Feature ID

```text
F-012
```

Before generation, the system validates whether the selected birth profile(s) satisfy the requirements of the selected system.

## Acceptance Criteria

### AC-012.1: Validation Before Generation

**Given** a system and profile selection exist
**When** the user proceeds toward generation
**Then** system requirements are evaluated before calculation starts.

### AC-012.2: Valid Requirements

**Given** all required information is present
**When** validation runs
**Then** the request can proceed to configuration or generation.

### AC-012.3: Invalid Requirements

**Given** required information is missing or invalid
**When** validation runs
**Then** generation is blocked.

### AC-012.4: Actionable Error

**Given** validation fails
**When** the error is displayed
**Then** the user is told what information is missing or invalid and, where possible, how to resolve it.

---

# 26. Missing Data Handling

If required information is missing, the system must not invent it.

Example:

```text
Human Design
```

requires a known birth time.

If the selected profile has:

```text
birthTime = null
```

the user should see:

```text
Birth time required

Human Design requires a known birth time.

[Edit Birth Data]
[Choose Another Profile]
[Cancel]
```

## Acceptance Criteria

### AC-026.1: No Data Fabrication

**Given** required information is missing
**When** generation is attempted
**Then** the system does not substitute an invented value.

### AC-026.2: Missing Birth Time

**Given** the selected profile has unknown birth time
**When** a system requiring known birth time is selected
**Then** validation blocks generation.

### AC-026.3: Recovery Action

**Given** validation fails because birth data is insufficient
**When** the user views the error
**Then** the user can access an appropriate recovery action where supported.

---

# 27. System Configuration

After requirement validation, the selected system may request additional configuration.

General model:

```text
System
   ↓
Requirements
   ↓
Configuration
```

Configuration is system-specific.

The global generation framework should not hardcode every system's configuration fields.

## Acceptance Criteria

### AC-027.1: System-Specific Configuration

**Given** a selected system requires additional configuration
**When** validation succeeds
**Then** the user is presented with the configuration required by that system.

### AC-027.2: No Unrelated Fields

**Given** a system does not require a configuration value
**When** its configuration UI is displayed
**Then** that unrelated field is not required.

### AC-027.3: Configuration Validation

**Given** configuration contains invalid or incomplete values
**When** the user attempts to generate
**Then** generation is blocked until the configuration is valid.

---

# 28. Astrology Feature

## Feature ID

```text
F-013
```

Astrology is one top-level metaphysical system.

It contains an extensible collection of chart modules.

```text
Astrology
│
├── Natal Chart
├── Draconic Chart
├── Solar Return
├── Lunar Return
├── Progressed Chart
└── Future Chart Types
```

## Acceptance Criteria

### AC-013.1: Astrology as One System

**Given** the user selects Astrology
**When** the generation flow continues
**Then** Astrology is treated as one top-level system.

### AC-013.2: Chart Type Selection

**Given** Astrology is selected
**When** chart selection is displayed
**Then** the available Astrology chart modules can be selected.

### AC-013.3: Module-Specific Behavior

**Given** a specific Astrology chart type is selected
**When** the flow continues
**Then** that chart module controls its own requirements and configuration.

---

# 29. Astrology Chart Module Registry

Astrology chart types should be represented through an extensible module model.

Conceptually:

```text
ASTROLOGY
   ↓
CHART MODULE REGISTRY
   │
   ├── Natal
   ├── Draconic
   ├── Solar Return
   ├── Lunar Return
   └── Progressed
```

## Acceptance Criteria

### AC-029.1: Initial Modules

**Given** the initial Astrology implementation is available
**When** chart types are listed
**Then** Natal, Draconic, Solar Return, Lunar Return, and Progressed are available.

### AC-029.2: Future Module

**Given** a new Astrology chart module is added
**When** it conforms to the chart module contract
**Then** it can appear in the Astrology chart selection without rewriting the global generation framework.

### AC-029.3: Module Isolation

**Given** one chart module is selected
**When** its generation runs
**Then** unrelated chart modules are not executed.

---

# 30. Astrology Chart Module Responsibilities

Each chart module may define:

```text
Chart ID
Display Name
Description
Requirements
Configuration
Calculation
Result Structure
Visualization
Interpretation
```

## Acceptance Criteria

### AC-030.1: Module Contract

**Given** an Astrology chart module is registered
**When** the generation framework uses it
**Then** the module exposes the information required by the framework.

### AC-030.2: Independent Requirements

**Given** two Astrology chart types have different requirements
**When** they are selected
**Then** each chart validates its own requirements.

### AC-030.3: Independent Configuration

**Given** a chart type has specific configuration requirements
**When** it is selected
**Then** its configuration is presented without forcing unrelated chart configuration.

---

# 31. Astrology: Natal Chart

## Module ID

```text
astrology.natal
```

Purpose:

Generate and display a Natal Chart.

The module should define its own exact requirements and configuration.

## Acceptance Criteria

### AC-031.1: Selection

**Given** Astrology is selected
**When** the user selects Natal Chart
**Then** the Natal Chart module becomes the active chart module.

### AC-031.2: Validation

**Given** the Natal Chart has defined requirements
**When** the user proceeds
**Then** those requirements are validated before calculation.

### AC-031.3: Result

**Given** valid Natal Chart inputs
**When** generation succeeds
**Then** the Natal Chart result is displayed.

---

# 32. Astrology: Draconic Chart

## Module ID

```text
astrology.draconic
```

Purpose:

Generate and display a Draconic Chart.

The module owns its specific configuration and result behavior.

## Acceptance Criteria

### AC-032.1: Module Selection

**Given** Astrology is active
**When** Draconic Chart is selected
**Then** the Draconic module becomes active.

### AC-032.2: Module-Specific Validation

**Given** the Draconic module has defined requirements
**When** the user proceeds
**Then** those requirements are validated.

### AC-032.3: Result

**Given** valid inputs
**When** generation succeeds
**Then** the Draconic result is displayed.

---

# 33. Astrology: Solar Return

## Module ID

```text
astrology.solar-return
```

Purpose:

Generate a Solar Return chart.

Potential configuration may include a target year and other chart-specific parameters.

Exact requirements must be defined by the Astrology specification.

## Acceptance Criteria

### AC-033.1: Module Selection

**Given** Astrology is active
**When** Solar Return is selected
**Then** the Solar Return module becomes active.

### AC-033.2: Configuration

**Given** Solar Return requires chart-specific configuration
**When** the module is active
**Then** the required configuration can be provided.

### AC-033.3: Validation

**Given** Solar Return configuration is incomplete or invalid
**When** the user attempts generation
**Then** generation is blocked.

### AC-033.4: Result

**Given** all Solar Return requirements are valid
**When** generation succeeds
**Then** the Solar Return result is displayed.

---

# 34. Astrology: Lunar Return

## Module ID

```text
astrology.lunar-return
```

Purpose:

Generate a Lunar Return chart.

The module owns its specific calculation parameters.

## Acceptance Criteria

### AC-034.1: Module Selection

**Given** Astrology is active
**When** Lunar Return is selected
**Then** the Lunar Return module becomes active.

### AC-034.2: Configuration

**Given** Lunar Return requires chart-specific parameters
**When** the module is active
**Then** the user can provide those parameters.

### AC-034.3: Validation

**Given** required Lunar Return inputs are invalid
**When** generation is attempted
**Then** generation is blocked.

### AC-034.4: Result

**Given** valid inputs
**When** calculation succeeds
**Then** the Lunar Return result is displayed.

---

# 35. Astrology: Progressed Chart

## Module ID

```text
astrology.progressed
```

Purpose:

Generate a Progressed Chart.

The module may require a target date or other chart-specific configuration.

Exact requirements must be defined by the Astrology specification.

## Acceptance Criteria

### AC-035.1: Module Selection

**Given** Astrology is active
**When** Progressed Chart is selected
**Then** the Progressed module becomes active.

### AC-035.2: Target Configuration

**Given** the Progressed module requires a target date or other parameter
**When** the module is configured
**Then** the required parameter can be provided.

### AC-035.3: Validation

**Given** required Progressed Chart configuration is invalid
**When** the user attempts generation
**Then** generation is blocked.

### AC-035.4: Result

**Given** all requirements are satisfied
**When** generation succeeds
**Then** the Progressed Chart result is displayed.

---

# 36. Future Astrology Modules

Future Astrology chart types should be implemented as additional modules.

Example:

```text
astrology.<new-chart>
```

Adding the module should not require modifying unrelated system code.

## Acceptance Criteria

### AC-036.1: Registry-Based Addition

**Given** a new chart module satisfies the defined module contract
**When** it is registered
**Then** it can become available through the Astrology chart selection flow.

### AC-036.2: Existing Modules Remain Functional

**Given** a new chart module is added
**When** existing chart types are used
**Then** their existing behavior remains functional.

### AC-036.3: No Global Rewrite

**Given** a new chart type is added
**When** the feature is implemented
**Then** the core generation framework does not require chart-type-specific rewrites throughout unrelated code.

---

# 37. Human Design Feature

## Feature ID

```text
F-014
```

Purpose:

Generate and display a Human Design result.

The feature must validate all required birth information before generation.

Known birth time is required where the calculation specification requires it.

## Acceptance Criteria

### AC-014.1: System Selection

**Given** the user selects Human Design
**When** the flow continues
**Then** Human Design becomes the active top-level system.

### AC-014.2: Birth Time Requirement

**Given** the selected profile has unknown birth time
**When** Human Design requires known birth time
**Then** generation is blocked.

### AC-014.3: Valid Generation

**Given** all required Human Design inputs are valid
**When** the user generates
**Then** a Human Design result is produced.

### AC-014.4: No Invented Time

**Given** birth time is unknown
**When** Human Design generation is attempted
**Then** the system does not invent a birth time.

---

# 38. Numerology Feature

## Feature ID

```text
F-015
```

Purpose:

Generate and display a Numerology result.

Numerology-specific input and calculation requirements belong to its system specification.

## Acceptance Criteria

### AC-015.1: System Activation

**Given** Numerology is selected
**When** the generation flow continues
**Then** Numerology becomes the active system.

### AC-015.2: Requirement Validation

**Given** Numerology has defined requirements
**When** generation is attempted
**Then** those requirements are validated first.

### AC-015.3: Result

**Given** valid Numerology inputs
**When** calculation succeeds
**Then** a Numerology result is displayed.

---

# 39. BaZi Feature

## Feature ID

```text
F-016
```

Purpose:

Generate and display a BaZi result.

BaZi-specific calculation requirements belong to its system specification.

## Acceptance Criteria

### AC-016.1: System Activation

**Given** BaZi is selected
**When** the generation flow continues
**Then** BaZi becomes the active system.

### AC-016.2: Requirement Validation

**Given** BaZi has defined requirements
**When** generation is attempted
**Then** those requirements are validated first.

### AC-016.3: Result

**Given** valid BaZi inputs
**When** calculation succeeds
**Then** a BaZi result is displayed.

---

# 40. Zi Wei Dou Shu Feature

## Feature ID

```text
F-017
```

Purpose:

Generate and display a Zi Wei Dou Shu result.

System-specific requirements belong to its system specification.

## Acceptance Criteria

### AC-017.1: System Activation

**Given** Zi Wei Dou Shu is selected
**When** the generation flow continues
**Then** Zi Wei Dou Shu becomes the active system.

### AC-017.2: Requirement Validation

**Given** Zi Wei Dou Shu has defined requirements
**When** generation is attempted
**Then** its requirements are validated first.

### AC-017.3: Result

**Given** valid inputs
**When** calculation succeeds
**Then** a Zi Wei Dou Shu result is displayed.

---

# 41. Tzolkin Feature

## Feature ID

```text
F-018
```

Purpose:

Generate and display a Tzolkin result.

System-specific requirements belong to its system specification.

## Acceptance Criteria

### AC-018.1: System Activation

**Given** Tzolkin is selected
**When** the generation flow continues
**Then** Tzolkin becomes the active system.

### AC-018.2: Requirement Validation

**Given** Tzolkin has defined requirements
**When** generation is attempted
**Then** its requirements are validated first.

### AC-018.3: Result

**Given** valid inputs
**When** calculation succeeds
**Then** a Tzolkin result is displayed.

---

# 42. Generation State Management

## Feature ID

```text
F-019
```

The generation process has explicit states.

```text
IDLE
  ↓
SELECTING_PROFILES
  ↓
SELECTING_SYSTEM
  ↓
VALIDATING
  ↓
CONFIGURING
  ↓
GENERATING
  ↓
SUCCESS
```

Failure states may branch from:

```text
VALIDATING
CONFIGURING
GENERATING
```

into:

```text
ERROR
```

## Acceptance Criteria

### AC-019.1: State Progression

**Given** the user begins a generation flow
**When** each required step is completed successfully
**Then** the flow progresses to the next valid state.

### AC-019.2: Invalid State Transition

**Given** required information for a state is incomplete
**When** the user attempts to advance
**Then** the application does not transition to a state that requires unavailable information.

### AC-019.3: Error State

**Given** a generation step fails
**When** the failure is detected
**Then** the flow enters an appropriate error state.

### AC-019.4: Successful State

**Given** calculation completes successfully
**When** the result is available
**Then** the generation flow enters the success state.

---

# 43. Generation Loading

During calculation:

```text
GENERATING
```

the UI should communicate that the system is processing.

The user should not be encouraged to accidentally submit duplicate generation requests.

## Acceptance Criteria

### AC-043.1: Processing Feedback

**Given** generation is running
**When** calculation is in progress
**Then** the user receives visible processing feedback.

### AC-043.2: Duplicate Submission Prevention

**Given** a generation request is already running
**When** the user attempts to submit the same generation action again
**Then** duplicate generation is prevented or safely ignored.

### AC-043.3: Completion

**Given** generation finishes
**When** the result or error is received
**Then** the loading state ends.

---

# 44. Generation Error Handling

Generation errors must be classified where possible.

Examples:

```text
VALIDATION_ERROR
CONFIGURATION_ERROR
CALCULATION_ERROR
NETWORK_ERROR
UNKNOWN_ERROR
```

The exact error model belongs to the technical architecture.

The UI should convert technical errors into understandable user-facing messages.

## Acceptance Criteria

### AC-044.1: User-Friendly Error

**Given** generation fails
**When** the error is displayed
**Then** the user receives an understandable explanation rather than raw technical output.

### AC-044.2: Error Classification

**Given** the system can determine the error category
**When** the error is recorded
**Then** the appropriate error category is preserved.

### AC-044.3: Recovery

**Given** an error has a known recovery path
**When** the error is displayed
**Then** the user receives an appropriate recovery action.

### AC-044.4: No False Success

**Given** generation fails
**When** the failure is detected
**Then** the UI does not present the generation as successful.

---

# 45. Generation Result

A successful generation produces a system-specific result.

Conceptually:

```text
Generation Result
│
├── System
├── Input Context
├── Configuration
├── Calculation Result
└── Presentation
```

The result format can differ between systems.

There is no requirement for every metaphysical system to display identical result structures.

## Acceptance Criteria

### AC-045.1: Correct System Result

**Given** a generation request uses one system
**When** generation succeeds
**Then** the displayed result belongs to that selected system.

### AC-045.2: Result Context

**Given** a result has been generated
**When** the result is displayed
**Then** the relevant generation context is preserved.

### AC-045.3: System-Specific Presentation

**Given** different systems produce different result structures
**When** their results are displayed
**Then** each system can use its own appropriate presentation.

---

# 46. Result Isolation

A generated result must be associated with the generation context that produced it.

Changing a saved Birth Profile later must not retroactively rewrite an already generated result.

## Acceptance Criteria

### AC-046.1: Historical Result Stability

**Given** Result A was generated from Profile Version A
**When** the user edits the saved profile
**Then** Result A remains associated with the original generation context.

### AC-046.2: New Generation

**Given** the user edits a Birth Profile
**When** they perform a new generation
**Then** the new result uses the updated profile data.

### AC-046.3: No Silent Recalculation

**Given** an existing result is displayed
**When** the source profile changes
**Then** the existing result is not silently recalculated.

---

# 47. Library Feature

## Feature ID

```text
F-020
```

## Purpose

Provide educational content about metaphysical systems.

Initial categories:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

## Acceptance Criteria

### AC-047.1: Library Access

**Given** the user selects Library
**When** the Library loads
**Then** the available educational system categories are presented.

### AC-047.2: System Exploration

**Given** the user selects a system in Library
**When** navigation completes
**Then** system-specific educational content is displayed.

### AC-047.3: Independent Education

**Given** the user is reading Library content
**When** the content loads
**Then** chart calculation is not automatically triggered.

---

# 48. Library Content Structure

The Library should support different content structures for different systems.

Possible content types:

```text
Introduction
Fundamentals
Terminology
Components
Methodology
Interpretation Concepts
Articles
Guides
References
```

Not every system needs every content type.

## Acceptance Criteria

### AC-048.1: Flexible Content Structure

**Given** different systems require different educational structures
**When** their Library content is presented
**Then** the content model does not force every system to have identical categories.

### AC-048.2: Content Discoverability

**Given** educational content exists
**When** the relevant system page is opened
**Then** available content can be discovered by the user.

---

# 49. Library System Separation

Library content should not directly own calculation logic.

For example:

```text
Library Astrology
```

can explain:

```text
What is a Natal Chart?
```

but should not itself calculate the user's Natal Chart.

Generation remains responsible for calculation.

## Acceptance Criteria

### AC-049.1: No Automatic Calculation

**Given** the user opens an educational article
**When** the article loads
**Then** no chart calculation occurs unless the user explicitly starts a generation action.

### AC-049.2: Calculation Ownership

**Given** the user wants a generated result
**When** they start generation from Library
**Then** the request enters the Generation flow.

---

# 50. Library → Generation Connection

A Library article may contain a contextual CTA.

Example:

```text
Learn about Natal Charts

[Generate Natal Chart]
```

This is a navigation bridge, not a merging of the two features.

The user should still pass through the required generation validation flow.

## Acceptance Criteria

### AC-050.1: Optional CTA

**Given** a Library article provides a generation CTA
**When** the user selects it
**Then** the user enters the appropriate generation flow.

### AC-050.2: Validation Preserved

**Given** the user enters generation from Library
**When** generation begins
**Then** normal profile, system, and requirement validation still applies.

---

# 51. Settings Feature

## Feature ID

```text
F-021
```

Settings provide user-level application configuration.

Initial conceptual categories:

```text
Account
Appearance
Preferences
Privacy
```

The exact settings are not finalized here.

## Acceptance Criteria

### AC-021.1: Settings Access

**Given** the Profile Menu is open
**When** the user selects Settings
**Then** the Settings experience opens.

### AC-021.2: Setting Isolation

**Given** the user changes an application setting
**When** the change is saved
**Then** it does not unexpectedly modify Birth Profile data.

### AC-021.3: Unspecified Settings

**Given** a setting has not yet been defined by the product specification
**When** implementation begins
**Then** the agent must not invent its behavior as a product requirement.

---

# 52. Authentication Boundary

Authentication is a supporting capability rather than a metaphysical system.

The product should distinguish:

```text
Authenticated User
```

from:

```text
Birth Profile
```

A birth profile represents a person whose data is being used.

It does not necessarily represent the account owner.

## Acceptance Criteria

### AC-052.1: Account/Profile Distinction

**Given** a user account contains multiple Birth Profiles
**When** the profiles are displayed
**Then** the application does not assume every profile represents the account owner.

### AC-052.2: Someone Else

**Given** a Birth Profile represents someone else
**When** it is used for generation
**Then** the application treats it as a valid profile according to system requirements.

---

# 53. Data Ownership Concept

The user owns their saved Birth Profiles within their account context.

A birth profile may be reused for multiple systems.

```text
Birth Profile
       │
       ├── Astrology
       ├── Human Design
       ├── Numerology
       ├── BaZi
       ├── Zi Wei Dou Shu
       └── Tzolkin
```

The profile should not be duplicated per system.

## Acceptance Criteria

### AC-053.1: Single Source Profile

**Given** a Birth Profile exists
**When** multiple systems use it
**Then** the same underlying Birth Profile is referenced.

### AC-053.2: No System Duplication

**Given** a Birth Profile is used across systems
**When** system-specific generation occurs
**Then** the application does not require separate copies of the profile merely because the system differs.

---

# 54. Feature Dependencies

The major dependency graph is:

```text
Application Shell
      │
      ├── Profile
      │     │
      │     └── Birth Data
      │
      ├── Library
      │
      └── Generation
             │
             ├── Birth Data
             │
             ├── System Registry
             │
             ├── Validation
             │
             └── System Modules
                    │
                    ├── Astrology
                    │      └── Chart Modules
                    │
                    ├── Human Design
                    ├── Numerology
                    ├── BaZi
                    ├── Zi Wei Dou Shu
                    └── Tzolkin
```

---

# 55. Feature Boundaries

The following boundaries are mandatory.

## Birth Data

Owns:

```text
Create
Read
Update
Delete
Select
```

It does not own:

```text
Chart Calculation
```

---

## Generation

Owns:

```text
Selection
Validation
Configuration
Generation Lifecycle
```

It does not own:

```text
Educational Content
```

---

## Library

Owns:

```text
Educational Content
```

It does not own:

```text
Birth Profiles
Chart Calculation
```

---

## System Modules

Own:

```text
System-specific requirements
System-specific configuration
System-specific calculation
System-specific result presentation
```

They do not own:

```text
Global navigation
User account management
Birth Profile persistence
```

---

# 56. Feature Interaction Example

A complete Astrology generation operation:

```text
User
 │
 ├── Start
 │
 ↓
Birth Data Selection
 │
 ├── Select Profile
 │
 ↓
System Selection
 │
 └── Astrology
 │
 ↓
Astrology Chart Selection
 │
 └── Natal Chart
 │
 ↓
Requirement Validation
 │
 ↓
Natal Configuration
 │
 ↓
Generate
 │
 ↓
Astrology Calculation
 │
 ↓
Natal Result
```

## Acceptance Criteria

### AC-056.1: End-to-End Astrology Flow

**Given** a valid Birth Profile exists
**When** the user selects Astrology and Natal Chart and completes all required configuration
**Then** the Natal Chart generation flow completes successfully.

### AC-056.2: Invalid Input Stops Flow

**Given** a required input is missing
**When** the user attempts to generate
**Then** calculation does not begin.

---

# 57. Feature Interaction: Human Design

```text
User
 │
 ↓
Birth Data Selection
 │
 └── Select Profile
 │
 ↓
System Selection
 │
 └── Human Design
 │
 ↓
Requirement Validation
 │
 ├── Birth Time Known?
 │       │
 │       ├── YES
 │       │
 │       └── NO
 │            ↓
 │       Requirement Error
 │
 ↓
Human Design Configuration
 │
 ↓
Generate
 │
 ↓
Human Design Result
```

## Acceptance Criteria

### AC-057.1: Known Time

**Given** the selected profile has the birth time required by Human Design
**When** validation runs
**Then** the flow can proceed.

### AC-057.2: Unknown Time

**Given** the selected profile has unknown birth time
**When** Human Design requires a known birth time
**Then** the flow stops at validation and provides recovery actions.

---

# 58. Feature Interaction: Library

```text
User
 │
 ↓
Library
 │
 ↓
System
 │
 ↓
Educational Content
 │
 ├── Read
 │
 └── Optional CTA
       ↓
    Generation
```

## Acceptance Criteria

### AC-058.1: Educational Flow

**Given** the user opens Library
**When** they select a system and content
**Then** the educational content is displayed.

### AC-058.2: Generation CTA

**Given** an article provides a generation CTA
**When** the user activates it
**Then** the application enters the normal generation flow rather than bypassing validation.

---

# 59. Feature Extensibility

The feature architecture must support:

### Adding a new metaphysical system

Example:

```text
New System
```

without requiring changes to:

```text
Birth Data Model
Primary Navigation
Existing Systems
Library Core
```

unless the new system introduces genuinely new product requirements.

### Adding a new Astrology chart type

Example:

```text
New Astrology Chart
```

without rewriting:

```text
Generation Framework
Astrology Core Page
Birth Data Feature
Existing Chart Modules
```

The new chart should conform to the established Astrology chart module contract.

## Acceptance Criteria

### AC-059.1: New System

**Given** a new system conforms to the system contract
**When** it is registered
**Then** it can participate in the generation framework without rewriting unrelated systems.

### AC-059.2: New Astrology Module

**Given** a new Astrology chart module conforms to the chart module contract
**When** it is registered
**Then** it can participate in Astrology generation without rewriting existing chart modules.

### AC-059.3: Existing Behavior Preservation

**Given** a new system or chart module is added
**When** existing features are used
**Then** existing supported functionality remains operational.

---

# 60. Anti-Patterns

The following implementations are prohibited unless explicitly justified by a future specification.

## Anti-pattern 1

Create separate birth data storage for each system.

```text
AstrologyBirthData
HumanDesignBirthData
BaZiBirthData
```

Do not do this.

---

## Anti-pattern 2

Treat Astrology chart types as top-level systems.

Incorrect:

```text
Systems
├── Astrology
├── Natal
├── Draconic
└── Solar Return
```

Correct:

```text
Systems
└── Astrology
    └── Chart Modules
```

---

## Anti-pattern 3

Hardcode all systems directly into global generation logic.

Avoid architecture where adding one system requires modifying a large central conditional structure.

---

## Anti-pattern 4

Use `00:00` for unknown birth time.

Unknown is not midnight.

---

## Anti-pattern 5

Let Library content perform chart calculations.

Library and Generation have separate responsibilities.

---

## Anti-pattern 6

Create a new page for every modal step.

For example:

```text
/birth-data/date
/birth-data/place
/birth-data/name
```

This is not required by the product.

---

# 61. Feature Priority

Initial implementation priority:

```text
P0
├── Application Shell
├── Home
├── Profile
├── Birth Data
├── Generation Framework
├── System Selection
├── Validation
└── System Architecture

P1
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin

P2
├── Library
├── Settings
└── Advanced educational features
```

Priority describes implementation sequencing, not product importance.

---

# 62. Minimum Viable Product Feature Set

A functional first version should be able to:

```text
1. Open Metaphysica
2. Create a Birth Profile
3. Save the profile
4. Edit the profile
5. Delete the profile
6. Select a profile
7. Select one metaphysical system
8. Validate required data
9. Configure the selected system
10. Generate a result
11. Display the result
12. Handle errors
```

## MVP Acceptance Criteria

The MVP is functionally complete when:

### AC-MVP-01

A user can create and save at least one valid Birth Profile.

### AC-MVP-02

A saved Birth Profile can be selected for generation.

### AC-MVP-03

A generation request contains exactly one top-level system.

### AC-MVP-04

The selected system validates its own requirements before calculation.

### AC-MVP-05

Missing required data prevents generation.

### AC-MVP-06

Unknown birth time is never silently converted to `00:00`.

### AC-MVP-07

A successful generation produces a system-specific result.

### AC-MVP-08

A failed generation produces an understandable error state.

### AC-MVP-09

Editing a Birth Profile does not silently mutate an already generated result.

### AC-MVP-10

Astrology remains a top-level system and its chart types remain internal modules.

---

# 63. Feature Acceptance Criteria Standard

Every major Metaphysica feature should define acceptance criteria using observable behavior.

The preferred format is:

```text
Given
When
Then
```

Acceptance criteria should describe **what the product must do**, not how the developer must implement it.

Good:

```text
Given a profile has unknown birth time
When Human Design requires known birth time
Then generation is blocked.
```

Bad:

```text
The React component must call validateBirthTime().
```

The first defines product behavior.

The second dictates implementation.

---

# 64. Acceptance Criteria Categories

Acceptance criteria should cover the following categories where relevant:

```text
FUNCTIONAL
├── Can the user perform the action?
│
VALIDATION
├── What happens when input is invalid?
│
STATE
├── What happens in each important state?
│
ERROR
├── What happens when something fails?
│
DATA
├── Is the correct information preserved?
│
BOUNDARY
├── Does the feature stay within its responsibility?
│
EXTENSIBILITY
├── Can future supported variations be added?
│
REGRESSION
└── Does new behavior preserve existing behavior?
```

Not every feature needs every category.

---

# 65. Acceptance Criteria Quality Rules

Acceptance criteria must be:

## Observable

A tester or agent must be able to determine whether the criterion passed.

## Specific

Avoid vague statements such as:

```text
The feature should work correctly.
```

Prefer:

```text
Given a saved profile exists
When the user selects it
Then the profile becomes selected for the generation request.
```

## Testable

A criterion should be verifiable through:

* UI testing;
* integration testing;
* unit testing;
* manual verification;
* or a combination of these.

## Product-Focused

Criteria should describe behavior rather than implementation.

## Independent

A criterion should not require knowledge of unrelated implementation details.

---

# 66. Feature Definition of Done

A feature is not considered complete merely because its UI exists.

A feature is considered complete when:

```text
FEATURE
│
├── Requirements implemented
│
├── Valid states implemented
│
├── Invalid states handled
│
├── Error states handled
│
├── Acceptance criteria satisfied
│
├── Relevant tests pass
│
├── Existing functionality remains intact
│
└── No undocumented product behavior was invented
```

---

# 67. Implementation Agent Rule

When implementing a feature, the coding agent must use the feature's acceptance criteria as the behavioral contract.

The agent must not declare a feature complete based solely on:

```text
UI exists
```

or:

```text
Code compiles
```

A feature is complete only when its applicable acceptance criteria are satisfied.

If an acceptance criterion cannot be implemented because required product behavior is undefined, the agent should identify the missing requirement rather than inventing product behavior.

---

# 68. Acceptance Criteria and Tests

Acceptance criteria should guide automated tests.

Example:

```text
Acceptance Criterion
        ↓
Test Case
        ↓
Implementation
        ↓
Test Result
```

Example:

```text
AC-011.2

Given one generation request
When the user selects Astrology
Then the request contains only Astrology
```

Potential test:

```text
Create generation request
Select Astrology
Assert selected system = Astrology
Assert selected systems count = 1
```

The exact test implementation belongs to the technical/testing specification.

---

# 69. Feature Traceability

Each major feature should be traceable across:

```text
Product Requirement
        ↓
Feature
        ↓
Acceptance Criteria
        ↓
Implementation
        ↓
Test
```

This prevents the implementation from drifting away from the original product definition.

---

# 70. Feature Acceptance Summary

The core Metaphysica acceptance model is:

```text
                         FEATURE
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
       INPUTS            STATES            OUTPUTS
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                       VALIDATION
                            │
                       ERROR HANDLING
                            │
                    ACCEPTANCE CRITERIA
                            │
                            ↓
                      TESTABLE BEHAVIOR
```

The goal is simple:

> An implementation agent should be able to determine what "done" means without guessing.

---

# 71. Final Feature Model

The final product-level feature architecture is:

```text
                         METAPHYSICA
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
       PROFILE             LIBRARY            GENERATION
          │                   │                   │
     Birth Data          Education         Profile Selection
          │                                  │
          │                             System Selection
          │                                  │
          │                              Validation
          │                                  │
          │                              Configuration
          │                                  │
          │                              Generation
          │                                  │
          │                                 Result
          │                                  │
          │                    ┌─────────────┼─────────────┐
          │                    │             │             │
          │                Astrology    Human Design    Other
          │                    │
          │              Chart Modules
          │
          └────────────────────┘
```

---

# 72. Definition of Done

The feature specification is considered satisfied when:

* all core features have an explicit purpose;
* feature responsibilities are separated;
* Birth Data is reusable across systems;
* unknown birth time is explicitly modeled;
* generation supports exactly one top-level system per operation;
* system requirements can differ;
* Astrology supports extensible chart modules;
* Library remains separate from calculation;
* generated results are isolated from later profile edits;
* future systems can be added without restructuring the entire product;
* future Astrology chart types can be added without rewriting the core framework;
* every major feature has observable acceptance criteria;
* acceptance criteria cover important valid, invalid, error, and boundary states;
* acceptance criteria are written as product behavior rather than implementation instructions;
* MVP completion can be verified objectively;
* no feature depends on undocumented assumptions.

---

# 73. Next Specification

The next document is:

```text
05-data-model.md
```

It will define the actual information structures behind these features, including:

```text
User
BirthProfile
BirthPlace
BirthTime
System
AstrologyChartType
GenerationRequest
GenerationConfiguration
GenerationResult
LibraryContent
Settings
```

The Data Model document should define **what data exists and how it relates**, without yet deciding the exact database technology or implementation framework.
