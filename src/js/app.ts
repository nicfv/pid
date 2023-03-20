import { DifferentialEquation, PID } from 'pidloop';

let controller: PID,
    chart: any;

/**
 * This is called when the page is loaded
 */
window.onload = () => {
    document.getElementById('go')?.addEventListener('click', go);
    const infoPanel = document.getElementById('info') as HTMLDivElement;
    infoPanel.addEventListener('dblclick', () => {
        if (infoPanel.className === 'opened') {
            infoPanel.className = 'closed';
        } else if (infoPanel.className === 'closed') {
            infoPanel.className = 'opened';
        } else {
            throw new Error('Invalid class name ' + infoPanel.className);
        }
    });
};

/**
 * Return user entered data from an input element
 */
function getUserInput(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value;
}

/**
 * Determine if a radio button or checkbox is checked
 */
function isChecked(id: string): boolean {
    return (document.getElementById(id) as HTMLInputElement).checked;
}

/**
 * Set an HTML element to be enabled or disabled
 */
function setEnabled(id: string, enabled: boolean): void {
    (document.getElementById(id) as HTMLInputElement).disabled = !enabled;
}

/**
 * Reference signal
 */
function ref(t: number) {
    return eval(getUserInput('ref'));
}

/**
 * First order differential equation
 */
function first(t: number, x: number, dx: number) {
    return eval(getUserInput('DE')) + controller.step(+getUserInput('dt'), x);
}

/**
 * Second order differential equation
 */
function second(t: number, x: number, dx: number, ddx: number) {
    return eval(getUserInput('DE')) + controller.step(+getUserInput('dt'), x);
}

/**
 * Third order differential equation
 */
function third(t: number, x: number, dx: number, ddx: number, d3x: number) {
    return eval(getUserInput('DE')) + controller.step(+getUserInput('dt'), x);
}

/**
 * Simulate the system with user entered parameters
 */
function go(): void {
    let DE: DifferentialEquation;
    controller = new PID(+getUserInput('Kp'), +getUserInput('Ki'), +getUserInput('Kd'), ref);
    if (isChecked('first')) {
        DE = new DifferentialEquation(first, 0, 0);
    } else if (isChecked('second')) {
        DE = new DifferentialEquation(second, 0, 0, 0);
    } else if (isChecked('third')) {
        DE = new DifferentialEquation(third, 0, 0, 0, 0);
    } else {
        throw new Error('Must select an order.');
    }
    setEnabled('go', false);
    setTimeout(() => {
        chart?.destroy();
        DE.solve(+getUserInput('dt'), +getUserInput('tf'));
        const T = DE.getTimeArray().map(t => Math.round(t * 1e4) / 1e4),
            R = T.map(t => ref(t)),
            Y = DE.getNthDerivative(0);
        chart = plot(T, ['Setpoint', 'Response'], [R, Y]);
        setEnabled('go', true);
    }, 1);
}

/**
 * Use chart.js to plot data.
 */
function plot(x: Array<any>, seriesLabels: Array<string>, seriesData: Array<Array<number>>): any {
    const sets: Array<any> = new Array();
    for (let i = 0; i < seriesLabels.length; i++) {
        sets[i] = { label: seriesLabels[i], data: seriesData[i], pointRadius: 0, pointHitRadius: 4, order: -i, tension: 0.1 };
    }
    return new Chart(document.getElementById('chart'), {
        type: 'line',
        data: {
            labels: x,
            datasets: sets
        }
    });
}