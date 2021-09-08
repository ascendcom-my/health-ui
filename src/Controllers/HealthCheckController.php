<?php

namespace Bigmom\HealthUi\Controllers;

use Bigmom\Health\Actions\QueueCheck;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HealthCheckController extends Controller
{
    public function getPage()
    {
        $stackName = config('health-ui.stack');
        if ($stackName === null) {
            throw new Exception('Stack name not set in config file: health-ui. Have you published the file?');
        }
        $stack = config("health.stacks.$stackName");

        $serviceNames = collect($stack['checks'])->map(function ($check) {
            return (new $check)->getName();
        });
        
        $stackToSend = [
            'name' => $stackName,
            'serviceNames' => $serviceNames,
        ];
        $stackJson = json_encode($stackToSend);

        return view('bigmom-health-ui::health-check', [
            'stack' => $stackJson,
        ]);
    }

    public function startCheck(Request $request)
    {
        $input = $request->validate([
            'serviceName' => ['required', 'string'],
            'stackName' => ['required', 'string', Rule::in(array_keys(config('health.stacks')))],
        ]);

        $stack = config("health.stacks.{$input['stackName']}");
        $serviceName = $input['serviceName'];

        $check = collect($stack['checks'])->first(function ($check) use ($serviceName) {
            return (new $check)->getName() === $serviceName;
        });

        (new QueueCheck([$check], $stack['handlers']))->handle();

        return response()->json(['message' => 'Health check dispatched.']);
    }
}
