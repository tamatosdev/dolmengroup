<?php
$defaults = [
  'to_email' => 'info@dolmengroup.com',
  'to_name' => 'Dolmen Group',
  'from_email' => 'info@dolmengroup.com',
  'from_name' => 'Dolmen Website',
  'smtp_host' => 'mail.dolmengroup.com',
  'smtp_port' => 587,
  'smtp_secure' => 'tls',
  'smtp_user' => 'info@dolmengroup.com',
  'smtp_pass' => '',
];

$localFile = __DIR__ . '/config.local.php';
if (is_file($localFile)) {
  $local = require $localFile;
  if (is_array($local)) {
    return array_merge($defaults, $local);
  }
}

return $defaults;
