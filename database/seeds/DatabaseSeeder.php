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

        $files = \File::allFiles(storage_path().'/images/old');
        $i = 0;
        foreach($files As $file) {
            $i++;
            $file_path = (string) $file;
            $file_name =  last(explode('/', $file_path));

            $category = Category::firstOrCreate([
                'name' => 'SAMPLE CATEGORY'
            ]);

            $album = Album::firstOrCreate([
                'name' => 'SAMPLE ALBUM',
                'category_id' => $category->id,
            ]);

            $picture = Picture::create([
                'filename' => $file_name,
                'storage_path' => 'no path',
                'thumbnail_path' => 'no thumbs',
                'album_id' => $album->id,
            ]);

            $picture->storage_path = '/images/'.$picture->id.'.jpg';

            $save_path = storage_path().$picture->storage_path;
            \File::copy($file_path, $save_path);

            // Generate Thumbnail
            \Image::make($save_path)->fit(342, 273)->save(storage_path().'/thumbnails/'.$picture->id.'.jpg');
            $picture->thumbnail_path = '/thumbnails/'.$picture->id.'.jpg';

            $picture->save();

            $count = count($files);
            echo "{$i}/{$count} {$file_name} is finished.\n";
        }
    }
}
