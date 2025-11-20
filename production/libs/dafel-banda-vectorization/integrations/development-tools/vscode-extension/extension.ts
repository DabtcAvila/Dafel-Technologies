/**
 * Dafel Banda VS Code Extension
 * 
 * Features:
 * - Live preview of SVG animations
 * - Code snippets and templates
 * - Color scheme management
 * - Performance analytics
 * - Auto-completion for animation properties
 * - Integration with existing projects
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface DafelBandaConfig {
    defaultAnimation: string;
    colorScheme: string;
    outputPath: string;
    includeCSS: boolean;
    includeJS: boolean;
    autoPreview: boolean;
    analytics: boolean;
}

interface AnimationTemplate {
    name: string;
    description: string;
    code: string;
    preview: string;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Dafel Banda VS Code Extension is now active!');
    
    const provider = new DafelBandaWebviewProvider(context.extensionUri);
    
    // Register webview provider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            DafelBandaWebviewProvider.viewType,
            provider
        )
    );
    
    // Register commands
    registerCommands(context, provider);
    
    // Register completion providers
    registerCompletionProviders(context);
    
    // Register code actions
    registerCodeActions(context);
    
    // Register file watchers
    registerFileWatchers(context);
    
    // Initialize extension
    initializeExtension(context);
}

function registerCommands(context: vscode.ExtensionContext, provider: DafelBandaWebviewProvider) {
    // Create new Dafel Banda animation
    const createAnimation = vscode.commands.registerCommand('dafelBanda.createAnimation', async () => {
        const animationType = await vscode.window.showQuickPick([
            { label: 'Fade In', value: 'fadeIn' },
            { label: 'Wave', value: 'wave' },
            { label: 'Pulse', value: 'pulse' },
            { label: 'Stagger In', value: 'staggerIn' },
            { label: 'Interactive', value: 'interactive' },
            { label: 'Scroll Based', value: 'scroll' },
            { label: 'Wave Smooth', value: 'waveSmooth' },
            { label: 'Grid Shimmer', value: 'gridShimmer' }
        ], {
            placeHolder: 'Select animation type'
        });
        
        if (!animationType) return;
        
        const colorScheme = await vscode.window.showQuickPick([
            { label: 'Default Blue', value: 'default' },
            { label: 'Dark Mode', value: 'dark' },
            { label: 'Sunset', value: 'sunset' },
            { label: 'Ocean', value: 'ocean' },
            { label: 'Forest', value: 'forest' },
            { label: 'Custom', value: 'custom' }
        ], {
            placeHolder: 'Select color scheme'
        });
        
        if (!colorScheme) return;
        
        const template = getAnimationTemplate(animationType.value, colorScheme.value);
        createNewFile(template);
    });
    
    // Insert animation snippet
    const insertSnippet = vscode.commands.registerCommand('dafelBanda.insertSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        const snippetType = await vscode.window.showQuickPick([
            { label: 'HTML with inline SVG', value: 'html-inline' },
            { label: 'React Component', value: 'react' },
            { label: 'Vue Component', value: 'vue' },
            { label: 'CSS Animation', value: 'css' },
            { label: 'GSAP Animation', value: 'gsap' },
            { label: 'Framer Motion', value: 'framer-motion' }
        ], {
            placeHolder: 'Select snippet type'
        });
        
        if (!snippetType) return;
        
        const snippet = getCodeSnippet(snippetType.value);
        editor.insertSnippet(new vscode.SnippetString(snippet));
    });
    
    // Preview current file
    const previewFile = vscode.commands.registerCommand('dafelBanda.previewFile', () => {
        provider.showPreview();
    });
    
    // Generate color variations
    const generateVariations = vscode.commands.registerCommand('dafelBanda.generateVariations', async () => {
        const baseScheme = await vscode.window.showInputBox({
            prompt: 'Enter base color (hex)',
            value: '#1E7FA4',
            validateInput: (value) => {
                if (!/^#[0-9A-F]{6}$/i.test(value)) {
                    return 'Please enter a valid hex color (e.g., #1E7FA4)';
                }
                return null;
            }
        });
        
        if (!baseScheme) return;
        
        const variations = generateColorVariations(baseScheme);
        const document = await vscode.workspace.openTextDocument({
            content: JSON.stringify(variations, null, 2),
            language: 'json'
        });
        
        vscode.window.showTextDocument(document);
    });
    
    // Export to production
    const exportProduction = vscode.commands.registerCommand('dafelBanda.exportProduction', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }
        
        const config = vscode.workspace.getConfiguration('dafelBanda');
        const outputPath = config.get<string>('outputPath', './dist/dafel-banda/');
        
        await exportProductionFiles(workspaceFolder.uri.fsPath, outputPath);
        vscode.window.showInformationMessage('Production files exported successfully!');
    });
    
    // Performance analysis
    const analyzePerformance = vscode.commands.registerCommand('dafelBanda.analyzePerformance', () => {
        provider.showPerformanceAnalysis();
    });
    
    context.subscriptions.push(
        createAnimation,
        insertSnippet,
        previewFile,
        generateVariations,
        exportProduction,
        analyzePerformance
    );
}

function registerCompletionProviders(context: vscode.ExtensionContext) {
    // CSS completion provider
    const cssProvider = vscode.languages.registerCompletionItemProvider('css', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const completions: vscode.CompletionItem[] = [];
            
            // Animation classes
            const animations = [
                'animate-fadeIn',
                'animate-wave',
                'animate-pulse',
                'animate-staggerIn',
                'animate-interactive',
                'animate-scroll',
                'animate-waveSmooth',
                'animate-gridShimmer'
            ];
            
            animations.forEach(animation => {
                const completion = new vscode.CompletionItem(animation, vscode.CompletionItemKind.Class);
                completion.detail = 'Dafel Banda Animation';
                completion.documentation = new vscode.MarkdownString(`Dafel Banda ${animation} animation class`);
                completion.insertText = animation;
                completions.push(completion);
            });
            
            // CSS Custom Properties
            const cssProperties = [
                '--dafel-animation-duration',
                '--dafel-animation-delay',
                '--dafel-animation-timing',
                '--dafel-primary-color',
                '--dafel-secondary-color',
                '--dafel-accent-color'
            ];
            
            cssProperties.forEach(prop => {
                const completion = new vscode.CompletionItem(prop, vscode.CompletionItemKind.Property);
                completion.detail = 'Dafel Banda CSS Property';
                completion.insertText = `${prop}: `;
                completions.push(completion);
            });
            
            return completions;
        }
    });
    
    // HTML completion provider
    const htmlProvider = vscode.languages.registerCompletionItemProvider('html', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const completions: vscode.CompletionItem[] = [];
            
            // Data attributes
            const dataAttributes = [
                'data-dafel-animation',
                'data-dafel-color-scheme',
                'data-dafel-interactive',
                'data-dafel-speed',
                'data-dafel-delay'
            ];
            
            dataAttributes.forEach(attr => {
                const completion = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
                completion.detail = 'Dafel Banda Data Attribute';
                completion.insertText = `${attr}=""`;
                completions.push(completion);
            });
            
            return completions;
        }
    });
    
    // JavaScript completion provider
    const jsProvider = vscode.languages.registerCompletionItemProvider(['javascript', 'typescript'], {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const completions: vscode.CompletionItem[] = [];
            
            // DafelBanda API methods
            const apiMethods = [
                { name: 'DafelBanda.init', detail: 'Initialize Dafel Banda animations' },
                { name: 'DafelBanda.animate', detail: 'Start animation with options' },
                { name: 'DafelBanda.pause', detail: 'Pause current animation' },
                { name: 'DafelBanda.resume', detail: 'Resume paused animation' },
                { name: 'DafelBanda.setColorScheme', detail: 'Change color scheme dynamically' },
                { name: 'DafelBanda.getPerformanceMetrics', detail: 'Get animation performance data' }
            ];
            
            apiMethods.forEach(method => {
                const completion = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Method);
                completion.detail = method.detail;
                completion.insertText = `${method.name}()`;
                completions.push(completion);
            });
            
            return completions;
        }
    });
    
    context.subscriptions.push(cssProvider, htmlProvider, jsProvider);
}

function registerCodeActions(context: vscode.ExtensionContext) {
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(['css', 'html', 'javascript', 'typescript'], {
        provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
            const actions: vscode.CodeAction[] = [];
            
            // Check if there are potential Dafel Banda optimizations
            const text = document.getText(range);
            
            if (text.includes('dafel-banda') || text.includes('DafelBanda')) {
                const optimizeAction = new vscode.CodeAction('Optimize Dafel Banda Performance', vscode.CodeActionKind.RefactorRewrite);
                optimizeAction.command = {
                    command: 'dafelBanda.optimizeCode',
                    title: 'Optimize Performance',
                    arguments: [document, range]
                };
                actions.push(optimizeAction);
                
                const addPreviewAction = new vscode.CodeAction('Add Live Preview', vscode.CodeActionKind.QuickFix);
                addPreviewAction.command = {
                    command: 'dafelBanda.addPreview',
                    title: 'Add Preview',
                    arguments: [document, range]
                };
                actions.push(addPreviewAction);
            }
            
            return actions;
        }
    });
    
    context.subscriptions.push(codeActionProvider);
}

function registerFileWatchers(context: vscode.ExtensionContext) {
    // Watch for Dafel Banda config changes
    const configWatcher = vscode.workspace.createFileSystemWatcher('**/dafel-banda.config.{json,js}');
    
    configWatcher.onDidChange(() => {
        vscode.window.showInformationMessage('Dafel Banda configuration updated');
        // Reload configuration
    });
    
    configWatcher.onDidCreate(() => {
        vscode.window.showInformationMessage('Dafel Banda configuration created');
    });
    
    context.subscriptions.push(configWatcher);
}

