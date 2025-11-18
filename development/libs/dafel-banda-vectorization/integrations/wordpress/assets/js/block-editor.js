/**
 * Dafel Banda Gutenberg Block Editor
 * 
 * Provides rich block editor experience for Dafel Banda SVG animations
 */

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { 
    PanelBody, 
    SelectControl, 
    ToggleControl, 
    RangeControl,
    TextControl,
    ColorPalette,
    Button,
    Placeholder,
    Icon
} = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;
const { useState, useEffect } = wp.element;

// Dafel Banda Icon
const dafelIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12z" fill="#1E7FA4"/>
        <path d="M7 8c2 2 4 2 6 0s4 2 6 4-2 4-4 4-4-2-6 0-4-2-6-4 2-4 4-4z" fill="#D0E8F5" opacity="0.7"/>
    </svg>
);

/**
 * Main Banda Animation Block
 */
registerBlockType('dafel/banda-animation', {
    title: __('Dafel Banda Animation', 'dafel-banda'),
    description: __('Professional SVG animation with customizable effects', 'dafel-banda'),
    category: 'media',
    icon: dafelIcon,
    keywords: [
        __('dafel', 'dafel-banda'),
        __('animation', 'dafel-banda'),
        __('svg', 'dafel-banda'),
        __('banda', 'dafel-banda')
    ],
    supports: {
        align: ['left', 'center', 'right', 'wide', 'full'],
        spacing: {
            margin: true,
            padding: true
        }
    },
    attributes: {
        animation: {
            type: 'string',
            default: 'fadeIn'
        },
        size: {
            type: 'string',
            default: 'large'
        },
        interactive: {
            type: 'boolean',
            default: false
        },
        colorScheme: {
            type: 'string',
            default: 'default'
        },
        customCSS: {
            type: 'string',
            default: ''
        },
        speed: {
            type: 'number',
            default: 1
        },
        delay: {
            type: 'number',
            default: 0
        },
        loop: {
            type: 'boolean',
            default: true
        }
    },
    
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const { animation, size, interactive, colorScheme, customCSS, speed, delay, loop } = attributes;
        const [isPreview, setIsPreview] = useState(false);
        
        const blockProps = useBlockProps({
            className: `dafel-banda-block dafel-banda-${size} dafel-banda-scheme-${colorScheme}`
        });
        
        // Animation options
        const animationOptions = [
            { label: __('Fade In', 'dafel-banda'), value: 'fadeIn' },
            { label: __('Wave Horizontal', 'dafel-banda'), value: 'wave' },
            { label: __('Pulse', 'dafel-banda'), value: 'pulse' },
            { label: __('Stagger In', 'dafel-banda'), value: 'staggerIn' },
            { label: __('Interactive', 'dafel-banda'), value: 'interactive' },
            { label: __('Scroll Based', 'dafel-banda'), value: 'scroll' },
            { label: __('Wave Smooth', 'dafel-banda'), value: 'waveSmooth' },
            { label: __('Grid Shimmer', 'dafel-banda'), value: 'gridShimmer' }
        ];
        
        // Size options
        const sizeOptions = [
            { label: __('Small (640px)', 'dafel-banda'), value: 'small' },
            { label: __('Medium (1024px)', 'dafel-banda'), value: 'medium' },
            { label: __('Large (1280px)', 'dafel-banda'), value: 'large' },
            { label: __('Full Width', 'dafel-banda'), value: 'full' }
        ];
        
        // Color scheme options
        const colorSchemeOptions = [
            { label: __('Default Blue', 'dafel-banda'), value: 'default' },
            { label: __('Dark Mode', 'dafel-banda'), value: 'dark' },
            { label: __('Brand Colors', 'dafel-banda'), value: 'brand' },
            { label: __('Sunset', 'dafel-banda'), value: 'sunset' },
            { label: __('Ocean', 'dafel-banda'), value: 'ocean' },
            { label: __('Forest', 'dafel-banda'), value: 'forest' },
            { label: __('Custom', 'dafel-banda'), value: 'custom' }
        ];
        
        // Preview SVG (simplified version for editor)
        const previewSVG = (
            <svg 
                width="100%" 
                height="200" 
                viewBox="0 0 1280 720" 
                xmlns="http://www.w3.org/2000/svg"
                className={`dafel-banda-preview animate-${animation}`}
                style={{
                    animationDuration: `${speed}s`,
                    animationDelay: `${delay}s`,
                    animationIterationCount: loop ? 'infinite' : '1'
                }}
            >
                <defs>
                    <linearGradient id="previewGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D0E8F5" />
                        <stop offset="100%" stopColor="#1E7FA4" />
                    </linearGradient>
                    <linearGradient id="previewGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7DBBDB" />
                        <stop offset="100%" stopColor="#094A62" />
                    </linearGradient>
                </defs>
                
                {/* Simplified banda layers for preview */}
                <path d="M0,200 C320,150 640,250 1280,200 L1280,400 C640,350 320,450 0,400 Z" 
                      fill="url(#previewGrad1)" opacity="0.6" />
                <path d="M0,250 C320,200 640,300 1280,250 L1280,450 C640,400 320,500 0,450 Z" 
                      fill="url(#previewGrad2)" opacity="0.8" />
                
                <text x="640" y="360" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
                    {__('Dafel Banda', 'dafel-banda')} - {animationOptions.find(opt => opt.value === animation)?.label}
                </text>
            </svg>
        );
        
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Animation Settings', 'dafel-banda')} initialOpen={true}>
                        <SelectControl
                            label={__('Animation Type', 'dafel-banda')}
                            value={animation}
                            options={animationOptions}
                            onChange={(value) => setAttributes({ animation: value })}
                        />
                        
                        <RangeControl
                            label={__('Animation Speed', 'dafel-banda')}
                            value={speed}
                            onChange={(value) => setAttributes({ speed: value })}
                            min={0.1}
                            max={10}
                            step={0.1}
                        />
                        
                        <RangeControl
                            label={__('Animation Delay (seconds)', 'dafel-banda')}
                            value={delay}
                            onChange={(value) => setAttributes({ delay: value })}
                            min={0}
                            max={5}
                            step={0.1}
                        />
                        
                        <ToggleControl
                            label={__('Loop Animation', 'dafel-banda')}
                            checked={loop}
                            onChange={(value) => setAttributes({ loop: value })}
                        />
                        
                        <ToggleControl
                            label={__('Interactive Hover Effects', 'dafel-banda')}
                            checked={interactive}
                            onChange={(value) => setAttributes({ interactive: value })}
                        />
                    </PanelBody>
                    
                    <PanelBody title={__('Display Settings', 'dafel-banda')}>
                        <SelectControl
                            label={__('Size', 'dafel-banda')}
                            value={size}
                            options={sizeOptions}
                            onChange={(value) => setAttributes({ size: value })}
                        />
                        
                        <SelectControl
                            label={__('Color Scheme', 'dafel-banda')}
                            value={colorScheme}
                            options={colorSchemeOptions}
                            onChange={(value) => setAttributes({ colorScheme: value })}
                        />
                    </PanelBody>
                    
                    <PanelBody title={__('Advanced', 'dafel-banda')} initialOpen={false}>
                        <TextControl
                            label={__('Custom CSS', 'dafel-banda')}
                            value={customCSS}
                            onChange={(value) => setAttributes({ customCSS: value })}
                            placeholder="margin: 20px; border-radius: 10px;"
                            help={__('Add custom CSS styles', 'dafel-banda')}
                        />
                        
                        <Button
                            isPrimary
                            onClick={() => setIsPreview(!isPreview)}
                        >
                            {isPreview ? __('Hide Preview', 'dafel-banda') : __('Show Preview', 'dafel-banda')}
                        </Button>
                    </PanelBody>
                </InspectorControls>
                
                <div {...blockProps}>
                    {isPreview ? (
                        <div className="dafel-banda-editor-preview">
                            {previewSVG}
                        </div>
                    ) : (
                        <Placeholder
                            icon={dafelIcon}
                            label={__('Dafel Banda Animation', 'dafel-banda')}
                            instructions={__('Configure your animation settings in the sidebar and click "Show Preview" to see the result.', 'dafel-banda')}
                        >
                            <div className="dafel-banda-placeholder-content">
                                <p><strong>{__('Animation:', 'dafel-banda')}</strong> {animationOptions.find(opt => opt.value === animation)?.label}</p>
                                <p><strong>{__('Size:', 'dafel-banda')}</strong> {sizeOptions.find(opt => opt.value === size)?.label}</p>
                                <p><strong>{__('Scheme:', 'dafel-banda')}</strong> {colorSchemeOptions.find(opt => opt.value === colorScheme)?.label}</p>
                                {interactive && <p><strong>{__('Interactive:', 'dafel-banda')}</strong> {__('Yes', 'dafel-banda')}</p>}
                            </div>
                        </Placeholder>
                    )}
                </div>
            </>
        );
    },
    
    save: () => {
        // Return null because we're using render_callback for dynamic content
        return null;
    }
});

