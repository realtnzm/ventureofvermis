const Pt = document.getElementById("card-wrapper"),
  Vt = document.getElementById("card-holder"),
  Et = document.getElementById("backdrop"),
  Tt = Array.from(document.querySelectorAll(".tooltip-trigger")),
  lt = Array.from(document.querySelectorAll("[data-experiment-preview]")),
  _t = Array.from(document.querySelectorAll("[data-experiment-more-trigger]")),
  bt = Array.from(document.querySelectorAll(".copy-email-trigger")),
  Qe = Array.from(document.querySelectorAll(".artifact-list")),
  Zt = document.querySelector(".artifact-list"),
  St = Array.from(document.querySelectorAll(".artifact-item")),
  kt = document.getElementById("shared-tooltip"),
  xt = document.getElementById("shared-tooltip-pill"),
  it = document.getElementById("experiment-tooltip"),
  Mt = it?.querySelector("[data-experiment-tooltip-current]"),
  Ft = it?.querySelector("[data-experiment-tooltip-next]"),
  z = document.getElementById("copy-toast"),
  ot = document.getElementById("copy-toast-pill"),
  It = () =>
    window.matchMedia("(max-width: 768px)").matches &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches,
  et = () => It(),
  X = () => It(),
  le = (o = "light") => {
    window.grizzHaptics?.trigger(o);
  },
  pt = "grizz-tooltip-claim",
  At = "shared-tooltip",
  Ct = "experiment-tooltip",
  rt = document.querySelector(".work-preview-reel"),
  Re = Math.max(1, rt?.querySelectorAll(".work-preview-frame").length || 1),
  tt = window.matchMedia("(prefers-reduced-motion: reduce)"),
  wt = (parseFloat(rt?.dataset.workPreviewCycleDuration || "9") || 9) * 1e3;
let dt = Re <= 1,
  ht = performance.now(),
  _e = 0,
  Xe = 0,
  Ze = tt.matches,
  nt = 0,
  Bt = !1,
  qt = !1,
  Ce = !1,
  Ve = 0;
const zt = (o) => {
    window.dispatchEvent(
      new CustomEvent(pt, {
        detail: {
          owner: o,
        },
      }),
    );
  },
  Xt = (o) =>
    o instanceof CustomEvent && typeof o.detail?.owner == "string"
      ? o.detail.owner
      : "",
  st = () => (Ce ? _e : performance.now() - ht),
  Ue = (o = document) => Array.from(o.querySelectorAll(".work-preview-frame")),
  Ut = (o = document) => Array.from(o.querySelectorAll(".work-preview-reel")),
  vt = () => wt / Re,
  ut = () => {
    const o = vt(),
      m = st() % wt;
    return Math.min(Re - 1, Math.floor(m / o));
  },
  Kt = () => {
    const o = Ue(rt ?? document).slice(0, Re);
    let m = ut(),
      a = 0;
    return (
      o.forEach((L, v) => {
        const Z = parseFloat(window.getComputedStyle(L).opacity || "0");
        Z > a && ((a = Z), (m = v));
      }),
      a > 0 ? m : ut()
    );
  },
  Gt = (o) => ((o % Re) + Re) % Re,
  Ie = (o = document) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const m = (st() % wt) / 1e3;
    Ue(o).forEach((L) => {
      const v = parseFloat(L.dataset.workPreviewDelay || "0") || 0;
      L.style.animationDelay = `${v - m}s`;
    });
  },
  gt = () => {
    nt && (window.clearTimeout(nt), (nt = 0));
  },
  yt = () => {
    Ve && (cancelAnimationFrame(Ve), (Ve = 0));
  },
  Se = (o = document) => {
    const m = !dt || Ce || Ze;
    Ut(o).forEach((a) => {
      (a.classList.toggle("is-paused", Ce),
        a.classList.toggle("is-locked", m),
        Ue(a).forEach((L, v) => {
          L.classList.toggle("is-active", m && v === Xe);
        }));
    });
  },
  Ht = (o, m = !1) => {
    ((Xe = Gt(o)), m && (_e = Xe * vt()), Se());
  },
  Dt = () => {
    !Ze || Ce || Ht(ut());
  },
  He = () => {
    if ((gt(), !Ze || Ce)) return;
    Dt();
    const o = vt(),
      m = st() % o,
      a = Math.max(80, o - m + 16);
    nt = window.setTimeout(He, a);
  },
  Yt = () => {
    const o = Bt || qt;
    if (o === Ce) {
      (Se(), o || He());
      return;
    }
    if (o) {
      ((_e = st()), (Xe = Kt()), Ie(), (Ce = !0), Se(), gt());
      return;
    }
    ((ht = performance.now() - _e), Ie(), (Ce = !1), Se(), He());
  },
  Ne = (o) => {
    (o && yt(), (Bt = o), Yt());
  },
  ft = (o) => {
    (o && yt(), (qt = o), Yt());
  },
  jt = () => {
    (yt(),
      (Ve = requestAnimationFrame(() => {
        ((Ve = 0), ft(!1));
      })));
  },
  Ot = (o, m = 1500) => {
    const a = () => {
      if (typeof window.requestIdleCallback == "function") {
        window.requestIdleCallback(o, {
          timeout: m,
        });
        return;
      }
      window.setTimeout(o, Math.min(m, 350));
    };
    if (document.readyState === "complete") {
      a();
      return;
    }
    window.addEventListener("load", a, {
      once: !0,
    });
  },
  Jt = (o) =>
    new Promise((m) => {
      const a = o.dataset.src;
      if (!a) {
        m();
        return;
      }
      let L = !1;
      const v = () => {
        L ||
          ((L = !0),
          o.removeEventListener("load", v),
          o.removeEventListener("error", v),
          m());
      };
      (o.addEventListener("load", v, {
        once: !0,
      }),
        o.addEventListener("error", v, {
          once: !0,
        }),
        (o.src = a),
        o.removeAttribute("data-src"),
        typeof o.decode == "function" && o.decode().then(v).catch(v));
    }),
  Qt = () => {
    const o = Ue(rt ?? document).filter(
      (m) => m instanceof HTMLImageElement && !!m.dataset.src,
    );
    if (o.length === 0) {
      ((dt = !0), Se());
      return;
    }
    Promise.allSettled(o.map(Jt)).then(() => {
      ((dt = !0),
        (ht = performance.now()),
        (_e = 0),
        (Xe = 0),
        Ie(),
        Se(),
        He());
    });
  };
Ie();
Se();
Ot(Qt);
He();
const $t = (o) => {
  if (((Ze = o.matches), Ze)) {
    (Dt(), He());
    return;
  }
  (gt(), Se(), Ie());
};
typeof tt.addEventListener == "function"
  ? tt.addEventListener("change", $t)
  : tt.addListener($t);