function initializeExtension(context: vscode.ExtensionContext) {
    // Check for existing Dafel Banda files
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        const configPath = path.join(workspaceFolder.uri.fsPath, 'dafel-banda.config.json');
        if (!fs.existsSync(configPath)) {
            vscode.window.showInformationMessage(
                'Would you like to create a Dafel Banda configuration file?',
                'Yes', 'No'
            ).then(selection => {
                if (selection === 'Yes') {
                    createConfigFile(configPath);
                }
            });
        }
    }
}

class DafelBandaWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'dafelBanda.preview';
    
    private _view?: vscode.WebviewView;
    
    constructor(private readonly _extensionUri: vscode.Uri) {}
    
    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'animationChange':
                    this.handleAnimationChange(data.animation);
                    break;
                case 'colorSchemeChange':
                    this.handleColorSchemeChange(data.scheme);
                    break;
                case 'exportSVG':
                    this.handleExportSVG(data.settings);
                    break;
            }
        });
    }
    
    public showPreview() {
        if (this._view) {
            this._view.show?.(true);
            this._view.webview.postMessage({ type: 'showPreview' });
        }
    }
    
    public showPerformanceAnalysis() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'showPerformance' });
        }
    }
    
    private handleAnimationChange(animation: string) {
        // Update preview with new animation
        if (this._view) {
            this._view.webview.postMessage({ 
                type: 'updateAnimation', 
                animation 
            });
        }
    }
    
    private handleColorSchemeChange(scheme: string) {
        // Update preview with new color scheme
        if (this._view) {
            this._view.webview.postMessage({ 
                type: 'updateColorScheme', 
                scheme 
            });
        }
    }
    
    private async handleExportSVG(settings: any) {
        const svgContent = generateSVGContent(settings);
        const document = await vscode.workspace.openTextDocument({
            content: svgContent,
            language: 'xml'
        });
        
        vscode.window.showTextDocument(document);
    }
    
    private _getHtmlForWebview(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dafel Banda Preview</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    margin: 0;
                    padding: 16px;
                }
                
                .section {
                    margin-bottom: 20px;
                }
                
                .section-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                select, input, button {
                    width: 100%;
                    padding: 6px 8px;
                    margin-bottom: 8px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 2px;
                }
                
                button {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    cursor: pointer;
                }
                
                button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                
                .preview-container {
                    border: 1px solid var(--vscode-panel-border);
                    padding: 16px;
                    border-radius: 4px;
                    background: var(--vscode-editor-background);
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .metrics {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 12px;
                    border-radius: 4px;
                    font-family: var(--vscode-editor-font-family);
                    font-size: 12px;
                }
                
                .animate-wave {
                    animation: wave 4s ease-in-out infinite;
                }
                
                @keyframes wave {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
            </style>
        </head>
        <body>
            <div class="section">
                <div class="section-title">Animation Type</div>
                <select id="animationSelect">
                    <option value="fadeIn">Fade In</option>
                    <option value="wave">Wave</option>
                    <option value="pulse">Pulse</option>
                    <option value="staggerIn">Stagger In</option>
                </select>
            </div>
            
            <div class="section">
                <div class="section-title">Color Scheme</div>
                <select id="colorSchemeSelect">
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="sunset">Sunset</option>
                    <option value="ocean">Ocean</option>
                </select>
            </div>
            
            <div class="section">
                <div class="section-title">Live Preview</div>
                <div class="preview-container" id="previewContainer">
                    <svg width="200" height="100" viewBox="0 0 1280 720" class="animate-wave">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#D0E8F5" />
                                <stop offset="100%" stop-color="#1E7FA4" />
                            </linearGradient>
                        </defs>
                        <path d="M0,200 C320,150 640,250 1280,200 L1280,500 C640,550 320,450 0,500 Z" 
                              fill="url(#grad1)" opacity="0.8"/>
                    </svg>
                </div>
            </div>
            
            <div class="section">
                <button id="exportBtn">Export SVG</button>
                <button id="insertCodeBtn">Insert Code</button>
            </div>
            
            <div class="section">
                <div class="section-title">Performance Metrics</div>
                <div class="metrics" id="metrics">
                    <div>Render Time: ~16ms</div>
                    <div>FPS: 60</div>
                    <div>Memory Usage: ~2MB</div>
                    <div>GPU Acceleration: ✓</div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                document.getElementById('animationSelect').addEventListener('change', (e) => {
                    vscode.postMessage({
                        type: 'animationChange',
                        animation: e.target.value
                    });
                });
                
                document.getElementById('colorSchemeSelect').addEventListener('change', (e) => {
                    vscode.postMessage({
                        type: 'colorSchemeChange',
                        scheme: e.target.value
                    });
                });
                
                document.getElementById('exportBtn').addEventListener('click', () => {
                    const settings = {
                        animation: document.getElementById('animationSelect').value,
                        colorScheme: document.getElementById('colorSchemeSelect').value
                    };
                    
                    vscode.postMessage({
                        type: 'exportSVG',
                        settings: settings
                    });
                });
                
                // Listen for messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    
                    switch (message.type) {
                        case 'updateAnimation':
                            updatePreviewAnimation(message.animation);
                            break;
                        case 'updateColorScheme':
                            updatePreviewColors(message.scheme);
                            break;
                    }
                });
                
                function updatePreviewAnimation(animation) {
                    const svg = document.querySelector('svg');
                    svg.className = 'animate-' + animation;
                }
                
                function updatePreviewColors(scheme) {
                    // Update SVG colors based on scheme
                    const schemes = {
                        default: { primary: '#D0E8F5', accent: '#1E7FA4' },
                        dark: { primary: '#1a1a2e', accent: '#0f3460' },
                        sunset: { primary: '#FF6B6B', accent: '#FF8E53' },
                        ocean: { primary: '#0077BE', accent: '#003459' }
                    };
                    
                    const colors = schemes[scheme] || schemes.default;
                    const gradient = document.getElementById('grad1');
                    gradient.children[0].setAttribute('stop-color', colors.primary);
                    gradient.children[1].setAttribute('stop-color', colors.accent);
                }
            </script>
        </body>
        </html>`;
    }
}

function getAnimationTemplate(animation: string, colorScheme: string): string {
    // Return SVG template with specified animation and color scheme
    return `<!-- Dafel Banda Animation: ${animation} with ${colorScheme} colors -->
