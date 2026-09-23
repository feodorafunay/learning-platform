const LP = {
    state: {
        lang: localStorage.getItem("lp_lang") || "id",
        role: localStorage.getItem("lp_role") || "student",
        progress: Number(localStorage.getItem("lp_progress") || 0),
        lessonStatus: localStorage.getItem("lp_lesson_status") || "available",
        currentLesson: Number(localStorage.getItem("lp_current_lesson") || 1),
        referral: localStorage.getItem("lp_referral") || "",
        teacherRequest: localStorage.getItem("lp_teacher_request") || "none",
        chatMessages: JSON.parse(localStorage.getItem("lp_chat") || "[]")
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
            teacher_guide:"Panduan Guru"
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
            teacher_guide:"Teacher Guide"
        }
    }
};

function t(key){
    return LP.translations[LP.state.lang][key] || key;
}

function saveState(){
    localStorage.setItem("lp_lang", LP.state.lang);
    localStorage.setItem("lp_role", LP.state.role);
    localStorage.setItem("lp_progress", String(LP.state.progress));
    localStorage.setItem("lp_lesson_status", LP.state.lessonStatus);
    localStorage.setItem("lp_current_lesson", String(LP.state.currentLesson));
    localStorage.setItem("lp_referral", LP.state.referral);
    localStorage.setItem("lp_teacher_request", LP.state.teacherRequest);
    localStorage.setItem("lp_chat", JSON.stringify(LP.state.chatMessages));
}

function toast(message){
    let el = document.querySelector("#toast");
    if(!el){
        el = document.createElement("div");
        el.id="toast"; el.className="toast";
        document.body.appendChild(el);
    }
    el.textContent=message;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer=setTimeout(()=>el.classList.remove("show"),2500);
}

function initNav(){
    const toggle=document.querySelector(".mobile-toggle");
    const links=document.querySelector(".nav-links");
    if(toggle && links){
        toggle.addEventListener("click",()=>links.classList.toggle("open"));
    }
}

function initLanguage(){
    const btn=document.querySelector("[data-lang-toggle]");
    if(btn){
        btn.textContent=LP.state.lang==="id"?"EN":"ID";
        btn.addEventListener("click",()=>{
            LP.state.lang=LP.state.lang==="id"?"en":"id";
            saveState();
            applyTranslations();
            btn.textContent=LP.state.lang==="id"?"EN":"ID";
        });
    }
    applyTranslations();
}

function applyTranslations(){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
        const key=el.dataset.i18n;
        el.textContent=t(key);
    });
    document.documentElement.lang=LP.state.lang==="id"?"id":"en";
}

function initRegister(){
    const form=document.querySelector("#registerForm");
    if(!form) return;
    const roleInputs=form.querySelectorAll('input[name="role"]');
    const studentFields=document.querySelector("#studentReferralField");
    const teacherFields=document.querySelector("#teacherReferralField");
    const codeInput=document.querySelector("#teacherGeneratedCode");
    const newCode=()=>{
        const letters="ABCDEFGHJKLMNPQRSTUVWXYZ";
        const nums="23456789";
        let code="";
        for(let i=0;i<3;i++) code+=letters[Math.floor(Math.random()*letters.length)];
        for(let i=0;i<3;i++) code+=nums[Math.floor(Math.random()*nums.length)];
        return code;
    };

    roleInputs.forEach(r=>{
        r.addEventListener("change",()=>{
            if(r.checked && r.value==="student"){
                studentFields?.classList.remove("hidden");
                teacherFields?.classList.add("hidden");
            }
            if(r.checked && r.value==="teacher"){
                studentFields?.classList.add("hidden");
                teacherFields?.classList.remove("hidden");
                const code=newCode();
                codeInput.value=code;
                LP.state.referral=code;
                saveState();
            }
        });
    });

    form.addEventListener("submit",e=>{
        e.preventDefault();
        const role=new FormData(form).get("role");
        LP.state.role=role==="teacher"?"teacher":"student";
        if(LP.state.role==="teacher" && !codeInput.value){
            codeInput.value=newCode();
            LP.state.referral=codeInput.value;
        }
        saveState();
        toast(LP.state.lang==="id" ? "Pendaftaran simulasi berhasil." : "Demo registration completed.");
        setTimeout(()=>location.href=LP.state.role==="teacher"?"profile-teacher.html":"profile-student.html",500);
    });
}

function initLogin(){
    const form=document.querySelector("#loginForm");
    if(!form)return;
    form.addEventListener("submit",e=>{
        e.preventDefault();
        const role=document.querySelector('input[name="demoRole"]:checked')?.value||"student";
        LP.state.role=role;
        saveState();
        toast(LP.state.lang==="id"?"Login simulasi berhasil.":"Demo login successful.");
        setTimeout(()=>location.href=role==="teacher"?"profile-teacher.html":"profile-student.html",500);
    });
}

