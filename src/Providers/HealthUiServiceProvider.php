<?php

namespace Bigmom\HealthUi\Providers;

use Illuminate\Support\ServiceProvider;

class HealthUiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/health-ui.php' => config_path('health-ui.php'),
            ], 'config');

            $this->publishes([
                __DIR__.'/../public' => public_path('vendor/bigmom/health-ui'),
            ], 'public');
        }

        $this->loadRoutesFrom(__DIR__.'/../routes.php');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'bigmom-health-ui');
    }
}