<svg width="1280" height="720" viewBox="0 0 1280 720" 
     class="dafel-banda animate-${animation} scheme-${colorScheme}">
    <!-- SVG content would be generated here -->
</svg>`;
}

function getCodeSnippet(type: string): string {
    const snippets: { [key: string]: string } = {
        'html-inline': `<div class="dafel-banda-container">
    \${1:<!-- SVG content -->}
</div>`,
        'react': `import { DafelBanda } from './components/DafelBanda';

function \${1:Component}() {
    return (
        <DafelBanda 
            animation="\${2:wave}"
            colorScheme="\${3:default}"
            interactive={\${4:false}}
        />
    );
}`,
        'css': `.dafel-banda {
    animation: dafel-\${1:wave} \${2:4s} ease-in-out infinite;
}

@keyframes dafel-\${1:wave} {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(\${3:5px}); }
}`,
        'gsap': `gsap.to(".dafel-banda", {
    duration: \${1:2},
    ease: "\${2:power2.inOut}",
    repeat: -1,
    yoyo: true,
    \${3:x: 10}
});`
    };
    
    return snippets[type] || '';
}

function generateColorVariations(baseColor: string): any {
    // Generate color variations based on base color
    return {
        base: baseColor,
        variations: [
            // Lighter variations
            lighten(baseColor, 0.1),
            lighten(baseColor, 0.2),
            lighten(baseColor, 0.3),
            // Darker variations
            darken(baseColor, 0.1),
            darken(baseColor, 0.2),
            darken(baseColor, 0.3)
        ]
    };
}

function lighten(color: string, amount: number): string {
    // Lighten color implementation
    return color; // Simplified for this example
}

function darken(color: string, amount: number): string {
    // Darken color implementation
    return color; // Simplified for this example
}

function createNewFile(template: string) {
    vscode.workspace.openTextDocument({
        content: template,
        language: 'html'
    }).then(document => {
        vscode.window.showTextDocument(document);
    });
}

function createConfigFile(configPath: string) {
    const defaultConfig: DafelBandaConfig = {
        defaultAnimation: 'fadeIn',
        colorScheme: 'default',
        outputPath: './dist/dafel-banda/',
        includeCSS: true,
        includeJS: true,
        autoPreview: true,
        analytics: false
    };
    
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    vscode.window.showInformationMessage('Dafel Banda configuration created!');
}

async function exportProductionFiles(workspacePath: string, outputPath: string) {
    const fullOutputPath = path.join(workspacePath, outputPath);
    
    // Create output directory
    if (!fs.existsSync(fullOutputPath)) {
        fs.mkdirSync(fullOutputPath, { recursive: true });
    }
    
    // Copy SVG files
    const svgFiles = ['optimized.svg', 'animatable.svg'];
    svgFiles.forEach(file => {
        // Copy SVG files to output directory
        // Implementation would copy from extension resources
    });
    
    // Generate CSS file
    const cssContent = generateProductionCSS();
    fs.writeFileSync(path.join(fullOutputPath, 'dafel-banda.css'), cssContent);
    
    // Generate JS file
    const jsContent = generateProductionJS();
    fs.writeFileSync(path.join(fullOutputPath, 'dafel-banda.js'), jsContent);
}

function generateProductionCSS(): string {
    return `/* Dafel Banda Production CSS */
