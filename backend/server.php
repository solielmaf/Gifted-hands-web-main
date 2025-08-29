<?php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve the requested file directly if it exists
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false;
}

// Otherwise forward the request to Laravel's index.php
require_once __DIR__ . '/public/index.php';
