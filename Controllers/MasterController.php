<?php

namespace WebApps\Apps\TimetableWeek\Controllers;

use App\Http\Controllers\AppsController;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
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
            'current' => ApplicationSettings::get('app.TimetableWeek.current'),
            'next' => ApplicationSettings::get('app.TimetableWeek.next'),
            'active' => ApplicationSettings::get('app.TimetableWeek.active'),
            'labels' => [
                'current' => ApplicationSettings::get('app.TimetableWeek.current_label'),
                'next' => ApplicationSettings::get('app.TimetableWeek.next_label')
            ]
        ];

        if (Auth::check()) {
            $value['settings'] = (Auth::user()->hasPermissionTo('app.TimetableWeek.settings'));
        }

        $now = new DateTime();
        $active = new DateTime($value['active']);

        if ((date_format($now, 'N') <= ApplicationSettings::get('app.TimetableWeek.switchover'))
        || (date_format($now, 'H') < date_format($active, 'H'))) {
            $value['auto']['text'] = ApplicationSettings::get('app.TimetableWeek.current_label').' '.$value['current'];
            $value['auto']['html'] = ApplicationSettings::get('app.TimetableWeek.current_label')
                .' <span>'.$value['current'].'</span>';
        } else {
            $value['auto']['text'] = ApplicationSettings::get('timetable.week.next_label').' '.$value['current'];
            $value['auto']['html'] = ApplicationSettings::get('timetable.week.next_label')." <span>".$value['current']."</span>";
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
        ApplicationSettings::set('app.TimetableWeek.current', $request->input('current'));
        ApplicationSettings::set('app.TimetableWeek.next', $request->input('next'));
        ApplicationSettings::set('app.TimetableWeek.current_label', $request->input('currentLabel'));
        ApplicationSettings::set('app.TimetableWeek.next_label', $request->input('nextLabel'));
        ApplicationSettings::set('app.TimetableWeek.active', $request->input('active'));

        return response()->json(['success' => true], 201);
    }

    /**
     * TODO:
     */
    public function next(Request $request)
    {
        ApplicationSettings::set('app.TimetableWeek.next', json_decode($request->input('next'), true));

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
        $active = new DateTime(ApplicationSettings::get('app.TimetableWeek.active'));

        if ($now >= $active) {
            ApplicationSettings::set('app.TimetableWeek.current', ApplicationSettings::get('app.TimetableWeek.next'));
            ApplicationSettings::set('app.TimetableWeek.next', 'Not Set');
            ApplicationSettings::set('app.TimetableWeek.active', $active->add(new DateInterval('P7D'))->format('Y-m-d H:i:s'));
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
