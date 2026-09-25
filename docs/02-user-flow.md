# Metaphysica

## User Flow Specification

**Document:** 02-user-flow.md
**Version:** 1.0
**Status:** Product Flow Definition

---

# 1. Purpose

This document defines how users move through Metaphysica and how the application responds to user actions.

It describes:

* navigation flow;
* modal flow;
* profile flow;
* birth data flow;
* chart generation flow;
* system selection;
* system-specific requirements;
* Astrology chart selection;
* error and empty states;
* transitions between application states.

This document defines **user behavior and experience**, not implementation details.

---

# 2. Core Navigation Model

The primary navigation consists of:

```text
Home
Library
Profile
```

Profile contains:

```text
Profile
├── Birth Data
├── Settings
└── Logout
```

Birth Data is accessed through a modal experience rather than becoming a primary navigation destination.

The overall structure is:

```text
                         HOME
                          │
              ┌───────────┴───────────┐
              ↓                       ↓
           LIBRARY                 PROFILE
              │                       │
              │                ┌──────┴──────┐
              │                ↓             ↓
              │           Birth Data      Settings
              │                │
              │                ↓
              │          Birth Data Modal
              │                │
              │                ↓
              │          Birth Profiles
              │                │
              └────────────────┤
                               ↓
                       Chart Generation
                               │
                               ↓
                       System Selection
                               │
              ┌────────────────┼────────────────┐
              ↓                ↓                ↓
          Astrology       Human Design      Other Systems
              │
              ↓
       Astrology Chart Type
              │
              ↓
        Chart Settings
              │
              ↓
           Generate
              │
              ↓
        Generated Result
```

---

# 3. Home Flow

## 3.1 Initial State

When a user enters Metaphysica, the Home page is the primary landing experience.

Home introduces:

* Metaphysica;
* its metaphysical concept;
* its visual identity;
* the available experience;
* the primary Start action.

Home should remain focused on introduction.

It should not behave like a dashboard.

---

## 3.2 Start Action

User action:

```text
User clicks START
```

The application begins the birth-data/chart-generation journey.

Initial flow:

```text
START
  ↓
Birth Data
```

If the user has no saved birth profiles, the application opens the empty Birth Data modal.

If saved birth profiles already exist, the application may open the Birth Data selection state.

---

# 4. Birth Data Flow

Birth Data is the reusable personal data layer of Metaphysica.

A user may store multiple birth profiles.

Examples:

```text
Bayu
Person A
Person B
Partner
Family Member
Friend
```

A birth profile is not tied permanently to a single metaphysical system.

---

# 5. Birth Data Empty State

When the user has no saved birth profiles:

```text
Profile
  ↓
Birth Data
  ↓
Birth Data Modal
  ↓
Empty State
```

The modal displays:

```text
Birth Data

No birth data yet.

Create a birth profile to use it
for your metaphysical charts.

[ + Create New ]
```

Primary action:

```text
Create New
```

Secondary action:

```text
Close
```

---

# 6. Create Birth Profile Flow

Clicking:

```text
+ Create New
```

opens the Birth Profile Wizard.

The wizard contains three steps.

```text
STEP 1
Birth Date
    ↓
STEP 2
Birth Place
    ↓
STEP 3
Name & Who Is This For?
    ↓
SAVE
```

The wizard remains inside the modal experience.

It should not navigate the user to a separate full-page form.

---

# 7. Birth Profile Wizard: Step 1

## 7.1 Purpose

Collect birth date and birth time information.

Fields:

```text
Date of Birth
Time of Birth
```

Birth date is required.

Birth time is optional at the profile level.

---

## 7.2 Known Birth Time

If the user knows their birth time:

```text
Date of Birth
25 / 09 / 2005

Time of Birth
14 : 30
```

The profile stores the known birth time.

---

## 7.3 Unknown Birth Time

If the user does not know their birth time:

```text
[ ] I don't know my birth time
```

When enabled:

```text
Time of Birth
Unknown
```

The system must preserve this as an explicit unknown state.

It must never silently convert:

```text
Unknown
```

into:

```text
00:00
```

---

## 7.4 Step Navigation

Actions:

```text
Cancel
Next
```

`Next` is available when the required information is valid.

If the birth date is missing or invalid, the user remains on Step 1 and receives an appropriate validation message.

---

# 8. Birth Profile Wizard: Step 2

## 8.1 Purpose

Collect the person's birth place.

The user searches for or selects their birth location.

The system should capture enough information to support future calculations.

Potential location information:

```text
Place Name
Country
Latitude
Longitude
Timezone
```

The user should primarily interact with a human-readable location selector.

Technical geographic information should be handled by the system rather than requiring the user to manually enter coordinates.

---

## 8.2 Step Navigation

Actions:

```text
Back
Next
Cancel
```

`Back` returns to Step 1 while preserving the entered information.

`Next` proceeds to Step 3 after a valid birth place has been selected.

---

# 9. Birth Profile Wizard: Step 3

## 9.1 Purpose

Identify the person represented by the birth data.

Fields:

```text
Profile Name
Who is this for?
```

Example:

```text
Profile Name
Bayu

Who is this for?

○ Myself
○ Someone Else
```

The system may later support more detailed relationship categories.

Potential future values:

```text
Myself
Family
Partner
Friend
Other
```

---

# 10. Review Before Save

Before the final save action, the application may present a compact summary:

```text
Birth
```
