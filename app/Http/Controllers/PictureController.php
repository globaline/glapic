<?php

namespace App\Http\Controllers;

use App\Album;
use App\Category;
use Illuminate\Http\Request;

class PictureController extends Controller
{
    public function store(Request $request) {
        $files = $request->allFiles('file');
        $album_id = $request->get('album');
        $category_id = Album::find($album_id)->category->id;
        $uploadcount = 0;
        foreach($files as $file) {
            $rules = array('file' => 'required'); //'required|mimes:png,gif,jpeg,txt,pdf,doc'
            $validator = \Validator::make(array('file'=> $file), $rules);
            if($validator->passes()){
                $destinationPath = 'uploads';
                $filename = $file->getClientOriginalName();
                $category = Category::find($category_id)->name;
                $album = Album::find($album_id)->name;
                $upload_success = $file->move(storage_path().'/images/'.$category.'/'.$album, $filename);
                $uploadcount ++;
            }
        }
    }
}
