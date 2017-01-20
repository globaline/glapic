<?php

namespace App\Http\Controllers;

use App\Album;
use App\Picture;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    protected $album;

    public function __construct(Album $album)
    {
        $this->album = $album;
    }

    public function index(Request $request)
    {
        $category_id = $request->get('category');
        return Album::where('category_id', $category_id)->get()
            ->map(function($album) {
                $album['thumbnail'] = Picture::firstOrNew([
                    'album_id' => $album['id']
                ])->storage_path;
                return $album;
            })->toJson();
    }

    public function store(Request $request)
    {
        $this->album->fill($request->all())->save();
    }
}
