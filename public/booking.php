<?php
// booking.php - Backend PHP proxy for BitForm submissions

// 1. Set your BitForm API key here (DO NOT expose this in the frontend React code!)
$api_key = "ccksweeeed71iwiic2iptsjp1506i9y1e5cdre"; 
$form_id = "1";
$bitform_endpoint = "https://old.escapegamingzone.com/wp-json/bitform/v1/entry/" . $form_id;

// 2. Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

// 3. Read the JSON body sent by React
$json_str = file_get_contents('php://input');
$data = json_decode($json_str, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON payload"]);
    exit;
}

// 4. Build the POST fields as expected by BitForm
$post_fields = [
    "b1-2" => isset($data['name']) ? $data['name'] : "",
    "b1-3" => isset($data['phone']) ? $data['phone'] : "",
    "b1-4" => isset($data['email']) ? $data['email'] : "",
    "b1-5" => isset($data['experience']) ? $data['experience'] : "",
    "b1-6" => isset($data['message']) ? $data['message'] : "",
    "b1-1" => "Submit"
];

// 5. Send the request via cURL
$ch = curl_init($bitform_endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));

// Add the custom API Key header
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Bitform-Api-Key: " . $api_key,
    "Content-Type: application/x-www-form-urlencoded"
]);

// Execute the request
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// 6. Return the response back to React
http_response_code($httpcode);
header('Content-Type: application/json');

if ($error) {
    echo json_encode(["error" => "cURL Error", "details" => $error]);
} else {
    echo $response;
}
?>
