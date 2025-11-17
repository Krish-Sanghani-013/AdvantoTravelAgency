let currentStep = 1;
const totalSteps = 4;

document.addEventListener("DOMContentLoaded", function () {
  initializeForm();
  setupEventListeners();
  calculatePrice();
});

function initializeForm() {
  showStep(currentStep);
  updateProgressSteps();
}

function setupEventListeners() {
  document
    .getElementById("totalMembers")
    .addEventListener("change", updateTravelers);

  const priceFields = [
    "tripDays",
    "budget",
    "accommodationType",
    "roomType",
    "transport",
    "totalMembers",
  ];

  priceFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("change", calculatePrice);
    }
  });

  document
    .getElementById("startDate")
    .addEventListener("change", validateDates);
  document.getElementById("endDate").addEventListener("change", validateDates);

  document.getElementById("bookingForm").addEventListener("submit", submitForm);

  document.querySelectorAll('input[name="activities"]').forEach((checkbox) => {
    checkbox.addEventListener("change", calculatePrice);
  });
}

function showStep(step) {
  document.querySelectorAll(".form-step").forEach((el) => {
    el.classList.remove("active");
  });

  const stepElement = document.getElementById(`step-${step}`);
  if (stepElement) {
    stepElement.classList.add("active");
  }

  updateButtons();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (currentStep === 1) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }

  if (currentStep === totalSteps) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
  } else {
    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
  }
}

function changeStep(direction) {
  if (direction === 1) {
    if (!validateStep(currentStep)) {
      showNotification("error", "Please fill in all required fields correctly");
      return;
    }
  }

  currentStep += direction;

  if (currentStep < 1) currentStep = 1;
  if (currentStep > totalSteps) currentStep = totalSteps;

  showStep(currentStep);
  updateProgressSteps();
}

function updateProgressSteps() {
  document.querySelectorAll(".step").forEach((step, index) => {
    const stepNum = index + 1;

    step.classList.remove("active", "completed");

    if (stepNum === currentStep) {
      step.classList.add("active");
    } else if (stepNum < currentStep) {
      step.classList.add("completed");
    }
  });
}

function validateStep(step) {
  const form = document.getElementById("bookingForm");
  const stepElement = document.getElementById(`step-${step}`);
  const requiredFields = stepElement.querySelectorAll("[required]");

  let isValid = true;
  const validatedRadioGroups = new Set();
  const validatedCheckboxGroups = new Set();

  requiredFields.forEach((field) => {
    if (field.type === "radio") {
      const groupName = field.name;
      if (!validatedRadioGroups.has(groupName)) {
        const checkedRadios = stepElement.querySelectorAll(
          `input[name="${groupName}"]:checked`
        );
        if (checkedRadios.length === 0) {
          stepElement
            .querySelectorAll(`input[name="${groupName}"]`)
            .forEach((f) => {
              f.classList.add("invalid");
            });
          isValid = false;
        } else {
          stepElement
            .querySelectorAll(`input[name="${groupName}"]`)
            .forEach((f) => {
              f.classList.remove("invalid");
            });
        }
        validatedRadioGroups.add(groupName);
      }
    } else if (field.type === "checkbox" && field.name === "activities") {
      if (!validatedCheckboxGroups.has("activities")) {
        const checkedActivities = stepElement.querySelectorAll(
          'input[name="activities"]:checked'
        );
        if (checkedActivities.length === 0) {
          stepElement
            .querySelectorAll('input[name="activities"]')
            .forEach((f) => {
              f.classList.add("invalid");
            });
          isValid = false;
        } else {
          stepElement
            .querySelectorAll('input[name="activities"]')
            .forEach((f) => {
              f.classList.remove("invalid");
            });
        }
        validatedCheckboxGroups.add("activities");
      }
    } else {
      if (!field.value.trim()) {
        field.classList.add("invalid");
        isValid = false;
      } else {
        field.classList.remove("invalid");
      }
    }
  });

  return isValid;
}

function updateTravelers() {
  const totalMembers = document.getElementById("totalMembers").value;
  const container = document.getElementById("travelersContainer");

  container.innerHTML = "";

  if (!totalMembers || totalMembers === "0") {
    return;
  }

  let memberCount = parseInt(totalMembers) === 6 ? 6 : parseInt(totalMembers);

  for (let i = 1; i <= memberCount; i++) {
    const travelerCard = document.createElement("div");
    travelerCard.className = "traveler-card";
    travelerCard.innerHTML = `
            <h4>Traveler ${i} Details</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="travelerName${i}">Full Name</label>
                    <input type="text" id="travelerName${i}" name="travelerName${i}" placeholder="Full name" required>
                </div>
                <div class="form-group">
                    <label for="travelerAge${i}">Age</label>
                    <input type="number" id="travelerAge${i}" name="travelerAge${i}" min="1" max="120" placeholder="Age" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="travelerGender${i}">Gender</label>
                    <select id="travelerGender${i}" name="travelerGender${i}" required>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="travelerID${i}">ID Proof Number</label>
                    <input type="text" id="travelerID${i}" name="travelerID${i}" placeholder="Passport/Aadhar/ID number" required>
                </div>
            </div>
        `;
    container.appendChild(travelerCard);
  }
}