if (
  Pt instanceof HTMLElement &&
  Vt instanceof HTMLElement &&
  Et instanceof HTMLElement
) {
  let o = function (t, r) {
      const b = window.setTimeout(() => {
        (ye.delete(b), t());
      }, r);
      return (ye.add(b), b);
    },
    m = function () {
      (ye.forEach((t) => window.clearTimeout(t)), ye.clear());
    },
    a = function () {
      j && (cancelAnimationFrame(j), (j = 0));
    },
    L = function (t, r, b) {
      let e = !1;
      const n = () => {
          e || ((e = !0), t.removeEventListener("transitionend", i), r());
        },
        i = (l) => {
          l.target !== t || !ze.has(l.propertyName) || n();
        };
      (t.addEventListener("transitionend", i), o(n, b + 80));
    },
    v = function (t) {
      document.documentElement.classList.toggle("card-zoom-active", t);
    },
    Z = function (t) {
      return t instanceof HTMLElement
        ? t.isContentEditable ||
            ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)
        : !1;
    },
    ke = function (t) {
      g !== "idle" && t.preventDefault();
    },
    $e = function (t) {
      g === "idle" || Z(t.target) || !at.has(t.key) || t.preventDefault();
    },
    H = function (t) {
      const r = t.width * P,
        b = t.height * P;
      return {
        top: t.top + (t.height - b) / 2,
        left: t.left + (t.width - r) / 2,
        width: r,
        height: b,
      };
    },
    D = function (t) {
      const r = t.width / t.height,
        b = window.innerWidth * We,
        e = window.innerHeight * We,
        n = Le(Math.min(b, e * r)),
        i = Le(n / r);
      return {
        top: Le((window.innerHeight - i) / 2),
        left: Le((window.innerWidth - n) / 2),
        width: n,
        height: i,
      };
    },
    W = function (t, r) {
      ((t.style.top = `${Le(r.top)}px`),
        (t.style.left = `${Le(r.left)}px`),
        (t.style.width = `${Le(r.width)}px`),
        (t.style.height = `${Le(r.height)}px`));
    },
    F = function (t) {
      const r = t.getBoundingClientRect();
      return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      };
    },
    U = function () {
      if (!c) return null;
      const t = F(c);
      return ((c.style.transition = "none"), W(c, t), c.offsetHeight, t);
    },
    K = function () {
      if (!(!M || ce === null))
        try {
          M.hasPointerCapture(ce) && M.releasePointerCapture(ce);
        } catch {}
    },
    re = function () {
      (K(), (ce = null), (Be = 0), (G = !1));
    },
    de = function () {
      we = null;
    },
    fe = function () {
      (M?.classList.remove("source-hidden"), (M = null));
    },
    k = function () {
      (c?.remove(), (c = null));
    },
    J = function () {
      (m(),
        a(),
        re(),
        de(),
        (ve = !1),
        (ge = !1),
        k(),
        fe(),
        v(!1),
        pe.classList.remove("active"),
        (g = "idle"),
        jt());
    },
    Te = function () {
      if (((j = 0), et())) {
        J();
        return;
      }
      if (g !== "open" || !c || !M) return;
      const t = M.getBoundingClientRect(),
        r = D(t),
        b = Math.max(1, r.width / t.width);
      ((c.style.transition = `top 180ms ${A}, left 180ms ${A}, width 180ms ${A}, height 180ms ${A}`),
        c.style.setProperty("--zoom-border-width", `${b}px`),
        W(c, r));
    },
    be = function () {
      j || (j = requestAnimationFrame(Te));
    },
    Q = function (t) {
      if (!c) return 0;
      const r = c.getBoundingClientRect();
      return t < r.left + r.width / 2 ? -1 : 1;
    },
    B = function (t) {
      if (!c) return;
      const r = Q(t);
      (c.classList.toggle("preview-nav-left", r < 0),
        c.classList.toggle("preview-nav-right", r > 0));
    },
    ee = function (t) {
      !c || (g !== "opening" && g !== "open") || B(t.clientX);
    },
    te = function () {
      c?.classList.remove("preview-nav-left", "preview-nav-right");
    },
    Y = function (t) {
      if (g !== "open" || !c) return !1;
      const r = Q(t.clientX);
      return (
        Ht(Xe + r, !0),
        Ie(c),
        ee(t),
        le("light"),
        t.preventDefault(),
        t.stopPropagation(),
        t.stopImmediatePropagation(),
        !0
      );
    },
    se = function (t) {
      const r = t.querySelector(".work-preview-frame.is-active");
      return r instanceof HTMLImageElement
        ? r
        : (Ue(t).find(
            (b) =>
              b instanceof HTMLImageElement &&
              parseFloat(window.getComputedStyle(b).opacity || "0") > 0,
          ) ?? null);
    },
    O = function (t) {
      return !!(t?.complete && t.naturalWidth > 0);
    },
    u = function (t) {
      if (!t) return Promise.resolve();
      const r = () =>
        typeof t.decode == "function"
          ? t.decode().catch(() => {})
          : Promise.resolve();
      return O(t)
        ? r()
        : new Promise((b) => {
            let e = !1;
            const n = () => {
                e ||
                  ((e = !0),
                  window.clearTimeout(l),
                  t.removeEventListener("load", i),
                  t.removeEventListener("error", n),
                  b());
              },
              i = () => {
                r().then(n);
              },
              l = window.setTimeout(n, 600);
            (t.addEventListener("load", i, {
              once: !0,
            }),
              t.addEventListener("error", n, {
                once: !0,
              }),
              O(t) && i());
          });
    },
    h = function (t, r) {
      g !== "pressing" ||
        c !== t ||
        M !== $ ||
        ((t.style.visibility = ""),
        requestAnimationFrame(() => {
          if (!(g !== "pressing" || c !== t || M !== $)) {
            if (((ve = !0), $.classList.add("source-hidden"), ge)) {
              f();
              return;
            }
            (t.offsetHeight,
              (t.style.transition = `top ${Me}ms ${E}, left ${Me}ms ${E}, width ${Me}ms ${E}, height ${Me}ms ${E}`),
              W(t, r));
          }
        }));
    },
    p = function (t, r) {
      const b = se(t);
      u(b).then(() => {
        requestAnimationFrame(() => {
          h(t, r);
        });
      });
    },
    N = function (t) {
      const r = $.cloneNode(!0);
      return r instanceof HTMLElement
        ? (r.classList.add("card-floating"),
          r.classList.remove("source-hidden"),
          r.removeAttribute("id"),
          r.querySelector("#card-holder")?.removeAttribute("id"),
          r.setAttribute("aria-hidden", "true"),
          (r.style.margin = "0"),
          (r.style.transition = "none"),
          (r.style.transform = "none"),
          (r.style.transformOrigin = ""),
          (r.style.visibility = "hidden"),
          r.style.setProperty("--zoom-border-width", "1px"),
          r.addEventListener("pointermove", ee),
          r.addEventListener("pointerleave", te),
          r.addEventListener(
            "pointerdown",
            (b) => {
              Y(b);
            },
            {
              capture: !0,
            },
          ),
          Ie(r),
          Se(r),
          W(r, t),
          document.body.append(r),
          r)
        : null;
    },
    ae = function (t) {
      if (et() || (t.pointerType === "mouse" && t.button !== 0) || g !== "idle")
        return !1;
      (J(), ft(!0));
      const r = $.getBoundingClientRect(),
        b = H(r),
        e = N(r);
      if (!e) return (ft(!1), !1);
      ((g = "pressing"),
        (M = $),
        (c = e),
        (ce = t.pointerId),
        (Be = performance.now()),
        (qe = t.clientX),
        (De = t.clientY),
        (G = !1),
        (ve = !1),
        (ge = !1),
        p(e, b));
      try {
        $.setPointerCapture(t.pointerId);
      } catch {}
      return (t.preventDefault(), !0);
    },
    me = function (t) {
      if (ce !== t.pointerId || g !== "pressing") return;
      const r = t.clientX - qe,
        b = t.clientY - De;
      if (((G = G || Math.hypot(r, b) > Fe), !M)) return;
      const e = M.getBoundingClientRect();
      (t.clientX < e.left ||
        t.clientX > e.right ||
        t.clientY < e.top ||
        t.clientY > e.bottom) &&
        (t.preventDefault(),
        t.stopPropagation(),
        (he = performance.now() + 450),
        s());
    },
    s = function () {
      if (g !== "pressing" || !c || !M) return !1;
      if ((m(), re(), !ve)) return (J(), !0);
      if (!U()) return !1;
      const t = F(M);
      return (
        v(!1),
        pe.classList.remove("active"),
        (c.style.transition = `top ${q}ms ${A}, left ${q}ms ${A}, width ${q}ms ${A}, height ${q}ms ${A}`),
        W(c, t),
        o(() => {
          J();
        }, q),
        !0
      );
    },
    f = function () {
      if (g !== "pressing" || !c || !M) return;
      if (!ve) {
        ge = !0;
        return;
      }
      const t = Math.max(0, Me - (performance.now() - Be));
      (m(), re(), (g = "opening"));
      const r = M.getBoundingClientRect(),
        b = F(c),
        e = H(r),
        n = D(r),
        i = Math.max(1, n.width / r.width);
      (le("medium"),
        B(qe),
        v(!0),
        pe.classList.add("active"),
        (c.style.transition = "none"),
        W(c, b),
        c.offsetHeight);
      const l = () => {
        g !== "opening" ||
          !c ||
          ((c.style.transition = `top ${R}ms ${A}, left ${R}ms ${A}, width ${R}ms ${A}, height ${R}ms ${A}`),
          c.style.setProperty("--zoom-border-width", `${i}px`),
          W(c, n),
          L(
            c,
            () => {
              g === "opening" && (g = "open");
            },
            R,
          ));
      };
      if (t > 0) {
        ((c.style.transition = `top ${t}ms ${E}, left ${t}ms ${E}, width ${t}ms ${E}, height ${t}ms ${E}`),
          W(c, e),
          o(l, t));
        return;
      }
      l();
    },
    C = function (t) {
      g !== "open" ||
        !c ||
        !M ||
        (m(),
        re(),
        U() &&
          ((g = "closePressing"),
          (we = t.pointerId),
          (c.style.transformOrigin = "center"),
          (c.style.transition = `transform ${Me}ms ${E}`),
          (c.style.transform = `scale(${P})`)));
    },
    V = function (t) {
      if (g !== "closePressing" || !c || !M || (t && we !== t.pointerId))
        return !1;
      (m(), de());
      const r = F(M);
      return (
        (g = "closing"),
        v(!1),
        (c.style.transition = `top ${q}ms ${A}, left ${q}ms ${A}, width ${q}ms ${A}, height ${q}ms ${A}, transform ${q}ms ${A}`),
        (c.style.transform = "scale(1)"),
        c.style.setProperty("--zoom-border-width", "1px"),
        W(c, r),
        pe.classList.remove("active"),
        L(
          c,
          () => {
            J();
          },
          q,
        ),
        !0
      );
    },
    ne = function (t) {
      return ce !== t.pointerId || g !== "pressing" || G || et()
        ? s()
        : (t.preventDefault(), f(), !0);
    },
    ue = function (t) {
      if (
        !(t.pointerType === "mouse" && t.button !== 0) &&
        !(c && t.target instanceof Node && c.contains(t.target))
      ) {
        if (g === "opening" || g === "closing" || g === "closePressing") {
          (t.preventDefault(),
            t.stopPropagation(),
            t.stopImmediatePropagation(),
            (he = performance.now() + 450));
          return;
        }
        g === "open" &&
          (t.preventDefault(),
          t.stopPropagation(),
          t.stopImmediatePropagation(),
          (he = performance.now() + 450),
          le("light"),
          C(t));
      }
    },
    xe = function (t) {
      (g === "idle" && performance.now() >= he) ||
        (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation());
    };
  const $ = Pt,
    pe = Et,
    A = "cubic-bezier(0.23, 1, 0.32, 1)",
    E = "ease",
    Me = 160,
    P = 0.97,
    R = 350,
    q = 250,
    Fe = 8,
    We = 0.7;
  let g = "idle",
    M = null,
    c = null,
    ce = null,
    we = null,
    Be = 0,
    qe = 0,
    De = 0,
    G = !1,
    he = 0,
    j = 0,
    ve = !1,
    ge = !1;
  const ye = new Set(),
    ze = new Set(["top", "left", "width", "height"]),
    at = new Set([
      " ",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "End",
      "Home",
      "PageDown",
      "PageUp",
    ]),
    Le = (t) => {
      const r = window.devicePixelRatio || 1;
      return Math.round(t * r) / r;
    };
  ($.addEventListener("pointerenter", () => {
    Ne(!0);
  }),
    $.addEventListener("pointerleave", () => {
      Ne(!1);
    }),
    $.addEventListener("mouseover", () => {
      Ne(!0);
    }),
    $.addEventListener("mouseout", (t) => {
      (t.relatedTarget instanceof Node && $.contains(t.relatedTarget)) ||
        Ne(!1);
    }),
    $.addEventListener(
      "pointerdown",
      (t) => {
        if (g !== "idle") {
          (t.preventDefault(), t.stopImmediatePropagation());
          return;
        }
        ae(t) && t.stopImmediatePropagation();
      },
      {
        capture: !0,
      },
    ),
    $.addEventListener(
      "pointermove",
      (t) => {
        me(t);
      },
      {
        capture: !0,
      },
    ),
    $.addEventListener(
      "pointerup",
      (t) => {
        (me(t), ne(t) && t.stopImmediatePropagation());
      },
      {
        capture: !0,
      },
    ),
    $.addEventListener(
      "pointercancel",
      () => {
        s();
      },
      {
        capture: !0,
      },
    ),
    document.addEventListener("pointerup", () => {
      if (g === "closePressing") {
        V();
        return;
      }
      s();
    }),
    document.addEventListener("pointercancel", () => {
      if (g === "closePressing") {
        V();
        return;
      }
      s();
    }),
    document.addEventListener("pointerdown", ue, !0),
    document.addEventListener("click", xe, !0),
    document.addEventListener("wheel", ke, {
      capture: !0,
      passive: !1,
    }),
    document.addEventListener("touchmove", ke, {
      capture: !0,
      passive: !1,
    }),
    document.addEventListener("keydown", $e, !0),
    window.addEventListener("resize", be),
    window.addEventListener("grizz-scroll-reset-hover", () => {
      Ne(!1);
    }));
}
if (Qe.length > 0) {
  let o = function (a) {
      (a ? [a] : Qe).forEach((v) => {
        (v.classList.remove("is-list-hovering"),
          v.querySelectorAll(".artifact-item.is-list-hovered").forEach((Z) => {
            Z.classList.remove("is-list-hovered");
          }));
      });
    },
    m = function (a, L) {
      if (X()) {
        o(a);
        return;
      }
      const v = L instanceof Element ? L.closest(".artifact-item") : null;
      if (!v || !a.contains(v)) {
        o(a);
        return;
      }
      (a.classList.add("is-list-hovering"),
        a.querySelectorAll(".artifact-item.is-list-hovered").forEach((Z) => {
          Z !== v && Z.classList.remove("is-list-hovered");
        }),
        v.classList.add("is-list-hovered"));
    };
  (Qe.forEach((a) => {
    (a.addEventListener("pointerenter", (L) => {
      m(a, L.target);
    }),
      a.addEventListener("pointermove", (L) => {
        m(a, L.target);
      }),
      a.addEventListener("pointerleave", () => {
        o(a);
      }),
      a.addEventListener("focusin", (L) => {
        m(a, L.target);
      }),
      a.addEventListener("focusout", () => {
        window.requestAnimationFrame(() => {
          if (a.contains(document.activeElement)) {
            m(a, document.activeElement);
            return;
          }
          o(a);
        });
      }));
  }),
    window.addEventListener(
      "pointermove",
      (a) => {
        if (X()) {
          o();
          return;
        }
        const L =
          a.target instanceof Element
            ? a.target.closest(".artifact-list")
            : null;
        Qe.forEach((v) => {
          if (L === v) {
            m(v, a.target);
            return;
          }
          o(v);
        });
      },
      !0,
    ),
    window.addEventListener("blur", () => {
      o();
    }),
    window.addEventListener("grizz-scroll-reset-hover", () => {
      o();
    }));
}
if (
  lt.length > 0 &&
  it instanceof HTMLElement &&
  Mt instanceof HTMLElement &&
  Ft instanceof HTMLElement
) {
  let o = function (u) {
      const h = de.get(u);
      if (h) return h;
      const p = new Image();
      return (
        (p.decoding = "async"),
        (p.loading = "eager"),
        (p.fetchPriority = "high"),
        p.setAttribute("fetchpriority", "high"),
        (p.src = u),
        typeof p.decode == "function" && p.decode().catch(() => {}),
        de.set(u, p),
        p
      );
    },
    m = function (u, h) {
      const p = F.getBoundingClientRect(),
        N = Math.max(U, window.innerWidth - p.width - U),
        ae = Math.max(U, window.innerHeight - p.height - U),
        me = Math.min(Math.max(u + K, U), N),
        s = Math.min(Math.max(h + re, U), ae);
      (F.style.setProperty("--experiment-tooltip-x", `${me.toFixed(2)}px`),
        F.style.setProperty("--experiment-tooltip-y", `${s.toFixed(2)}px`));
    },
    a = function () {
      if (
        ((te *= 0.84),
        (ee += (te - ee) * 0.18),
        Math.abs(te) < 0.03 && Math.abs(ee) < 0.03)
      ) {
        ((ee = 0),
          (te = 0),
          F.style.setProperty("--experiment-tooltip-rotate", "0deg"),
          (Y = 0));
        return;
      }
      (F.style.setProperty(
        "--experiment-tooltip-rotate",
        `${ee.toFixed(2)}deg`,
      ),
        (Y = requestAnimationFrame(a)));
    },
    L = function () {
      Y || (Y = requestAnimationFrame(a));
    },
    v = function () {
      ((ee = 0),
        (te = 0),
        Y && (cancelAnimationFrame(Y), (Y = 0)),
        F.style.setProperty("--experiment-tooltip-rotate", "0deg"));
    },
    Z = function () {
      (se && (window.clearTimeout(se), (se = 0)),
        O && (window.clearTimeout(O), (O = 0)));
    },
    ke = function () {
      !(z instanceof HTMLElement) ||
        !(ot instanceof HTMLElement) ||
        (Z(),
        (ot.textContent = "Sorry mobile is not supported."),
        z.setAttribute("aria-hidden", "false"),
        z.classList.remove("is-hiding"),
        z.offsetHeight,
        z.classList.add("is-visible"),
        (se = window.setTimeout(() => {
          (z.classList.add("is-hiding"),
            z.classList.remove("is-visible"),
            (O = window.setTimeout(() => {
              (z.setAttribute("aria-hidden", "true"),
                z.classList.remove("is-hiding"));
            }, 280)));
        }, 1400)));
    },
    $e = function (u) {
      if (k === u) return;
      if ((o(u), !k)) {
        ((J.style.backgroundImage = `url(${JSON.stringify(u)})`),
          J.classList.add("is-active"),
          (k = u));
        return;
      }
      window.clearTimeout(be);
      const h = J,
        p = Te;
      (h.classList.remove("is-incoming"),
        (p.style.transition = "none"),
        p.classList.remove("is-active", "is-incoming"),
        (p.style.backgroundImage = `url(${JSON.stringify(u)})`),
        p.offsetWidth,
        (p.style.transition = ""),
        p.classList.add("is-incoming"),
        (J = p),
        (Te = h),
        (k = u),
        requestAnimationFrame(() => {
          (h.classList.remove("is-active"), p.classList.add("is-active"));
        }),
        (be = window.setTimeout(() => {
          (h.classList.remove("is-active", "is-incoming"),
            (h.style.backgroundImage = ""),
            p.classList.remove("is-incoming"));
        }, 380)));
    },
    H = function (u, h) {
      const p = u.dataset.experimentPreview;
      if (!p) return;
      if (
        (zt(Ct),
        (fe = u),
        (Q = h instanceof PointerEvent),
        $e(p),
        F.setAttribute("aria-hidden", "false"),
        h instanceof PointerEvent)
      )
        ((B = h.clientX), m(h.clientX, h.clientY));
      else {
        v();
        const ae = u.getBoundingClientRect();
        m(ae.right, ae.bottom);
      }
      const N = !F.classList.contains("is-visible");
      (N && F.classList.add("snap-position"),
        F.offsetHeight,
        F.classList.add("is-visible"),
        N &&
          requestAnimationFrame(() => {
            F.classList.remove("snap-position");
          }));
    },
    D = function (u) {
      (u && fe !== u) ||
        ((fe = null),
        (Q = !1),
        v(),
        F.setAttribute("aria-hidden", "true"),
        F.classList.remove("is-visible", "snap-position"));
    },
    W = function (u, h) {
      const p =
        u instanceof Element ? u.closest("[data-experiment-preview]") : null;
      return !!(p && p !== h);
    };
  const F = it,
    U = 12,
    K = 12,
    re = 16,
    de = new Map();
  let fe = null,
    k = "",
    J = Mt,
    Te = Ft,
    be = 0,
    Q = !1,
    B = 0,
    ee = 0,
    te = 0,
    Y = 0,
    se = 0,
    O = 0;
  (window.addEventListener(pt, (u) => {
    Xt(u) !== Ct && D();
  }),
    lt.forEach((u) => {
      (u.addEventListener("pointerenter", (h) => {
        X() || H(u, h);
      }),
        u.addEventListener("click", (h) => {
          X() && (h.preventDefault(), le("medium"), ke());
        }),
        u.addEventListener("pointerleave", (h) => {
          X() || W(h.relatedTarget, u) || D(u);
        }),
        u.addEventListener("focus", (h) => {
          X() || !u.matches(":focus-visible") || H(u, h);
        }),
        u.addEventListener("blur", () => {
          X() || D(u);
        }));
    }),
    window.addEventListener("pointermove", (u) => {
      if (X() || !Q || !fe || !F.classList.contains("is-visible")) return;
      const h = u.clientX - B;
      ((B = u.clientX),
        (te = Math.max(-8, Math.min(8, h * 0.45))),
        m(u.clientX, u.clientY),
        L());
    }),
    window.addEventListener("grizz-scroll-reset-hover", () => {
      D();
    }));
}
if (
  (Tt.length > 0 || bt.length > 0) &&
  kt instanceof HTMLElement &&
  xt instanceof HTMLElement
) {
  let o = function () {
      te && (window.clearTimeout(te), (te = 0));
    },
    m = function () {
      (Y && (window.clearTimeout(Y), (Y = 0)),
        se && (window.clearTimeout(se), (se = 0)));
    },
    a = function () {
      (O && (window.clearTimeout(O), (O = 0)),
        k.classList.remove("is-swapping"));
    },
    L = function (s) {
      return `text:${s}`;
    },
    v = function (s) {
      ((ae = L(s)), (J.textContent = s));
    },
    Z = function (s, f = !1) {
      if ((a(), !f)) {
        v(s);
        return;
      }
      (k.classList.add("is-swapping"),
        (O = window.setTimeout(() => {
          (v(s),
            (O = 0),
            requestAnimationFrame(() => {
              k.classList.remove("is-swapping");
            }));
        }, 115)));
    },
    ke = function () {
      return (
        k.classList.contains("is-visible") &&
        k.getAttribute("aria-hidden") === "false"
      );
    },
    $e = function (s, f) {
      return ke() && B !== null && B !== s && ae !== L(f);
    },
    H = function () {
      if (
        ((p *= 0.84),
        (h += (p - h) * 0.18),
        Math.abs(p) < 0.03 && Math.abs(h) < 0.03)
      ) {
        ((h = 0),
          (p = 0),
          k.style.setProperty("--tooltip-rotate", "0deg"),
          (N = 0));
        return;
      }
      (k.style.setProperty("--tooltip-rotate", `${h.toFixed(2)}deg`),
        (N = requestAnimationFrame(H)));
    },
    D = function () {
      N || (N = requestAnimationFrame(H));
    },
    W = function () {
      ((h = 0),
        (p = 0),
        N && (cancelAnimationFrame(N), (N = 0)),
        k.style.setProperty("--tooltip-rotate", "0deg"));
    },
    F = function (s, f) {
      const C = k.getBoundingClientRect(),
        V = Math.max(Q, window.innerWidth - C.width - Q),
        ne = Math.max(Q, window.innerHeight - C.height - Q),
        ue = Math.min(Math.max(s + Te, Q), V),
        xe = Math.min(Math.max(f + be, Q), ne);
      (k.style.setProperty("--tooltip-x", `${ue.toFixed(2)}px`),
        k.style.setProperty("--tooltip-y", `${xe.toFixed(2)}px`));
    },
    U = function (s, f, C = {}) {
      (zt(At), o());
      const V = $e(s, f),
        ne = !!(C.snap && !V);
      if (
        ((B = s),
        (ee = !!C.followPointer),
        Z(f, V),
        k.setAttribute("aria-hidden", "false"),
        ne
          ? k.classList.add("snap-position")
          : k.classList.remove("snap-position"),
        typeof C.clientX == "number" && typeof C.clientY == "number")
      )
        F(C.clientX, C.clientY);
      else {
        const ue = s.getBoundingClientRect();
        F(ue.right, ue.bottom);
      }
      (k.offsetHeight,
        k.classList.add("is-visible"),
        ne &&
          requestAnimationFrame(() => {
            k.classList.remove("snap-position");
          }));
    },
    K = function (s) {
      (s && B !== s) ||
        (o(),
        (B = null),
        (ae = ""),
        (ee = !1),
        a(),
        W(),
        k.setAttribute("aria-hidden", "true"),
        k.classList.remove("is-visible", "snap-position", "is-swapping"));
    },
    re = function (s, f = 1200) {
      return !(z instanceof HTMLElement) || !(ot instanceof HTMLElement)
        ? !1
        : (o(),
          m(),
          (ot.textContent = s),
          z.setAttribute("aria-hidden", "false"),
          z.classList.remove("is-hiding"),
          z.offsetHeight,
          z.classList.add("is-visible"),
          (Y = window.setTimeout(() => {
            (z.classList.add("is-hiding"),
              z.classList.remove("is-visible"),
              (se = window.setTimeout(() => {
                (z.setAttribute("aria-hidden", "true"),
                  z.classList.remove("is-hiding"));
              }, 280)));
          }, f)),
          !0);
    },
    de = function (s, f = {}) {
      const C = f.trigger ?? B ?? k,
        V = f.visibleDuration ?? 1200,
        ne = f.haptic ?? "medium";
      if (
        (typeof f.clientX == "number" && (u = f.clientX),
        W(),
        ne !== !1 && le(ne),
        X())
      ) {
        s && re(s, V);
        return;
      }
      (U(C, s, {
        clientX: f.clientX,
        clientY: f.clientY,
        snap: !0,
        followPointer: !0,
      }),
        !f.persistent && (te = window.setTimeout(() => K(C), V)));
    },
    fe = function (s) {
      K(s);
    };
  const k = kt,
    J = xt,
    Te = 12,
    be = 16,
    Q = 12;
  let B = null,
    ee = !1,
    te = 0,
    Y = 0,
    se = 0,
    O = 0,
    u = 0,
    h = 0,
    p = 0,
    N = 0,
    ae = "";
  (window.addEventListener(pt, (s) => {
    Xt(s) !== At && K();
  }),
    (window.grizzShowFeedbackPill = de),
    (window.grizzHideFeedbackPill = fe),
    Tt.forEach((s) => {
      (s.addEventListener("pointerenter", (f) => {
        if (X()) return;
        const C = s.dataset.tooltip || "";
        C &&
          de(C, {
            clientX: f.clientX,
            clientY: f.clientY,
            haptic: !1,
            persistent: !0,
            trigger: s,
          });
      }),
        s.addEventListener("pointerleave", () => {
          X() || K(s);
        }),
        s.addEventListener("focus", () => {
          if (X() || !s.matches(":focus-visible")) return;
          const f = s.dataset.tooltip || "";
          f &&
            (W(),
            U(s, f, {
              snap: !0,
            }));
        }),
        s.addEventListener("blur", () => {
          X() || K(s);
        }),
        s.addEventListener("click", () => {
          if (!X()) return;
          const f = s.dataset.tooltip || "";
          f && (le("medium"), re(f, 1800));
        }),
        s.addEventListener("keydown", (f) => {
          if (!X() || (f.key !== "Enter" && f.key !== " ")) return;
          const C = s.dataset.tooltip || "";
          C && (f.preventDefault(), le("medium"), re(C, 1800));
        }));
    }));
  async function me(s, f, C) {
    const V = s.dataset.copyValue || "",
      ne = s.dataset.copyTooltip || "Copied";
    if (!V) return;
    try {
      await navigator.clipboard.writeText(V);
    } catch {
      const pe = window.getSelection(),
        A = document.createRange();
      (A.selectNodeContents(s),
        pe?.removeAllRanges(),
        pe?.addRange(A),
        document.execCommand("copy"),
        pe?.removeAllRanges());
    }
    if ((le("success"), X())) {
      re(ne, 1200);
      return;
    }
    const ue = s.getBoundingClientRect(),
      xe = typeof f == "number" ? f : ue.right,
      $ = typeof C == "number" ? C : ue.bottom;
    de(ne, {
      clientX: xe,
      clientY: $,
      haptic: !1,
      trigger: s,
      visibleDuration: 1200,
    });
  }
  (bt.forEach((s) => {
    (s.addEventListener("click", (f) => {
      me(s, f.clientX, f.clientY);
    }),
      s.addEventListener("keydown", (f) => {
        (f.key !== "Enter" && f.key !== " ") || (f.preventDefault(), me(s));
      }));
  }),
    window.addEventListener("pointermove", (s) => {
      if (X() || !ee || !B) return;
      const f = s.clientX - u;
      ((u = s.clientX),
        (p = Math.max(-8, Math.min(8, f * 0.45))),
        F(s.clientX, s.clientY),
        D());
    }),
    window.addEventListener("grizz-scroll-reset-hover", () => {
      K();
    }));
}
const Wt = document.getElementById("bookshelf"),
  mt = document.getElementById("bookshelf-viewport"),
  Rt = mt?.closest(".books-shell");
