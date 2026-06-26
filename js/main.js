/* ============================================================
   NAV TOGGLE (mobile)
   ============================================================ */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });

  // close on outside click
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
})();


/* ============================================================
   IMAGE COMPARE SLIDER
   ============================================================ */
(function () {
  /**
   * Expects this HTML structure:
   *
   *   <div class="compare-slider" data-before-label="Vorher" data-after-label="Nachher">
   *     <img class="compare-sizer" src="after.jpg" alt="">
   *     <div class="compare-layer compare-after">
   *       <img src="after.jpg" alt="Nachher">
   *     </div>
   *     <div class="compare-layer compare-before">
   *       <img src="before.jpg" alt="Vorher">
   *     </div>
   *     <div class="compare-handle">
   *       <div class="compare-knob">&#8596;</div>
   *     </div>
   *     <span class="compare-label compare-label-before">Vorher</span>
   *     <span class="compare-label compare-label-after">Nachher</span>
   *   </div>
   */
  class ImageCompare {
    constructor (el) {
      this.el      = el;
      this.before  = el.querySelector('.compare-before');
      this.handle  = el.querySelector('.compare-handle');
      this.pct     = 50;
      this.active  = false;
      this._bind();
      this._setPos(50);
    }

    _getClientX (e) {
      return e.touches ? e.touches[0].clientX : e.clientX;
    }

    _bind () {
      // start drag on the whole element (not just the handle) for better UX
      this.el.addEventListener('mousedown',  this._start.bind(this));
      this.el.addEventListener('touchstart', this._start.bind(this), { passive: false });
      window.addEventListener('mousemove',   this._move.bind(this));
      window.addEventListener('touchmove',   this._move.bind(this), { passive: false });
      window.addEventListener('mouseup',     this._end.bind(this));
      window.addEventListener('touchend',    this._end.bind(this));
    }

    _start (e) {
      this.active = true;
      if (e.cancelable) e.preventDefault();
      this._move(e);
    }

    _move (e) {
      if (!this.active) return;
      if (e.cancelable) e.preventDefault();
      const rect = this.el.getBoundingClientRect();
      const x    = this._getClientX(e) - rect.left;
      const pct  = Math.max(0, Math.min(100, (x / rect.width) * 100));
      this._setPos(pct);
    }

    _end () {
      this.active = false;
    }

    _setPos (pct) {
      this.pct = pct;
      // clip the "before" layer from the right so only the left `pct`% is visible
      this.before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      this.handle.style.left     = `${pct}%`;
    }
  }

  document.querySelectorAll('.compare-slider').forEach(el => new ImageCompare(el));
})();
