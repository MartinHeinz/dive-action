import * as core from '@actions/core'
import * as exec from '@actions/exec'
import fs from 'fs'

interface Result {
    efficiency: number;
    wastedBytes: number;
    userWastedPercent: number;
}

function extract(output: string): Result {
    let efficiency = 0;
    let wastedBytes = 0;
    let userWastedPercent = 0;
    for (const line of output.split('\n')) {
        if (line.includes('efficiency:')) {
            efficiency = +line.match(/[+-]?\d+(\.\d+)?/)![0]
        }
        else if (line.includes('wastedBytes:')) {
            wastedBytes = +line.match(/[+-]?\d+(\.\d+)?/)![0]
        }
        else if (line.includes('userWastedPercent:')) {
            userWastedPercent = +line.match(/[+-]?\d+(\.\d+)?/)![0]
        }
    }
    return {
        efficiency: efficiency,
        wastedBytes: wastedBytes,
        userWastedPercent: userWastedPercent,
    }
}

async function run(): Promise<void> {
    try {
        const image = core.getInput('image');
        const config = core.getInput('config');
        const exitZero = core.getInput('exit-zero');

        if (config && !fs.existsSync(config)) {
            core.setFailed(`Dive configuration file ${config} doesn't exist!`);
            return
        }

        const dive = 'wagoodman/dive:v0.9.2';

        const runOptions = [
          '-e',
          'CI=true',
          '-e',
          'DOCKER_API_VERSION=1.37',
          '--rm',
          '-v',
          '/var/run/docker.sock:/var/run/docker.sock'
        ];

        const cmdOptions = [];

        if (config) {
            runOptions.push('-v', `${config}:/.dive-ci`);
            cmdOptions.push('--ci-config', '/.dive-ci')
        }

        await exec.exec('docker', ['pull', dive]);

        const parameters = ['run', ...runOptions, dive, image, ...cmdOptions];

        let output = '';
        const execOptions = {
            ignoreReturnCode: true,
            listeners: {
                stdout: (data: Buffer) => {
                    output += data.toString()
                },
                stderr: (data: Buffer) => {
                    output += data.toString()
                }
            }
        };

        const exitCode = await exec.exec('docker', parameters, execOptions);

        let results = extract(output);
        core.setOutput('efficiency', results.efficiency);
        core.setOutput('wasted-bytes', results.wastedBytes);
        core.setOutput('user-wasted-percent', results.userWastedPercent);

        if (exitCode === 0) {
            // success
            return
        }
        if (exitZero === 'true') {
            // forced exit 0
            console.log(`Scan failed (exit code: ${exitCode}), but forcing exit with 0.`);
            return
        }

        core.setFailed(`Scan failed (exit code: ${exitCode})`)
    } catch (error) {
        core.setFailed(`${error}`);
    }
}

run();
