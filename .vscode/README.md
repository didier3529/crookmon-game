# VS Code Configuration for Crookmon Game

This folder contains optimized VS Code configuration files designed to enhance your development experience with the Crookmon Game project. These configurations are specifically tailored to work with the technical architecture documented in `TECHNICAL_ARCHITECTURE.md`.

## 📁 Configuration Files

### `settings.json`
**Purpose**: Core editor and workspace settings optimized for React/TypeScript development

**Key Features**:
- **TypeScript Integration**: Enhanced IntelliSense, auto-imports, and type checking
- **React Development**: JSX/TSX support with React-specific snippets
- **Markdown Enhancement**: Optimized for technical documentation with Mermaid support
- **Code Quality**: ESLint and Prettier integration with auto-formatting
- **Performance**: File watching optimizations and memory management
- **Project Structure**: File nesting and explorer configurations

### `extensions.json`
**Purpose**: Recommended extensions that complement the project architecture

**Categories**:
- **Core Development**: TypeScript, React, ESLint, Prettier
- **Documentation**: Markdown All-in-One, Mermaid diagram support
- **Testing**: Jest integration and test runners
- **Git Integration**: GitLens, Git Graph, GitHub Actions
- **Code Quality**: Error Lens, Todo Tree, spell checking

### `launch.json`
**Purpose**: Debugging configurations for all project components

**Debug Configurations**:
- 🚀 **React App**: Debug the web application in Chrome
- 🎮 **Battle Engine**: Debug core engine logic in Node.js
- 🧪 **Jest Tests**: Debug unit and integration tests
- 📦 **Rollup Build**: Debug build process issues
- 🤖 **AI System**: Debug AI move generation algorithms

### `tasks.json`
**Purpose**: Automated build and development tasks

**Task Categories**:
- **Build**: Project compilation, library bundling, watch modes
- **Testing**: Run tests, coverage, watch tests
- **Quality**: Linting, formatting, type checking
- **Documentation**: Markdown preview, Mermaid validation
- **Cleanup**: Clear build artifacts and dependencies

## 🚀 Getting Started

### 1. Install Recommended Extensions

When you open the project, VS Code will prompt you to install recommended extensions. Click **"Install All"** to get the complete setup.

Alternatively, run:
```bash
code --install-extension <extension-id>
```

### 2. Key Shortcuts and Commands

#### **Development Workflow**
- `Ctrl+Shift+P` → Type "Tasks" → Select development tasks
- `F5` → Start debugging (React app or Node.js engine)
- `Ctrl+Shift+` → Build project
- `Ctrl+Shift+T` → Run tests

#### **Code Quality**
- `Shift+Alt+F` → Format document (Prettier)
- `Ctrl+.` → Quick fix (ESLint)
- `F2` → Rename symbol (with auto-import updates)

#### **Documentation**
- `Ctrl+Shift+V` → Preview Markdown
- `Ctrl+K V` → Open Markdown preview side-by-side

### 3. Workspace Setup

The configuration automatically:
- Sets up file associations for `.tsx`, `.ts`, `.js`, `.jsx`
- Configures proper indentation (2 spaces)
- Enables auto-save and formatting on save
- Sets up problem matchers for build tools
- Configures search exclusions for `node_modules`, `dist`

## 🎯 Optimized Workflows

### **React Development**
1. **Component Creation**: Use React snippets (`rafce`, `useState`, etc.)
2. **Auto-Import**: TypeScript automatically manages imports
3. **Debugging**: Set breakpoints and use "🚀 Launch React App"
4. **Hot Reload**: Changes automatically refresh in browser

### **Battle Engine Development**
1. **Pure Functions**: Core engine functions are debuggable in Node.js
2. **State Machine**: Visual debugging of FSM transitions
3. **AI Testing**: Use "🤖 Debug AI Move Generation" for algorithm testing
4. **RNG Testing**: Deterministic debugging with seed values

