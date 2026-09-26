<?php
/**
 * Test-only WordPress function shim for browser checks when Local is stopped.
 */

$root = dirname(__DIR__, 3);
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$asset = realpath($root . $path);
if ($asset && str_starts_with($asset, $root . DIRECTORY_SEPARATOR) && is_file($asset)) {
    return false;
}

define('ABSPATH', $root . DIRECTORY_SEPARATOR);
define('SITEXCELL_UI_PATH', $root . DIRECTORY_SEPARATOR);
define('SITEXCELL_UI_URL', 'http://127.0.0.1:4179/');
define('SITEXCELL_UI_HOME_SLUG', 'sitexcell-home-prototype');

function wp_parse_url(string $url, int $component): string|false|null { return parse_url($url, $component); }
function home_url(string $path = ''): string { return 'http://127.0.0.1:4179' . $path; }
function untrailingslashit(string $value): string { return rtrim($value, '/'); }
function wp_unslash(string $value): string { return stripslashes($value); }
function sanitize_key(string $value): string { return preg_replace('/[^a-z0-9_\-]/', '', strtolower($value)); }
function sanitize_text_field(string $value): string { return trim(strip_tags($value)); }
function add_query_arg(array $args, string $url): string { return $url . '?' . http_build_query($args); }
function esc_html(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function esc_attr(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function esc_url(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function language_attributes(): void { echo 'lang="en"'; }
function bloginfo(string $name): void { echo $name === 'charset' ? 'UTF-8' : ''; }
function body_class(string $classes): void { echo 'class="' . esc_attr($classes) . '"'; }
function wp_body_open(): void {}
function status_header(int $status): void { http_response_code($status); }
function wp_head(): void
{
    $view = sitexcell_ui_cositer_demo_view();
    if ($view === 'laan') {
        echo '<link rel="stylesheet" href="/co-siter_dashboard/proposed_laan_form/src/styles/prototype.css">';
    } elseif ($view === 'access') {
        echo '<link rel="stylesheet" href="/co-siter_dashboard/proposed_access_request_form/src/styles/access-request.css">';
    }
    echo '<link rel="stylesheet" href="/co-siter_dashboard/assets/css/cositer-demo.css">';
}
function wp_footer(): void
{
    echo '<script src="/co-siter_dashboard/assets/js/cositer-demo.js"></script>';
    $view = sitexcell_ui_cositer_demo_view();
    if ($view === 'laan') {
        echo '<script type="module" src="/co-siter_dashboard/proposed_laan_form/src/scripts/prototype.js"></script>';
    } elseif ($view === 'access') {
        echo '<script type="module" src="/co-siter_dashboard/proposed_access_request_form/src/app.js"></script>';
    }
}

require_once $root . '/co-siter_dashboard/includes/cositer-demo.php';
if (sitexcell_ui_cositer_demo_route() === '') {
    http_response_code(404);
    echo 'Not found';
    return;
}

require $root . '/co-siter_dashboard/pages/cositer-demo/template.php';
