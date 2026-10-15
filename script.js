const form = document.getElementById("enrollForm");
const successMessage = document.getElementById("successMessage");
const courseSelect = document.getElementById("course");
const majorField = document.getElementById("majorField");
const majorSelect = document.getElementById("major");
const dataBody = document.getElementById("dataBody");

const fields = [
  "studentId", "prefix", "firstName", "middleName",
  "lastName", "suffix", "email", "course", "major", "year"
];

function setError(id, message) {
  document.getElementById(id + "Error").textContent = message;
  document.getElementById(id).classList.add("invalid");
}

function clearError(id) {
  document.getElementById(id + "Error").textContent = "";
  document.getElementById(id).classList.remove("invalid");
}

// Clear errors while typing or changing a field
fields.forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => clearError(id));
  el.addEventListener("change", () => clearError(id));
});

// Show major only when BSIT is selected
courseSelect.addEventListener("change", () => {
  if (courseSelect.value === "BSIT") {
    majorField.hidden = false;
  } else {
    majorField.hidden = true;
    majorSelect.value = "";
    clearError("major");
  }
});

function validate() {
  let valid = true;
  const v = (id) => document.getElementById(id).value.trim();

  // Required fields with minimum length
  const required = [
    ["studentId", "Student ID", 5],
    ["firstName", "First name", 3],
    ["lastName", "Last name", 2]
  ];
  required.forEach(([id, label, min]) => {
    if (v(id) === "") {
      setError(id, label + " is required.");
      valid = false;
    } else if (v(id).length < min) {
      setError(id, label + " must be at least " + min + " characters.");
      valid = false;
    }
  });

  // Optional fields: validate length only if filled
  const optional = [
    ["prefix", "Prefix"],
    ["middleName", "Middle name"],
    ["suffix", "Suffix"]
  ];
  optional.forEach(([id, label]) => {
    if (v(id) !== "" && v(id).length < 2) {
      setError(id, label + " must be at least 2 characters.");
      valid = false;
    }
  });

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (v("email") === "") {
    setError("email", "Email is required.");
    valid = false;
  } else if (!emailPattern.test(v("email"))) {
    setError("email", "Enter a valid email address.");
    valid = false;
  }

  // Course and major
  if (v("course") === "") {
    setError("course", "Please select a course.");
    valid = false;
  } else if (v("course") === "BSIT" && v("major") === "") {
    setError("major", "Please select a major for BSIT.");
    valid = false;
  }

  // Year level
  if (v("year") === "") {
    setError("year", "Please select a year level.");
    valid = false;
  }

  return valid;
}

function addRow(data) {
  const emptyRow = document.getElementById("emptyRow");
  if (emptyRow) emptyRow.remove();

  const fullName = [data.prefix, data.firstName, data.middleName, data.lastName, data.suffix]
    .filter(Boolean)
    .join(" ");

  const values = [
    data.studentId,
    fullName,
    data.email,
    data.course,
    data.major || "N/A",
    data.year
  ];

  const tr = document.createElement("tr");
  values.forEach((val) => {
    const td = document.createElement("td");
    td.textContent = val;
    tr.appendChild(td);
  });
  dataBody.appendChild(tr);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMessage.hidden = true;

  if (!validate()) return;

  const data = {};
  fields.forEach((id) => {
    data[id] = document.getElementById(id).value.trim();
  });

  addRow(data);

  successMessage.textContent = "Enrollment submitted successfully!";
  successMessage.hidden = false;

  form.reset();
  majorField.hidden = true;
});