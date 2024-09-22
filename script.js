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
    const nightDuration = new Date(fajrDate.getTime() - maghribDate.getTime())
    const lastThird = new Date(fajrDate.getTime() - (nightDuration / 3));

    const midnightTime = midnight.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lastThirdTime = lastThird.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById("result").innerHTML = `
        Islamic Midnight: ${midnightTime}<br>
        Last Third of the Night Begins: ${lastThirdTime}
    `;
});

document.getElementById("open-dawud-prayer").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link behavior

    const maghribTime = document.getElementById("maghrib").value;
    const fajrTime = document.getElementById("fajr").value;

    if (!maghribTime || !fajrTime) {
        alert("Please enter both Maghrib and Fajr times.");
        return;
    }

    const maghribDate = new Date(`1970-01-01T${maghribTime}:00`);
    const fajrDate = new Date(`1970-01-02T${fajrTime}:00`); // Fajr is on the next day

    const totalNightDuration = fajrDate - maghribDate; // Total duration between Maghrib and Fajr in milliseconds

    // Estimate Isha to be 1/3 of the night after Maghrib
    const oneThirdNight = totalNightDuration / 3;
    const ishaTime = new Date(maghribDate.getTime() + oneThirdNight);

    // Assume Dawud did other activities for 1 hour after Isha
    const afterIshaActivityDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    const sleepStart = new Date(ishaTime.getTime() + afterIshaActivityDuration);

    // Now calculate the remaining time from sleepStart to Fajr
    const remainingNight = fajrDate - sleepStart;

    // Dawud's routine: half sleep, one-third prayer, and final one-sixth sleep
    const halfSleepDuration = remainingNight / 2;
    const oneThirdPrayerDuration = remainingNight / 3;
    const oneSixthFinalSleepDuration = remainingNight / 6;

    const sleepEnd = new Date(sleepStart.getTime() + halfSleepDuration); // End of first sleep/start of prayer
    const prayerEnd = new Date(sleepEnd.getTime() + oneThirdPrayerDuration); // End of prayer/start of final sleep
    const finalSleepEnd = fajrDate; // Final sleep ends at Fajr

    // Display the schedule
    document.getElementById("dawud-info").style.display = "block";
    document.getElementById("dawud-schedule").innerHTML = `
        <strong>Dawud's Night Prayer Approximation:</strong><br>
        - Sleep start: ${sleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
        - Sleep end (start of prayer): ${sleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
        - Prayer end (resume sleep): ${prayerEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
        - Final sleep ends at Fajr: ${finalSleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    `;
});


document.getElementById("get-maghrib").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Fetch prayer times using an API
            fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
                .then(response => response.json())
                .then(data => {
                    const maghrib = data.data.timings.Maghrib;
                    document.getElementById("maghrib").value = maghrib; // Set the Maghrib time
                })
                .catch(error => {
                    console.error("Error fetching prayer times:", error);
                    alert("Could not fetch Maghrib time. Please enter it manually.");
                });
        }, function() {
            alert("Geolocation access denied.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

document.getElementById("fajr-info").addEventListener("click", function() {
    window.open("fajr-info.html", "_blank");
});

