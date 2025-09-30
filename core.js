const main = document.getElementById('main');
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  navLinks.forEach(x => x.classList.remove('active'));
  l.classList.add('active');
  route(l.dataset.page);
}));
route('home');

function route(page) {
  switch(page) {
    case 'home': main.innerHTML = `
      <section>
        <h1>TechCon 2025: Future of Web Development</h1>
        <p>Join us for the premier web development conference featuring cutting-edge technologies, industry experts, and networking opportunities.</p>
        <div>
          <strong>Date:</strong> December 15, 2025<br>
          <strong>Location:</strong> Convention Center, Tech City
        </div>
        <button class="btn-main" onclick="document.querySelector('[data-page=register]').click()">Register Now</button>
      </section>`; break;
    case 'details': main.innerHTML = `
      <section>
        <h2>Event Details</h2>
        <div>
          <h3>Schedule:</h3>
          <ul>
            <li>9:00 AM - Registration & Welcome</li>
            <li>9:30 AM - Keynote: Future of Web Development (Sarah Johnson)</li>
            <li>10:30 AM - Modern JS Frameworks (Mike Chen)</li>
            <li>11:30 AM - Coffee Break</li>
            <li>12:00 PM - Responsive Design (Lisa Rodriguez)</li>
            <li>1:00 PM - Lunch Break</li>
            <li>2:00 PM - PWAs (David Kim)</li>
            <li>3:00 PM - Security & Performance (Alex Turner)</li>
            <li>4:00 PM - Panel Discussion</li>
            <li>5:00 PM - Networking Reception</li>
          </ul>
          <h3>Speakers:</h3>
          <ul>
            <li>Sarah Johnson, Google</li>
            <li>Mike Chen, React Core</li>
            <li>Lisa Rodriguez, Adobe</li>
            <li>David Kim, PWA Consultant</li>
            <li>Alex Turner, Cybersecurity Specialist</li>
          </ul>
          <h3>Venue:</h3>
          <p>Convention Center, Tech City</p>
        </div>
      </section>`; break;
    case 'register':
      renderForm();
      break;
    case 'admin':
      renderAdmin();
      break;
  }
}

function renderForm() {
  main.innerHTML = `
  <form class="form-step" id="regForm">
    <h2>Register for TechCon 2025</h2>
    <div id="formStep"></div>
  </form>
  <div id="formSuccess" style="display:none"></div>
  `;
  let step = 0, data = {};
  const steps = [
    // Step 1
    () => `<label>Name*</label><input name="name" required>
       <label>Email*</label><input name="email" type="email" required>
       <label>Phone Number*</label><input name="phone" type="tel" required>
       <label>Company/Organization</label><input name="company">`,
    // Step 2
    () => `<label>Session Preferences:</label>
      <input type="checkbox" name="sessions" value="Frontend">Frontend
      <input type="checkbox" name="sessions" value="Backend">Backend
      <input type="checkbox" name="sessions" value="UI/UX">UI/UX
      <input type="checkbox" name="sessions" value="DevOps">DevOps
      <input type="checkbox" name="sessions" value="Mobile">Mobile
      <input type="checkbox" name="sessions" value="Web Security">Security<br>
      <label>Dietary Restrictions</label>
      <select name="diet"><option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-Free</option></select>
      <label>T-shirt Size*</label>
      <input type="radio" name="tshirt" value="S" required>S
      <input type="radio" name="tshirt" value="M">M
      <input type="radio" name="tshirt" value="L">L
      <input type="radio" name="tshirt" value="XL">XL<br>
      <label>Special requirements</label>
      <textarea name="requirements"></textarea>`,
    // Step 3
    () => `<label>Select Ticket Type*</label>
      <select name="ticket" required>
        <option disabled selected value="">Choose...</option>
        <option value="Early Bird">Early Bird - $199</option>
        <option value="Regular">Regular - $299</option>
        <option value="Student">Student - $99</option>
      </select>
      <label>Payment Method*</label>
      <select name="payment" required>
        <option disabled selected value="">Choose...</option>
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>
      <label><input type="checkbox" name="terms" required> I agree to the terms and conditions</label>`,
    // Step 4
    () => `<div class="success-banner">
      <b>Review & Submit</b><hr>
      Name: ${data.name || ''}<br>
      Email: ${data.email || ''}<br>
      Sessions: ${(data.sessions||[]).join(', ')}<br>
      T-shirt: ${data.tshirt || ''}<br>
      Ticket Type: ${data.ticket || ''}<br>
      Payment: ${data.payment || ''}<br>
      <button type="submit" class="btn-main">Submit Registration</button>
    </div>`
  ];
  showStep();

  function showStep() {
    document.getElementById('formStep').innerHTML = steps[step]();
    document.getElementById('regForm').onsubmit = submitHandler;
    if (step < 3) {
      let nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.innerText = "Next";
      nextBtn.className = "btn-main";
      document.getElementById('formStep').appendChild(nextBtn);
      nextBtn.onclick = handleNext;
    }
    if (step > 0) {
      let backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.innerText = "Back";
      backBtn.className = "btn-main";
      backBtn.style.marginLeft = "1rem";
      document.getElementById('formStep').appendChild(backBtn);
      backBtn.onclick = handleBack;
    }
  }
  function handleNext(e) {
    e.preventDefault();
    let fd = new FormData(document.getElementById('regForm'));
    for (let [k, v] of fd.entries()) {
      // Handle checkboxes
      if (k === 'sessions') {
        if (!Array.isArray(data.sessions)) data.sessions = [];
        data.sessions.push(v);
      } else data[k] = v;
    }
    // Validation per step
    if (step === 0 && (!data.name || !data.email || !data.phone)) { alert("All fields required!"); return; }
    if (step === 2 && (!data.ticket || !data.payment || !fd.get("terms"))) { alert("Please complete all fields and accept terms."); return; }
    step++;
    showStep();
  }
  function handleBack(e) { e.preventDefault(); step--; showStep(); }
  function submitHandler(e) {
    if (step !== 3) { e.preventDefault(); return; }
    e.preventDefault();
    let regs = JSON.parse(localStorage.getItem("techcon_regs") || "[]");
    let regObj = Object.assign({}, data);
    regObj.regid = "TCN" + String(regs.length+1).padStart(3,"0");
    regs.push(regObj);
    localStorage.setItem("techcon_regs", JSON.stringify(regs));
    document.getElementById('regForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    document.getElementById('formSuccess').innerHTML = `
      <div class="success-banner">Registration successful!<br>Your Registration ID: <b>${regObj.regid}</b></div>
    `;
  }
}

function renderAdmin() {
  let regs = JSON.parse(localStorage.getItem("techcon_regs") || "[]");
  let rows = regs.map(r => `<tr>
    <td>${r.name||''}</td>
    <td>${r.email||''}</td>
    <td>${(r.sessions||[]).join(', ')}</td>
    <td>${r.tshirt||''}</td>
    <td>${r.ticket||''}</td>
    <td>${r.regid||''}</td>
  </tr>`);
  main.innerHTML = `
    <section>
      <h2>Admin Dashboard</h2>
      <table class="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Sessions</th><th>T-shirt</th><th>Ticket</th><th>Reg.ID</th></tr>
        </thead>
        <tbody>
          ${rows.length ? rows.join('') : `<tr><td colspan="6" style="text-align:center;">No registrations yet.</td></tr>`}
        </tbody>
      </table>
      <div style="margin-top:1.4rem">
        <b>Total Registered:</b> ${rows.length}
      </div>
    </section>
  `;
}
