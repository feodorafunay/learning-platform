/* =========================================================
   RuangBelajar — prototype front-end
   Semua data di sini adalah simulasi (localStorage). Lihat README.
   ========================================================= */

   const TOTAL_LESSONS = 30;

   /* Jumlah pelajaran Kelas G yang sudah lulus pada data demo.
      7 = sama dengan angka di halaman profil murid (7/30 = 23%).
      Ubah ke 0 kalau ingin demo dimulai dari murid baru. */
   const DEMO_SEED_APPROVED = 7;
   
   /* ---------- Storage aman ----------
      localStorage bisa melempar error (mode privat, izin diblokir, data rusak).
      Tanpa try/catch, satu error di sini mematikan seluruh script. */
   const store = {
       get(key, fallback){
           try{
               const v = localStorage.getItem(key);
               return v === null ? fallback : v;
           }catch(e){ return fallback; }
       },
       getJSON(key, fallback){
           try{
               const v = localStorage.getItem(key);
               return v === null ? fallback : JSON.parse(v);
           }catch(e){ return fallback; }
       },
       set(key, value){
           try{ localStorage.setItem(key, value); }catch(e){ /* storage diblokir: abaikan */ }
       },
       clearDemo(){
           try{
               Object.keys(localStorage)
                   .filter(k => k.startsWith("lp_"))
                   .forEach(k => localStorage.removeItem(k));
           }catch(e){}
       }
   };
   
   /* Buka halaman mana pun dengan ?reset=1 untuk mengembalikan data demo
      (berguna saat tes di HP, tanpa perlu buka DevTools). */
   if(new URLSearchParams(location.search).has("reset")){
       store.clearDemo();
       history.replaceState(null, "", location.pathname);
   }
   
   function seedStatuses(){
       const a = {};
       for(let i = 1; i <= DEMO_SEED_APPROVED; i++) a[i] = "approved";
       return { "kelas-g": a, "kelas-h": {}, "kelas-m": {} };
   }
   
   const LP = {
       state: {
           lang: store.get("lp_lang", "id"),
           // Sesi login (simulasi). Tanpa ini, tamu dan murid tidak bisa dibedakan
           // karena role selalu punya nilai bawaan "student".
           session: store.get("lp_session", "0") === "1",
           role: store.get("lp_role", "student"),
           // { "kelas-g": { 1:"approved", 8:"waiting" }, "kelas-h": {...} }
           // Status disimpan PER KELAS dan PER PELAJARAN.
           lessonStatuses: (() => {
               const s = store.getJSON("lp_lesson_statuses", null);
               return s && typeof s === "object" && !Array.isArray(s) ? s : seedStatuses();
           })(),
           referral: store.get("lp_referral", ""),
           // none | pending | approved | rejected
           teacherRequest: store.get("lp_teacher_request", "none"),
           chatMessages: (() => {
               const c = store.getJSON("lp_chat", []);
               return Array.isArray(c) ? c : [];
           })()
       },
       translations: {
           id: {
               nav_home:"Home", nav_classes:"Kelas", nav_resources:"Resources", nav_login:"Masuk", nav_register:"Daftar",
               hero_badge:"Learning Platform", hero_title:"Belajar bertumbuh, satu langkah yang berarti setiap hari.",
               hero_desc:"Ruang belajar yang membantu murid dan guru menjalani proses belajar secara terstruktur, manusiawi, dan terukur.",
               cta_start:"Mulai Perjalananmu", cta_free:"Lihat Free Resources",
               classes_title:"Pilih kelas yang sesuai dengan perjalananmu", classes_desc:"Tiga jalur belajar dengan struktur modul yang jelas dan pendampingan guru.",
               free_title:"Belajar juga bisa dimulai secara gratis", free_desc:"Jelajahi e-book, video, dan gambar pilihan tanpa harus login.",
               see_more:"Lihat semua resources", login:"Masuk", register:"Daftar",
               student:"Murid", teacher:"Guru", submit:"Kirim jawaban ke guru", pass:"Luluskan murid",
               revise:"Minta murid perbaiki", self_rating:"Seberapa paham kamu dengan materi ini?",
               teacher_guide:"Panduan Guru",
               nav_profile:"Profil", nav_logout:"Keluar",
               cta_continue:"Lanjutkan belajar", cta_dashboard:"Buka dashboard guru",
               class_join:"Daftar untuk masuk", class_enter:"Masuk kelas",
               panel_guest_title:"Begini alur belajarnya",
               flow1_t:"Pelajari materi", flow1_d:"Video dan bacaan singkat di setiap pelajaran.",
               flow2_t:"Kirim tugas", flow2_d:"Jawab tugas di akhir pelajaran, langsung ke gurumu.",
               flow3_t:"Lulus lalu lanjut", flow3_d:"Pelajaran berikutnya terbuka setelah guru meluluskan.",
               stat_total:"Total pelajaran", stat_modules:"Modul", stat_guidance:"Pendampingan",
               panel_progress_title:"Progress Belajarmu", panel_active:"Aktif",
               panel_next:"Berikutnya", panel_all_done:"Semua pelajaran selesai",
               stat_done:"Pelajaran selesai", stat_active_module:"Modul aktif",
               panel_teacher_title:"Ruang Guru", panel_teacher_active:"Guru aktif",
               panel_teacher_desc:"Pantau murid, periksa jawaban, dan bagikan kode referral dari dashboard.",
               word_module:"Modul", word_lesson:"Pelajaran"
           },
           en: {
               nav_home:"Home", nav_classes:"Classes", nav_resources:"Resources", nav_login:"Log in", nav_register:"Register",
               hero_badge:"Learning Platform", hero_title:"Grow through learning, one meaningful step at a time.",
               hero_desc:"A learning space that helps students and teachers move through learning in a structured, human, and measurable way.",
               cta_start:"Start Your Journey", cta_free:"Explore Free Resources",
               classes_title:"Choose the class for your journey", classes_desc:"Three learning paths with clear modules and teacher guidance.",
               free_title:"Learning can start for free", free_desc:"Explore selected e-books, videos, and images without logging in.",
               see_more:"See all resources", login:"Log in", register:"Register",
               student:"Student", teacher:"Teacher", submit:"Submit answer to teacher", pass:"Approve student",
               revise:"Ask student to revise", self_rating:"How well do you understand this lesson?",
               teacher_guide:"Teacher Guide",
               nav_profile:"Profile", nav_logout:"Log out",
               cta_continue:"Continue learning", cta_dashboard:"Open teacher dashboard",
               class_join:"Sign up to join", class_enter:"Enter class",
               panel_guest_title:"How learning works here",
               flow1_t:"Study the material", flow1_d:"Short videos and readings in every lesson.",
               flow2_t:"Submit your task", flow2_d:"Answer the task at the end of the lesson, straight to your teacher.",
               flow3_t:"Pass, then move on", flow3_d:"The next lesson opens once your teacher approves.",
               stat_total:"Total lessons", stat_modules:"Modules", stat_guidance:"Mentoring",
               panel_progress_title:"Your learning progress", panel_active:"Active",
               panel_next:"Up next", panel_all_done:"All lessons completed",
               stat_done:"Lessons done", stat_active_module:"Current module",
               panel_teacher_title:"Teacher space", panel_teacher_active:"Teacher active",
               panel_teacher_desc:"Track students, review answers, and share your referral code from the dashboard.",
               word_module:"Module", word_lesson:"Lesson"
           }
       }
   };
   
   function t(key){
       return LP.translations[LP.state.lang][key] || key;
   }
   
   function saveState(){
       store.set("lp_lang", LP.state.lang);
       store.set("lp_session", LP.state.session ? "1" : "0");
       store.set("lp_role", LP.state.role);
       store.set("lp_lesson_statuses", JSON.stringify(LP.state.lessonStatuses));
       store.set("lp_referral", LP.state.referral);
       store.set("lp_teacher_request", LP.state.teacherRequest);
       store.set("lp_chat", JSON.stringify(LP.state.chatMessages));
   }
   
   /* ---------- Helper progres kelas ---------- */
   const classKey      = name => (name || "Kelas G").trim().toLowerCase().replace(/\s+/g, "-");
   const statusMap     = key  => LP.state.lessonStatuses[key] || (LP.state.lessonStatuses[key] = {});
   const lessonStatus  = (key, n) => statusMap(key)[n] || "available";   // available | waiting | approved
   const approvedCount = key  => Object.values(statusMap(key)).filter(s => s === "approved").length;
   const getProgress   = key  => Math.round(approvedCount(key) / TOTAL_LESSONS * 100);
   const unlockedUpTo  = key  => Math.min(TOTAL_LESSONS, approvedCount(key) + 1);
   
   function generateReferralCode(){
       const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
       const nums = "23456789";
       let code = "";
       for(let i = 0; i < 3; i++) code += letters[Math.floor(Math.random() * letters.length)];
       for(let i = 0; i < 3; i++) code += nums[Math.floor(Math.random() * nums.length)];
       return code;
   }
   
   /* ---------- UI umum ---------- */
   function toast(message){
       let el = document.querySelector("#toast");
       if(!el){
           el = document.createElement("div");
           el.id = "toast"; el.className = "toast";
           el.setAttribute("role", "status");
           document.body.appendChild(el);
       }
       el.textContent = message;
       el.classList.add("show");
       clearTimeout(window.__toastTimer);
       window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
   }
   
   async function copyText(text){
       try{
           // navigator.clipboard hanya tersedia di HTTPS / localhost.
           // Saat tes dari HP lewat http://192.168.x.x nilainya undefined.
           if(navigator.clipboard && window.isSecureContext){
               await navigator.clipboard.writeText(text);
               return true;
           }
       }catch(e){ /* lanjut ke fallback */ }
       try{
           const ta = document.createElement("textarea");
           ta.value = text;
           ta.setAttribute("readonly", "");
           ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
           document.body.appendChild(ta);
           ta.select();
           ta.setSelectionRange(0, text.length);
           const ok = document.execCommand("copy");
           ta.remove();
           return ok;
       }catch(e){ return false; }
   }
   
   async function copyReferral(){
       const el = document.querySelector("[data-referral-code]");
       if(!el) return;
       const code = el.textContent.trim();
       const ok = await copyText(code);
       toast(ok ? "Kode referral disalin." : "Tidak bisa menyalin otomatis. Kode: " + code);
   }
   
   function initNav(){
       const toggle = document.querySelector(".mobile-toggle");
       const links = document.querySelector(".nav-links");
       if(!toggle || !links) return;
   
       if(!toggle.hasAttribute("aria-label")) toggle.setAttribute("aria-label", "Buka menu");
       toggle.setAttribute("aria-expanded", "false");
   
       const setOpen = open => {
           links.classList.toggle("open", open);
           toggle.setAttribute("aria-expanded", String(open));
       };
       toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
       // tutup setelah memilih tautan (penting untuk anchor #classes di halaman yang sama)
       links.addEventListener("click", e => { if(e.target.closest("a")) setOpen(false); });
       document.addEventListener("click", e => { if(!e.target.closest(".navbar-shell")) setOpen(false); });
       document.addEventListener("keydown", e => { if(e.key === "Escape") setOpen(false); });
   }
   
   function initLanguage(){
       const btn = document.querySelector("[data-lang-toggle]");
       // Baru halaman yang punya banyak data-i18n yang benar-benar diterjemahkan.
       // Di halaman lain tombol disembunyikan supaya tidak terlihat "rusak".
       // Hapus baris ini setelah semua halaman diberi data-i18n.
       if(btn && document.querySelectorAll("[data-i18n]").length < 3){
           btn.hidden = true;
           return;
       }
       if(btn){
           btn.textContent = LP.state.lang === "id" ? "EN" : "ID";
           btn.addEventListener("click", () => {
               LP.state.lang = LP.state.lang === "id" ? "en" : "id";
               saveState();
               renderAuthUI();          // teks dinamis di panel Home ikut berganti bahasa
               applyTranslations();
               btn.textContent = LP.state.lang === "id" ? "EN" : "ID";
           });
       }
       applyTranslations();
   }
   
   function applyTranslations(){
       document.querySelectorAll("[data-i18n]").forEach(el => {
           el.textContent = t(el.dataset.i18n);
       });
       document.documentElement.lang = LP.state.lang === "id" ? "id" : "en";
   }
   
   /* ---------- Sesi & tampilan sesuai siapa yang membuka ----------
      Tamu   : belum pernah login  -> tidak boleh melihat progres siapa pun
      Murid  : sudah login         -> melihat progres miliknya
      Guru   : sudah login         -> melihat ringkasan ruang guru            */
   function initLogout(){
       document.querySelectorAll("[data-logout]").forEach(btn => {
           btn.addEventListener("click", () => {
               LP.state.session = false;      // data progres tetap tersimpan; hanya sesinya berakhir
               saveState();
               location.href = "index.html";
           });
       });
   }
   
   const classPage = key => `class-${key.split("-")[1]}.html`;          // "kelas-g" -> "class-a.html"
   const className = key => `Kelas ${key.split("-")[1].toUpperCase()}`;  // "kelas-g" -> "Kelas G"
   
   // kelas yang paling maju = kelas Gktif murid (seri -> Kelas G)
   function activeClassKey(){
       return ["kelas-g", "kelas-h", "kelas-m"].reduce((best, k) => approvedCount(k) > approvedCount(best) ? k : best, "kelas-g");
   }
   
   function studentPanelHTML(key){
       const done = approvedCount(key);
       const pct = getProgress(key);
       const next = unlockedUpTo(key);
       const m = Math.ceil(next / 10), l = ((next - 1) % 10) + 1;
       const nextHTML = done >= TOTAL_LESSONS
           ? `<span data-i18n="panel_all_done"></span>`
           : `<span data-i18n="panel_next"></span>: ${t("word_module")} ${m} · ${t("word_lesson")} ${l}`;
       return `
           <div class="hero-panel-top">
               <strong data-i18n="panel_progress_title"></strong>
               <span class="status-pill">● <span data-i18n="panel_active"></span></span>
           </div>
           <div class="progress-card">
               <div class="progress-meta"><span>${className(key)}</span><strong>${pct}%</strong></div>
               <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
               <div class="progress-next">${nextHTML}</div>
           </div>
           <div class="mini-stats">
               <div class="mini-stat"><strong>${done}/${TOTAL_LESSONS}</strong><span data-i18n="stat_done"></span></div>
               <div class="mini-stat"><strong>${m}</strong><span data-i18n="stat_active_module"></span></div>
               <div class="mini-stat"><strong>1:1</strong><span data-i18n="stat_guidance"></span></div>
           </div>`;
   }
   
   function teacherPanelHTML(){
       return `
           <div class="hero-panel-top">
               <strong data-i18n="panel_teacher_title"></strong>
               <span class="status-pill">● <span data-i18n="panel_teacher_active"></span></span>
           </div>
           <div class="progress-card">
               <div class="progress-next" style="margin-top:0" data-i18n="panel_teacher_desc"></div>
               <a class="btn btn-primary btn-small" href="profile-teacher.html" data-i18n="cta_dashboard"></a>
           </div>
           <div class="mini-stats">
               <div class="mini-stat"><strong>${TOTAL_LESSONS}</strong><span data-i18n="stat_total"></span></div>
               <div class="mini-stat"><strong>3</strong><span data-i18n="stat_modules"></span></div>
               <div class="mini-stat"><strong>1:1</strong><span data-i18n="stat_guidance"></span></div>
           </div>`;
   }
   
   function renderAuthUI(){
       const member = LP.state.session;
       const teacher = member && LP.state.role === "teacher";
   
       // Navbar: "Masuk/Daftar" hanya untuk tamu; "Profil/Keluar" hanya untuk yang sudah login
       document.querySelectorAll('[data-auth="guest"]').forEach(el => el.hidden = member);
       document.querySelectorAll('[data-auth="member"]').forEach(el => el.hidden = !member);
       document.querySelectorAll("[data-profile-link]").forEach(a => {
           a.href = teacher ? "profile-teacher.html" : "profile-student.html";
       });
   
       // Tombol kelas di Home: tamu diarahkan mendaftar, bukan langsung masuk ke ruang kelas
       document.querySelectorAll("[data-member-href]").forEach(a => {
           a.href = member ? a.dataset.memberHref : "register.html";
           a.dataset.i18n = member ? "class_enter" : "class_join";
       });
   
       // Panel hero: markup statis di HTML = versi tamu (tanpa data pribadi, tanpa kedipan).
       const panel = document.querySelector("#heroPanel");
       if(!panel || !member) return;
   
       const cta = document.querySelector("#ctaPrimary");
       if(teacher){
           panel.innerHTML = teacherPanelHTML();
           if(cta){ cta.href = "profile-teacher.html"; cta.dataset.i18n = "cta_dashboard"; }
       }else{
           const key = activeClassKey();
           panel.innerHTML = studentPanelHTML(key);
           if(cta){ cta.href = classPage(key); cta.dataset.i18n = "cta_continue"; }
       }
   }
   
   /* ---------- Register & login ---------- */
   function initRegister(){
       const form = document.querySelector("#registerForm");
       if(!form) return;
       const studentFields = document.querySelector("#studentReferralField");
       const teacherFields = document.querySelector("#teacherReferralField");
       const codeInput = document.querySelector("#teacherGeneratedCode");
       const refInput = form.querySelector('[name="referral"]');
       const pass = form.querySelector('[name="password"]');
       const pass2 = form.querySelector('[name="password2"]');
   
       const syncRole = () => {
           const isTeacher = new FormData(form).get("role") === "teacher";
           studentFields?.classList.toggle("hidden", isTeacher);
           teacherFields?.classList.toggle("hidden", !isTeacher);
           // kode referral wajib untuk murid, tidak untuk guru
           if(refInput) refInput.required = !isTeacher;
           if(isTeacher && !codeInput.value) codeInput.value = generateReferralCode();
       };
       form.querySelectorAll('input[name="role"]').forEach(r => r.addEventListener("change", syncRole));
       syncRole();
   
       const checkMatch = () => {
           if(!pass || !pass2) return;
           pass2.setCustomValidity(pass2.value && pass.value !== pass2.value ? "Konfirmasi password tidak sama." : "");
       };
       pass?.addEventListener("input", checkMatch);
       pass2?.addEventListener("input", checkMatch);
   
       form.addEventListener("submit", e => {
           e.preventDefault();
           const role = new FormData(form).get("role") === "teacher" ? "teacher" : "student";
           LP.state.role = role;
           if(role === "teacher") LP.state.referral = codeInput.value;
           LP.state.session = true;
           saveState();
           toast(LP.state.lang === "id" ? "Pendaftaran simulasi berhasil." : "Demo registration completed.");
           setTimeout(() => location.href = role === "teacher" ? "profile-teacher.html" : "profile-student.html", 600);
       });
   }
   
   function initLogin(){
       const form = document.querySelector("#loginForm");
       if(!form) return;
       form.addEventListener("submit", e => {
           e.preventDefault();
           const role = document.querySelector('input[name="demoRole"]:checked')?.value || "student";
           LP.state.role = role;
           LP.state.session = true;
           saveState();
           toast(LP.state.lang === "id" ? "Login simulasi berhasil." : "Demo login successful.");
           setTimeout(() => location.href = role === "teacher" ? "profile-teacher.html" : "profile-student.html", 600);
       });
   }
   
   /* ---------- Permintaan murid menjadi guru ----------
      Tampilan SELALU dirender dari LP.state.teacherRequest, sehingga
      tetap benar setelah halaman di-reload atau dibuka di tab lain. */
   function renderBecomeTeacher(){
       const btn = document.querySelector("#becomeTeacherBtn");
       if(!btn) return;
       const idn = LP.state.lang === "id";
       const s = LP.state.teacherRequest;
       btn.disabled = false;
       if(s === "pending"){
           btn.disabled = true;
           btn.textContent = idn ? "Permintaan terkirim" : "Request sent";
       }else if(s === "approved"){
           btn.disabled = true;
           btn.textContent = idn ? "Disetujui — kamu sekarang guru" : "Approved — you are now a teacher";
       }
   }
   
   function initBecomeTeacher(){
       const btn = document.querySelector("#becomeTeacherBtn");
       if(!btn) return;
       btn.addEventListener("click", () => {
           LP.state.teacherRequest = "pending";
           saveState();
           renderBecomeTeacher();
           toast(LP.state.lang === "id" ? "Permintaan menjadi guru sudah dikirim ke guru kamu." : "Your teacher request has been sent to your teacher.");
       });
       renderBecomeTeacher();
   }
   
   function renderTeacherRequest(){
       const card = document.querySelector("#teacherRequestCard");
       if(!card) return;
       const s = LP.state.teacherRequest;
   
       if(s === "approved"){
           card.innerHTML = '<div class="notice success">Permintaan murid sudah disetujui. Status murid berubah menjadi guru.</div>';
           return;
       }
       if(s === "rejected"){
           card.innerHTML = '<div class="notice">Permintaan menjadi guru ditolak untuk simulasi ini.</div>';
           return;
       }
       // none (data demo bawaan) atau pending (dikirim dari halaman murid): tombol aksi harus tetap ada
       card.innerHTML = `
           <div class="notice warning">${s === "pending" ? "<strong>Permintaan baru masuk.</strong> " : ""}Ada permintaan dari 1 murid yang ingin menjadi guru.</div>
           <div class="row-actions" style="margin-top:10px">
               <button id="approveTeacherBtn" class="btn btn-primary btn-small">Setujui</button>
               <button id="rejectTeacherBtn" class="btn btn-secondary btn-small">Tolak</button>
           </div>`;
       card.querySelector("#approveTeacherBtn").addEventListener("click", () => {
           LP.state.teacherRequest = "approved";
           saveState();
           renderTeacherRequest();
           toast(LP.state.lang === "id" ? "Murid disetujui menjadi guru." : "Student approved as teacher.");
       });
       card.querySelector("#rejectTeacherBtn").addEventListener("click", () => {
           LP.state.teacherRequest = "rejected";
           saveState();
           renderTeacherRequest();
           toast(LP.state.lang === "id" ? "Permintaan ditolak." : "Request rejected.");
       });
   }
   
   /* ---------- Resources ---------- */
   function initResourceFilters(){
       const buttons = document.querySelectorAll(".filter-btn");
       const cards = document.querySelectorAll("[data-resource-type]");
       buttons.forEach(btn => {
           btn.setAttribute("aria-pressed", String(btn.classList.contains("active")));
           btn.addEventListener("click", () => {
               buttons.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
               btn.classList.add("active");
               btn.setAttribute("aria-pressed", "true");
               const type = btn.dataset.filter;
               cards.forEach(card => {
                   card.style.display = (type === "all" || card.dataset.resourceType === type) ? "block" : "none";
               });
           });
       });
   }
   
   /* ---------- Chat (simulasi) ---------- */
   function initChat(){
       const fab = document.querySelector(".chat-fab");
       const panel = document.querySelector(".chat-panel");
       const close = document.querySelector(".chat-close");
       const form = document.querySelector("#chatForm");
       const body = document.querySelector(".chat-body");
       if(!fab || !panel) return;
   
       // atribut aksesibilitas diberikan di sini supaya tidak perlu diulang di tiap halaman HTML
       fab.setAttribute("aria-label", "Buka chat");
       fab.setAttribute("aria-expanded", "false");
       panel.setAttribute("role", "dialog");
       panel.setAttribute("aria-label", "Chat");
       close?.setAttribute("aria-label", "Tutup chat");
       form?.querySelector("button")?.setAttribute("aria-label", "Kirim pesan");
       form?.querySelector("input")?.setAttribute("aria-label", "Tulis pesan");
   
       const setOpen = open => {
           panel.classList.toggle("hidden", !open);
           fab.setAttribute("aria-expanded", String(open));
       };
   
       const render = () => {
           body.innerHTML = "";
           if(!LP.state.chatMessages.length){
               LP.state.chatMessages = [{ from: "them", text: "Halo! Ada yang bisa kami bantu hari ini?" }];
           }
           LP.state.chatMessages.forEach(m => {
               const div = document.createElement("div");
               div.className = `msg ${m.from === "me" ? "me" : "them"}`;
               div.textContent = m.text;   // textContent (bukan innerHTML) = aman dari XSS
               body.appendChild(div);
           });
           body.scrollTop = body.scrollHeight;
           saveState();
       };
   
       fab.addEventListener("click", () => setOpen(panel.classList.contains("hidden")));
       close?.addEventListener("click", () => setOpen(false));
       document.addEventListener("keydown", e => { if(e.key === "Escape") setOpen(false); });
   
       form?.addEventListener("submit", e => {
           e.preventDefault();
           const input = form.querySelector("input");
           const value = input.value.trim();
           if(!value) return;
           LP.state.chatMessages.push({ from: "me", text: value });
           input.value = "";
           render();
           setTimeout(() => {
               LP.state.chatMessages.push({ from: "them", text: "Pesan sudah diterima. Guru akan membalas pada percakapan ini." });
               render();
           }, 700);
       });
       render();
   }
   
   /* ---------- Halaman kelas ---------- */
   function initLessonPage(){
       const shell = document.querySelector("[data-class-page]");
       if(!shell) return;
   
       const className = shell.dataset.className || "Kelas G";
       const key = classKey(className);
       const lessonTitle = document.querySelector("#lessonTitle");
       const lessonBody = document.querySelector("#lessonBody");
       const teacherGuide = document.querySelector("#teacherGuide");
       const teacherStatus = document.querySelector("#teacherStatus");
       const studentOnly = document.querySelector("#studentOnly");
       const moduleList = document.querySelector("#moduleList");
   
       document.querySelector("#classTitle").textContent = className;
   
       // Daftar pelajaran dibungkus <details>: di HP/tablet bisa dilipat sehingga
       // isi pelajaran langsung terlihat; di layar lebar selalu terbuka.
       moduleList.innerHTML = `
           <details class="lesson-nav" id="lessonNav">
               <summary><span>Daftar pelajaran</span><small class="field-help" id="lessonNavLabel"></small></summary>
               <div class="lesson-nav-body" id="lessonNavBody"></div>
           </details>`;
       const nav = document.querySelector("#lessonNav");
       const navBody = document.querySelector("#lessonNavBody");
       const navLabel = document.querySelector("#lessonNavLabel");
       const desktop = window.matchMedia("(min-width: 981px)");
       const syncNav = () => { if(desktop.matches) nav.open = true; };
       desktop.addEventListener?.("change", syncNav);
       syncNav();
   
       // "viewing" = pelajaran yang sedang DIBUKA.
       // Terpisah dari "unlocked" (pelajaran terjauh yang boleh dibuka), yang dihitung dari status lulus.
       let viewing = unlockedUpTo(key);
   
       const pos = n => ({ m: Math.ceil(n / 10), l: ((n - 1) % 10) + 1 });
       const statusLabel = st => st === "waiting" ? "Menunggu pemeriksaan guru" : st === "approved" ? "Sudah diluluskan" : "Belum dikirim";
   
       const renderNav = () => {
           const keepScroll = navBody.scrollTop;
           const unlocked = unlockedUpTo(key);
           let html = "";
           for(let m = 1; m <= 3; m++){
               html += `<div class="module">
                   <div class="module-head"><strong>Modul ${m}</strong><div class="field-help">10 pelajaran</div></div>
                   <div class="lesson-list">`;
               for(let l = 1; l <= 10; l++){
                   const n = (m - 1) * 10 + l;
                   const st = lessonStatus(key, n);
                   const isUnlocked = n <= unlocked;
                   const cls = ["lesson", n === viewing ? "current" : "", st === "approved" ? "complete" : "", !isUnlocked ? "locked" : ""]
                       .filter(Boolean).join(" ");
                   html += `<button type="button" class="${cls}" data-lesson="${n}" ${!isUnlocked ? "disabled" : ""} ${n === viewing ? 'aria-current="true"' : ""}>
                       <span class="lesson-dot">${st === "approved" ? "✓" : n}</span>
                       <span>Pelajaran ${l}</span>
                   </button>`;
               }
               html += `</div></div>`;
           }
           navBody.innerHTML = html;
           navBody.scrollTop = keepScroll;
           const p = pos(viewing);
           navLabel.textContent = `Modul ${p.m} · Pelajaran ${p.l} (${viewing}/${TOTAL_LESSONS})`;
       };
   
       // Bagian yang berubah saat status berubah, tanpa menghapus jawaban yang sedang diketik
       const refreshStatusBits = () => {
           const st = lessonStatus(key, viewing);
           const tag = document.querySelector("#submissionStatus");
           const btn = document.querySelector("#submitAnswerBtn");
           if(tag) tag.textContent = statusLabel(st);
           if(btn) btn.disabled = st === "waiting" || st === "approved";
           if(teacherStatus){
               const p = pos(viewing);
               teacherStatus.textContent = `Modul ${p.m} · Pelajaran ${p.l} — status: ${statusLabel(st)}`;
           }
           renderNav();
           renderProfileData();
       };
   
       const renderLesson = () => {
           const st = lessonStatus(key, viewing);
           const p = pos(viewing);
           lessonTitle.textContent = `Modul ${p.m} · Pelajaran ${p.l}`;
           lessonBody.innerHTML = `
               <p>Materi pembelajaran untuk <strong>${className}</strong>. Ini adalah tampilan prototype; nanti konten teks, video, file tugas, dan rubrik penilaian dapat ditarik dari database.</p>
               <div class="video-placeholder"><span>▶</span></div>
               <p>Setelah memahami materi, murid mengerjakan tugas dan mengirim jawaban kepada guru. Pelajaran berikutnya tetap terkunci sampai guru memberikan status <strong>Lulus</strong>.</p>
               <div class="assignment">
                   <h3>Tugas pelajaran</h3>
                   <p>Tuliskan tiga hal yang paling kamu pahami dari materi ini dan satu hal yang masih ingin kamu tanyakan.</p>
                   <textarea id="answerField" placeholder="Tulis jawabanmu di sini..." aria-label="Jawaban tugas"></textarea>
                   <div class="card-footer">
                       <span class="tag" id="submissionStatus"></span>
                       <button class="btn btn-primary btn-small" id="submitAnswerBtn">${t("submit")}</button>
                   </div>
               </div>
               <div class="section-block">
                   <h2>${t("self_rating")}</h2>
                   <div class="rating-grid">
                       ${Array.from({ length: 10 }, (_, i) => `<button type="button" class="rating-btn" data-rate="${i + 1}">${i + 1}</button>`).join("")}
                   </div>
               </div>`;
   
           lessonBody.querySelectorAll(".rating-btn").forEach(btn => {
               btn.addEventListener("click", () => {
                   lessonBody.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("selected"));
                   btn.classList.add("selected");
               });
           });
           document.querySelector("#submitAnswerBtn").addEventListener("click", () => {
               statusMap(key)[viewing] = "waiting";
               saveState();
               refreshStatusBits();
               toast(LP.state.lang === "id" ? "Jawaban berhasil dikirim. Sekarang menunggu pemeriksaan guru." : "Answer submitted. Waiting for teacher review.");
           });
           refreshStatusBits();
       };
   
       const renderAll = () => { renderNav(); renderLesson(); };
   
       navBody.addEventListener("click", e => {
           const btn = e.target.closest("[data-lesson]");
           if(!btn || btn.disabled) return;
           viewing = Number(btn.dataset.lesson);   // hanya mengganti tampilan; TIDAK mengubah progres
           renderAll();
           if(!desktop.matches){
               nav.open = false;
               lessonTitle.scrollIntoView({ behavior: "smooth", block: "start" });
           }
       });
   
       // Tampilan Murid / Guru
       const switchButtons = document.querySelectorAll(".role-switch button");
       switchButtons.forEach(btn => {
           btn.setAttribute("aria-pressed", String(btn.classList.contains("active")));
           btn.addEventListener("click", () => {
               switchButtons.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
               btn.classList.add("active");
               btn.setAttribute("aria-pressed", "true");
               const teacher = btn.dataset.role === "teacher";
               teacherGuide?.classList.toggle("hidden", !teacher);
               studentOnly?.classList.toggle("hidden", teacher);
           });
       });
   
       // Simulasi keputusan guru — hanya berlaku bila murid sudah mengirim jawaban
       document.querySelector("#demoApprove")?.addEventListener("click", () => {
           if(lessonStatus(key, viewing) !== "waiting"){
               toast("Belum ada jawaban yang menunggu pemeriksaan di pelajaran ini.");
               return;
           }
           statusMap(key)[viewing] = "approved";
           saveState();
           viewing = Math.min(TOTAL_LESSONS, viewing + 1);   // pindah ke pelajaran yang baru terbuka
           renderAll();
           toast("Simulasi: jawaban diluluskan. Pelajaran berikutnya terbuka.");
       });
       document.querySelector("#demoRevise")?.addEventListener("click", () => {
           if(lessonStatus(key, viewing) !== "waiting"){
               toast("Belum ada jawaban yang menunggu pemeriksaan di pelajaran ini.");
               return;
           }
           statusMap(key)[viewing] = "available";
           saveState();
           renderAll();
           toast("Simulasi: guru meminta perbaikan jawaban.");
       });
   
       renderAll();
   }
   
   /* ---------- Data profil (progres, kode referral) ---------- */
   function renderProfileData(){
       const shell = document.querySelector("[data-class-page]");
       const pageKey = shell ? classKey(shell.dataset.className) : "kelas-g";
   
       // atribut boleh berisi kunci kelas (mis. data-progress-value="kelas-h"); kosong = kelas halaman ini
       document.querySelectorAll("[data-progress-value]").forEach(el => {
           el.textContent = `${getProgress(el.dataset.progressValue || pageKey)}%`;
       });
       document.querySelectorAll("[data-progress-bar]").forEach(el => {
           el.style.width = `${getProgress(el.dataset.progressBar || pageKey)}%`;
       });
       document.querySelectorAll("[data-lessons-done]").forEach(el => {
           el.textContent = `${approvedCount(el.dataset.lessonsDone || pageKey)}/${TOTAL_LESSONS}`;
       });
       document.querySelectorAll("[data-referral-code]").forEach(el => {
           el.textContent = LP.state.referral || "KLM582";
       });
   }
   
   /* ---------- Modal review (halaman guru) ---------- */
   function openReview(name){
       const m = document.getElementById("reviewModal");
       if(!m) return;
       document.getElementById("reviewTitle").textContent = "Review jawaban — " + name;
       m.classList.add("open");
       document.body.classList.add("modal-open");     // kunci scroll halaman di belakang modal
       m.querySelector(".close-btn")?.focus();
   }
   function closeReview(){
       const m = document.getElementById("reviewModal");
       if(!m) return;
       m.classList.remove("open");
       document.body.classList.remove("modal-open");
   }
   function reviewAction(action){
       closeReview();
       toast(action === "pass" ? "Murid berhasil diluluskan. Progress akan diperbarui." : "Murid diminta memperbaiki jawaban.");
   }
   function initReviewModal(){
       const m = document.getElementById("reviewModal");
       if(!m) return;
       m.setAttribute("role", "dialog");
       m.setAttribute("aria-modal", "true");
       m.setAttribute("aria-labelledby", "reviewTitle");
       m.querySelector(".close-btn")?.setAttribute("aria-label", "Tutup");
       m.addEventListener("click", e => { if(e.target === m) closeReview(); });   // klik area gelap
       document.addEventListener("keydown", e => { if(e.key === "Escape" && m.classList.contains("open")) closeReview(); });
   }
   
   document.addEventListener("DOMContentLoaded", () => {
       initNav();
       initLogout();
       renderAuthUI();     // harus sebelum initLanguage(): kunci terjemahan diatur di sini
       initLanguage();
       initRegister();
       initLogin();
       initBecomeTeacher();
       renderTeacherRequest();
       initResourceFilters();
       initChat();
       initLessonPage();
       initReviewModal();
       renderProfileData();
   });
   