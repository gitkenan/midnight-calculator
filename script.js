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

document.getElementById("show-hadith").addEventListener("click", function(event) {
  event.preventDefault();
  const hadithSection = document.getElementById("hadith-section");
  if (hadithSection.classList.contains("collapse")) {
      hadithSection.classList.remove("collapse");
      hadithSection.classList.add("expand");
  } else {
      hadithSection.classList.remove("expand");
      hadithSection.classList.add("collapse");
  }
});

// Event listener for Dawud's Night Prayer section reveal
document.getElementById("open-dawud-prayer").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link behavior

    const maghribTime = document.getElementById("maghrib").value;
    const fajrTime = document.getElementById("fajr").value;

    // Check if Maghrib and Fajr times are provided
    if (!maghribTime || !fajrTime) {
        alert("Please enter both Maghrib and Fajr times.");
        return;
    }

    // Parse Maghrib and Fajr times into Date objects
    const maghribDate = new Date(`1970-01-01T${maghribTime}:00`);
    const fajrDate = new Date(`1970-01-02T${fajrTime}:00`); // Fajr is the next day

    // Total duration between Maghrib and Fajr in milliseconds
    const totalNightDuration = fajrDate - maghribDate;

    // Isha is 1.25 hours (75 minutes) after Maghrib
    const ishaDuration = 75 * 60 * 1000; // 1.25 hours in milliseconds
    const ishaTime = new Date(maghribDate.getTime() + ishaDuration);

    // Dawud goes to sleep between 1.5 to 3 hours after Isha
    const minSleepDelay = 1.5 * 60 * 60 * 1000; // Minimum 1.5 hours in milliseconds
    const maxSleepDelay = 3 * 60 * 60 * 1000; // Maximum 3 hours in milliseconds

    // Random sleep delay between 1.5 to 3 hours
    const sleepDelay = Math.random() * (maxSleepDelay - minSleepDelay) + minSleepDelay;
    const sleepStart = new Date(ishaTime.getTime() + sleepDelay); // Sleep starts after this delay

    // Dawud's night routine: half sleep, one-third prayer, final one-sixth sleep (all based on the full night duration)
    const halfNightDuration = totalNightDuration / 2;
    const oneThirdNightDuration = totalNightDuration / 3;
    const oneSixthNightDuration = totalNightDuration / 6;

    // Calculate the timings for sleep, prayer, and final sleep (fractions of the full night)
    const sleepEnd = new Date(sleepStart.getTime() + halfNightDuration); // End of half-night sleep, start of prayer
    const prayerEnd = new Date(sleepEnd.getTime() + oneThirdNightDuration); // End of prayer, start of final sleep
    const finalSleepEnd = fajrDate; // Final sleep ends at Fajr

    // Display the Dawud's Night Prayer schedule
    document.getElementById("dawud-info").style.display = "block";
    document.getElementById("dawud-schedule").innerHTML = `
        <strong>Dawud's Night Prayer Approximation:</strong><br>
        - Isha time: ${ishaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
        - Sleep start (after Isha delay): ${sleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
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

// Event listener for Fajr explanation toggle
document.getElementById("fajr-info").addEventListener("click", function() {
  const fajrInfoText = document.getElementById("fajr-info-text");
  if (fajrInfoText.style.display === "none" || fajrInfoText.style.display === "") {
      fajrInfoText.style.display = "block"; // Show the Fajr explanation
  } else {
      fajrInfoText.style.display = "none"; // Hide the Fajr explanation
  }
});


