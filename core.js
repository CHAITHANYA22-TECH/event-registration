// Single Page Navigation & Interactivity
const main = document.getElementById('mainContent');
const navLinks = document.querySelectorAll('.nav-link');

document.querySelector('.mode-toggle').onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : '');
};
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

navLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  navLinks.forEach(x => x.classList.remove('active'));
  l.classList.add('active');
  const page = l.getAttribute('data-page');
  renderPage(page);
}));
renderPage('home');

function renderPage(page) {
  switch(page) {
    case 'home':
      main.innerHTML = `
        <div class="card" style="text-align:center;">
          <h1>SummitX: Next-Gen Event Platform</h1>
          <p>Discover the future of digital collaboration at <b>SummitX 2025</b>.  
          Meet industry leaders and innovators.</p>
          <a class="btn-main" href="#" onclick="document.querySelector('.nav-link[data-page=register]').click()">Register Now</a>
        </div>`;
      break;
    case 'about':
      main.innerHTML = `
        <div class="card">
          <h2>About SummitX 2025</h2>
          <p>Date: <b>December 22, 2025</b></p>
          <p>Location: Global Expo Center, Mumbai</p>
          <h3>Highlights</h3>
          <ul>
            <li>Innovation keynotes, hands-on workshops, AI panels</li>
            <li>Speakers from Google, Microsoft, OpenAI</li>
            <li>Live networking & virtual lounges</li>
          </ul>
        </div>`;
      break;
    case 'register':
      renderWizard();
      break;
    case 'dashboard':
      renderDashboard();
      break;
    default:
      main.innerHTML = '<div class="card">Page Not Found.</div>';
  }
}

// Multi-step Registration Wizard
function renderWizard() {
  main.innerHTML = `
    <form class="card form-wizard" id="regForm">
      <div class="wizard-steps">
        <div class="wizard-step current" data-step="0">Info</div>
        <div class="wizard-step" data-step="1">Preferences</div>
        <div class="wizard-step" data-step="2">Confirm</div>
      </div>
      <div class="form-section" id="step0">
        <div class="field"><input class="input-text" name="name" placeholder=" " required/><label class="label-float">Full Name*</label></div>
        <div class="field"><input class="input-text" name="email" type="email" placeholder=" " required/><label class="label-float">Email*</label></div>
        <div class="field"><input class="input-text" name="phone" type="tel" placeholder=" " required/><label class="label-float">Phone*</label></div>
        <div class="field"><input class="input-text" name="org" placeholder=" "/><label class="label-float">Organization</label></div>
        <button type="button" class="btn-form" id="to1">Next &rarr;</button>
      </div>
      <div class="form-section" id="step1" style="display:none;">
        <div class="field">
          <label>Sessions Interested</label>
          <label><input type="checkbox" name="session" value="AI" />AI</label>
          <label><input type="checkbox" name="session" value="Web" />Web Tech</label>
          <label><input type="checkbox" name="session" value="Cloud" />Cloud</label>
        </div>
        <div class="field">
          <select class="input-select" name="diet" required>
            <option value="" disabled selected>Dietary Preferences*</option>
            <option>None</option><option>Veg</option><option>Vegan</option>
          </select>
        </div>
        <div class="field">
          <label>T-shirt Size:</label>
          <label><input type="radio" name="tshirt" value="S" required>S</label>
          <label><input type="radio" name="tshirt" value="M">M</label>
          <label><input type="radio" name="tshirt" value="L">L</label>
          <label><input type="radio" name="tshirt" value="XL">XL</label>
        </div>
        <button type="button" class="btn-form" id="back0">&larr; Back</button>
        <button type="button" class="btn-form" id="to2">Next &rarr;</button>
      </div>
      <div class="form-section" id="step2" style="display:none;">
        <div id="summary"></div>
        <label><input type="checkbox" name="terms" required/> I accept terms.</label>
        <button type="button" class="btn-form" id="back1">&larr; Back</button>
        <button type="submit" class="btn-form">Register</button>
      </div>
    </form>
    <div id="successMsg" style="display:none;"></div>
  `;
  let form = document.getElementById('regForm');
  const steps = [document.getElementById('step0'), document.getElementById('step1'), document.getElementById('step2')];
  const wizardNavs = document.querySelectorAll('.wizard-step');
  let currentStep = 0, userData = {};

  function showStep(n) {
    steps.forEach((s,i)=>{ s.style.display = (i===n?'block':'none'); wizardNavs[i].classList.toggle('current',i===n); });
    if(n===2) document.getElementById('summary').innerHTML = `
      <div class="success-banner">
        <b>Review Your Details</b><hr>
        Name: ${form.name.value}<br>
        Email: ${form.email.value}<br>
        Sessions: ${(Array.from(form.session).filter(c=>c.checked).map(c=>c.value) || []).join(', ')}<br>
        T-shirt: ${form.tshirt.value || ''}<br>
      </div>`;
  }
  form.querySelector('#to1').onclick = () => {
    if (form.name.value && form.email.value && form.phone.value) showStep(++currentStep);
    else alert('Fill all required fields.');
  };
  form.querySelector('#to2').onclick = () => {
    if(form.tshirt.value && form.diet.value) showStep(++currentStep);
    else alert('Select session, dietary and t-shirt.');
  };
  form.querySelector('#back0').onclick = ()=> showStep(--currentStep);
  form.querySelector('#back1').onclick = ()=> showStep(--currentStep);

  form.onsubmit = e => {
    e.preventDefault();
    if(!form.terms.checked) { alert('Please accept terms!'); return;}
    let regList = JSON.parse(localStorage.getItem('summitx_regs')||"[]");
    let obj = {};
    new FormData(form).forEach((v,k) => {
      if(obj[k]) { if(!Array.isArray(obj[k])) obj[k]=[obj[k]]; obj[k].push(v);}
      else obj[k]=v;
    });
    regList.push(obj);
    localStorage.setItem('summitx_regs',JSON.stringify(regList));
    form.reset();
    form.style.display = 'none';
    document.getElementById('successMsg').style.display='block';
    document.getElementById('successMsg').innerHTML =
      '<div class="success-banner"><b>Registration Successful!</b><br>Your entry ID: ' + regList.length + '</div>';
  }
  showStep(currentStep);
}

// Dashboard
function renderDashboard() {
  let list = JSON.parse(localStorage.getItem('summitx_regs')||"[]");
  if(!list.length) {
    main.innerHTML = `<div class="card"><h2>Dashboard</h2><p>No registrations yet.</p></div>`;
    return;
  }
  let rows = list.map((r,i) => `<tr>
    <td>${r.name||''}</td><td>${r.email||''}</td><td>${r.session? (Array.isArray(r.session) ? r.session.join(', ') : r.session) : ''}</td>
    <td>${r.tshirt||''}</td>
  </tr>`).join('');
  main.innerHTML = `
    <div class="card"><h2>Dashboard</h2>
      <table class="table-board">
        <thead><tr><th>Name</th><th>Email</th><th>Session</th><th>T-shirt</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:1.5rem;">
        <b>Total Registered:</b> ${list.length}
      </div>
    </div>
  `;
}
