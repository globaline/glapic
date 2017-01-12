<?php

namespace App\Http\Controllers;

use App\Album;
use App\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index (Request $request)
    {
        return Category::all()->map(function($category) {
            $category['album_count'] = Album::where('category_id', $category->id)->count();
            return $category;
        })->toJson();
    }
}