function validateDates() {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const tripDays = document.getElementById("tripDays");

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (startDateInput.value && endDateInput.value) {
    if (endDate <= startDate) {
      showNotification("error", "Return date must be after departure date");
      endDateInput.classList.add("invalid");
      endDateInput.value = "";
      return;
    }

    endDateInput.classList.remove("invalid");
    startDateInput.classList.remove("invalid");

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    tripDays.value = days;
    tripDays.classList.remove("invalid");
    calculatePrice();
  } else if (startDateInput.value || endDateInput.value) {
    if (!startDateInput.value) startDateInput.classList.add("invalid");
    if (!endDateInput.value) endDateInput.classList.add("invalid");
  }
}

function calculatePrice() {
  const budget = parseInt(document.getElementById("budget").value) || 0;
  const days = parseInt(document.getElementById("tripDays").value) || 0;
  const accommodation = document.getElementById("accommodationType").value;
  const transport = document.getElementById("transport").value;
  const members = parseInt(document.getElementById("totalMembers").value) || 1;
  const activities = document.querySelectorAll(
    'input[name="activities"]:checked'
  ).length;

  let basePrice = budget || days * 2000;
  let hotelPrice = 0;
  let transportPrice = 0;
  let activitiesPrice = 0;

  const hotelRates = {
    budget: 3000,
    standard: 6000,
    luxury: 12000,
    resort: 8000,
    homestay: 4000,
    villa: 10000,
  };

  hotelPrice = (hotelRates[accommodation] || 0) * days;

  const transportRates = {
    flight: 15000,
    train: 5000,
    bus: 2000,
    car: 8000,
    mixed: 10000,
  };

  transportPrice = (transportRates[transport] || 0) * members;

  activitiesPrice = activities * 2000;

  const totalPrice = basePrice + hotelPrice + transportPrice + activitiesPrice;

  document.getElementById(
    "basePrice"
  ).textContent = `₹ ${basePrice.toLocaleString()}`;
  document.getElementById(
    "hotelPrice"
  ).textContent = `₹ ${hotelPrice.toLocaleString()}`;
  document.getElementById(
    "transportPrice"
  ).textContent = `₹ ${transportPrice.toLocaleString()}`;
  document.getElementById(
    "activitiesPrice"
  ).textContent = `₹ ${activitiesPrice.toLocaleString()}`;
  document.getElementById(
    "totalPrice"
  ).textContent = `₹ ${totalPrice.toLocaleString()}`;
}

function submitForm(e) {
  e.preventDefault();

  if (!validateStep(currentStep)) {
    showNotification("error", "Please fill in all required fields");
    return;
  }

  if (!document.querySelector('input[name="terms"]:checked')) {
    showNotification("error", "Please accept the Terms & Conditions");
    return;
  }

  const formData = new FormData(document.getElementById("bookingForm"));
  const bookingData = Object.fromEntries(formData);

  console.log("Booking Data:", bookingData);

  showNotification(
    "success",
    "Your booking has been submitted! We will contact you shortly."
  );

  setTimeout(() => {
    document.getElementById("bookingForm").reset();
    currentStep = 1;
    showStep(currentStep);
    updateProgressSteps();
  }, 2000);
}

function showNotification(type, message) {
  const messageClass = type === "error" ? "error-message" : "success-message";
  const notification = document.createElement("div");
  notification.className = messageClass;
  notification.textContent = message;

  const form = document.getElementById("bookingForm");
  form.insertBefore(notification, form.firstChild);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

document.addEventListener("change", function (e) {
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "SELECT" ||
    e.target.tagName === "TEXTAREA"
  ) {
    if (e.target.hasAttribute("required") && e.target.value.trim()) {
      e.target.classList.remove("invalid");
    }
  }
});

document.addEventListener(
  "blur",
  function (e) {
    if (e.target.hasAttribute("required")) {
      if (!e.target.value.trim()) {
        e.target.classList.add("invalid");
      } else {
        e.target.classList.remove("invalid");
      }
    }
  },
  true
);

function exportBookingData() {
  const formData = new FormData(document.getElementById("bookingForm"));
  const bookingData = Object.fromEntries(formData);
  const json = JSON.stringify(bookingData, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `booking-${Date.now()}.json`;
  link.click();
}

function generateTripSummary() {
  const formData = new FormData(document.getElementById("bookingForm"));
  const data = Object.fromEntries(formData);

  const summary = `
TRIP SUMMARY
============
Departure: ${data.departureLocation}
Destination: ${data.destinationLocation}
Start Date: ${data.startDate}
End Date: ${data.endDate}
Duration: ${data.tripDays} days
Trip Type: ${data.tripType}

TRAVELERS
=========
Total Members: ${data.totalMembers}
Group Type: ${data.groupType}

ACCOMMODATION
=============
Type: ${data.accommodationType}
Room Type: ${data.roomType}
Meal Plan: ${data.mealPlan}

PREFERENCES
===========
Transport: ${data.transport}
Budget: ₹${data.budget}

PRIMARY CONTACT
===============
Name: ${data.primaryName}
Email: ${data.primaryEmail}
Phone: ${data.primaryPhone}
`;

  console.log(summary);
  return summary;
}
