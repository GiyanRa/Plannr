<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Plannr</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet" />
  <link rel="stylesheet" href="{{ asset('style.css') }}" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script>
    (function(){
      let S = JSON.parse(localStorage.getItem('tly3') || '{}');
      if (!S.settings) S.settings = {};
      @auth
      S.settings.name = '{{ Auth::user()->name }}';
      S.settings.email = '{{ Auth::user()->email }}';
      S.settings.role = 'Plannr User';
      @else
      window.location.href = '{{ route("login") }}';
      @endauth
      localStorage.setItem('tly3', JSON.stringify(S));
    })();
  </script>
</head>

<body>

  <!-- SIDEBAR -->
  <aside class="sb" id="sb">
    <div class="sb-logo">
      <div class="logo-ic" style="width:36px;height:36px;border-radius:10px;background:#6d28d9;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:800;position:relative;flex-shrink:0;box-shadow:none;">
        P
        <div style="position:absolute;bottom:-4px;right:-4px;width:14px;height:14px;background:#10b981;border-radius:50%;border:2px solid #1f2937;display:flex;align-items:center;justify-content:center;">
          <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
      <span class="logo-tx" style="font-size:24px;font-weight:700;letter-spacing:-0.5px;color:#374151;">plann<span style="color:#10b981;">r</span></span>
    </div>

    <nav class="sb-nav">
      <div class="ni active" data-p="dashboard" onclick="nav('dashboard')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span class="nlbl">Dashboard</span>
      </div>
      <div class="ni" data-p="tasks" onclick="nav('tasks')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="nlbl">Tasks</span>
      </div>
      <div class="ni" data-p="calendar" onclick="nav('calendar')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" />
        </svg>
        <span class="nlbl">Calendar</span>
      </div>
      <div class="ni" data-p="projects" onclick="nav('projects')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M3 7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span class="nlbl">Projects</span>
      </div>
      <div class="ni" data-p="team" onclick="nav('team')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 100-8 4 4 0 000 8z"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="nlbl">Team</span>
      </div>
      <div class="ni" data-p="reports" onclick="nav('reports')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="nlbl">Reports</span>
      </div>
      <div class="ni" data-p="settings" onclick="nav('settings')">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span class="nlbl">Settings</span>
      </div>
    </nav>

    <div class="col-btn" onclick="toggleSB()">
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" id="colico">
        <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      <span class="clbl">Collapse</span>
    </div>
    <div class="clbl" style="text-align:center; font-size:11px; color:#9ca3af; margin-top:20px; font-weight:500;">
      &copy; {{ date('Y') }} Giyan Radhietya Akmal
    </div>
  </aside>

  <!-- MAIN AREA -->
  <div class="main" id="mn">
    <!-- TOPBAR -->
    <header class="tb">
      <div class="sw">
        <svg class="si" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
        </svg>
        <input class="sinp" id="gsrch" placeholder="Search tasks�" oninput="onGSearch(this.value)"
          onkeydown="if(event.key==='Enter'&&this.value){tSearch=this.value;nav('tasks')}" />
      </div>
      <div class="tbr">
        <div class="icbtn" id="nbtn" style="position:relative;" onclick="toggleNotif()">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" stroke-width="2">
            <path d="M15 17H9m9.293-2.293A6 6 0 006.07 10.07A6 6 0 006 10v5l-1 1h14l-1-1v-5a6 6 0 00-2.707-5.293" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.73 21a2 2 0 01-3.46 0" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="ndot" id="ndot" style="display:none;"></div>
          
          <!-- Notif Menu -->
          <div id="nmenu" style="display:none; position:absolute; top:calc(100% + 12px); right:-10px; background:#fff; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); border-radius:12px; padding:12px; width:280px; z-index:100; border:1px solid #e5e7eb; cursor:default; text-align:left;">
            <div style="font-weight:700; font-size:14px; color:#1f2937; margin-bottom:12px; border-bottom:1px solid #f3f4f6; padding-bottom:8px;">Notifications</div>
            <div id="nlist" style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;"></div>
          </div>
        </div>
        <div class="uchip" style="position:relative;" onclick="document.getElementById('umenu').style.display = document.getElementById('umenu').style.display === 'none' ? 'block' : 'none'">
          <div class="uav" id="uav">LO</div>
          <div>
            <div class="unm" id="unm">Login</div>
            <div class="url" id="url">Click to authenticate</div>
          </div>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" stroke-width="2">
            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- Logout Menu -->
          <div id="umenu" style="display:none; position:absolute; top:calc(100% + 8px); right:0; background:#fff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border-radius:12px; padding:8px; min-width:150px; z-index:100; border:1px solid #e5e7eb;">
            <div style="padding:8px 12px; font-size:14px; font-weight:500; cursor:pointer; color:#ef4444; display:flex; align-items:center; gap:8px; border-radius:8px; transition:background 0.2s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'" onclick="event.stopPropagation(); doLogout();">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Logout
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- DYNAMIC CONTENT CONTAINER -->
    <div class="pw" id="pw"></div>
  </div>

  <!-- MODAL CONTAINER -->
  <div class="mo" id="mo" onclick="if(event.target===this)closeModal()">
    <div class="md" id="mc"></div>
  </div>

  <!-- TOAST CONTAINER -->
  <div class="tc" id="tc"></div>

  <!-- LOAD SCRIPT -->
  <script src="{{ asset('script.js') }}?v={{ time() }}"></script>
</body>

</html>

<script>
  function doLogout() {
    try {
      let S = JSON.parse(localStorage.getItem('tly3') || '{}');
      if (S.settings) {
        S.settings.name = '';
        S.settings.email = '';
        S.settings.role = '';
      }
      localStorage.setItem('tly3', JSON.stringify(S));
    } catch(err) {}
    
    fetch('{{ route("logout") }}', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' }
    }).then(() => {
        window.location.href = '{{ route("login") }}';
    });
  }
  
  document.addEventListener('click', function(e) {
    const umenu = document.getElementById('umenu');
    const uchip = document.querySelector('.uchip');
    if (umenu && umenu.style.display === 'block' && !uchip.contains(e.target)) {
      umenu.style.display = 'none';
    }
    
    const nmenu = document.getElementById('nmenu');
    const nbtn = document.getElementById('nbtn');
    if (nmenu && nmenu.style.display === 'block' && !nbtn.contains(e.target)) {
      nmenu.style.display = 'none';
    }
  });
</script>
