<?php
// booking.php - Backend PHP proxy & email dispatcher for Hostinger

// 1. BitForm API Configuration
$api_key = "[ENCRYPTION_KEY]";
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

// 6. Direct Email Notification (Sent directly by Hostinger's PHP mail)
// You can add your own email here separated by a comma if you want a copy (e.g. "escapegamingbandra@gmail.com, your@email.com")
$to_email = "escapegamingbandra@gmail.com";

$customer_name = !empty($data['name']) ? strip_tags($data['name']) : "Customer";
$customer_phone = !empty($data['phone']) ? strip_tags($data['phone']) : "N/A";
$customer_email = !empty($data['email']) ? filter_var($data['email'], FILTER_SANITIZE_EMAIL) : "";
$experience_booked = !empty($data['experience']) ? strip_tags($data['experience']) : "General";
$user_notes = !empty($data['message']) ? nl2br(htmlspecialchars($data['message'])) : "No notes provided";

$subject = "🎮 New Booking: " . $experience_booked . " - " . $customer_name;
$email_html = "
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f111a; color: #ffffff; padding: 20px; }
    .card { background: #1a1d2e; padding: 25px; border-radius: 12px; max-width: 550px; margin: 0 auto; border: 1px solid #2a2e45; }
    h2 { color: #00f0ff; margin-top: 0; border-bottom: 2px solid #ff0055; padding-bottom: 10px; font-size: 22px; }
    .item { margin-bottom: 12px; font-size: 15px; color: #e0e0e0; }
    .label { font-weight: bold; color: #9aa0b6; display: inline-block; width: 140px; }
    .val { color: #ffffff; }
    .val a { color: #00f0ff; text-decoration: none; }
    .msg-box { background: #121422; border-left: 3px solid #ff0055; padding: 12px; margin-top: 8px; border-radius: 4px; color: #fff; line-height: 1.5; }
    .footer { font-size: 12px; color: #666; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class='card'>
    <h2>🎮 New Booking Request</h2>
    <div class='item'><span class='label'>Name:</span> <span class='val'>" . htmlspecialchars($customer_name) . "</span></div>
    <div class='item'><span class='label'>Phone:</span> <span class='val'><a href='tel:" . htmlspecialchars($customer_phone) . "'>" . htmlspecialchars($customer_phone) . "</a></span></div>
    <div class='item'><span class='label'>Email:</span> <span class='val'><a href='mailto:" . htmlspecialchars($customer_email) . "'>" . htmlspecialchars($customer_email) . "</a></span></div>
    <div class='item'><span class='label'>Experience:</span> <span class='val'><strong>" . htmlspecialchars($experience_booked) . "</strong></span></div>
    <div class='item'><span class='label'>Submission Time:</span> <span class='val'>" . htmlspecialchars($timestamp) . "</span></div>
    <div class='item'>
      <span class='label'>Notes / Message:</span>
      <div class='msg-box'>" . $user_notes . "</div>
    </div>
    <div class='footer'>Sent from Escape Gaming Zone Website</div>
  </div>
</body>
</html>
";

$domain = $_SERVER['SERVER_NAME'] ?? 'escapegamingzone.com';
$headers = [
  'MIME-Version: 1.0',
  'Content-type: text/html; charset=UTF-8',
  'From: Escape Gaming Zone <bookings@' . $domain . '>',
  'X-Mailer: PHP/' . phpversion()
];
if (!empty($customer_email)) {
  $headers[] = 'Reply-To: ' . $customer_email;
}

@mail($to_email, $subject, $email_html, implode("\r\n", $headers));

// 7. Return JSON response to frontend
http_response_code($httpcode ?: 200);
header('Content-Type: application/json');

if ($error) {
  echo json_encode(["error" => "cURL Error", "details" => $error]);
} else {
  echo $response;
}
?>