function initBecomeTeacher(){
    const btn=document.querySelector("#becomeTeacherBtn");
    if(!btn)return;
    btn.addEventListener("click",()=>{
        LP.state.teacherRequest="pending";
        saveState();
        toast(LP.state.lang==="id"?"Permintaan menjadi guru sudah dikirim ke guru kamu.":"Your teacher request has been sent to your teacher.");
        btn.disabled=true;
        btn.textContent=LP.state.lang==="id"?"Permintaan terkirim":"Request sent";
    });
}

function initTeacherApproval(){
    const approve=document.querySelector("#approveTeacherBtn");
    const reject=document.querySelector("#rejectTeacherBtn");
    const pending=document.querySelector("#teacherRequestCard");
    if(approve){
        approve.addEventListener("click",()=>{
            LP.state.teacherRequest="approved";
            LP.state.role="teacher";
            if(!LP.state.referral){
                LP.state.referral = "KLM582";
            }
            saveState();
            if(pending) pending.innerHTML='<div class="notice success">Permintaan murid sudah disetujui. Status murid berubah menjadi guru.</div>';
            toast(LP.state.lang==="id"?"Murid disetujui menjadi guru.":"Student approved as teacher.");
        });
    }
    if(reject){
        reject.addEventListener("click",()=>{
            LP.state.teacherRequest="none";
            saveState();
            if(pending) pending.innerHTML='<div class="notice">Permintaan menjadi guru ditolak untuk simulasi ini.</div>';
        });
    }
}

function initResourceFilters(){
    const buttons=document.querySelectorAll(".filter-btn");
    const cards=document.querySelectorAll("[data-resource-type]");
    buttons.forEach(btn=>{
        btn.addEventListener("click",()=>{
            buttons.forEach(b=>b.classList.remove("active"));
            btn.classList.add("active");
            const type=btn.dataset.filter;
            cards.forEach(card=>{
                card.style.display=(type==="all" || card.dataset.resourceType===type)?"block":"none";
            });
        });
    });
}

function initChat(){
    const fab=document.querySelector(".chat-fab");
    const panel=document.querySelector(".chat-panel");
    const close=document.querySelector(".chat-close");
    const form=document.querySelector("#chatForm");
    const body=document.querySelector(".chat-body");
    if(!fab || !panel)return;

    const render=()=>{
        body.innerHTML="";
        if(!LP.state.chatMessages.length){
            LP.state.chatMessages=[
                {from:"them", text:"Halo! Ada yang bisa kami bantu hari ini?"}
            ];
        }
        LP.state.chatMessages.forEach(m=>{
            const div=document.createElement("div");
            div.className=`msg ${m.from==="me"?"me":"them"}`;
            div.textContent=m.text;
            body.appendChild(div);
        });
        body.scrollTop=body.scrollHeight;
        saveState();
    };
    fab.addEventListener("click",()=>panel.classList.toggle("hidden"));
    close?.addEventListener("click",()=>panel.classList.add("hidden"));
    form?.addEventListener("submit",e=>{
        e.preventDefault();
        const input=form.querySelector("input");
        const value=input.value.trim();
        if(!value)return;
        LP.state.chatMessages.push({from:"me",text:value});
        input.value="";
        render();
        setTimeout(()=>{
            LP.state.chatMessages.push({from:"them",text:"Pesan sudah diterima. Guru akan membalas pada percakapan ini."});
            render();
        },700);
    });
    render();
}

