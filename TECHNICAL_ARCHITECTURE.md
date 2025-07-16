# Crookmon Game - Technical Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Core Engine Architecture](#core-engine-architecture)
4. [React Application Architecture](#react-application-architecture)
5. [State Management Architecture](#state-management-architecture)
6. [Battle System Flow](#battle-system-flow)
7. [Component Hierarchy](#component-hierarchy)
8. [Data Flow Architecture](#data-flow-architecture)
9. [Build System](#build-system)
10. [Technology Stack](#technology-stack)
11. [Code Quality & Patterns](#code-quality--patterns)
12. [Performance Considerations](#performance-considerations)
13. [Security Considerations](#security-considerations)
14. [Deployment Architecture](#deployment-architecture)

---

## Project Overview

**Crookmon Game** is a framework-agnostic, turn-based card battle engine designed as both a standalone JavaScript library and a complete React web application. The project demonstrates advanced software architecture patterns with clean separation between business logic and presentation layers.

### Key Characteristics

- **Framework Agnostic**: Core battle engine written in pure JavaScript
- **Zero Runtime Dependencies**: Self-contained with optional React integration
- **Deterministic**: Seedable RNG for reproducible battles
- **Event-Driven**: Comprehensive event system for real-time updates
- **Multi-Format Distribution**: ESM, CJS, and UMD builds
- **Type-Safe**: Full TypeScript definitions included

---

## Architecture Overview

The system follows a **layered architecture** with clear separation of concerns:

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[React Components]
        Hooks[Custom Hooks]
        Context[React Context]
    end

    subgraph "Application Layer"
        Services[Services & Managers]
        Utils[Utilities]
        Analytics[Analytics]
    end

    subgraph "Core Engine Layer"
        Engine[Battle Engine]
        FSM[State Machine]
        Events[Event System]
        RNG[Random Number Generation]
    end

    subgraph "Data Layer"
        LocalStorage[Local Storage]
        SessionStorage[Session Storage]
        URLParams[URL Parameters]
    end

    UI --> Hooks
    Hooks --> Context
    Context --> Services
    Services --> Engine
    Engine --> FSM
    Engine --> Events
    Engine --> RNG
    Services --> LocalStorage
    Analytics --> LocalStorage
```

---

## Core Engine Architecture

The core battle engine is designed as a pure functional system with no external dependencies:

```mermaid
graph LR
    subgraph "Core Engine"
        Init[initializeBattle]
        Process[processTurn]
        AI[generateAIMove]
        Damage[calculateDamage]
        Victory[evaluateVictory]
        WinStreak[advanceWinStreak]
    end

    subgraph "Supporting Systems"
        SM[State Machine]
        EE[Event Emitter]
        RNG[RNG System]
        Utils[Utilities]
    end

    subgraph "React Integration"
        Hook[useBattleEngine]
        Context[Battle Context]
    end

    Init --> SM
    Process --> Damage
    Process --> Victory
    Process --> EE
    AI --> RNG
    Damage --> RNG

    Hook --> Init
    Hook --> Process
    Hook --> AI
    Context --> Hook
```

### Core Engine Components

#### 1. State Machine (`statemachine.js`)
- **Purpose**: Manages battle state transitions
- **Pattern**: Finite State Machine (FSM)
- **States**: `idle`, `selecting`, `resolving`, `finished`
- **Features**:
  - Event-driven transitions
  - State validation
  - Subscription system
  - Immutable configuration

#### 2. Event Emitter (`eventemitter.js`)
- **Purpose**: Decoupled communication system
- **Pattern**: Observer/Pub-Sub
- **Features**:
  - Type-safe event handling
  - Memory leak prevention
  - Once-only listeners
  - Synchronous event dispatch

#### 3. RNG System (`rng.js`)
- **Algorithm**: xoroshiro128+ (high-quality PRNG)
- **Features**:
  - Seedable for deterministic behavior
  - State serialization/deserialization
  - Uniform distribution
  - 32-bit integer support

#### 4. Battle Processing (`processturn.js`)
- **Pattern**: Command pattern for actions
- **Action Types**: `attack`, `switch`, `item`
- **Features**:
  - Action validation
  - State mutation with deep cloning
  - Status effect processing
  - Turn progression

---

## React Application Architecture

The React application layer provides a complete game interface built on modern React patterns:

```mermaid
graph TB
    subgraph "App Root"
        App[App.tsx]
    end

    subgraph "Providers"
        Analytics[AnalyticsProvider]
        Ad[AdProvider]
        WinStreak[WinStreakProvider]
        Skin[SkinProvider]
        Settings[SettingsProvider]
    end

    subgraph "Pages"
        Home[HomePage]
        Duel[DuelPage]
        Shop[ShopPage]
        Stats[StatsPage]
    end

    subgraph "Components"
        Battle[BattleScreen]
        Cards[CardPickerGrid]
        Settings[SettingsModal]
        Share[ShareLinkModal]
    end

    App --> Analytics
    Analytics --> Ad
    Ad --> WinStreak
    WinStreak --> Skin
    Skin --> Settings
    Settings --> Home
    Settings --> Duel
    Settings --> Shop
    Settings --> Stats

    Duel --> Battle
    Duel --> Cards
    Battle --> Share
```

### Component Design Patterns

#### 1. **Higher-Order Components (HOCs)**
- Error boundaries for fault tolerance
- Lazy loading with Suspense
- Analytics tracking wrappers

#### 2. **Render Props & Custom Hooks**
- `useBattleEngine`: Core battle logic integration
- `useAudioManager`: Sound effect management
- `useDuelLogic`: High-level duel orchestration

#### 3. **Context Providers**
- **Single Responsibility**: Each context manages one concern
- **Performance**: Optimized with `useMemo` and `useCallback`
- **Persistence**: Local storage integration

---

## State Management Architecture

The application uses a **Context-based state management** approach with multiple specialized contexts:

```mermaid
graph TB
    subgraph "Context Providers"
        subgraph "Game State"
            Duel[DuelContext]
            WinStreak[WinStreakContext]
        end

        subgraph "User Preferences"
            Settings[SettingsContext]
        end

        subgraph "Monetization"
            Ad[AdContext]
            Analytics[AnalyticsContext]
        end
    end

    subgraph "Local Storage"
        LS[localStorage]
    end

    subgraph "Components"
        Battle[BattleScreen]
        UI[UI Components]
    end

    Duel --> LS
    WinStreak --> LS
    Settings --> LS

    Battle --> Duel
    Battle --> WinStreak
    UI --> Settings
    UI --> Ad

    Analytics --> LS
```

### Context Responsibilities

#### DuelContext
- **State**: Current duel ID, progress, win streak
- **Actions**: Start/end duel, share functionality
- **Persistence**: Win streak in localStorage
- **Integration**: URL parameter handling

#### WinStreakContext
- **State**: Current and best win streaks
- **Actions**: Increment, reset streaks
- **Persistence**: Both values in localStorage
- **Features**: Atomic updates, error handling

#### SettingsContext
- **State**: Theme, audio, notifications, language
- **Actions**: Update settings, reset to defaults
- **Features**: Dark mode detection, preference merging
- **Persistence**: Complete settings object in localStorage

---

## Battle System Flow

The battle system implements a sophisticated turn-based combat system:

```mermaid
sequenceDiagram
    participant Player
    participant UI
    participant Engine
    participant AI
    participant Events

    Player->>UI: Initialize Battle
    UI->>Engine: initializeBattle(config)
    Engine->>Events: emit('battleStart')

    loop Battle Loop
        Player->>UI: Select Action
        UI->>Engine: processTurn(action)
        Engine->>Engine: validateAction()
        Engine->>Engine: calculateDamage()
        Engine->>Events: emit('turnProcessed')
        Engine->>Engine: evaluateVictory()

        alt Battle Continues
            Engine->>AI: generateAIMove()
            AI->>Engine: aiAction
            Engine->>Engine: processTurn(aiAction)
            Engine->>Events: emit('aiTurnProcessed')
        else Battle Ends
            Engine->>Events: emit('battleEnd')
            Engine->>Engine: advanceWinStreak()
        end
    end
```

### Battle State Management

```mermaid
stateDiagram-v2
    [*] --> Initializing
    Initializing --> PlayerTurn: Battle Started
    PlayerTurn --> Processing: Action Selected
    Processing --> AITurn: Turn Processed
    AITurn --> Processing: AI Action
    Processing --> Victory: Battle Won
    Processing --> Defeat: Battle Lost
    Processing --> PlayerTurn: Turn Complete
    Victory --> [*]
    Defeat --> [*]

    state Processing {
        [*] --> ValidateAction
        ValidateAction --> CalculateDamage
        CalculateDamage --> ApplyEffects
        ApplyEffects --> CheckVictory
        CheckVictory --> [*]
    }
```

---

## Component Hierarchy

The UI components follow a clear hierarchical structure:

```mermaid
graph TB
    subgraph "App Level"
        App[App.tsx]
        Router[React Router]
    end

    subgraph "Page Level"
        Home[HomePage]
        Duel[DuelPage]
        Shop[ShopPage]
        Stats[StatsPage]
    end

    subgraph "Feature Components"
        Battle[BattleScreen]
        CardGrid[CardPickerGrid]
        Settings[SettingsModal]
        Premium[PremiumSkinModal]
    end

    subgraph "UI Components"
        CardTile[CardTile]
        Spinner[LoadingSpinner]
        Header[Header]
        Footer[Footer]
    end

    subgraph "Utilities"
        ErrorBoundary[ErrorBoundary]
        AdManager[InterstitialAdManager]
    end

    App --> Router
    Router --> Home
    Router --> Duel
    Router --> Shop
    Router --> Stats

    Duel --> Battle
    Duel --> CardGrid
    Shop --> Premium

    Battle --> CardTile
    CardGrid --> CardTile

    App --> Header
    App --> Footer
    App --> ErrorBoundary
    App --> AdManager
```

### Component Categories

#### 1. **Container Components**
- Page-level components
- Data fetching and state management
- Route handling

#### 2. **Presentation Components**
- Pure UI rendering
- Props-based configuration
- Memoized for performance

#### 3. **Smart Components**
- Business logic integration
- Context consumption
- Effect management

---

## Data Flow Architecture

The application implements unidirectional data flow with clear boundaries:

```mermaid
graph TB
    subgraph "User Interactions"
        Click[User Clicks]
        Input[User Input]
    end

    subgraph "React Layer"
        Components[React Components]
        Hooks[Custom Hooks]
        Context[React Context]
    end

    subgraph "Services Layer"
        Audio[Audio Manager]
        Analytics[Analytics Service]
        Storage[Storage Service]
    end

    subgraph "Core Engine"
        Battle[Battle Engine]
        State[Game State]
    end

    subgraph "Side Effects"
        LocalStorage[Local Storage]
        API[External APIs]
        Events[DOM Events]
    end

    Click --> Components
    Input --> Components
    Components --> Hooks
    Hooks --> Context
    Context --> Services
    Services --> Battle
    Battle --> State

    Services --> LocalStorage
    Analytics --> API
    Audio --> Events
```

### Data Flow Patterns

#### 1. **Event-Driven Updates**
- Core engine emits events
- React hooks subscribe to events
- State updates trigger re-renders

#### 2. **Context-Based State**
- Centralized state management
- Provider pattern for state distribution
- Optimized updates with dependency arrays

#### 3. **Service Layer**
- Abstracted external integrations
- Error handling and retry logic
- Consistent API interfaces

---

## Build System

The project uses **Rollup** for multi-format distribution:

```mermaid
graph LR
    subgraph "Source"
        TS[TypeScript Source]
        JSX[React JSX]
        Assets[Static Assets]
    end

    subgraph "Build Process"
        Rollup[Rollup Bundler]
        TypeScript[TypeScript Compiler]
        Terser[Code Minification]
    end

    subgraph "Output Formats"
        ESM[ES Modules]
        CJS[CommonJS]
        UMD[UMD Bundle]
        Types[Type Definitions]
    end

    TS --> TypeScript
    JSX --> TypeScript
    TypeScript --> Rollup
    Rollup --> Terser
    Terser --> ESM
    Terser --> CJS
    Terser --> UMD
    TypeScript --> Types
```

### Build Configuration

#### Rollup Features
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Lazy loading support
- **Source Maps**: Development debugging
- **External Dependencies**: Peer dependency handling

#### Output Targets
- **ESM**: Modern JavaScript modules
- **CJS**: Node.js compatibility
- **UMD**: Browser script tag support
- **TypeScript**: Complete type definitions

---

## Technology Stack

### Core Technologies

```mermaid
mindmap
  root((Technology Stack))
    Frontend
      React 18+
      TypeScript
      React Router
      CSS Modules
    Build Tools
      Rollup
      TypeScript Compiler
      Terser
      ESLint
    Testing
      Jest
      React Testing Library
    Core Engine
      Pure JavaScript
      Custom State Machine
      Event System
      Seedable RNG
    Services
      Web Audio API
      Local Storage
      Fetch API
      Analytics
```

### Library Dependencies

#### Development Dependencies
- **Rollup Ecosystem**: Bundling and plugins
- **TypeScript**: Type checking and compilation
- **ESLint**: Code quality and consistency
- **Jest**: Unit testing framework

#### Runtime Dependencies
- **React**: UI framework (peer dependency)
- **Zero Dependencies**: Core engine is standalone

---

## Code Quality & Patterns

### Design Patterns

#### 1. **Finite State Machine**
- **Implementation**: Custom FSM in `statemachine.js`
- **Benefits**: Predictable state transitions, debugging
- **Usage**: Battle phase management

#### 2. **Observer Pattern**
- **Implementation**: Custom event emitter
- **Benefits**: Decoupled communication, extensibility
- **Usage**: Battle event notifications

#### 3. **Command Pattern**
- **Implementation**: Action objects in battle system
- **Benefits**: Undo/redo potential, validation
- **Usage**: Player and AI actions

#### 4. **Hook Pattern**
- **Implementation**: Custom React hooks
- **Benefits**: Logic reuse, state encapsulation
- **Usage**: Battle engine integration

### Code Quality Measures

#### Type Safety
- **TypeScript**: Comprehensive type definitions
- **Runtime Checks**: Input validation
- **Error Boundaries**: React error handling

#### Performance
- **Memoization**: React.memo, useMemo, useCallback
- **Lazy Loading**: React.lazy for code splitting
- **Event Cleanup**: Proper listener removal

#### Testing Strategy
- **Unit Tests**: Core engine functions
- **Integration Tests**: React hooks
- **Component Tests**: UI behavior

---

## Performance Considerations

### Core Engine Performance

```mermaid
graph TB
    subgraph "Performance Optimizations"
        subgraph "Memory"
            Clone[Object Cloning]
            GC[Garbage Collection]
            Refs[Reference Management]
        end

        subgraph "Computation"
            Cache[Result Caching]
            Batch[Batch Processing]
            Async[Async Operations]
        end

        subgraph "React"
            Memo[Memoization]
            Lazy[Lazy Loading]
            Virt[Virtual DOM]
        end
    end

    Clone --> GC
    Cache --> Batch
    Memo --> Lazy
```

#### Memory Management
- **Deep Cloning**: Safe state mutations
- **WeakMap Usage**: State machine internals
- **Event Cleanup**: Automatic listener removal

#### React Performance
- **Component Memoization**: Prevent unnecessary re-renders
- **Context Optimization**: Separate concerns, minimize updates
- **Lazy Loading**: Route-based code splitting

#### Engine Performance
- **Deterministic RNG**: High-quality, fast algorithm
- **Action Validation**: Early error detection
- **State Machine**: O(1) state transitions

---

## Security Considerations

### Client-Side Security

#### Input Validation
- **Action Validation**: Comprehensive battle action checking
- **Type Safety**: TypeScript for compile-time safety
- **Sanitization**: User input cleaning

#### Data Protection
- **Local Storage**: No sensitive data storage
- **Analytics**: Anonymized event tracking
- **Error Handling**: No information leakage

#### Code Security
- **Dependencies**: Zero runtime dependencies
- **Build Process**: Deterministic builds
- **CSP Compatibility**: Content Security Policy support

---

## Deployment Architecture

### Deployment Targets

```mermaid
graph TB
    subgraph "Source Code"
        Repo[Git Repository]
        CI[CI/CD Pipeline]
    end

    subgraph "Build Outputs"
        Library[NPM Package]
        WebApp[Web Application]
        Docs[Documentation]
    end

    subgraph "Distribution"
        NPM[NPM Registry]
        CDN[CDN Hosting]
        Hosting[Web Hosting]
    end

    Repo --> CI
    CI --> Library
    CI --> WebApp
    CI --> Docs

    Library --> NPM
    WebApp --> CDN
    WebApp --> Hosting
```

### Distribution Strategy

#### NPM Package
- **Formats**: ESM, CJS, UMD
- **Tree Shaking**: Optimized bundle sizes
- **Type Definitions**: Full TypeScript support

#### Web Application
- **Static Hosting**: JAMstack deployment
- **CDN**: Global content distribution
- **Progressive Web App**: Offline capability

#### Documentation
- **API Documentation**: Generated from TypeScript
- **Usage Examples**: Interactive demonstrations
- **Architecture Guides**: Technical documentation

---

## Conclusion

The Crookmon Game represents a sophisticated software architecture that successfully balances several competing concerns:

### Architectural Strengths

1. **Separation of Concerns**: Clear boundaries between core logic and UI
2. **Framework Agnostic**: Reusable core engine across platforms
3. **Type Safety**: Comprehensive TypeScript integration
4. **Performance**: Optimized for both development and runtime
5. **Maintainability**: Clean code patterns and documentation
6. **Extensibility**: Event-driven architecture enables easy enhancement

### Technical Excellence

The codebase demonstrates advanced understanding of:
- **Modern JavaScript**: ES2019+ features with broad compatibility
- **React Patterns**: Hooks, Context, Suspense, Error Boundaries
- **State Management**: Finite state machines and event-driven updates
- **Build Systems**: Multi-format distribution and optimization
- **Software Architecture**: Clean architecture principles

This architecture serves as an excellent example of how to build maintainable, scalable, and reusable game engines while providing a complete, production-ready gaming experience.
