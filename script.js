/* =====================================================
   SCRIPT.JS - Al-Khoir Islamic Boarding School
   Berisi: Navbar, Scroll Effect, Validasi Form
   ===================================================== */


/* =====================================================
   1. NAVBAR - TOGGLE MENU MOBILE
      Membuka/menutup menu saat tombol hamburger diklik
   ===================================================== */
(function () {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      // Tambah/hapus kelas 'open' pada menu
      menu.classList.toggle('open');

      // Ubah aria-label untuk aksesibilitas
      const isOpen = menu.classList.contains('open');
      toggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');

      // Animasi icon hamburger → X
      toggle.classList.toggle('active');
    });

    // Tutup menu saat link di dalam menu diklik
    menu.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-label', 'Buka menu');
      });
    });

    // Tutup menu jika klik di luar navbar
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-label', 'Buka menu');
      }
    });
  }
})();


/* =====================================================
   2. NAVBAR - EFEK SCROLL (tambah shadow saat discroll)
   ===================================================== */
(function () {
  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
})();


/* =====================================================
   3. NAVBAR - TANDAI LINK AKTIF BERDASARKAN HALAMAN
      Secara otomatis menandai link yang sesuai URL saat ini
   ===================================================== */
(function () {
  const links       = document.querySelectorAll('.navbar__link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    const href = link.getAttribute('href');
    // Hapus kelas active dari semua link
    link.classList.remove('active');
    // Tandai link yang sesuai dengan halaman saat ini
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* =====================================================
   4. ANIMASI SCROLL - TAMPILKAN ELEMEN SAAT DISCROLL
      Elemen dengan class 'fade-in' akan muncul saat terlihat
   ===================================================== */
(function () {
  // Daftarkan semua elemen yang ingin dianimasikan
  const elements = document.querySelectorAll(
    '.feature-card, .jenjang-card, .alur__step, .kontak__item, .info-card'
  );

  if (!elements.length) return;

  // Gunakan IntersectionObserver untuk efisiensi
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target); // Hentikan observasi setelah muncul
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) {
    // Set state awal (tersembunyi)
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();


/* =====================================================
   5. FORM PENDAFTARAN - VALIDASI & SUBMIT
      Validasi semua field wajib sebelum form dikirim
   ===================================================== */
(function () {
  const form = document.getElementById('formPendaftaran');

  if (!form) return; // Keluar jika form tidak ada di halaman ini

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Cegah reload halaman

    // Reset semua error sebelum validasi ulang
    clearErrors(form);

    let valid = true;

    /* --- Validasi per field --- */

    // Nama Lengkap
    valid = validateRequired(form, 'namaLengkap', 'Nama lengkap wajib diisi.') && valid;

    // Tempat Lahir
    valid = validateRequired(form, 'tempatLahir', 'Tempat lahir wajib diisi.') && valid;

    // Tanggal Lahir
    valid = validateRequired(form, 'tanggalLahir', 'Tanggal lahir wajib diisi.') && valid;

    // Jenis Kelamin
    valid = validateRequired(form, 'jenisKelamin', 'Jenis kelamin wajib dipilih.') && valid;

    // Jenjang yang dipilih
    valid = validateRequired(form, 'jenjang', 'Jenjang pendidikan wajib dipilih.') && valid;

    // Asal Sekolah
    valid = validateRequired(form, 'asalSekolah', 'Asal sekolah wajib diisi.') && valid;

    // Nama Ayah
    valid = validateRequired(form, 'namaAyah', 'Nama ayah wajib diisi.') && valid;

    // Nama Ibu
    valid = validateRequired(form, 'namaIbu', 'Nama ibu wajib diisi.') && valid;

    // Nomor HP Orang Tua
    valid = validatePhone(form, 'noHpOrtu', 'Nomor HP orang tua wajib diisi.', 'Format nomor HP tidak valid.') && valid;

    // Alamat
    valid = validateRequired(form, 'alamat', 'Alamat wajib diisi.') && valid;

    /* --- Jika semua valid, tampilkan pesan sukses --- */
    if (valid) {
      tampilkanSukses();
    } else {
      // Scroll ke error pertama
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });


  /* ===== Fungsi-fungsi validasi ===== */

  // Cek apakah field tidak kosong
  function validateRequired(form, fieldName, errorMsg) {
    const field = form.querySelector('[name="' + fieldName + '"]');
    if (!field) return true;
    if (!field.value.trim()) {
      showError(field, errorMsg);
      return false;
    }
    return true;
  }

  // Validasi nomor telepon (angka, min 9 digit)
  function validatePhone(form, fieldName, emptyMsg, formatMsg) {
    const field = form.querySelector('[name="' + fieldName + '"]');
    if (!field) return true;
    if (!field.value.trim()) {
      showError(field, emptyMsg);
      return false;
    }
    // Regex: opsional +62 atau 0, diikuti 8-14 angka
    const phoneRegex = /^(\+62|62|0)[0-9]{8,14}$/;
    if (!phoneRegex.test(field.value.replace(/[\s-]/g, ''))) {
      showError(field, formatMsg);
      return false;
    }
    return true;
  }

  // Tampilkan pesan error pada field
  function showError(field, msg) {
    const group   = field.closest('.form-group');
    const errSpan = group ? group.querySelector('.error-msg') : null;
    if (group)   group.classList.add('has-error');
    if (errSpan) errSpan.textContent = msg;
  }

  // Hapus semua error di form
  function clearErrors(form) {
    form.querySelectorAll('.has-error').forEach(function (g) {
      g.classList.remove('has-error');
    });
    form.querySelectorAll('.error-msg').forEach(function (s) {
      s.textContent = '';
    });
  }

  // Tampilkan pesan sukses dan sembunyikan form
  function tampilkanSukses() {
    const successDiv = document.getElementById('formSukses');
    if (successDiv) {
      form.style.display       = 'none';
      successDiv.style.display = 'block';
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


  /* ===== Hapus error saat field mulai diisi ===== */
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

})();


/* =====================================================
   6. TOMBOL KEMBALI KE ATAS (Opsional)
      Uncomment blok di bawah jika ingin tombol scroll-to-top
   ===================================================== */
/*
(function () {
  const btn = document.createElement('button');
  btn.id = 'scrollTop';
  btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 900;
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--color-primary); color: white; border: none;
    cursor: pointer; font-size: 1rem; display: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: opacity 0.3s, transform 0.3s;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
*/
