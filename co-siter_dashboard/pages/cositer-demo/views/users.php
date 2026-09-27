<?php if (!defined('ABSPATH')) { exit; } ?>
<div class="demo-page-heading"><div><p class="demo-eyebrow">People</p><h1>Users</h1><p>People associated with requests.</p></div></div>
<section class="demo-panel" aria-label="User list">
    <div class="demo-panel-toolbar"><label>Search by name or email<input type="search" placeholder="Find a user" data-demo-user-search></label></div>
    <div class="demo-table-scroll"><table class="demo-table"><thead><tr><th scope="col">First name</th><th scope="col">Last name</th><th scope="col">Email</th><th scope="col">Company</th><th scope="col">Role</th></tr></thead><tbody>
        <?php foreach ($users as $user) : $name_parts = explode(' ', $user['name'], 2); ?>
        <tr data-demo-user data-search="<?php echo esc_attr(strtolower($user['name'] . ' ' . $user['email'])); ?>"><td><?php echo esc_html($name_parts[0]); ?></td><td><?php echo esc_html($name_parts[1] ?? ''); ?></td><td><?php echo esc_html($user['email']); ?></td><td><?php echo esc_html($user['company']); ?></td><td><?php echo esc_html($user['role']); ?></td></tr>
        <?php endforeach; ?>
    </tbody></table></div>
    <p class="demo-list-count" aria-live="polite" data-demo-user-count></p><p class="demo-empty" hidden data-demo-user-empty>No users match this search.</p>
</section>
