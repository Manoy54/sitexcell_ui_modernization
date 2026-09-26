<?php
/**
 * WordPress routing helpers for the non-submitting Co-Siter demo.
 */

if (!defined('ABSPATH')) {
    exit;
}

const SITEXCELL_UI_COSITER_LOGIN_SLUG = 'sitexcell-cositer-login-prototype';
const SITEXCELL_UI_COSITER_PORTAL_SLUG = 'sitexcell-portal-requests-prototype';

function sitexcell_ui_cositer_demo_route(): string
{
    $path = wp_parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);

    if (!is_string($path)) {
        return '';
    }

    foreach ([
        'portal-login' => SITEXCELL_UI_COSITER_LOGIN_SLUG,
        'portal-requests' => SITEXCELL_UI_COSITER_PORTAL_SLUG,
    ] as $route => $slug) {
        $expected = wp_parse_url(home_url('/' . $slug . '/'), PHP_URL_PATH);

        if (is_string($expected) && untrailingslashit($path) === untrailingslashit($expected)) {
            return $route;
        }
    }

    return '';
}

function sitexcell_ui_cositer_demo_view(): string
{
    if (sitexcell_ui_cositer_demo_route() === 'portal-login') {
        return 'login';
    }

    $raw_view = $_GET['view'] ?? 'requests';
    $view = is_string($raw_view) ? sanitize_key(wp_unslash($raw_view)) : '';

    return in_array($view, ['requests', 'request', 'users', 'documents', 'settings', 'contact', 'laan', 'access'], true)
        ? $view
        : 'not-found';
}

function sitexcell_ui_cositer_demo_url(string $view = 'requests', array $args = []): string
{
    $url = home_url('/' . SITEXCELL_UI_COSITER_PORTAL_SLUG . '/');

    if ($view !== 'requests') {
        $args = ['view' => $view] + $args;
    }

    return $args ? add_query_arg($args, $url) : $url;
}