### **Documentation Workflow**
1. **Live Preview**: Markdown automatically previews with Mermaid diagrams
2. **TOC Generation**: Table of contents updates automatically
3. **Diagram Validation**: Mermaid syntax checking and preview
4. **Cross-References**: File links and references work seamlessly

### **Testing Workflow**
1. **Watch Mode**: Tests run automatically on file changes
2. **Debug Tests**: Set breakpoints in test files
3. **Coverage**: Visual coverage reporting in editor
4. **File-Specific**: Test only the current file with "🎯 Test Current File"

## 🔧 Customization

### **Personal Preferences**
You can override any setting in your user `settings.json`:
```json
{
  "editor.fontSize": 16,
  "workbench.colorTheme": "GitHub Dark"
}
```

### **Project-Specific Adjustments**
Modify `.vscode/settings.json` for team-wide changes:
```json
{
  "typescript.preferences.importModuleSpecifier": "absolute"
}
```

## 🎮 Battle Engine Specific Features

### **State Machine Debugging**
- Set breakpoints in `statemachine.js`
- Watch state transitions in debug console
- Inspect FSM configuration immutability

### **Event System Debugging**
- Monitor event emissions in `eventemitter.js`
- Track subscriber count and memory leaks
- Debug event ordering and timing

### **RNG System Testing**
- Use deterministic seeds for reproducible debugging
- Step through random number generation
- Validate distribution and algorithm correctness

### **AI Move Generation**
- Profile minimax algorithm performance
- Debug alpha-beta pruning efficiency
- Test move evaluation heuristics

## 📊 Performance Monitoring

### **Build Performance**
- Watch build times in terminal
- Monitor bundle size with Rollup visualizer
- Track TypeScript compilation speed

### **Runtime Performance**
- Use React DevTools integration
- Monitor re-render cycles
- Profile memory usage in Chrome DevTools

### **Test Performance**
- Track test execution times
- Monitor coverage changes
- Profile Jest test runs

## 🔍 Troubleshooting

### **Common Issues**

#### **TypeScript Errors**
1. Check `tsconfig.json` configuration
2. Verify extension installations
3. Restart TypeScript language service: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

#### **Debugging Not Working**
1. Ensure source maps are enabled
2. Check `launch.json` file paths
3. Verify Node.js/Chrome debug ports

#### **Extensions Not Loading**
1. Check extension compatibility
2. Disable conflicting extensions
3. Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"

#### **Performance Issues**
1. Exclude large directories from file watching
2. Disable unused extensions
3. Increase VS Code memory limit

### **Advanced Configuration**

#### **Custom Snippets**
Create project-specific snippets in `.vscode/snippets/`:
```json
{
  "Battle Engine Test": {
    "prefix": "betest",
    "body": [
      "describe('$1', () => {",
      "  it('should $2', () => {",
      "    const battleState = initializeBattle($3);",
      "    $0",
      "  });",
      "});"
    ]
  }
}
```

#### **Custom Tasks**
Add project-specific tasks to `tasks.json`:
```json
{
  "label": "🎮 Generate Battle Report",
  "type": "shell",
  "command": "node",
  "args": ["scripts/generate-battle-report.js"]
}
```

## 📚 Resources

- [VS Code Documentation](https://code.visualstudio.com/docs)
- [TypeScript in VS Code](https://code.visualstudio.com/docs/languages/typescript)
- [React Development](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial)
- [Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Task Configuration](https://code.visualstudio.com/docs/editor/tasks)

## 🤝 Contributing

When contributing to the project:

1. **Maintain Configuration**: Keep VS Code configs updated with project changes
2. **Document Extensions**: Add new required extensions to `extensions.json`
3. **Test Configurations**: Ensure debug configs work across environments
4. **Share Best Practices**: Update this README with new workflows

---

**Happy Coding! 🎮✨**

This configuration setup is designed to maximize your productivity while working with the sophisticated Crookmon Game architecture. The combination of intelligent TypeScript support, React development tools, comprehensive debugging, and documentation features creates an optimal development environment for this advanced gaming project.
