<?php

namespace App\Http\Controllers;

use App\Album;
use App\Category;
use App\Picture;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categories = Category::all();
        $albums = $request->has('category') ? Album::where('category_id', $request->get('category'))->get() : collect();
        $pictures = $request->has('album') ? Picture::where('album_id', $request->get('album'))->get() : collect();

        $categories->map(function($category){
            return $this->addAlbumCount($category);
        });

        $albums->map(function($album){
            return $this->addAlbumThumbnail($album);
        });

        return view('home', compact('categories', 'albums', 'pictures'));
    }

    public function destroy($id)
    {
        Picture::destroy($id);

        return redirect()->back();
    }

    /**
     * Add album count
     *
     * @param $category
     * @return mixed
     */
    protected function addAlbumCount($category)
    {
        $category['album_count'] = Album::where('category_id', $category->id)->count();

        return $category;
    }

    protected function addAlbumThumbnail($album)
    {
        $album['thumbnail'] = Picture::where('album_id', $album->id)->first();

        return $album;
    }
}