function initLessonPage(){
    const shell=document.querySelector("[data-class-page]");
    if(!shell)return;

    const className=shell.dataset.className||"Kelas A";
    const title=document.querySelector("#classTitle");
    const moduleList=document.querySelector("#moduleList");
    const lessonTitle=document.querySelector("#lessonTitle");
    const lessonBody=document.querySelector("#lessonBody");
    const teacherGuide=document.querySelector("#teacherGuide");

    title.textContent=className;

    let modules="";
    for(let m=1;m<=3;m++){
        modules += `<div class="module">
            <div class="module-head"><strong>Modul ${m}</strong><div class="field-help">10 pelajaran</div></div>
            <div class="lesson-list">`;
        for(let l=1;l<=10;l++){
            const globalIndex=(m-1)*10+l;
            const current=globalIndex===LP.state.currentLesson;
            const completed=globalIndex<LP.state.currentLesson;
            const unlocked=globalIndex<=LP.state.currentLesson;
            modules += `<button class="lesson ${current?"current":""} ${completed?"complete":""} ${!unlocked?"locked":""}" data-lesson="${globalIndex}" ${!unlocked?"disabled":""}>
                <span class="lesson-dot">${completed?"✓":globalIndex}</span>
                <span>Pelajaran ${l}</span>
            </button>`;
        }
        modules += `</div></div>`;
    }
    moduleList.innerHTML=modules;

    const openLesson=(lessonNumber)=>{
        LP.state.currentLesson=lessonNumber;
        if(LP.state.lessonStatus==="approved"){
            LP.state.progress=Math.max(LP.state.progress, Math.round(((lessonNumber-1)/30)*100));
        }
        saveState();
        lessonTitle.textContent=`Pelajaran ${lessonNumber}`;
        lessonBody.innerHTML=`
            <p>Materi pembelajaran untuk <strong>${className}</strong>. Ini adalah tampilan prototype; nanti konten teks, video, file tugas, dan rubrik penilaian dapat ditarik dari database.</p>
            <div class="video-placeholder"><span>▶</span></div>
            <p>Setelah memahami materi, murid mengerjakan tugas dan mengirim jawaban kepada guru. Pelajaran berikutnya tetap terkunci sampai guru memberikan status <strong>Lulus</strong>.</p>
            <div class="assignment">
                <h3>Tugas pelajaran</h3>
                <p>Tuliskan tiga hal yang paling kamu pahami dari materi ini dan satu hal yang masih ingin kamu tanyakan.</p>
                <textarea id="answerField" placeholder="Tulis jawabanmu di sini..."></textarea>
                <div class="card-footer">
                    <span class="tag" id="submissionStatus">${LP.state.lessonStatus==="waiting"?"Menunggu pemeriksaan guru":LP.state.lessonStatus==="approved"?"Sudah diluluskan":"Belum dikirim"}</span>
                    <button class="btn btn-primary btn-small" id="submitAnswerBtn" ${LP.state.lessonStatus==="waiting"||LP.state.lessonStatus==="approved"?"disabled":""}>${t("submit")}</button>
                </div>
            </div>
            <div class="section-block">
                <h2>${t("self_rating")}</h2>
                <div class="rating-grid">
                    ${Array.from({length:10},(_,i)=>`<button class="rating-btn" data-rate="${i+1}">${i+1}</button>`).join("")}
                </div>
            </div>
        `;
        document.querySelectorAll(".rating-btn").forEach(btn=>{
            btn.addEventListener("click",()=>{
                document.querySelectorAll(".rating-btn").forEach(b=>b.classList.remove("selected"));
                btn.classList.add("selected");
            });
        });
        document.querySelector("#submitAnswerBtn")?.addEventListener("click",()=>{
            LP.state.lessonStatus="waiting";
            saveState();
            document.querySelector("#submissionStatus").textContent="Menunggu pemeriksaan guru";
            document.querySelector("#submitAnswerBtn").disabled=true;
            toast(LP.state.lang==="id"?"Jawaban berhasil dikirim. Sekarang menunggu pemeriksaan guru.":"Answer submitted. Waiting for teacher review.");
        });
    };

    moduleList.querySelectorAll("[data-lesson]").forEach(btn=>{
        btn.addEventListener("click",()=>openLesson(Number(btn.dataset.lesson)));
    });

    openLesson(LP.state.currentLesson);

    const switchButtons=document.querySelectorAll(".role-switch button");
    switchButtons.forEach(btn=>{
        btn.addEventListener("click",()=>{
            switchButtons.forEach(b=>b.classList.remove("active"));
            btn.classList.add("active");
            const teacher=btn.dataset.role==="teacher";
            teacherGuide?.classList.toggle("hidden",!teacher);
            const studentOnly=document.querySelector("#studentOnly");
            studentOnly?.classList.toggle("hidden",teacher);
        });
    });

    const approveDemo=document.querySelector("#demoApprove");
    approveDemo?.addEventListener("click",()=>{
        LP.state.lessonStatus="approved";
        LP.state.progress=Math.max(LP.state.progress, Math.round((LP.state.currentLesson/30)*100));
        LP.state.currentLesson=Math.min(30,LP.state.currentLesson+1);
        saveState();
        toast("Simulasi: jawaban diluluskan. Pelajaran berikutnya terbuka.");
        setTimeout(()=>location.reload(),350);
    });

    const reviseDemo=document.querySelector("#demoRevise");
    reviseDemo?.addEventListener("click",()=>{
        LP.state.lessonStatus="available";
        saveState();
        toast("Simulasi: guru meminta perbaikan jawaban.");
        setTimeout(()=>location.reload(),350);
    });
}

function renderProfileData(){
    const progress=document.querySelectorAll("[data-progress-value]");
    progress.forEach(el=>el.textContent=`${LP.state.progress}%`);
    document.querySelectorAll("[data-progress-bar]").forEach(el=>el.style.width=`${LP.state.progress}%`);
    document.querySelectorAll("[data-referral-code]").forEach(el=>el.textContent=LP.state.referral||"KLM582");

    const request=document.querySelector("#teacherRequestCard");
    if(request && LP.state.teacherRequest==="pending"){
        request.innerHTML=`<div class="notice warning"><strong>Permintaan menjadi guru menunggu persetujuan.</strong><br>Murid sudah mengirim permintaan dan menunggu guru menyetujuinya.</div>`;
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    initNav();
    initLanguage();
    initRegister();
    initLogin();
    initBecomeTeacher();
    initTeacherApproval();
    initResourceFilters();
    initChat();
    initLessonPage();
    renderProfileData();
});
