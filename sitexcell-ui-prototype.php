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
define('SITEXCELL_UI_LAAN_SLUG', 'sitexcell-laan-request-prototype');

/**
 * Helper to check current URI for prototype slugs.
 */
function sitexcell_ui_get_current_prototype(): string
{
    if (is_page(SITEXCELL_UI_HOME_SLUG)) {
        return 'home';
    }

    if (is_page(SITEXCELL_UI_PAGE_SLUG)) {
        return 'about';
    }

    if (is_page(SITEXCELL_UI_LAAN_SLUG)) {
        return 'laan-request';
    }

    $uri = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '';

    if (strpos($uri, 'sitexcell-home-prototype') !== false) {
        return 'home';
    }

    if (strpos($uri, 'sitexcell-about-prototype') !== false) {
        return 'about';
    }

    if (strpos($uri, SITEXCELL_UI_LAAN_SLUG) !== false) {
        return 'laan-request';
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

    if (strpos($uri, 'sitexcell-portal-requests-prototype') !== false) {
        return 'portal-requests';
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

    return $post instanceof WP_Post && (has_shortcode($post->post_content, 'sitexcell_about') || has_shortcode($post->post_content, 'sitexcell_home'));
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

    if (sitexcell_ui_get_current_prototype() === 'laan-request') {
        wp_enqueue_script(
            'sitexcell-ui-laan-request',
            SITEXCELL_UI_URL . 'assets/js/laan-request.js',
            [],
            (string) filemtime(SITEXCELL_UI_PATH . 'assets/js/laan-request.js'),
            true
        );
    }

    $contact_form_id = sitexcell_ui_contact_form_id();

    if ($contact_form_id > 0 && function_exists('gravity_form_enqueue_scripts')) {
        gravity_form_enqueue_scripts($contact_form_id, true);
    }
}

add_action('wp_enqueue_scripts', 'sitexcell_ui_enqueue_assets');

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
 * Use a standalone template for the SiteXcell prototype pages.
 */
function sitexcell_ui_template_include(string $template): string
{
    $prototype = sitexcell_ui_get_current_prototype();

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

    if ($prototype === 'portal-requests') {
        $custom_template = SITEXCELL_UI_PATH . 'pages/access-portal-page/prototype-ui.html';

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