/**
 * Hero Section Block
 */
registerBlockType('dafel/banda-hero', {
    title: __('Dafel Banda Hero', 'dafel-banda'),
    description: __('Full-screen hero section with animated background', 'dafel-banda'),
    category: 'layout',
    icon: dafelIcon,
    keywords: [
        __('hero', 'dafel-banda'),
        __('dafel', 'dafel-banda'),
        __('background', 'dafel-banda'),
        __('section', 'dafel-banda')
    ],
    supports: {
        align: ['full'],
        spacing: {
            margin: true
        }
    },
    attributes: {
        title: {
            type: 'string',
            default: ''
        },
        subtitle: {
            type: 'string',
            default: ''
        },
        overlayOpacity: {
            type: 'number',
            default: 0.7
        },
        height: {
            type: 'string',
            default: '100vh'
        },
        textColor: {
            type: 'string',
            default: '#ffffff'
        },
        animation: {
            type: 'string',
            default: 'wave'
        }
    },
    
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const { title, subtitle, overlayOpacity, height, textColor, animation } = attributes;
        
        const blockProps = useBlockProps({
            className: 'dafel-banda-hero-block'
        });
        
        const heightOptions = [
            { label: __('Small (50vh)', 'dafel-banda'), value: '50vh' },
            { label: __('Medium (75vh)', 'dafel-banda'), value: '75vh' },
            { label: __('Full Screen (100vh)', 'dafel-banda'), value: '100vh' },
            { label: __('Large (120vh)', 'dafel-banda'), value: '120vh' },
            { label: __('Custom', 'dafel-banda'), value: 'custom' }
        ];
        
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Content Settings', 'dafel-banda')} initialOpen={true}>
                        <TextControl
                            label={__('Hero Title', 'dafel-banda')}
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('Enter hero title...', 'dafel-banda')}
                        />
                        
                        <TextControl
                            label={__('Hero Subtitle', 'dafel-banda')}
                            value={subtitle}
                            onChange={(value) => setAttributes({ subtitle: value })}
                            placeholder={__('Enter hero subtitle...', 'dafel-banda')}
                        />
                        
                        <div>
                            <label>{__('Text Color', 'dafel-banda')}</label>
                            <ColorPalette
                                value={textColor}
                                onChange={(value) => setAttributes({ textColor: value || '#ffffff' })}
                                colors={[
                                    { name: 'White', color: '#ffffff' },
                                    { name: 'Black', color: '#000000' },
                                    { name: 'Light Blue', color: '#D0E8F5' },
                                    { name: 'Dark Blue', color: '#1E7FA4' }
                                ]}
                            />
                        </div>
                    </PanelBody>
                    
                    <PanelBody title={__('Layout Settings', 'dafel-banda')}>
                        <SelectControl
                            label={__('Height', 'dafel-banda')}
                            value={height}
                            options={heightOptions}
                            onChange={(value) => setAttributes({ height: value })}
                        />
                        
                        <RangeControl
                            label={__('Overlay Opacity', 'dafel-banda')}
                            value={overlayOpacity}
                            onChange={(value) => setAttributes({ overlayOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                        
                        <SelectControl
                            label={__('Background Animation', 'dafel-banda')}
                            value={animation}
                            options={[
                                { label: __('Wave', 'dafel-banda'), value: 'wave' },
                                { label: __('Pulse', 'dafel-banda'), value: 'pulse' },
                                { label: __('Static', 'dafel-banda'), value: 'none' }
                            ]}
                            onChange={(value) => setAttributes({ animation: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div {...blockProps}>
                    <div 
                        className="dafel-banda-hero-preview"
                        style={{
                            height: '300px',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #D0E8F5 0%, #1E7FA4 100%)',
                            color: textColor,
                            textAlign: 'center'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `rgba(0,0,0,${overlayOpacity})`,
                            zIndex: 1
                        }}></div>
                        
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            {title ? (
                                <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
                                    {title}
                                </h1>
                            ) : (
                                <h1 style={{ fontSize: '2rem', margin: '0 0 1rem 0', opacity: 0.7 }}>
                                    {__('Hero Title', 'dafel-banda')}
                                </h1>
                            )}
                            
                            {subtitle ? (
                                <p style={{ fontSize: '1.25rem', margin: 0, opacity: 0.9 }}>
                                    {subtitle}
                                </p>
                            ) : (
                                <p style={{ fontSize: '1rem', margin: 0, opacity: 0.5 }}>
                                    {__('Hero subtitle text', 'dafel-banda')}
                                </p>
                            )}
                        </div>
                        
                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            zIndex: 3
                        }}>
                            {__('Preview - Height:', 'dafel-banda')} {height}
                        </div>
                    </div>
                </div>
            </>
        );
    },
    
    save: () => {
        return null;
    }
});

/**
 * Animated Separator Block
 */
registerBlockType('dafel/banda-separator', {
    title: __('Dafel Banda Separator', 'dafel-banda'),
    description: __('Animated section separator', 'dafel-banda'),
    category: 'layout',
    icon: dafelIcon,
    keywords: [
        __('separator', 'dafel-banda'),
        __('divider', 'dafel-banda'),
        __('section', 'dafel-banda')
    ],
    attributes: {
        height: {
            type: 'number',
            default: 100
        },
        animation: {
            type: 'string',
            default: 'wave'
        },
        colorScheme: {
            type: 'string',
            default: 'default'
        }
    },
    
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const { height, animation, colorScheme } = attributes;
        
        const blockProps = useBlockProps({
            className: 'dafel-banda-separator-block'
        });
        
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Separator Settings', 'dafel-banda')} initialOpen={true}>
                        <RangeControl
                            label={__('Height (px)', 'dafel-banda')}
                            value={height}
                            onChange={(value) => setAttributes({ height: value })}
                            min={50}
                            max={300}
                            step={10}
                        />
                        
                        <SelectControl
                            label={__('Animation', 'dafel-banda')}
                            value={animation}
                            options={[
                                { label: __('Wave', 'dafel-banda'), value: 'wave' },
                                { label: __('Pulse', 'dafel-banda'), value: 'pulse' },
                                { label: __('Static', 'dafel-banda'), value: 'none' }
                            ]}
                            onChange={(value) => setAttributes({ animation: value })}
                        />
                        
                        <SelectControl
                            label={__('Color Scheme', 'dafel-banda')}
                            value={colorScheme}
                            options={[
                                { label: __('Default', 'dafel-banda'), value: 'default' },
                                { label: __('Light', 'dafel-banda'), value: 'light' },
                                { label: __('Dark', 'dafel-banda'), value: 'dark' }
                            ]}
                            onChange={(value) => setAttributes({ colorScheme: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div {...blockProps}>
                    <div 
                        className="dafel-banda-separator-preview"
                        style={{
                            height: `${height}px`,
                            background: 'linear-gradient(90deg, #D0E8F5 0%, #1E7FA4 50%, #D0E8F5 100%)',
                            opacity: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ 
                            background: 'rgba(255,255,255,0.9)', 
                            padding: '5px 15px', 
                            borderRadius: '15px',
                            fontSize: '14px',
                            color: '#1E7FA4'
                        }}>
                            {__('Animated Separator', 'dafel-banda')} - {height}px
                        </span>
                    </div>
                </div>
            </>
        );
    },
    
    save: () => {
        return null;
    }
});

// Add custom CSS for editor
wp.domReady(() => {
    const editorCSS = `
        .dafel-banda-preview {
            border: 2px dashed #1E7FA4;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .dafel-banda-placeholder-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
        }
        
        .dafel-banda-placeholder-content p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .animate-fadeIn {
            animation: fadeIn 2s ease-in-out;
        }
        
        .animate-wave {
            animation: wave 4s ease-in-out infinite;
        }
        
        .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes wave {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(10px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = editorCSS;
    document.head.appendChild(style);
});