<?php

use App\Album;
use App\Category;
use App\Picture;
use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => '河本勇人',
            'email' => 'bahihzss@gmail.com',
            'password' => bcrypt('isbn9784'),
        ]);

        $files = \File::allFiles(storage_path().'/images');
        foreach($files As $file) {
            $file_path = (string) $file;
            $file_info = explode('/',str_replace(storage_path().'/images/', '',$file_path));

            $category = Category::firstOrCreate([
                'name' => $file_info[0]
            ]);

            $album = Album::firstOrCreate([
                'name' => $file_info[1],
                'category_id' => $category->id,
            ]);

            Picture::create([
                'filename' => $file_info[2],
                'storage_path' => 'images/'.implode('/', $file_info),
                'album_id' => $album->id,
            ]);
        }
    }
}
