<?php
use Kreait\Firebase\Factory;
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$serviceAccount=[
    "type"=>$_ENV['TYPE'],
    "project_id"=>$_ENV['PROJECT_ID'],
    "private_key" => str_replace('\n', "\n", $_ENV['PRIVATE_KEY']),
    "private_key_id"=>$_ENV['PRIVATE_KEY_ID'],
    "client_email" => $_ENV['CLIENT_EMAIL'],
    "client_id" => $_ENV['CLIENT_ID'],

];
$factory = (new Factory)->withServiceAccount($serviceAccount)->withDatabaseUri(
    $_ENV['DATABASE_URL']
);;
return $factory->createDatabase();