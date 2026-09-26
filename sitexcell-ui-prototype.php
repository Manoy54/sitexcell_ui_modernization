<?php
/**
 * Plugin Name: SiteXcell UI Prototype
 * Description: UI Modernization Prototype for the SiteXcell website and contractor portal.
 * Version: 1.0.0
 * Author: Sean Dylan Armenta
 * License: GPL v2 or later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SITEXCELL_UI_PATH', plugin_dir_path(__FILE__));
define('SITEXCELL_UI_URL', plugin_dir_url(__FILE__));
define('SITEXCELL_UI_PAGE_SLUG', 'sitexcell-about-prototype');
define('SITEXCELL_UI_HOME_SLUG', 'sitexcell-home-prototype');
define('SITEXCELL_UI_LAAN_SLUG', 'laan-request');

require_once SITEXCELL_UI_PATH . 'includes/laan-request.php';
require_once SITEXCELL_UI_PATH . 'includes/cositer-demo.php';

/**
 * Helper to check current URI for prototype slugs.
 */
function sitexcell_ui_get_current_prototype(): string
{
    $portal_demo_route = sitexcell_ui_cositer_demo_route();

    if ($portal_demo_route !== '') {
        return $portal_demo_route;
    }

    if (is_page(SITEXCELL_UI_LAAN_SLUG)) {
        return 'laan-request';
    }

    if (is_page(SITEXCELL_UI_HOME_SLUG)) {
        return 'home';
    }

    if (is_page(SITEXCELL_UI_PAGE_SLUG)) {
        return 'about';
    }

    $uri = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '';

    if (strpos($uri, 'sitexcell-home-prototype') !== false) {
        return 'home';
    }

    if (strpos($uri, 'sitexcell-about-prototype') !== false) {
        return 'about';
    }

    if (strpos($uri, 'sitexcell-cta-prototype') !== false) {
        return 'cta';
    }

    if (strpos($uri, 'sitexcell-insights-prototype') !== false) {
        return 'insights';
    }

    if (strpos($uri, 'sitexcell-contact-prototype') !== false) {
        return 'contact';
    }

    if (strpos($uri, 'sitexcell-transitions-prototype') !== false) {
        return 'transitions';
    }

    if (strpos($uri, 'laan-request') !== false) {
        return 'laan-request';
    }

    return '';
}

/**
 * Check whether the current request renders the prototype UI.
 */
function sitexcell_ui_is_prototype_request(): bool
{
    if (sitexcell_ui_get_current_prototype() !== '') {
        return true;
    }

    $post = is_singular() ? get_queried_object() : null;

    return $post instanceof WP_Post && (
        has_shortcode($post->post_content, 'sitexcell_about')
        || has_shortcode($post->post_content, 'sitexcell_home')
        || has_shortcode($post->post_content, 'sitexcell_laan_request')
    );
}

/**
 * Return the production contact form ID supplied by the host project.
 *
 * A value of zero keeps the visual prototype form active.
 */
function sitexcell_ui_contact_form_id(): int
{
    return max(0, (int) apply_filters('sitexcell_ui_contact_form_id', 0));
}

/**
 * Load the prototype assets.
 */
function sitexcell_ui_enqueue_assets(): void
{
    if (!sitexcell_ui_is_prototype_request()) {
        return;
    }

    wp_enqueue_style(
        'sitexcell-ui-fonts',
        'https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/index.css',
        [],
        null
    );

    $prototype = sitexcell_ui_get_current_prototype();

    if ($prototype === 'portal-login' || $prototype === 'portal-requests') {
        $view = sitexcell_ui_cositer_demo_view();
        $style_dependencies = ['sitexcell-ui-fonts'];

        if ($view === 'laan' || $view === 'access') {
            $form_style = $view === 'laan'
                ? 'proposed_laan_form/src/styles/prototype.css'
                : 'proposed_access_request_form/src/styles/access-request.css';
            wp_enqueue_style(
                'sitexcell-ui-cositer-form',
                SITEXCELL_UI_URL . $form_style,
                ['sitexcell-ui-fonts'],
                (string) filemtime(SITEXCELL_UI_PATH . $form_style)
            );
            $style_dependencies[] = 'sitexcell-ui-cositer-form';
        }

        wp_enqueue_style(
            'sitexcell-ui-cositer-demo',
            SITEXCELL_UI_URL . 'assets/css/cositer-demo.css',
            $style_dependencies,
            (string) filemtime(SITEXCELL_UI_PATH . 'assets/css/cositer-demo.css')
        );

        wp_enqueue_script(
            'sitexcell-ui-cositer-demo',
            SITEXCELL_UI_URL . 'assets/js/cositer-demo.js',
            [],
            (string) filemtime(SITEXCELL_UI_PATH . 'assets/js/cositer-demo.js'),
            true
        );

        if ($view === 'laan' || $view === 'access') {
            $form_script = $view === 'laan'
                ? 'proposed_laan_form/src/scripts/prototype.js'
                : 'proposed_access_request_form/src/app.js';
            wp_enqueue_script(
                'sitexcell-ui-cositer-form',
                SITEXCELL_UI_URL . $form_script,
                [],
                (string) filemtime(SITEXCELL_UI_PATH . $form_script),
                true
            );
        }

        return;
    }

    if (function_exists('sitexcell_ui_is_laan_request') && sitexcell_ui_is_laan_request()) {
        wp_enqueue_style(
            'sitexcell-ui-laan-style',
            SITEXCELL_UI_URL . 'assets/css/laan-request.css',
            ['sitexcell-ui-fonts'],
            (string) filemtime(SITEXCELL_UI_PATH . 'assets/css/laan-request.css')
        );

        wp_enqueue_script(
            'sitexcell-ui-laan-request',
            SITEXCELL_UI_URL . 'assets/js/laan-request.js',
            [],
            (string) filemtime(SITEXCELL_UI_PATH . 'assets/js/laan-request.js'),
            true
        );

        wp_add_inline_script(
            'sitexcell-ui-laan-request',
            'window.SitexcellLaanConfig = ' . wp_json_encode(sitexcell_ui_laan_frontend_config()) . ';',
            'before'
        );

        return;
    }

    wp_enqueue_style(
        'sitexcell-ui-style',
        SITEXCELL_UI_URL . 'assets/css/style.css',
        ['sitexcell-ui-fonts'],
        (string) filemtime(SITEXCELL_UI_PATH . 'assets/css/style.css')
    );

    wp_enqueue_script(
        'sitexcell-ui-app',
        SITEXCELL_UI_URL . 'assets/js/app.js',
        [],
        (string) filemtime(SITEXCELL_UI_PATH . 'assets/js/app.js'),
        true
    );

    $contact_form_id = sitexcell_ui_contact_form_id();

    if ($contact_form_id > 0 && function_exists('gravity_form_enqueue_scripts')) {
        gravity_form_enqueue_scripts($contact_form_id, true);
    }
}

