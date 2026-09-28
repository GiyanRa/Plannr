<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function sync(Request $request)
    {
        $user = Auth::user();
        $tasksData = $request->input('tasks', []);
        
        $user->tasks()->delete();
        
        $insertData = [];
        foreach ($tasksData as $task) {
            $insertData[] = [
                'user_id' => $user->id,
                'name' => $task['name'] ?? 'Untitled',
                'desc' => $task['desc'] ?? null,
                'cat' => $task['cat'] ?? 'General',
                'prio' => $task['prio'] ?? 'Medium',
                'due_date' => $task['dueDate'] ?? null,
                'status' => $task['status'] ?? 'todo',
                'project_id' => $task['projectId'] ?? null,
                'assignee_id' => $task['assigneeId'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        Task::insert($insertData);
        
        return response()->json(['status' => 'success']);
    }
    
    public function getTasks()
    {
        $tasks = Auth::user()->tasks()->get()->map(function($task) {
            return [
                'id' => $task->id,
                'name' => $task->name,
                'desc' => $task->desc,
                'cat' => $task->cat,
                'prio' => $task->prio,
                'dueDate' => $task->due_date,
                'status' => $task->status,
                'projectId' => $task->project_id,
                'assigneeId' => $task->assignee_id,
            ];
        });
        
        return response()->json(['tasks' => $tasks]);
    }
}