if (
  Wt instanceof HTMLElement &&
  mt instanceof HTMLElement &&
  Rt instanceof HTMLElement
) {
  let o = function (e) {
      (Me.classList.toggle("is-scrollable", e),
        E.classList.toggle("is-scrollable", e),
        e || (L(), (E.scrollLeft = 0), (G = !1), a()));
    },
    m = function () {
      const e = window.innerWidth || document.documentElement.clientWidth || 0,
        n = fe(M, c);
      o(n > e + 1);
    },
    a = function () {
      ((ce = !1), E.classList.remove("dragging"));
    },
    L = function () {
      Fe && (cancelAnimationFrame(Fe), (Fe = 0));
    },
    v = function () {
      We && (window.clearTimeout(We), (We = 0));
    },
    Z = function () {
      const e = window.getComputedStyle(A);
      return parseFloat(e.columnGap || e.gap || "0") || 0;
    },
    ke = function () {
      const e = window.getComputedStyle(E);
      return {
        left: parseFloat(e.paddingLeft || "0") || 0,
        right: parseFloat(e.paddingRight || "0") || 0,
      };
    },
    $e = function () {
      const e = E.clientWidth;
      return D(e * 0.12, 24, 56);
    },
    H = function (e) {
      return !e.classList.contains("is-missing");
    },
    D = function (e, n, i) {
      return Math.min(Math.max(e, n), i);
    },
    W = function (e, n, i) {
      return e + (n - e) * i;
    },
    F = function (e) {
      return e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
    },
    U = function (e, n, i, l, w, d) {
      const S = l * (Math.PI / 180),
        T = w * (Math.PI / 180),
        x = Math.cos(S),
        y = Math.sin(S),
        I = Math.cos(T),
        ie = Math.sin(T),
        _ = d ? e : 0,
        Pe = i / 2,
        Ae = d ? e - n : 0,
        Ye = d ? e : n,
        Ke = [
          {
            z: 0,
            corners: [
              {
                x: Ae,
                y: 0,
              },
              {
                x: Ye,
                y: 0,
              },
              {
                x: Ae,
                y: i,
              },
              {
                x: Ye,
                y: i,
              },
            ],
          },
          {
            z: n,
            corners: [
              {
                x: 0,
                y: 0,
              },
              {
                x: e,
                y: 0,
              },
              {
                x: 0,
                y: i,
              },
              {
                x: e,
                y: i,
              },
            ],
          },
        ],
        Oe = [];
      Ke.forEach((je) => {
        je.corners.forEach(({ x: Je, y: oe }) => {
          const Ee = Je - _,
            ct = oe - Pe,
            Nt = (Ee * x + je.z * y) * I - ct * ie;
          Oe.push(Nt + _);
        });
      });
      const Ge = Math.min(...Oe);
      return {
        width: Math.max(...Oe) - Ge,
        offsetX: -Ge,
      };
    },
    K = function (e, n) {
      const i = P[e],
        l = parseFloat(i.dataset.baseTilt || i.dataset.tilt || "0"),
        w = Math.abs(e - n),
        d = e < n ? -1 : 1,
        S = Math.max(0, 1.85 - w * 0.26),
        T = Math.abs(l) * Math.max(0.7, 1 - w * 0.04);
      return D((T + S) * d, -3.4, 3.4);
    },
    re = function (e, n) {
      const i = P[e];
      if (!H(i)) return 0;
      const l = i.classList.contains("manga"),
        w = parseFloat(i.dataset.coverWidth || "0"),
        d = parseFloat(i.dataset.spineWidth || "0");
      if (e === n) return w;
      const S = l ? -90 : 90,
        T = K(e, n);
      return U(w, d, 260, S, T, l).width;
    },
    de = function (e, n, i) {
      const l = P[e];
      if (!H(l)) return 0;
      const w = l.classList.contains("manga"),
        d = w ? -90 : 90,
        S = parseFloat(l.dataset.coverWidth || "0"),
        T = parseFloat(l.dataset.spineWidth || "0"),
        x = D(n, 0, 1),
        y = i * (1 - x),
        I = d * (1 - x);
      return U(S, T, 260, I, y, w).width;
    },
    fe = function (e, n) {
      const i = Z(),
        l = P.map((w, d) => (H(w) ? d : -1)).filter((w) => w >= 0);
      return l.reduce((w, d, S) => {
        const T = de(d, e[d], n[d]),
          x = S < l.length - 1 ? i : 0;
        return w + T + x;
      }, 0);
    },
    k = function (e) {
      if (!H(P[e])) return;
      const n = Z(),
        i = P.map((oe, Ee) => re(Ee, e)),
        l = i[e],
        w = window.innerWidth || document.documentElement.clientWidth || 0,
        d = P.map((oe, Ee) => (H(oe) ? Ee : -1)).filter((oe) => oe >= 0);
      let S = 0,
        T = 0;
      for (let oe = 0; oe < e; oe++) d.includes(oe) && (S += i[oe] + n);
      if (
        (d.forEach((oe, Ee) => {
          ((T += i[oe]), Ee < d.length - 1 && (T += n));
        }),
        T <= w + 1 || (o(!0), !E.classList.contains("is-scrollable")))
      )
        return;
      const x = ke(),
        y = E.scrollLeft,
        I = y + E.clientWidth,
        ie = x.left + S,
        _ = ie + l,
        Pe = $e(),
        Ae = Math.max(0, x.left + T + x.right - E.clientWidth),
        Ye = D(ie + l / 2 - E.clientWidth / 2, 0, Ae),
        Ke = E.scrollLeft,
        Oe = ie < y + Pe || _ > I - Pe,
        Ge = e === 0 || e === P.length - 1;
      if ((!Oe && !Ge) || Math.abs(Ye - Ke) < 1) return;
      L();
      const Lt = performance.now(),
        je = 650;
      function Je(oe) {
        const Ee = D((oe - Lt) / je, 0, 1),
          ct = F(Ee);
        if (((E.scrollLeft = W(Ke, Ye, ct)), Ee < 1)) {
          Fe = requestAnimationFrame(Je);
          return;
        }
        Fe = 0;
      }
      Fe = requestAnimationFrame(Je);
    },
    J = function (e, n, i) {
      const l = e.querySelector(".book-inner");
      if (!H(e)) {
        ((e.style.width = "0px"), (e.style.zIndex = "0"));
        return;
      }
      const w = e.classList.contains("manga"),
        d = w ? -90 : 90,
        S = parseFloat(e.dataset.coverWidth || "0"),
        T = parseFloat(e.dataset.spineWidth || "0"),
        x = D(n, 0, 1),
        y = i * (1 - x),
        I = d * (1 - x),
        { width: ie, offsetX: _ } = U(S, T, 260, I, y, w);
      ((e.style.width = `${ie.toFixed(2)}px`),
        (l.style.transform = `translateX(${_.toFixed(2)}px) rotate(${y}deg) rotateY(${I}deg)`),
        (e.style.zIndex = x > 0.01 ? "2" : "1"));
    },
    Te = function (e, n) {
      ((M = e.slice()),
        (c = n.slice()),
        P.forEach((i, l) => {
          (J(i, M[l], c[l]), i.classList.toggle("open", M[l] > 0.999));
        }),
        m());
    },
    be = function (e) {
      Te(
        P.map((n, i) => (i === e ? 1 : 0)),
        P.map((n, i) => K(i, e)),
      );
    },
    Q = function (e) {
      (q && cancelAnimationFrame(q), (g = e), k(e));
      const n = c.slice(),
        i = P.map((x, y) => (y === e ? 1 : 0)),
        l = P.map((x, y) => K(y, e)),
        w = M.slice(),
        d = performance.now(),
        S = 650;
      function T(x) {
        const y = D((x - d) / S, 0, 1),
          I = F(y),
          ie = w.map((Pe, Ae) => W(Pe, i[Ae], I)),
          _ = n.map((Pe, Ae) => W(Pe, l[Ae], I));
        if ((Te(ie, _), y < 1)) {
          q = requestAnimationFrame(T);
          return;
        }
        ((R = e), (g = e), (q = 0), be(R), ne(R));
      }
      q = requestAnimationFrame(T);
    },
    B = function () {
      (be(R), m());
    },
    ee = function (e, n, i, l) {
      return new Promise((w) => {
        let d = !1,
          S = 0;
        const T = e.getAttribute("src") || "",
          x = e.getAttribute("srcset") || "",
          y = (Pe) => {
            d ||
              ((d = !0),
              window.clearTimeout(S),
              e.removeEventListener("load", I),
              e.removeEventListener("error", ie),
              w(Pe));
          },
          I = () => {
            y(e.naturalWidth > 0);
          },
          ie = () => {
            y(!1);
          },
          _ = T === n && (!i || x === i);
        if (
          ((e.fetchPriority = l),
          e.setAttribute("fetchpriority", l),
          e.complete && e.naturalWidth > 0 && _)
        ) {
          y(!0);
          return;
        }
        if (
          (e.addEventListener("load", I, {
            once: !0,
          }),
          e.addEventListener("error", ie, {
            once: !0,
          }),
          _ ||
            (i && ((e.srcset = i), e.setAttribute("srcset", i)),
            (e.src = n),
            e.setAttribute("src", n)),
          (S = window.setTimeout(() => y(!1), 1e4)),
          e.complete && e.naturalWidth > 0)
        ) {
          y(!0);
          return;
        }
        if (e.complete && e.naturalWidth === 0) {
          y(!1);
          return;
        }
        e.decode?.()
          .then(() => y(e.naturalWidth > 0))
          .catch(() => {
            e.complete && y(!1);
          });
      });
    },
    te = function (e) {
      return new Promise((n) => {
        window.setTimeout(n, e);
      });
    },
    Y = function (e, n) {
      if (n === 0) return e;
      const i = new URL(e, window.location.origin);
      return (
        i.searchParams.set("book-retry", `${Date.now()}-${n}`),
        `${i.pathname}${i.search}${i.hash}`
      );
    },
    se = function (e, n) {
      return !e || n === 0
        ? e
        : e
            .split(",")
            .map((i) => {
              const l = i.trim().split(/\s+/),
                [w, ...d] = l;
              return [Y(w, n), ...d].join(" ");
            })
            .join(", ");
    },
    O = function (e, n) {
      e.classList.contains(n === "cover" ? "cover-loaded" : "spine-loaded") ||
        (e.classList.add(n === "cover" ? "cover-loaded" : "spine-loaded"),
        e.classList.contains("cover-loaded") &&
          e.classList.contains("spine-loaded") &&
          e.classList.add("is-loaded"),
        n === "cover" && ne(P.indexOf(e)));
    },
    u = function (e) {
      (e.classList.add("is-missing"),
        e.setAttribute("aria-hidden", "true"),
        (e.tabIndex = -1),
        B());
    },
    h = function (e) {
      e.classList.contains("is-missing") &&
        (e.classList.remove("is-missing"),
        e.removeAttribute("aria-hidden"),
        e.removeAttribute("tabindex"),
        B());
    },
    p = function (e, n, i) {
      const l = n === "cover" ? Le : t,
        w = l[e];
      if (w) return w;
      const d = P[e];
      if (d.classList.contains(n === "cover" ? "cover-loaded" : "spine-loaded"))
        return Promise.resolve();
      const S = d.querySelector(n === "cover" ? ".book-cover" : ".book-spine"),
        T = S.dataset.src || "",
        x = S.dataset.srcset || "",
        y = at(S, T, x, i).then((I) => {
          if (!I) {
            u(d);
            return;
          }
          (h(d), O(d, n));
        });
      return ((l[e] = y), y);
    },
    N = function (e) {
      const n = e.dataset.bookStatus || "not-started",
        i = b[n] || b["not-started"];
      return i[Math.floor(Math.random() * i.length)];
    },
    ae = function (e) {
      return (
        e.dataset.bookStatus === "finished" &&
        !!e.dataset.bookUrl &&
        e.classList.contains("cover-loaded") &&
        M[P.indexOf(e)] > 0.999
      );
    },
    me = function (e, n, i, l = "medium", w = 1200, d = !1) {
      if (window.grizzShowFeedbackPill) {
        window.grizzShowFeedbackPill(n, {
          clientX: i?.clientX,
          clientY: i?.clientY,
          haptic: l,
          persistent: d,
          trigger: e,
          visibleDuration: w,
        });
        return;
      }
      l !== !1 && le(l);
    },
    s = function (e, n) {
      ((he = e), (ge = n.clientX), (ye = n.clientY), (ze = !0));
    },
    f = function () {
      if (!ze) return -1;
      const e = document.elementFromPoint(ge, ye),
        n = e instanceof Element ? e.closest(".book") : null;
      return !n || !A.contains(n) ? -1 : P.indexOf(n);
    },
    C = function (e) {
      if (!ze || !e.matches(":hover")) return !1;
      const n = e.querySelector(".book-cover");
      if (!n) return !1;
      const i = n.getBoundingClientRect();
      return ge >= i.left && ge <= i.right && ye >= i.top && ye <= i.bottom;
    },
    V = function (e = he) {
      if (X() || e < 0 || f() !== e || j === e) return;
      const n = P[e];
      !n ||
        !ae(n) ||
        (C(n) &&
          (me(
            n,
            N(n),
            {
              clientX: ge,
              clientY: ye,
            },
            !1,
            1200,
            !0,
          ),
          (j = e)));
    },
    ne = function (e) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          V(e);
        });
      });
    },
    ue = function () {
      ((he = -1),
        (j = -1),
        (ve = 0),
        (ze = !1),
        window.grizzHideFeedbackPill?.());
    },
    xe = function (e, n, i) {
      if (n.complete) {
        n.naturalWidth > 0 && O(e, i);
        return;
      }
      n.addEventListener(
        "load",
        () => {
          n.naturalWidth > 0 && O(e, i);
        },
        {
          once: !0,
        },
      );
    },
    $ = function (e, n) {
      const i = P[e];
      if (!(!i || !H(i))) {
        if (
          (n && s(e, n),
          j >= 0 && j !== e && (window.grizzHideFeedbackPill?.(P[j]), (j = -1)),
          G)
        ) {
          G = !1;
          return;
        }
        if (q) {
          if (e === g) return;
        } else if (e === R) {
          const l = i.dataset.bookUrl,
            w = i.dataset.bookStatus || "not-started",
            d = i.classList.contains("cover-loaded") && M[e] > 0.999;
          if (w !== "finished" || !l) {
            if (performance.now() < ve) return;
            (me(i, N(i), n, "error"), (ve = performance.now() + 1200));
            return;
          }
          if (d) {
            (le("medium"),
              v(),
              (We = window.setTimeout(() => {
                window.location.href = l;
              }, 80)));
            return;
          }
          (le("medium"), p(e, "cover", "high"));
          return;
        }
        (le("medium"), p(e, "cover", "high"), p(e, "spine", "high"), Q(e));
      }
    },
    pe = function (e, n) {
      const i = A.getBoundingClientRect();
      if (n < i.top || n > i.bottom || e < i.left || e > i.right) return -1;
      let l = -1,
        w = 1 / 0;
      return (
        P.forEach((d, S) => {
          if (!H(d)) return;
          const T = d.getBoundingClientRect(),
            x = e < T.left ? T.left - e : e > T.right ? e - T.right : 0;
          x < w && ((w = x), (l = S));
        }),
        l
      );
    };
  const A = Wt,
    E = mt,
    Me = Rt,
    P = Array.from(A.querySelectorAll(".book"));
  let R = parseInt(A.dataset.initialOpenIndex || "0", 10),
    q = 0,
    Fe = 0,
    We = 0,
    g = R,
    M = P.map((e, n) => (n === R ? 1 : 0)),
    c = P.map((e, n) => K(n, R)),
    ce = !1,
    we = !1,
    Be = 0,
    qe = 0,
    De = 0,
    G = !1,
    he = -1,
    j = -1,
    ve = 0,
    ge = 0,
    ye = 0,
    ze = !1;
  async function at(e, n, i, l) {
    for (let d = 0; d < 3; d++) {
      if (await ee(e, Y(n, d), se(i, d), l)) return !0;
      d < 2 && (await te(2e3));
    }
    return !1;
  }
  const Le = Array(P.length).fill(null),
    t = Array(P.length).fill(null);
  async function r() {
    (await p(R, "cover", "low"),
      await Promise.all(
        P.map((e, n) => (n === R ? null : p(n, "spine", "low"))).filter(
          Boolean,
        ),
      ),
      await Promise.all(
        P.map((e, n) =>
          n === R ? p(n, "spine", "low") : p(n, "cover", "low"),
        ),
      ));
  }
  const b = {
    finished: ["Read my thoughts", "Check my notes?", "See my takeaways"],
    "not-started": [
      "I didn't read it yet",
      "Working on it",
      "Trying to find time",
      "I need to start this",
    ],
    reading: [
      "Currently reading",
      "Writing my notes as you click",
      "Hold on i am on it",
    ],
  };
  (P.forEach((e, n) => {
    const i = e.querySelector(".book-preview-cover-shell"),
      l = e.querySelector(".book-preview-spine-shell"),
      w = e.querySelector(".book-spine"),
      d = e.querySelector(".book-cover"),
      S = e.querySelector(".book-elements"),
      T = e.querySelector(".book-inner"),
      x = parseFloat(e.dataset.coverWidth || "0"),
      y = parseFloat(e.dataset.spineWidth || "0");
    ((e.dataset.baseTilt = e.dataset.tilt || "0"),
      (d.style.transform = `translateZ(${y}px)`),
      (i.style.transform = `translateZ(${y}px)`),
      S && (S.style.transform = `translateZ(${y}px)`),
      (d.style.width = `${x}px`),
      (i.style.width = `${x}px`),
      (w.style.width = `${y}px`),
      (l.style.width = `${y}px`),
      (T.style.width = `${x}px`));
    const I = n === R ? 1 : 0,
      ie = K(n, R);
    ((M[n] = I),
      (c[n] = ie),
      J(e, I, ie),
      xe(e, d, "cover"),
      xe(e, w, "spine"),
      e.addEventListener("click", (_) => {
        $(n, _);
      }),
      e.addEventListener("pointerenter", (_) => {
        (s(n, _), V(n));
      }),
      e.addEventListener("pointermove", (_) => {
        (s(n, _), V(n));
      }),
      e.addEventListener("pointerleave", () => {
        (he === n && (he = -1),
          j === n && (j = -1),
          (ve = 0),
          window.grizzHideFeedbackPill?.(e));
      }));
  }),
    A.addEventListener("click", (e) => {
      const n = e.target;
      if (n instanceof Element && n.closest(".book")) return;
      const i = pe(e.clientX, e.clientY);
      i < 0 || $(i, e);
    }),
    B(),
    Ot(() => {
      r();
    }, 2500),
    E.addEventListener("pointerdown", (e) => {
      (m(),
        E.classList.contains("is-scrollable") &&
          e.pointerType === "mouse" &&
          (L(),
          (ce = !0),
          (we = !1),
          (Be = e.clientX),
          (qe = e.clientY),
          (De = E.scrollLeft)));
    }),
    E.addEventListener("pointermove", (e) => {
      if (!ce) return;
      const n = e.clientX - Be,
        i = e.clientY - qe;
      if (!we && Math.abs(i) > Math.abs(n) && Math.abs(i) > 6) {
        a();
        return;
      }
      (!we &&
        Math.abs(n) > 6 &&
        ((we = !0), (G = !0), E.classList.add("dragging")),
        we && (E.scrollLeft = De - n));
    }),
    E.addEventListener("pointerup", () => {
      (a(),
        G &&
          window.setTimeout(() => {
            G = !1;
          }, 0));
    }),
    E.addEventListener("pointercancel", () => {
      (a(),
        G &&
          window.setTimeout(() => {
            G = !1;
          }, 0));
    }),
    E.addEventListener("pointerleave", () => {
      !ce ||
        !we ||
        (a(),
        G &&
          window.setTimeout(() => {
            G = !1;
          }, 0));
    }),
    window.addEventListener("resize", m),
    window.addEventListener("grizz-scroll-reset-hover", ue));
}
Zt instanceof HTMLElement &&
  St.length > 0 &&
  St.forEach((o) => {
    o.addEventListener("click", () => {
      try {
        window.sessionStorage.setItem("grizz-artifact-return-target", "/");
      } catch {}
    });
  });
lt.forEach((o) => {
  o.addEventListener("click", () => {
    try {
      window.sessionStorage.setItem("grizz-experiment-return-target", "/");
    } catch {}
  });
});
_t.forEach((o) => {
  o.addEventListener("click", (m) => {
    et() &&
      (m.preventDefault(),
      window.grizzShowFeedbackPill?.(
        o.dataset.mobileMessage || "Sorry mobile is not supported.",
        {
          haptic: "medium",
          trigger: o,
          visibleDuration: 1800,
        },
      ));
  });
});
