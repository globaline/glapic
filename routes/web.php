<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Authentication Routes...
use App\Picture;
use Illuminate\Http\Request;

Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');
Route::post('logout', 'Auth\LoginController@logout')->name('logout');

// Registration Routes...
Route::get('register', 'Auth\RegisterController@showRegistrationForm')->name('register');
Route::post('register', 'Auth\RegisterController@register');


Route::resource('/', 'HomeController');

Route::get('images/{filename}', function ($filename)
{
    $path = implode('/', [storage_path(), 'images', $filename]);

    if(!File::exists($path)) abort(404);
    $type = File::mimeType($path);

    $response = Response::file($path, ["Content-Type" => $type]);

    return $response;
});

Route::get('thumbnails/{filename}', function ($filename)
{
    $path = implode('/', [storage_path(), 'thumbnails', $filename]);

    if(!File::exists($path)) abort(404);
    $type = File::mimeType($path);

    $response = Response::file($path, ["Content-Type" => $type]);

    return $response;
});

Route::resource('home', 'HomeController');