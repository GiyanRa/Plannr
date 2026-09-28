<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'user_id', 'name', 'desc', 'cat', 'prio', 
        'due_date', 'status', 'project_id', 'assignee_id'
    ];
}
