import { DifferentialEquation, DifferentialSystem, PID } from '../node_modules/pidloop/dist/index.js';

window.onload = () => {
    // Cutoff frequency
    const w0 = 10;

    // Input (unfiltered) voltage
    function vi(t) {
        return Math.sin(t) + 0.25 * Math.sin(100 * t);
    }

    // Filter differential equation (dv/dt)
    function dv(t, v, _dv) {
        return w0 * (vi(t) - v);
    }

    // Set initial conditions
    const v0 = 0, dv0 = 0;

    // Initialize the 1st order low pass filter
    const LowPassFilter = new DifferentialEquation(dv, v0, dv0);

    // Simulate the low pass filter for 10 seconds with time step 0.01
    LowPassFilter.solve(0.01, 10);

    // Obtain the time array, voltage input, and output
    const T = LowPassFilter.getTimeArray(),
        V_in = T.map(t => vi(t)),
        V_out = LowPassFilter.getNthDerivative(0);

    // Print a table of comma separated values
    console.log('time,V_in,V_out');
    for (let i = 0; i < T.length; i++) {
        console.log(T[i] + ',' + V_in[i] + ',' + V_out[i]);
    }
};
