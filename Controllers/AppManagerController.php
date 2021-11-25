<?php

namespace WebApps\Apps\TimetableWeek\Controllers;

use App\Http\Controllers\AppManagerController as Controller;

class AppManagerController extends Controller
{
    
    public function __construct()
    {
        parent::__construct(json_decode(file_get_contents(__DIR__.'/../manifest.json'), true));
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
    
    private function dropAppJS()
    {
        $path = public_path("js/apps/");
        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
    }
}
