document.getElementById("calculate").addEventListener("click", function() {
    const maghribTime = document.getElementById("maghrib").value;
    const fajrTime = document.getElementById("fajr").value;

    if (!maghribTime || !fajrTime) {
        alert("Please enter both Maghrib and Fajr times.");
        return;
    }

    const maghribDate = new Date(`1970-01-01T${maghribTime}:00`);
    const fajrDate = new Date(`1970-01-01T${fajrTime}:00`);

    // If Fajr is before Maghrib, it means Fajr is on the next day
    if (fajrDate <= maghribDate) {
        fajrDate.setDate(fajrDate.getDate() + 1);
    }

    const midnight = new Date(maghribDate.getTime() + (fajrDate - maghribDate) / 2);
    const lastThird = new Date(midnight.getTime() - (fajrDate - maghribDate) / 6);

    const midnightTime = midnight.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lastThirdTime = lastThird.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById("result").innerHTML = `
        Islamic Midnight: ${midnightTime}<br>
        Last Third of the Night Begins: ${lastThirdTime}
    `;
});