add_action('wp_enqueue_scripts', 'sitexcell_ui_enqueue_assets');

/**
 * Mark the LAAN browser module as an ES module without changing other scripts.
 */
function sitexcell_ui_laan_module_script(string $tag, string $handle, string $src): string
{
    if (!in_array($handle, ['sitexcell-ui-laan-request', 'sitexcell-ui-cositer-form'], true)) {
        return $tag;
    }

    return '<script type="module" src="' . esc_url($src) . '"></script>';
}

add_filter('script_loader_tag', 'sitexcell_ui_laan_module_script', 10, 3);

/**
 * Render the modernized SiteXcell About page prototype.
 *
 * Usage:
 * [sitexcell_about]
 */
function sitexcell_ui_about_shortcode(): string
{
    $page_path = SITEXCELL_UI_PATH . 'pages/about/about.php';

    if (!file_exists($page_path)) {
        return '<p>SiteXcell About prototype page not found.</p>';
    }

    ob_start();
    include $page_path;

    return (string) ob_get_clean();
}

add_shortcode('sitexcell_about', 'sitexcell_ui_about_shortcode');

/**
 * Render the modernized SiteXcell Home page prototype.
 *
 * Usage:
 * [sitexcell_home]
 */
function sitexcell_ui_home_shortcode(): string
{
    $page_path = SITEXCELL_UI_PATH . 'pages/home/home.php';

    if (!file_exists($page_path)) {
        return '<p>SiteXcell Home prototype page not found.</p>';
    }

    ob_start();
    include $page_path;

    return (string) ob_get_clean();
}

add_shortcode('sitexcell_home', 'sitexcell_ui_home_shortcode');

/**
 * Render the native WordPress LAAN request form.
 *
 * Usage:
 * [sitexcell_laan_request]
 */
function sitexcell_ui_laan_request_shortcode(): string
{
    $page_path = SITEXCELL_UI_PATH . 'pages/laan-request/laan-request.php';

    if (!file_exists($page_path)) {
        return '<p>SiteXcell LAAN request page not found.</p>';
    }

    ob_start();
    include $page_path;

    return (string) ob_get_clean();
}

add_shortcode('sitexcell_laan_request', 'sitexcell_ui_laan_request_shortcode');

/**
 * Use a standalone template for the SiteXcell prototype pages.
 */
function sitexcell_ui_template_include(string $template): string
{
    $prototype = sitexcell_ui_get_current_prototype();

    if ($prototype === 'laan-request') {
        $custom_template = SITEXCELL_UI_PATH . 'pages/laan-request/template.php';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'home') {
        $custom_template = SITEXCELL_UI_PATH . 'pages/home/template.php';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'about') {
        $custom_template = SITEXCELL_UI_PATH . 'pages/about/template.php';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'cta') {
        $custom_template = SITEXCELL_UI_PATH . '.scratch/cta-variations/prototype-ui.html';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'insights') {
        $custom_template = SITEXCELL_UI_PATH . '.scratch/insights-prototype/prototype-ui.html';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'contact') {
        $custom_template = SITEXCELL_UI_PATH . '.scratch/contact-prototype/prototype-ui.html';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'transitions') {
        $custom_template = SITEXCELL_UI_PATH . '.scratch/section-transitions/prototype-ui.html';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    if ($prototype === 'portal-login' || $prototype === 'portal-requests') {
        $custom_template = SITEXCELL_UI_PATH . 'pages/cositer-demo/template.php';

        if (file_exists($custom_template)) {
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
                status_header(200);
            }
            return $custom_template;
        }
    }

    return $template;
}

add_filter('template_include', 'sitexcell_ui_template_include');
