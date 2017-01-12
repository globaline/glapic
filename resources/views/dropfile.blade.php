@extends('layouts.app')

@section('content')
<uploader ref="mainUploader"></uploader>
<button v-on:click="$refs.mainUploader.show()">表示</button>
@endsection
