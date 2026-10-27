<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class TrainMLModels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ml:train';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Train and execute TeraPublic Python Machine Learning Models (APBD Forecasting & Clustering)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting TeraPublic Python Machine Learning Pipeline...');

        $scriptPath = base_path('../ml/train_models.py');

        if (! file_exists($scriptPath)) {
            $this->error("Python script not found at {$scriptPath}");

            return Command::FAILURE;
        }

        $process = new Process(['python', $scriptPath]);
        $process->setTimeout(60);

        $process->run(function ($type, $buffer) {
            $this->output->write($buffer);
        });

        if (! $process->isSuccessful()) {
            $this->error('Failed to execute Python ML pipeline.');

            return Command::FAILURE;
        }

        $this->info('Python Machine Learning Models trained and artifacts exported successfully!');

        return Command::SUCCESS;
    }
}
