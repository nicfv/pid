import { DifferentialEquation, DifferentialSystem, PID } from 'pidloop';

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
    const T = LowPassFilter.getTimeArray().map(t => Math.round(t * 1e3) / 1e3),
        V_in = T.map(t => vi(t)),
        V_out = LowPassFilter.getNthDerivative(0);

    // Plot data
    plot(T, ['V_in', 'V_out'], [V_in, V_out]);
};

/**
 * Use chart.js to plot data.
 */
function plot(x = [], seriesLabels = [], seriesData = []) {
    const sets = [];
    for (let i = 0; i < seriesLabels.length; i++) {
        sets[i] = { label: seriesLabels[i], data: seriesData[i], pointRadius: 0, order: -i, tension: 0.1 };
    }
    new Chart(document.getElementById('chart'), {
        type: 'line',
        data: {
            labels: x,
            datasets: sets
        }
    });
}