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
                $thumbnail = Picture::firstOrNew([
                    'album_id' => $album['id']
                ]);
                if(!isset($thumbnail['storage_path'])) {
                    $thumbnail['storage_path'] = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzE0MDMwMzt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPuOCouOCu+ODg+ODiCAyPC90aXRsZT48ZyBpZD0i44Os44Kk44Ok44O8XzIiIGRhdGEtbmFtZT0i44Os44Kk44Ok44O8IDIiPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMS0yIiBkYXRhLW5hbWU9IuODrOOCpOODpOODvCAxIj48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzguMTgsNzIuMjNoMy4xN2w0LjUxLDguMjcsMS41NSwzLjM2aC4xYy0uMTctMS42Mi0uNC0zLjY3LS40LTUuNDRWNzIuMjNoMi45NFY4Ny43N0g0Ni45MWwtNC40OS04LjMxLTEuNTctMy4zNGgtLjFjLjE1LDEuNjguMzgsMy42My4zOCw1LjQydjYuMjRIMzguMThaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTMuMTMsNzkuOTRjMC01LjA2LDIuODMtOCw2Ljk1LThzNi45NSwzLDYuOTUsOC0yLjgzLDguMTMtNi45NSw4LjEzUzUzLjEzLDg1LDUzLjEzLDc5Ljk0Wm0xMC43MywwYzAtMy4zNC0xLjQ3LTUuMzMtMy43OC01LjMzcy0zLjc4LDItMy43OCw1LjMzLDEuNDcsNS40NCwzLjc4LDUuNDRTNjMuODYsODMuMjUsNjMuODYsNzkuOTRaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzQuODQsNzIuMjNoNS4xYzMuNDQsMCw2LjA5LDEuMiw2LjA5LDQuODdzLTIuNjcsNS4xNC02LDUuMTRINzcuOTV2NS41Mkg3NC44NFptNSw3LjU2YzIuMTQsMCwzLjE3LS45LDMuMTctMi42OXMtMS4xMy0yLjQxLTMuMjgtMi40MUg3Ny45NXY1LjFaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNODguODUsNzIuMjNIOTJWODcuNzdIODguODVaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNOTUsODAuMDZjMC01LjEyLDMuMy04LjEzLDcuMjItOC4xM2E2LjM0LDYuMzQsMCwwLDEsNC41NiwybC0xLjY0LDJhNCw0LDAsMCwwLTIuODYtMS4zYy0yLjM1LDAtNC4xMiwyLTQuMTIsNS4zNXMxLjYsNS40Miw0LjA1LDUuNDJhNC4zMiw0LjMyLDAsMCwwLDMuMjEtMS41M2wxLjY0LDEuOTNhNi4yOSw2LjI5LDAsMCwxLTUsMi4yOUM5OC4xOSw4OC4wNiw5NSw4NS4yNSw5NSw4MC4wNloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMTIuNjYsNzQuODFoLTQuMzdWNzIuMjNoMTEuODh2Mi41OGgtNC40MXYxM2gtMy4xMVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMjIuNjIsODAuNzhWNzIuMjNoMy4xMVY4MWMwLDMuMjMsMS4xMSw0LjMzLDIuOTQsNC4zM3MzLTEuMDksMy00LjMzVjcyLjIzaDN2OC41NWMwLDUuMTctMi4yMSw3LjI5LTYsNy4yOVMxMjIuNjIsODUuOTQsMTIyLjYyLDgwLjc4WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE0Ni44Nyw4Ny43N2wtMy4xOS01Ljg4aC0yLjE2djUuODhoLTMuMTFWNzIuMjNoNS40MmMzLjI2LDAsNS44NCwxLjEzLDUuODQsNC43YTQuNDUsNC40NSwwLDAsMS0zLDQuNDdsMy42Myw2LjM2Wm0tNS4zNS04LjM0aDJjMiwwLDMuMDktLjg0LDMuMDktMi41cy0xLjA5LTIuMjUtMy4wOS0yLjI1aC0yWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE1Mi43Myw3Mi4yM2g5LjUzdjIuNThoLTYuNDJWNzguNGg1LjQ2VjgxaC01LjQ2djQuMTZoNi42NnYyLjZoLTkuNzZaIi8+PC9nPjwvZz48L3N2Zz4=';
                }
                $album['thumbnail'] = $thumbnail;
                return $album;
            })->toJson();
    }

    public function store(Request $request)
    {
        $this->album->fill($request->all())->save();
    }
}
