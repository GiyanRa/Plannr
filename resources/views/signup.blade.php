<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plannr — Sign Up</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{{ asset('style.css') }}" />
  <style>
    body {
      background-color: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      overflow: hidden;
      position: relative;
      transition: background-color 0.3s;
    }
    
    /* Aurora Background */
    .bg-aurora {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      overflow: hidden;
      z-index: -3;
    }
    .aurora-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
      animation: drift 20s infinite alternate ease-in-out;
    }
    .blob-1 { width: 400px; height: 400px; background: #8b5cf6; top: -10%; left: -10%; animation-delay: 0s; }
    .blob-2 { width: 500px; height: 500px; background: #4f46e5; bottom: -20%; right: -10%; animation-delay: -5s; }
    .blob-3 { width: 300px; height: 300px; background: #ec4899; top: 40%; left: 60%; animation-delay: -10s; }
    .blob-4 { width: 350px; height: 350px; background: #10b981; top: 60%; left: 10%; animation-delay: -15s; }

    @keyframes drift {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(50px, -50px) scale(1.1); }
    }

    /* Dot Grid */
    .bg-dots {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(var(--g300) 1px, transparent 1px);
      background-size: 24px 24px;
      z-index: -2;
      opacity: 0.5;
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
    }

    /* Floating Cards */
    .bg-floating-cards {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      overflow: hidden;
      z-index: -1;
      pointer-events: none;
    }
    .float-card {
      position: absolute;
      bottom: -100px;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(4px);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pu);
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border: 1px solid rgba(255,255,255,0.6);
      animation: floatUp linear infinite;
    }
    @keyframes floatUp {
      0% { transform: translateY(0) rotate(0deg) scale(var(--s, 1)); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-120vh) rotate(360deg) scale(var(--s, 1)); opacity: 0; }
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: #0f172a; }
      .aurora-blob { opacity: 0.4; }
      .bg-dots { background-image: radial-gradient(#334155 1px, transparent 1px); }
      .float-card {
        background: rgba(30, 41, 59, 0.4);
        border-color: rgba(255,255,255,0.1);
        color: #8b5cf6;
      }
      .login-wrapper {
        background: rgba(15, 23, 42, 0.6) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
      }
      .login-title, .logo-tx, .fl { color: #f8fafc !important; }
      .login-sub, .login-footer { color: #94a3b8 !important; }
      .fi { background: rgba(15, 23, 42, 0.5) !important; border-color: #334155 !important; color: #f8fafc !important; }
      .mascot-msg { color: #e2e8f0 !important; background: #334155 !important; }
    }

    /* Glassmorphism for login wrapper */
    .login-wrapper {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      width: 100%;
      max-width: 420px;
      padding: 40px;
      border-radius: var(--rxl);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
      position: relative;
      margin: 20px;
      z-index: 10;
    }
    .back-btn {
      position: absolute;
      top: 24px;
      left: 24px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--g500);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .back-btn:hover { color: var(--pu); }
    
    /* MASCOT CSS */
    .mascot-container {
      position: relative;
      width: 160px;
      height: 160px;
      margin: 0 auto 10px;
      perspective: 1000px;
    }
    #mascot {
      width: 100%;
      height: 100%;
      overflow: visible;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mascot-msg {
      background: var(--g800);
      color: #fff;
      padding: 10px 16px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 24px;
      position: relative;
      animation: float 3s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .mascot-msg, #mascot, .hand, .pupil, .body, .eyes { animation: none !important; transition: none !important; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .mascot-msg::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 6px 6px 0;
      border-style: solid;
      border-color: inherit;
      border-bottom-color: transparent !important;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      color: inherit;
      background: inherit;
      -webkit-background-clip: text;
    }

    .form-group { text-align: left; margin-bottom: 16px; position: relative; }
    .btn-login { width: 100%; padding: 12px; font-size: 14.5px; margin-top: 10px; justify-content: center; }
    .login-footer { margin-top: 24px; font-size: 13px; color: var(--g500); }
    .login-link { color: var(--pu); font-weight: 600; text-decoration: none; }
    .login-link:hover { text-decoration: underline; }
    .eye-btn { position:absolute; right:12px; top:36px; cursor:pointer; color:var(--g400); }
    
    /* Animations */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-10px); }
      40%, 80% { transform: translateX(10px); }
    }
    @keyframes jump {
      0%, 100% { transform: translateY(0) scaleY(1); }
      40% { transform: translateY(-30px) scaleY(1.1); }
      70% { transform: translateY(0) scaleY(0.9); }
    }
  </style>
</head>
<body>

  <!-- Dynamic Background Layers -->
  <div class="bg-aurora">
    <div class="aurora-blob blob-1"></div>
    <div class="aurora-blob blob-2"></div>
    <div class="aurora-blob blob-3"></div>
    <div class="aurora-blob blob-4"></div>
  </div>
  <div class="bg-dots"></div>
  <div class="bg-floating-cards">
    <div class="float-card" style="left: 15%; animation-delay: 0s; animation-duration: 15s; --s: 1;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
    </div>
    <div class="float-card" style="left: 85%; animation-delay: -5s; animation-duration: 20s; --s: 0.8;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
    </div>
    <div class="float-card" style="left: 50%; animation-delay: -12s; animation-duration: 18s; --s: 1.2;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
    </div>
  </div>

  <div class="login-wrapper">
    <a href="{{ route('dashboard') }}" class="back-btn">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Back
    </a>

    <div class="mascot-container">
      <svg id="mascot" viewBox="0 0 200 200">
        <!-- Shadow -->
        <ellipse cx="100" cy="180" rx="40" ry="8" fill="rgba(0,0,0,0.15)" id="shadow" style="transition: all 0.3s;" />
        <!-- Antenna -->
        <line x1="100" y1="60" x2="100" y2="30" stroke="#8b5cf6" stroke-width="4" />
        <circle cx="100" cy="30" r="8" fill="#10b981" />
        
        <g id="character-body" style="transition: transform 0.3s; transform-origin: 100px 170px;">
          <!-- Body -->
          <path d="M 40 110 C 40 50, 160 50, 160 110 C 160 170, 40 170, 40 110 Z" fill="#8b5cf6" />
          <!-- Checkmark -->
          <path d="M 85 130 L 95 140 L 120 115" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>
          <!-- Cheeks -->
          <circle cx="65" cy="100" r="7" fill="#f472b6" opacity="0.6" id="cheek-l" style="transition: opacity 0.3s" />
          <circle cx="135" cy="100" r="7" fill="#f472b6" opacity="0.6" id="cheek-r" style="transition: opacity 0.3s" />
          <!-- Mouth -->
          <path d="M 90 105 Q 100 115 110 105" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" id="mouth" style="transition: d 0.3s;" />
          
          <!-- Eyes Group -->
          <g id="eyes" style="transition: transform 0.1s; transform-origin: 100px 85px;">
            <!-- Left Eye -->
            <circle cx="75" cy="85" r="14" fill="#fff" />
            <circle cx="75" cy="85" r="6" fill="#1f2937" id="pupil-l" style="transition: transform 0.1s;" />
            <!-- Right Eye -->
            <circle cx="125" cy="85" r="14" fill="#fff" />
            <circle cx="125" cy="85" r="6" fill="#1f2937" id="pupil-r" style="transition: transform 0.1s;" />
          </g>
          <!-- Happy Eyes -->
          <g id="eyes-happy" style="display:none; transform-origin: 100px 85px;">
            <path d="M 65 85 Q 75 75 85 85" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" />
            <path d="M 115 85 Q 125 75 135 85" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" />
          </g>
        </g>

        <!-- Hands -->
        <g id="hand-l" style="transform: translate(30px, 140px); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
          <circle cx="0" cy="0" r="18" fill="#7c3aed" />
        </g>
        <g id="hand-r" style="transform: translate(170px, 140px); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
          <circle cx="0" cy="0" r="18" fill="#7c3aed" />
        </g>
      </svg>
    </div>
    
    <div class="mascot-msg" id="msg-box">Ayo bergabung dengan Plannr!</div>

    <form onsubmit="handleSignup(event)" style="position:relative; z-index:10;">
      <div class="form-group">
        <label class="fl">Full Name</label>
        <input type="text" class="fi" id="fullname" placeholder="John Doe" required onfocus="trackEmail()" oninput="trackEmail()" onblur="resetMascot()" />
      </div>

      <div class="form-group">
        <label class="fl">Email Address</label>
        <input type="email" class="fi" id="email" placeholder="Enter your email" required onfocus="trackEmail()" oninput="trackEmail()" onblur="resetMascot()" />
      </div>
      
      <div class="form-group">
        <label class="fl" style="margin-bottom:0;">Password</label>
        <input type="password" class="fi" id="password" placeholder="••••••••" required style="margin-top:6px;" onfocus="coverEyes()" onblur="resetMascot()" />
        <div class="eye-btn" id="toggle-pw" onclick="togglePeek()">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </div>
      </div>

      <button type="submit" class="btn1 btn-login">Sign Up</button>
    </form>

    <div class="login-footer">
      Already have an account? <a href="{{ route('login') }}" class="login-link">Sign in</a>
    </div>
  </div>

  <script>
    const mascot = document.getElementById('mascot');
    const msgBox = document.getElementById('msg-box');
    const pl = document.getElementById('pupil-l');
    const pr = document.getElementById('pupil-r');
    const hl = document.getElementById('hand-l');
    const hr = document.getElementById('hand-r');
    const eyes = document.getElementById('eyes');
    const eyesHappy = document.getElementById('eyes-happy');
    const mouth = document.getElementById('mouth');
    const body = document.getElementById('character-body');
    const shadow = document.getElementById('shadow');
    const pwInput = document.getElementById('password');
    const emailInput = document.getElementById('email');

    let isPeeking = false;
    let isCovering = false;
    let blinkInt = null;

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Blinking
    function blink() {
      if(isCovering || prefersReducedMotion) return;
      eyes.style.transform = 'scaleY(0.1)';
      setTimeout(() => { eyes.style.transform = 'scaleY(1)'; }, 150);
    }
    if(!prefersReducedMotion) blinkInt = setInterval(blink, 4000);

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      if(isCovering || prefersReducedMotion) return;
      const rect = mascot.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const angle = Math.atan2(y, x);
      const dist = Math.min(6, Math.hypot(x, y) / 10);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      pl.style.transform = `translate(${tx}px, ${ty}px)`;
      pr.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    // Tracking text
    window.trackEmail = () => {
      if(prefersReducedMotion) return;
      isCovering = false;
      resetHands();
      // simplistic tracking
      const pct = Math.min(100, Math.random() * 100); 
      const tx = -5 + (pct / 100) * 10; 
      pl.style.transform = `translate(${tx}px, 2px)`;
      pr.style.transform = `translate(${tx}px, 2px)`;
    };

    // Cover Eyes
    window.coverEyes = () => {
      if(prefersReducedMotion) return;
      isCovering = true;
      hl.style.transform = 'translate(65px, 80px)';
      hr.style.transform = 'translate(135px, 80px)';
      if(isPeeking) peek();
    };

    // Reset
    window.resetMascot = () => {
      if(prefersReducedMotion) return;
      isCovering = false;
      isPeeking = false;
      pwInput.type = 'password';
      resetHands();
      mouth.setAttribute('d', 'M 90 105 Q 100 115 110 105');
      body.style.animation = 'none';
      eyes.style.display = 'block';
      eyesHappy.style.display = 'none';
      msgBox.textContent = 'Ayo bergabung dengan Plannr!';
      msgBox.style.background = 'var(--g800)';
      pl.style.transform = 'translate(0, 0)';
      pr.style.transform = 'translate(0, 0)';
    };

    function resetHands() {
      hl.style.transform = 'translate(30px, 140px)';
      hr.style.transform = 'translate(170px, 140px)';
    }

    // Toggle Peek
    window.togglePeek = () => {
      if(!isCovering) return;
      isPeeking = !isPeeking;
      if(isPeeking) {
        pwInput.type = 'text';
        hl.style.transform = 'translate(50px, 110px)'; // peek hand
        pl.style.transform = 'translate(-4px, 4px)';
        pr.style.transform = 'translate(-4px, 4px)';
      } else {
        pwInput.type = 'password';
        coverEyes();
      }
    };

    // Error State
    function showError() {
      msgBox.textContent = 'Maaf, pendaftaran gagal.';
      msgBox.style.background = '#ef4444';
      mouth.setAttribute('d', 'M 90 115 Q 100 105 110 115'); // frown
      if(!prefersReducedMotion) mascot.style.animation = 'shake 0.4s ease-in-out';
      setTimeout(() => mascot.style.animation = 'none', 400);
      resetHands();
      isCovering = false;
    }

    // Success State
    function showSuccess() {
      msgBox.textContent = 'Yeay! Berhasil mendaftar.';
      msgBox.style.background = '#10b981';
      mouth.setAttribute('d', 'M 85 105 Q 100 120 115 105'); // big smile
      eyes.style.display = 'none';
      eyesHappy.style.display = 'block';
      resetHands();
      
      if(!prefersReducedMotion) {
        body.style.animation = 'jump 0.6s ease-out';
        shadow.style.transform = 'scale(0.5)';
        setTimeout(() => shadow.style.transform = 'scale(1)', 400);
      }
    }

    // Handle Signup
    window.handleSignup = (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const pw = pwInput.value;
      const name = document.getElementById('fullname').value;
      
      if(pw.length < 3) {
        showError();
        return;
      }
      
      fetch('{{ url("/signup") }}', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': '{{ csrf_token() }}'
          },
          body: JSON.stringify({ name: name, email: email, password: pw })
      })
      .then(response => response.json())
      .then(data => {
          if(data.status === 'success') {
              showSuccess();
              setTimeout(() => {
                window.location.href = '{{ route("dashboard") }}';
              }, 1000);
          } else {
              showError();
          }
      })
      .catch(error => {
          showError();
      });
    }
  </script>
</body>
</html>