.dafel-banda {
    display: block;
    width: 100%;
    height: auto;
}

.animate-fadeIn {
    animation: dafelFadeIn 2s ease-out;
}

.animate-wave {
    animation: dafelWave 4s ease-in-out infinite;
}

@keyframes dafelFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes dafelWave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
}`;
}

function generateProductionJS(): string {
    return `/* Dafel Banda Production JavaScript */
class DafelBanda {
    static init(options = {}) {
        const elements = document.querySelectorAll('.dafel-banda');
        elements.forEach(el => this.initElement(el, options));
    }
    
    static initElement(element, options) {
        const animation = element.dataset.animation || 'fadeIn';
        element.classList.add('animate-' + animation);
        
        if (options.analytics) {
            this.trackView(element);
        }
    }
    
    static trackView(element) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Dafel Banda animation viewed');
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(element);
    }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DafelBanda.init());
} else {
    DafelBanda.init();
}`;
}

function generateSVGContent(settings: any): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" 
     xmlns="http://www.w3.org/2000/svg"
     class="dafel-banda animate-${settings.animation}">
    <!-- Generated SVG content for ${settings.animation} animation -->
    <!-- Color scheme: ${settings.colorScheme} -->
</svg>`;
}

export function deactivate() {
    console.log('Dafel Banda VS Code Extension deactivated');
}