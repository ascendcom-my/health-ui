<!DOCTYPE html>
<html>
  <head>
    <title>Health Check - {{ config('app.name') }}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="{{ asset('vendor/bigmom/health-ui/css/app.css') }}" rel="stylesheet">
    <script src="{{ asset('vendor/bigmom/health-ui/js/index.js') }}" defer></script>
  </head>
  <body>
    <div id="app"></div>
    <input id="required-data" data-url="{{ route('bigmom.health-check.start') }}" data-stack="{{ $stack }}" data-broadcaster="{{ config('broadcasting.default') }}" data-broadcast-key="{{ config('broadcasting.connections.'.config('broadcasting.default').'.key') }}" />
  </body>
</html>
