<?php

require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

// CORS Middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Max-Age', '86400');
});

// OPTIONS isteğine cevap
$app->options('/{path:.+}', function ($request, $response) {
    return $response;
});

$app->get('/{path:.+}' , function ($request, $response, $args) {
    $database = require 'firebase.php';
    $data = $database
        ->getReference($args['path'])
        ->getValue();

    $response->getBody()->write(
        json_encode($data)
    );

    return $response->withHeader(
        'Content-Type',
        'application/json'
    );
});
$app->put('/{path:.+}', function ($request, $response, $args) {
    $body = json_decode(
        $request->getBody()->getContents(),
        true
    );

    $database = require 'firebase.php';

    // update() kullanarak sadece gelen alanları güncelle, diğerlerini silme
    $database
        ->getReference($args['path'])
        ->update($body);

    $response->getBody()->write(json_encode([
        "success" => true
    ]));

    return $response->withHeader(
        'Content-Type',
        'application/json'
    );
});

$app->run();