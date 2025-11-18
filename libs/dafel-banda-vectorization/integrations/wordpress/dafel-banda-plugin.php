<?php
/**
 * Plugin Name: Dafel Banda SVG Animation
 * Plugin URI: https://dafel.com.mx
 * Description: Enterprise-grade SVG animation plugin with Gutenberg blocks for the Dafel Banda system
 * Version: 1.0.0
 * Author: Dafel Technologies
 * License: MIT
 * Text Domain: dafel-banda
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DAFEL_BANDA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DAFEL_BANDA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DAFEL_BANDA_VERSION', '1.0.0');

/**
 * Main Dafel Banda Plugin Class
 */
class DafelBandaPlugin {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Register Gutenberg blocks
        $this->register_blocks();
        
        // Add shortcodes
        add_shortcode('dafel_banda', array($this, 'shortcode_handler'));
        
        // Load text domain
        load_plugin_textdomain('dafel-banda', false, dirname(plugin_basename(__FILE__)) . '/languages/');
    }
    
    /**
     * Register Gutenberg blocks
     */
    public function register_blocks() {
        // Register the main block
        register_block_type('dafel/banda-animation', array(
            'editor_script' => 'dafel-banda-block-editor',
            'editor_style' => 'dafel-banda-block-editor',
            'style' => 'dafel-banda-block',
            'render_callback' => array($this, 'render_banda_block'),
            'attributes' => array(
                'animation' => array(
                    'type' => 'string',
                    'default' => 'fadeIn'
                ),
                'size' => array(
                    'type' => 'string',
                    'default' => 'large'
                ),
                'interactive' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'colorScheme' => array(
                    'type' => 'string',
                    'default' => 'default'
                ),
                'customCSS' => array(
                    'type' => 'string',
                    'default' => ''
                )
            )
        ));
        
        // Register hero section block
        register_block_type('dafel/banda-hero', array(
            'editor_script' => 'dafel-banda-block-editor',
            'editor_style' => 'dafel-banda-block-editor',
            'style' => 'dafel-banda-block',
            'render_callback' => array($this, 'render_hero_block'),
            'attributes' => array(
                'title' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'subtitle' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'overlayOpacity' => array(
                    'type' => 'number',
                    'default' => 0.7
                ),
                'height' => array(
                    'type' => 'string',
                    'default' => '100vh'
                )
            )
        ));
    }
    
    /**
     * Enqueue block editor assets
     */
    public function enqueue_block_editor_assets() {
        wp_enqueue_script(
            'dafel-banda-block-editor',
            DAFEL_BANDA_PLUGIN_URL . 'assets/js/block-editor.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-block-editor'),
            DAFEL_BANDA_VERSION,
            true
        );
        
        wp_enqueue_style(
            'dafel-banda-block-editor',
            DAFEL_BANDA_PLUGIN_URL . 'assets/css/block-editor.css',
            array('wp-edit-blocks'),
            DAFEL_BANDA_VERSION
        );
        
        // Localize script with SVG data
        wp_localize_script('dafel-banda-block-editor', 'dafelBandaData', array(
            'pluginUrl' => DAFEL_BANDA_PLUGIN_URL,
            'svgPath' => DAFEL_BANDA_PLUGIN_URL . 'assets/svg/',
            'animations' => array(
                'fadeIn' => __('Fade In', 'dafel-banda'),
                'wave' => __('Wave', 'dafel-banda'),
                'pulse' => __('Pulse', 'dafel-banda'),
                'interactive' => __('Interactive', 'dafel-banda'),
                'scroll' => __('Scroll Based', 'dafel-banda')
            ),
            'sizes' => array(
                'small' => __('Small (640px)', 'dafel-banda'),
                'medium' => __('Medium (1024px)', 'dafel-banda'),
                'large' => __('Large (1280px)', 'dafel-banda'),
                'full' => __('Full Width', 'dafel-banda')
            ),
            'colorSchemes' => array(
                'default' => __('Default Blue', 'dafel-banda'),
                'dark' => __('Dark Mode', 'dafel-banda'),
                'brand' => __('Brand Colors', 'dafel-banda'),
                'custom' => __('Custom', 'dafel-banda')
            )
        ));
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        // Main CSS
        wp_enqueue_style(
            'dafel-banda-frontend',
            DAFEL_BANDA_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            DAFEL_BANDA_VERSION
        );
        
        // Animation CSS
        wp_enqueue_style(
            'dafel-banda-animations',
            DAFEL_BANDA_PLUGIN_URL . 'assets/css/animations.css',
            array('dafel-banda-frontend'),
            DAFEL_BANDA_VERSION
        );
        
        // GSAP (conditional)
        $use_gsap = get_option('dafel_banda_use_gsap', false);
        if ($use_gsap) {
            wp_enqueue_script(
                'gsap',
                'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
                array(),
                '3.12.2',
                true
            );
        }
        
        // Main JS
        wp_enqueue_script(
            'dafel-banda-frontend',
            DAFEL_BANDA_PLUGIN_URL . 'assets/js/frontend.js',
            array('jquery'),
            DAFEL_BANDA_VERSION,
            true
        );
        
        // Localize frontend script
        wp_localize_script('dafel-banda-frontend', 'dafelBandaFrontend', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('dafel_banda_nonce'),
            'useGsap' => $use_gsap,
            'analytics' => get_option('dafel_banda_analytics', false)
        ));
    }
    
    /**
     * Render banda block
     */
    public function render_banda_block($attributes) {
        $animation = esc_attr($attributes['animation']);
        $size = esc_attr($attributes['size']);
        $interactive = $attributes['interactive'] ? 'true' : 'false';
        $color_scheme = esc_attr($attributes['colorScheme']);
        $custom_css = esc_attr($attributes['customCSS']);
        
        // Size mapping
        $sizes = array(
            'small' => 'max-width: 640px;',
            'medium' => 'max-width: 1024px;',
            'large' => 'max-width: 1280px;',
            'full' => 'width: 100%;'
        );
        
        $size_style = isset($sizes[$size]) ? $sizes[$size] : $sizes['large'];
        
        ob_start();
        ?>
        <div class="dafel-banda-container dafel-banda-<?php echo $size; ?> dafel-banda-scheme-<?php echo $color_scheme; ?>" 
             data-animation="<?php echo $animation; ?>"
             data-interactive="<?php echo $interactive; ?>"
             style="<?php echo $size_style; ?> <?php echo $custom_css; ?>">
            <?php echo $this->get_svg_content($color_scheme); ?>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Render hero block
     */
    public function render_hero_block($attributes) {
        $title = esc_html($attributes['title']);
        $subtitle = esc_html($attributes['subtitle']);
        $overlay_opacity = floatval($attributes['overlayOpacity']);
        $height = esc_attr($attributes['height']);
        
        ob_start();
        ?>
        <div class="dafel-banda-hero" style="height: <?php echo $height; ?>; position: relative; overflow: hidden;">
            <div class="dafel-banda-hero-background" data-animation="wave">
                <?php echo $this->get_svg_content('default'); ?>
            </div>
            <div class="dafel-banda-hero-overlay" style="background: rgba(0,0,0,<?php echo $overlay_opacity; ?>); position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>
            <div class="dafel-banda-hero-content" style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center; color: white;">
                <div>
                    <?php if ($title): ?>
                        <h1 class="dafel-banda-hero-title" style="font-size: 3rem; margin-bottom: 1rem;"><?php echo $title; ?></h1>
                    <?php endif; ?>
                    <?php if ($subtitle): ?>
                        <p class="dafel-banda-hero-subtitle" style="font-size: 1.5rem; opacity: 0.9;"><?php echo $subtitle; ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Get SVG content based on color scheme
     */
    private function get_svg_content($color_scheme = 'default') {
        $svg_file = DAFEL_BANDA_PLUGIN_DIR . 'assets/svg/animatable.svg';
        
        if (!file_exists($svg_file)) {
            return '<div class="dafel-banda-error">SVG file not found</div>';
        }
        
        $svg_content = file_get_contents($svg_file);
        
        // Apply color scheme transformations
        switch ($color_scheme) {
            case 'dark':
                $svg_content = $this->apply_dark_mode($svg_content);
                break;
            case 'brand':
                $svg_content = $this->apply_brand_colors($svg_content);
                break;
            case 'custom':
                $svg_content = $this->apply_custom_colors($svg_content);
                break;
        }
        
        return $svg_content;
    }
    
    /**
     * Apply dark mode colors
     */
    private function apply_dark_mode($svg_content) {
        // Dark mode color mappings
        $color_map = array(
            '#D0E8F5' => '#1a1a2e',
            '#A8D1E6' => '#16213e',
            '#7DBBDB' => '#0f3460',
            '#6FB3D9' => '#0e4b99',
            '#5AAED0' => '#0d4f8c',
            '#3493B8' => '#0c4d84',
            '#1E7FA4' => '#0b4a7c'
        );
        
        foreach ($color_map as $original => $dark) {
            $svg_content = str_replace($original, $dark, $svg_content);
        }
        
        return $svg_content;
    }
    
    /**
     * Apply brand colors
     */
    private function apply_brand_colors($svg_content) {
        $brand_colors = get_option('dafel_banda_brand_colors', array());
        
        if (!empty($brand_colors)) {
            foreach ($brand_colors as $original => $brand) {
                $svg_content = str_replace($original, $brand, $svg_content);
            }
        }
        
        return $svg_content;
    }
    
    /**
     * Apply custom colors
     */
    private function apply_custom_colors($svg_content) {
        // Custom color logic would go here
        return $svg_content;
    }
    
    /**
     * Shortcode handler
     */
    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'animation' => 'fadeIn',
            'size' => 'large',
            'interactive' => 'false',
            'color-scheme' => 'default'
        ), $atts, 'dafel_banda');
        
        return $this->render_banda_block(array(
            'animation' => $atts['animation'],
            'size' => $atts['size'],
            'interactive' => $atts['interactive'] === 'true',
            'colorScheme' => $atts['color-scheme']
        ));
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('dafel-banda/v1', '/analytics', array(
            'methods' => 'POST',
            'callback' => array($this, 'track_analytics'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('dafel-banda/v1', '/colors', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_color_schemes'),
            'permission_callback' => '__return_true'
        ));
    }
    
    /**
     * Track analytics
     */
    public function track_analytics($request) {
        $params = $request->get_params();
        
        if (get_option('dafel_banda_analytics', false)) {
            // Store analytics data
            $analytics = get_option('dafel_banda_analytics_data', array());
            $analytics[] = array(
                'event' => sanitize_text_field($params['event']),
                'animation' => sanitize_text_field($params['animation']),
                'timestamp' => current_time('mysql'),
                'ip' => $_SERVER['REMOTE_ADDR'],
                'user_agent' => $_SERVER['HTTP_USER_AGENT']
            );
            
            // Keep only last 1000 entries
            if (count($analytics) > 1000) {
                $analytics = array_slice($analytics, -1000);
            }
            
            update_option('dafel_banda_analytics_data', $analytics);
        }
        
        return rest_ensure_response(array('success' => true));
    }
    
    /**
     * Get color schemes
     */
    public function get_color_schemes($request) {
        return rest_ensure_response(array(
            'default' => $this->get_default_colors(),
            'dark' => $this->get_dark_colors(),
            'brand' => get_option('dafel_banda_brand_colors', array())
        ));
    }
    
    /**
     * Get default colors
     */
    private function get_default_colors() {
        return array(
            'primary' => '#D0E8F5',
            'secondary' => '#7DBBDB',
            'accent' => '#1E7FA4',
            'background' => '#ffffff'
        );
    }
    
    /**
     * Get dark colors
     */
    private function get_dark_colors() {
        return array(
            'primary' => '#1a1a2e',
            'secondary' => '#16213e',
            'accent' => '#0f3460',
            'background' => '#000000'
        );
    }
    
    /**
     * Activate plugin
     */
    public function activate() {
        // Set default options
        add_option('dafel_banda_version', DAFEL_BANDA_VERSION);
        add_option('dafel_banda_use_gsap', false);
        add_option('dafel_banda_analytics', false);
        add_option('dafel_banda_cache_timeout', 3600);
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Deactivate plugin
     */
    public function deactivate() {
        // Clean up
        flush_rewrite_rules();
    }
}

// Initialize plugin
new DafelBandaPlugin();

/**
 * Admin Settings Page
 */
class DafelBandaAdmin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'init_settings'));
    }
    
    public function add_admin_menu() {
        add_options_page(
            __('Dafel Banda Settings', 'dafel-banda'),
            __('Dafel Banda', 'dafel-banda'),
            'manage_options',
            'dafel-banda-settings',
            array($this, 'settings_page')
        );
    }
    
    public function init_settings() {
        register_setting('dafel_banda_settings', 'dafel_banda_use_gsap');
        register_setting('dafel_banda_settings', 'dafel_banda_analytics');
        register_setting('dafel_banda_settings', 'dafel_banda_cache_timeout');
        register_setting('dafel_banda_settings', 'dafel_banda_brand_colors');
    }
    
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Dafel Banda Settings', 'dafel-banda'); ?></h1>
            <form method="post" action="options.php">
                <?php settings_fields('dafel_banda_settings'); ?>
                <?php do_settings_sections('dafel_banda_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('Use GSAP Animations', 'dafel-banda'); ?></th>
                        <td>
                            <input type="checkbox" name="dafel_banda_use_gsap" value="1" <?php checked(1, get_option('dafel_banda_use_gsap')); ?> />
                            <p class="description"><?php _e('Enable GSAP for advanced animations (loads external library)', 'dafel-banda'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Enable Analytics', 'dafel-banda'); ?></th>
                        <td>
                            <input type="checkbox" name="dafel_banda_analytics" value="1" <?php checked(1, get_option('dafel_banda_analytics')); ?> />
                            <p class="description"><?php _e('Track animation usage and performance metrics', 'dafel-banda'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Cache Timeout (seconds)', 'dafel-banda'); ?></th>
                        <td>
                            <input type="number" name="dafel_banda_cache_timeout" value="<?php echo esc_attr(get_option('dafel_banda_cache_timeout', 3600)); ?>" />
                            <p class="description"><?php _e('How long to cache SVG content (3600 = 1 hour)', 'dafel-banda'); ?></p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <div class="dafel-banda-analytics" style="margin-top: 40px;">
                <h2><?php _e('Usage Analytics', 'dafel-banda'); ?></h2>
                <?php $this->display_analytics(); ?>
            </div>
        </div>
        <?php
    }
    
    private function display_analytics() {
        if (!get_option('dafel_banda_analytics', false)) {
            echo '<p>' . __('Analytics disabled. Enable above to track usage.', 'dafel-banda') . '</p>';
            return;
        }
        
        $analytics = get_option('dafel_banda_analytics_data', array());
        
        if (empty($analytics)) {
            echo '<p>' . __('No analytics data yet.', 'dafel-banda') . '</p>';
            return;
        }
        
        // Simple analytics display
        $animation_counts = array();
        foreach ($analytics as $entry) {
            $animation = $entry['animation'];
            $animation_counts[$animation] = isset($animation_counts[$animation]) ? $animation_counts[$animation] + 1 : 1;
        }
        
        echo '<table class="widefat">';
        echo '<thead><tr><th>' . __('Animation', 'dafel-banda') . '</th><th>' . __('Usage Count', 'dafel-banda') . '</th></tr></thead>';
        echo '<tbody>';
        foreach ($animation_counts as $animation => $count) {
            echo '<tr><td>' . esc_html($animation) . '</td><td>' . esc_html($count) . '</td></tr>';
        }
        echo '</tbody>';
        echo '</table>';
    }
}

// Initialize admin
if (is_admin()) {
    new DafelBandaAdmin();
}