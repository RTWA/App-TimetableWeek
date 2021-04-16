<?php

namespace WebApps\Apps\TimetableWeek\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Akaunting\Setting\Facade as Setting;

class AppManagerController extends Controller
{
    public $name;
    public $slug;
    public $icon;
    public $version;
    public $author;

    public $menu;
    public $routes;

    private $manifest;

    public function __construct()
    {
        $this->manifest = json_decode(file_get_contents(__DIR__.'/../manifest.json'), true);
        $this->name = $this->manifest['name'];
        $this->slug = $this->manifest['slug'];
        $this->icon = $this->manifest['icon'];
        $this->version = $this->manifest['version'];
        $this->author = $this->manifest['author'];
        $this->menu = $this->manifest['menu'];
        $this->routes = $this->manifest['routes'];
    }

    public function install()
    {
        // No tables to create
        $this->createPermissions();
        $this->createSettings();
        $this->copyAppJS();
    }

    public function uninstall()
    {
        // No tables to drop
        $this->dropPermissions();
        $this->dropSettings();
        $this->dropAppJS();
    }

    /**
     * TODO: This needs centralising
     */
    private function createPermissions()
    {
        $admin = Role::findByName('Administrators', 'web');

        foreach ($this->manifest['permissions'] as $permission) {
            if (Permission::where('name', $permission['name'])
                    ->where('guard_name', $permission['guard'])
                    ->first() === null) {
                $p = Permission::create([
                    'name' => $permission['name'],
                    'title' => $permission['title'],
                    'guard_name' => $permission['guard'],
                ]);
                if ($permission['admin']) {
                    $admin->givePermissionTo($p);
                }
            }
        }
    }

    /**
     * TODO: This needs centralising
     */
    private function dropPermissions()
    {
        foreach ($this->manifest['permissions'] as $permission) {
            $p = Permission::where('name', $permission['name'])
                ->where('guard_name', $permission['guard'])
                ->first();
            if ($p <> null) {
                // Revoke direct user permissions
                $users = User::permission($permission['name'])->get();
                foreach ($users as $user) {
                    $user->revokePermissionTo($p);
                }
                // Revoke all role permissions
                $roles = Role::all();
                foreach ($roles as $role) {
                    $role->revokePermissionTo($permission);
                }
                
                $p->delete();
            }
        }
    }

    /**
     * TODO: This needs centralising
     */
    private function createSettings()
    {
        foreach ($this->manifest['settings'] as $setting) {
            if (Setting::get($setting['key']) === null) {
                Setting::set($setting['key'], (is_array($setting['value']))
                                                    ? json_encode($setting['value'])
                                                    : $setting['value']);
            }
        }
        Setting::save();
    }

    /**
     * TODO: This needs centralising
     */
    private function dropSettings()
    {
        foreach ($this->manifest['settings'] as $setting) {
            Setting::forget($setting['key']);
        }
        Setting::save();
    }

    /**
     * TODO: This needs centralising
     */
    private function copyAppJS()
    {
        $js = __DIR__.'/../public/'.$this->slug.'.js';
        $path = public_path("js/apps/");

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
        copy($js, $path.$this->slug.'.js');
    }

    /**
     * TODO: This needs centralising
     */
    private function dropAppJS()
    {
        $path = public_path("js/apps/");
        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
    }
}
