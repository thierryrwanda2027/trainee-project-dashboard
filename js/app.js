// DOM Elements
const clockElement = document.getElementById('clock');
const logOutput = document.getElementById('log-output');
const toastContainer = document.getElementById('toast-container');

// Sensor Thresholds
const THRESHOLDS = {
    temp: { warning: 85, critical: 100, max: 120 },
    rpm: { warning: 2800, critical: 3200, max: 4000 },
    pressure: { warning: 120, critical: 150, max: 200 }
};

// Application State
let isEmergencyStop = false;

// --- Utility Functions ---

function updateClock() {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

function getTimestamp() {
    return new Date().toISOString().split('T')[1].slice(0, -1);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// --- Terminal Logging ---

function addLog(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="timestamp">[${getTimestamp()}]</span> > ${message}`;
    logOutput.appendChild(entry);
    
    // Auto-scroll to bottom
    logOutput.scrollTop = logOutput.scrollHeight;
    
    // Keep log history manageable
    if (logOutput.children.length > 50) {
        logOutput.removeChild(logOutput.firstChild);
    }
}

// --- Toast Notifications ---

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<strong>ALERT:</strong> ${message}`;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300); // Wait for transition
    }, 5000);
}

// --- Data Simulation ---

function updateSensor(type, value) {
    const valEl = document.getElementById(`val-${type}`);
    const barEl = document.getElementById(`bar-${type}`);
    const statusEl = document.getElementById(`status-${type}`);
    const widgetEl = document.getElementById(`widget-${type}`);
    
    if (isEmergencyStop) {
        valEl.textContent = "0";
        barEl.style.width = "0%";
        barEl.style.backgroundColor = "var(--text-muted)";
        statusEl.textContent = "OFFLINE";
        statusEl.className = "status-indicator";
        widgetEl.classList.remove('alert-active');
        return;
    }

    // Update Value
    valEl.textContent = value;
    
    // Update Progress Bar
    const percentage = (value / THRESHOLDS[type].max) * 100;
    barEl.style.width = `${Math.min(percentage, 100)}%`;
    
    // Status Logic
    if (value >= THRESHOLDS[type].critical) {
        statusEl.textContent = "CRITICAL";
        statusEl.className = "status-indicator critical";
        barEl.style.backgroundColor = "var(--neon-red)";
        widgetEl.classList.add('alert-active');
        
        // Trigger alert if it just crossed the threshold
        if (Math.random() > 0.8) { // Prevent spamming alerts every tick
             showToast(`${type.toUpperCase()} reached critical levels: ${value}`);
             addLog(`CRITICAL SENSOR STATE: ${type.toUpperCase()} @ ${value}`, 'critical');
        }
    } else if (value >= THRESHOLDS[type].warning) {
        statusEl.textContent = "WARNING";
        statusEl.className = "status-indicator warning";
        barEl.style.backgroundColor = "var(--neon-yellow)";
        widgetEl.classList.remove('alert-active');
    } else {
        statusEl.textContent = "NORMAL";
        statusEl.className = "status-indicator";
        barEl.style.backgroundColor = "var(--neon-blue)";
        widgetEl.classList.remove('alert-active');
    }
}

// --- Simulated API Fetch ---
// We wrap our mock data in a Promise to simulate a real async API request
// This allows you to practice async/await data handling without hitting rate limits.
async function fetchMockAPI() {
    return new Promise((resolve, reject) => {
        // Simulate network latency (100ms - 400ms)
        setTimeout(() => {
            if (isEmergencyStop) {
                resolve({ temp: 0, rpm: 0, pressure: 0, networkLoad: 0 });
            } else {
                resolve({
                    temp: randomInt(70, Math.random() > 0.9 ? 105 : 82),
                    rpm: randomInt(2000, Math.random() > 0.95 ? 3300 : 2500),
                    pressure: randomInt(90, Math.random() > 0.9 ? 160 : 110),
                    networkLoad: randomInt(30, 85)
                });
            }
        }, randomInt(100, 400));
    });
}

async function fetchMockData() {
    try {
        // Await the simulated API response
        const data = await fetchMockAPI();
        
        updateSensor('temp', data.temp);
        updateSensor('rpm', data.rpm);
        updateSensor('pressure', data.pressure);
        
        // Update network load
        document.getElementById('val-network').textContent = `${data.networkLoad}%`;
    } catch (error) {
        console.error("Failed to fetch sensor data:", error);
        addLog("API Connection Error", "critical");
    }
}

// --- Cybersecurity Simulation ---

const cyberEvents = [
    { msg: "Failed SSH login attempt from IP 192.168.1.45", type: "warning" },
    { msg: "Port scan detected on sub-network B", type: "warning" },
    { msg: "UNAUTHORIZED ACCESS ATTEMPT on Pump Station Alpha", type: "critical" },
    { msg: "Firewall rules updated automatically.", type: "info" },
    { msg: "Routine ping sweep originating from external IP block.", type: "warning" },
    { msg: "MALWARE SIGNATURE DETECTED in payload packet. Connection dropped.", type: "critical" }
];

function simulateCyberEvent() {
    if (isEmergencyStop) return;
    
    // 20% chance to trigger an event every cycle
    if (Math.random() > 0.8) {
        const event = cyberEvents[Math.floor(Math.random() * cyberEvents.length)];
        addLog(event.msg, event.type);
        
        if (event.type === 'critical') {
            showToast("Security Breach Attempt Detected");
        }
    } else {
        // Normal log traffic
        addLog(`Packet check OK. Latency: ${randomInt(10, 40)}ms`, 'system');
    }
}

// --- Event Listeners ---

document.getElementById('btn-emergency-stop').addEventListener('click', function() {
    isEmergencyStop = !isEmergencyStop;
    
    if (isEmergencyStop) {
        this.textContent = "RESTART SYSTEM";
        this.style.backgroundColor = "var(--neon-red)";
        this.style.color = "#fff";
        addLog("MANUAL OVERRIDE: EMERGENCY STOP INITIATED", "critical");
        showToast("System Halted.");
        document.querySelectorAll('.widget').forEach(w => w.classList.remove('alert-active'));
    } else {
        this.textContent = "INITIATE EMERGENCY STOP";
        this.style.backgroundColor = "transparent";
        this.style.color = "var(--neon-red)";
        addLog("SYSTEM RESTART SEQUENCE INITIATED", "info");
    }
});

// --- Initialization ---

// Start clock
setInterval(updateClock, 1000);
updateClock();

// Start data fetching loop (every 2 seconds)
setInterval(fetchMockData, 2000);
fetchMockData(); // Initial call

// Start cyber event simulation loop (every 3.5 seconds)
setInterval(simulateCyberEvent, 3500);

// Initial logs
addLog("Establishing connection to field devices...", "system");
setTimeout(() => addLog("Extruder Alpha connected.", "info"), 500);
setTimeout(() => addLog("Conveyor Beta connected.", "info"), 1000);
setTimeout(() => addLog("Hydraulic Pump Gamma connected.", "info"), 1500);
setTimeout(() => addLog("System running optimally.", "info"), 2000);