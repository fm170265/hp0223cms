// reveal.js
(function () {
  function run() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    // IntersectionObserver が使えない環境は即表示
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible'); // ← style.css の .reveal.is-visible に合わせる
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    targets.forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();