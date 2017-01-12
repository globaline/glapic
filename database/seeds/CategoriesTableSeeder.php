<?php

use App\Category;
use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
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
            Category::create([
                'name' => $category,
            ]);
        }
    }
}
