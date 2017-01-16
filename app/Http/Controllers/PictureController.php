<?php

namespace App\Http\Controllers;

use App\Album;
use App\Category;
use App\Picture;
use Illuminate\Http\Request;

class PictureController extends Controller
{
    public function index(Request $request)
    {
        $album_id = $request->get('album');

        return Picture::where('album_id', $album_id)->orderBy('id', 'asc')->get()->toJSON();
    }

    public function store(Request $request)
    {
        $files = $request->allFiles('file');
        $album_id = $request->get('album');
        $category_id = Album::find($album_id)->category_id;
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

                Picture::create([
                    'filename' => $filename,
                    'storage_path' => '/images/'.$category.'/'.$album.'/'.$filename,
                    'album_id' => $album_id,
                ]);
                $uploadcount ++;
            }
        }
    }

    public function destroy($id){
        $picture = Picture::find($id);
        \File::delete(storage_path().'/'.$picture->storage_path);
        $picture->delete();
    }

    public function update(Request $request, $id){
        $picture = Picture::find($id);
        $old_path = storage_path().'/'.$picture->storage_path;
        $old_name = $picture->filename;
        $new_name = $request->get('filename');
        $dir = str_replace($old_name, '', $old_path);
        \File::move($old_path, $dir.$new_name);

        $picture->update($request->all());

    }
}
