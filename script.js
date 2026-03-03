function scrollToSection() {
  document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
}

function loadSubmissions() {
  var submissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]");
  var list = document.getElementById("submissions-list");
  var noMsg = document.getElementById("no-submissions");

  list.innerHTML = "";

  if (submissions.length === 0) {
    noMsg.style.display = "block";
    return;
  }

  noMsg.style.display = "none";

  submissions.forEach(function (entry, index) {
    var card = document.createElement("div");
    card.className = "card submission-card";
    card.innerHTML =
      "<h3>" + escapeHtml(entry.name) + "</h3>" +
      "<p class='submission-email'>" + escapeHtml(entry.email) + "</p>" +
      (entry.phone ? "<p class='submission-phone'>" + escapeHtml(entry.phone) + "</p>" : "") +
      "<p class='submission-message'>" + escapeHtml(entry.message) + "</p>" +
      "<p class='submission-date'>" + entry.date + "</p>";
    list.appendChild(card);
  });
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  loadSubmissions();

  var form = document.querySelector("form[name='contact']");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(form);
    var name = formData.get("name");
    var email = formData.get("email");
    var phone = formData.get("phone");
    var message = formData.get("message");

    // Submit to Netlify Forms
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    }).then(function () {
      // Save to localStorage for display
      var submissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]");
      submissions.unshift({
        name: name,
        email: email,
        phone: phone,
        message: message,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("formSubmissions", JSON.stringify(submissions));

      form.reset();
      loadSubmissions();

      // Scroll to submissions section
      document.getElementById("submissions").scrollIntoView({ behavior: "smooth" });
    }).catch(function () {
      alert("There was an error submitting the form. Please try again.");
    });
  });
});
