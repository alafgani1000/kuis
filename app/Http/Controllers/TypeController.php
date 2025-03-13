<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Type;


class TypeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $perPage = isset($request->perPage) ? $request->perPage : 10;
        $sort = isset($request->sort) ? $request->sort : 'id';
        $types = Type::where(function (Builder $query) use($search) {
            return $query->where('name', 'like', '%'.$search.'%');
        })->orderBy($sort)->paginate($perPage);
        return Inertia::render('Type/Type', [
            'types' => $types,
            'pgSearch' => $search,
            'pgPerPage' => $perPage,
            'pgSort' => $sort
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);
        Type::create([
            'name' => $request->name
        ]);
        return 'Input Success';
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required'
        ]);
        Type::where('id',$id)->update([
            'name' => $request->name
        ]);
        return 'Update Success';
    }

    public function delete(Request $request, $id)
    {
        Type::where('id',$id)->delete();
        return 'Delete Success';
    }

}
