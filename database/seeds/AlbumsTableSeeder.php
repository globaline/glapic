<?php

use App\Album;
use App\Category;
use Illuminate\Database\Seeder;

class AlbumsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = \File::directories(storage_path().'/image');

        foreach($categories As $category) {
            $albums = \File::directories(storage_path().'/image/'.$category);
            foreach($albums As $album) {
                Album::create([
                    'name' => $album,
                    'category_id' => Category::where('name', $category)->first()->id,
                ]);
            }
        }
    }
}
