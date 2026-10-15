<?php
// booking.php - Backend PHP proxy & email dispatcher for Hostinger

// 1. BitForm API Configuration
$api_key = "ccksweeeed71iwiic2iptsjp1506i9y1e5cdre";
$form_id = "1";
$bitform_endpoint = "https://old.escapegamingzone.com/wp-json/bitform/v1/entry/" . $form_id;

// 2. Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "Method Not Allowed"]);
  exit;
}

// 3. Read incoming JSON from React
$json_str = file_get_contents('php://input');
$data = json_decode($json_str, true);

if (!$data) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid JSON payload"]);
  exit;
}

// 4. Prepare data fields
$timestamp = !empty($data['timestamp']) ? $data['timestamp'] : date('d M Y, h:i A (T)');
$raw_message = isset($data['message']) ? trim($data['message']) : "";
$message_with_time = !empty($raw_message)
  ? $raw_message . "\n\n[Submission Time: " . $timestamp . "]"
  : "[Submission Time: " . $timestamp . "]";

$post_fields = [
  "b1-2" => isset($data['name']) ? $data['name'] : "",
  "b1-3" => isset($data['phone']) ? $data['phone'] : "",
  "b1-4" => isset($data['email']) ? $data['email'] : "",
  "b1-5" => isset($data['experience']) ? $data['experience'] : "",
  "b1-6" => $message_with_time,
  "b1-1" => "Submit"
];

// 5. Forward entry to BitForm on old.escapegamingzone.com via cURL
$ch = curl_init($bitform_endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Bitform-Api-Key: " . $api_key,
  "Content-Type: application/x-www-form-urlencoded"
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// 6. Send Email Notification via WordPress & WP Mail SMTP
$wp_mail_endpoint = "https://old.escapegamingzone.com/wp-json/escape/v1/book";
$ch_mail = curl_init($wp_mail_endpoint);
curl_setopt($ch_mail, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch_mail, CURLOPT_POST, true);
curl_setopt($ch_mail, CURLOPT_POSTFIELDS, json_encode([
  "name" => !empty($data['name']) ? $data['name'] : 'Customer',
  "phone" => !empty($data['phone']) ? $data['phone'] : 'N/A',
  "email" => !empty($data['email']) ? $data['email'] : '',
  "experience" => !empty($data['experience']) ? $data['experience'] : 'General',
  "message" => $message_with_time
]));
curl_setopt($ch_mail, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json"
]);
$mail_response = curl_exec($ch_mail);
curl_close($ch_mail);

// 7. Return JSON response to frontend
http_response_code($httpcode ?: 200);
header('Content-Type: application/json');

if ($error) {
  echo json_encode(["error" => "cURL Error", "details" => $error]);
} else {
  echo $response;
}
?>