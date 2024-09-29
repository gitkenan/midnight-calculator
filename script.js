document.getElementById("calculate").addEventListener("click", function () {
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

// Add event listener for revealing the hadith section
document.getElementById("show-hadith").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent default link behavior (jumping to the top)
  
  const hadithSection = document.getElementById("hadith-section");
  
  // Toggle the display of the hadith section
  if (hadithSection.style.display === "none" || hadithSection.style.display === "") {
      hadithSection.style.display = "block"; // Show the hadith
  } else {
      hadithSection.style.display = "none"; // Hide the hadith
  }
});


// Event listener for Dawud's Night Prayer section reveal
document.getElementById("open-dawud-prayer").addEventListener("click", function (event) {
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

  // Isha is assumed to be 1.25 hours after Maghrib
  const ishaDuration = 1.25 * 60 * 60 * 1000; // 1.25 hours in milliseconds
  const ishaTime = new Date(maghribDate.getTime() + ishaDuration); // Isha time

  // Dawud's night routine: half sleep, one-third prayer, final one-sixth sleep
  const halfNightDuration = totalNightDuration / 2;
  const oneThirdNightDuration = totalNightDuration / 3;
  const oneSixthNightDuration = totalNightDuration / 6;

  // Convert night fractions to hours and minutes for logging
  const msToHoursMinutes = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const halfNight = msToHoursMinutes(halfNightDuration);
  const oneThirdNight = msToHoursMinutes(oneThirdNightDuration);
  const oneSixthNight = msToHoursMinutes(oneSixthNightDuration);

  // Log the lengths of half, one-third, and one-sixth of the night
  console.log(`Half of the night: ${halfNight.hours} hours and ${halfNight.minutes} minutes`);
  console.log(`One-third of the night: ${oneThirdNight.hours} hours and ${oneThirdNight.minutes} minutes`);
  console.log(`One-sixth of the night: ${oneSixthNight.hours} hours and ${oneSixthNight.minutes} minutes`);


  // Final one-sixth sleep ends at Fajr
  const finalSleepEnd = fajrDate; // Final sleep ends at Fajr
  const finalSleepStart = new Date(finalSleepEnd.getTime() - oneSixthNightDuration); // Final sleep starts one-sixth before Fajr

  // Half-night sleep starts after Isha
  const sleepStart = new Date(ishaTime.getTime() + 1.5 * 60 * 60 * 1000); // Add 1.25hrs to isha time to allow time to settle into sleep after Isha
  const sleepEnd = new Date(sleepStart.getTime() + halfNightDuration); // Half-night sleep

  // After waking, one-third of the night is for prayer
  const prayerEnd = new Date(sleepEnd.getTime() + oneThirdNightDuration - 1.5 * 60 * 60 * 1000); // One hour and a half for prayer as Maghrib and Isha were prayed in masjid

  function calculateDawudSecondSleep(maghribTimeStr, fajrTimeStr) {
    const prayerEndTest = new Date(sleepEnd.getTime() + oneThirdNightDuration - 1.5 * 60 * 60 * 1000);
    return prayerEndTest.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Display Dawud's Night Prayer schedule
  document.getElementById("dawud-info").style.display = "block";
  document.getElementById("dawud-schedule").innerHTML = `
      <strong>Dawud's Night Prayer Approximation:</strong><br>
      - If Isha is at: ${ishaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
      - and sleeping begins at: ${sleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
      - then he'd wake up at: ${sleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
      - and go back to sleep at: ${prayerEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
      - or, if sleep is prioritised, then the final sleep starts at: ${finalSleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
      - to wake up at Fajr: ${finalSleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  `;
});


// document.getElementById("get-maghrib").addEventListener("click", function () {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//       const lat = position.coords.latitude;
//       const lon = position.coords.longitude;

//       // Fetch prayer times using an API
//       fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
//         .then(response => response.json())
//         .then(data => {
//           const maghrib = data.data.timings.Maghrib;
//           document.getElementById("maghrib").value = maghrib; // Set the Maghrib time
//         })
//         .catch(error => {
//           console.error("Error fetching prayer times:", error);
//           alert("Could not fetch Maghrib time. Please enter it manually.");
//         });
//     }, function () {
//       alert("Geolocation access denied.");
//     });
//   } else {
//     alert("Geolocation is not supported by this browser.");
//   }
// });

// // Event listener for Fajr explanation toggle
// document.getElementById("fajr-info").addEventListener("click", function () {
//   const fajrInfoText = document.getElementById("fajr-info-text");
//   if (fajrInfoText.style.display === "none" || fajrInfoText.style.display === "") {
//     fajrInfoText.style.display = "block"; // Show the Fajr explanation
//   } else {
//     fajrInfoText.style.display = "none"; // Hide the Fajr explanation
//   }
// });

if (typeof module !== 'undefined') {
  module.exports = { calculateDawudSecondSleep };
}