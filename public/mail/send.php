<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$config = require __DIR__ . '/config.php';

if (empty($config['smtp_pass'])) {
  http_response_code(500);
  echo json_encode([
    'ok' => false,
    'error' => 'SMTP is not configured. Add public/mail/config.local.php with smtp_pass.',
  ]);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  $data = $_POST;
}

$type = isset($data['type']) ? trim((string) $data['type']) : 'contact';

function respond_error(string $message, int $code = 400): void {
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $message]);
  exit;
}

function clean_line(string $value): string {
  return trim(str_replace(["\r", "\n"], '', $value));
}

function smtp_expect($socket, array $codes): void {
  $response = '';
  while ($line = fgets($socket, 515)) {
    $response .= $line;
    if (isset($line[3]) && $line[3] === ' ') {
      break;
    }
  }

  $code = (int) substr($response, 0, 3);
  if (!in_array($code, $codes, true)) {
    throw new RuntimeException('SMTP error: ' . trim($response));
  }
}

function smtp_command($socket, string $command, array $codes): void {
  fwrite($socket, $command . "\r\n");
  smtp_expect($socket, $codes);
}

function send_smtp_mail(array $config, string $subject, string $body, string $replyTo = ''): void {
  $host = $config['smtp_host'];
  $port = (int) $config['smtp_port'];
  $secure = $config['smtp_secure'];
  $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;

  $socket = @stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT);
  if (!$socket) {
    throw new RuntimeException("Could not connect to SMTP: $errstr ($errno)");
  }

  stream_set_timeout($socket, 30);
  smtp_expect($socket, [220]);
  smtp_command($socket, 'EHLO dolmengroup.com', [250]);

  if ($secure === 'tls') {
    smtp_command($socket, 'STARTTLS', [220]);
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      throw new RuntimeException('Could not enable TLS');
    }
    smtp_command($socket, 'EHLO dolmengroup.com', [250]);
  }

  smtp_command($socket, 'AUTH LOGIN', [334]);
  smtp_command($socket, base64_encode($config['smtp_user']), [334]);
  smtp_command($socket, base64_encode($config['smtp_pass']), [235]);

  $fromEmail = clean_line($config['from_email']);
  $fromName = clean_line($config['from_name']);
  $toEmail = clean_line($config['to_email']);
  $toName = clean_line($config['to_name']);

  smtp_command($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
  smtp_command($socket, 'RCPT TO:<' . $toEmail . '>', [250, 251]);
  smtp_command($socket, 'DATA', [354]);

  $headers = [
    'Date: ' . date('r'),
    'From: ' . sprintf('"%s" <%s>', $fromName, $fromEmail),
    'To: ' . sprintf('"%s" <%s>', $toName, $toEmail),
    'Subject: ' . clean_line($subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . clean_line($replyTo);
  }

  $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n.", "\n..", $body) . "\r\n.";
  fwrite($socket, $message . "\r\n");
  smtp_expect($socket, [250]);
  smtp_command($socket, 'QUIT', [221]);
  fclose($socket);
}

try {
  if ($type === 'newsletter') {
    $email = isset($data['email']) ? trim((string) $data['email']) : '';
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      respond_error('Please enter a valid email address.');
    }

    $subject = 'Newsletter subscription — Dolmen website';
    $body = "New newsletter subscription\n\nEmail: {$email}\nSubmitted: " . date('Y-m-d H:i:s');
    send_smtp_mail($config, $subject, $body, $email);

    echo json_encode(['ok' => true, 'message' => 'Subscribed successfully.']);
    exit;
  }

  $name = isset($data['name']) ? trim((string) $data['name']) : '';
  $phone = isset($data['phone']) ? trim((string) $data['phone']) : '';
  $email = isset($data['email']) ? trim((string) $data['email']) : '';
  $enquiry = isset($data['enquiry']) ? trim((string) $data['enquiry']) : '';
  $message = isset($data['message']) ? trim((string) $data['message']) : '';

  if ($name === '' || $phone === '' || $email === '' || $message === '') {
    respond_error('Please fill in all required fields.');
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond_error('Please enter a valid email address.');
  }

  $subject = 'Website enquiry' . ($enquiry !== '' ? " — {$enquiry}" : '');
  $body = "New enquiry from the Dolmen website\n\n"
    . "Name: {$name}\n"
    . "Phone: {$phone}\n"
    . "Email: {$email}\n"
    . "Enquiry: {$enquiry}\n\n"
    . "Message:\n{$message}\n\n"
    . 'Submitted: ' . date('Y-m-d H:i:s');

  send_smtp_mail($config, $subject, $body, $email);

  echo json_encode(['ok' => true, 'message' => 'Message sent successfully.']);
} catch (Throwable $error) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $error->getMessage()]);
}
