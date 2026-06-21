/* ==========================================================================
   ECOQUEST DASHBOARD CHARTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initDashboardCharts();
});

function initDashboardCharts() {
    const dataEl = document.getElementById('chart-data');
    if (!dataEl) return;
    
    // Parse data from HTML template tags
    const weeklyXp = JSON.parse(dataEl.getAttribute('data-xp-week') || '[40, 80, 45, 110, 60, 95, 30]');
    const userCarbon = parseFloat(dataEl.getAttribute('data-carbon-user') || '4.2');
    const targetCarbon = parseFloat(dataEl.getAttribute('data-carbon-target') || '2.0');
    
    // Theme Colors based on Active Mode
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)';
    
    // 1. Weekly XP Progress Chart
    const xpCtx = document.getElementById('xpProgressChart');
    if (xpCtx) {
        new Chart(xpCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'XP Gained',
                    data: weeklyXp,
                    backgroundColor: 'rgba(0, 230, 118, 0.65)',
                    borderColor: 'rgba(0, 230, 118, 1)',
                    borderWidth: 1,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(0, 230, 118, 0.85)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, stepSize: 50 },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // 2. Carbon Footprint vs Target Chart
    const carbonCtx = document.getElementById('carbonComparisonChart');
    if (carbonCtx) {
        new Chart(carbonCtx, {
            type: 'doughnut',
            data: {
                labels: ['Your Carbon', 'Target Level'],
                datasets: [{
                    data: [userCarbon, targetCarbon],
                    backgroundColor: [
                        userCarbon > targetCarbon ? 'rgba(255, 23, 68, 0.75)' : 'rgba(0, 176, 255, 0.75)',
                        'rgba(0, 230, 118, 0.65)'
                    ],
                    borderColor: [
                        userCarbon > targetCarbon ? 'rgba(255, 23, 68, 1)' : 'rgba(0, 176, 255, 1)',
                        'rgba(0, 230, 118, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor, boxWidth: 12 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw} tons CO2/yr`;
                            }
                        }
                    }
                }
            }
        });
    }
}
