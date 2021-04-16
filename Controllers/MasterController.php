<?php

namespace WebApps\Apps\TimetableWeek\Controllers;

use Akaunting\Setting\Facade as Setting;
use App\Http\Controllers\AppsController;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use SimpleXMLElement;

class MasterController extends AppsController
{
    /**
     * Get the current value in the requested format
     *
     * @param string $format Default 'json'
     * @return json|xml
     */
    public function value($format = 'json')
    {
        $this->needsProgress();
        $value = [
            'current' => Setting::get('app.TimetableWeek.current'),
            'next' => Setting::get('app.TimetableWeek.next'),
            'active' => Setting::get('app.TimetableWeek.active'),
            'labels' => [
                'current' => Setting::get('app.TimetableWeek.current_label'),
                'next' => Setting::get('app.TimetableWeek.next_label')
            ]
        ];

        if (Auth::check()) {
            $value['settings'] = (Auth::user()->hasPermissionTo('app.TimetableWeek.settings'));
        }

        $now = new DateTime();
        $active = new DateTime($value['active']);

        if ((date_format($now, 'N') <= Setting::get('app.TimetableWeek.switchover'))
        || (date_format($now, 'H') < date_format($active, 'H'))) {
            $value['auto']['text'] = Setting::get('app.TimetableWeek.current_label').' '.$value['current'];
            $value['auto']['html'] = Setting::get('app.TimetableWeek.current_label')
                .' <span>'.$value['current'].'</span>';
        } else {
            $value['auto']['text'] = Setting::get('timetable.week.next_label').' '.$value['current'];
            $value['auto']['html'] = Setting::get('timetable.week.next_label')." <span>".$value['current']."</span>";
        }

        if ($format === 'json') {
            return response()->json(['value' => $value], 200);
        } elseif ($format === 'xml') {
            $xml = new SimpleXmlElement('<value/>');
            $this->arrayToXml($value, $xml);
            echo $xml->asXML();
        }
    }

    /**
     * TODO:
     */
    public function saveConfig(Request $request)
    {
        Setting::set('app.TimetableWeek.current', $request->input('current'));
        Setting::set('app.TimetableWeek.next', $request->input('next'));
        Setting::set('app.TimetableWeek.current_label', $request->input('currentLabel'));
        Setting::set('app.TimetableWeek.next_label', $request->input('nextLabel'));
        Setting::set('app.TimetableWeek.active', $request->input('active'));
        Setting::save();

        return response()->json(['success' => true], 201);
    }

    /**
     * TODO:
     */
    public function next(Request $request)
    {
        Setting::set('app.TimetableWeek.next', json_decode($request->input('next'), true));
        Setting::save();

        return response()->json([
            'success' => true,
            'message' => 'The selected option has been saved successfully'
        ], 201);
    }

    /**
     * TODO:
     */
    private function needsProgress()
    {
        $now = new DateTime();
        $active = new DateTime(Setting::get('app.TimetableWeek.active'));

        if ($now >= $active) {
            Setting::set('app.TimetableWeek.current', Setting::get('app.TimetableWeek.next'));
            Setting::set('app.TimetableWeek.next', 'Not Set');
            Setting::set('app.TimetableWeek.active', $active->add(new DateInterval('P7D'))->format('Y-m-d H:i:s'));
            Setting::save();
        }
    }

    /**
     * TODO:
     *
     * @param array $array
     * @param SimpleXmlElement $xml
     */
    private function arrayToXml($array, &$xml)
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                if (!is_numeric($key)) {
                    $subnode = $xml->addChild("$key");
                    $this->arrayToXml($value, $xml);
                } else {
                    $this->arrayToXml($value, $xml);
                }
            } else {
                $xml->addChild("$key", "$value");
            }
        }
    }
}
