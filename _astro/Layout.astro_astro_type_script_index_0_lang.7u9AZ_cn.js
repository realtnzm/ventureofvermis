var F = {
    success: {
      pattern: [
        {
          duration: 30,
          intensity: 0.5,
        },
        {
          delay: 60,
          duration: 40,
          intensity: 1,
        },
      ],
    },
    warning: {
      pattern: [
        {
          duration: 40,
          intensity: 0.8,
        },
        {
          delay: 100,
          duration: 40,
          intensity: 0.6,
        },
      ],
    },
    error: {
      pattern: [
        {
          duration: 40,
          intensity: 0.9,
        },
        {
          delay: 40,
          duration: 40,
          intensity: 0.9,
        },
        {
          delay: 40,
          duration: 40,
          intensity: 0.9,
        },
      ],
    },
    light: {
      pattern: [
        {
          duration: 15,
          intensity: 0.4,
        },
      ],
    },
    medium: {
      pattern: [
        {
          duration: 25,
          intensity: 0.7,
        },
      ],
    },
    heavy: {
      pattern: [
        {
          duration: 35,
          intensity: 1,
        },
      ],
    },
    soft: {
      pattern: [
        {
          duration: 40,
          intensity: 0.5,
        },
      ],
    },
    rigid: {
      pattern: [
        {
          duration: 10,
          intensity: 1,
        },
      ],
    },
    selection: {
      pattern: [
        {
          duration: 8,
          intensity: 0.3,
        },
      ],
    },
    nudge: {
      pattern: [
        {
          duration: 80,
          intensity: 0.8,
        },
        {
          delay: 80,
          duration: 50,
          intensity: 0.3,
        },
      ],
    },
    buzz: {
      pattern: [
        {
          duration: 1e3,
          intensity: 1,
        },
      ],
    },
  },
  B = 16,
  R = 184,
  x = 1e3,
  m = 20;
function T(t) {
  if (typeof t == "number")
    return {
      vibrations: [
        {
          duration: t,
        },
      ],
    };
  if (typeof t == "string") {
    let e = F[t];
    return e
      ? {
          vibrations: e.pattern.map((n) => ({
            ...n,
          })),
        }
      : (console.warn(`[web-haptics] Unknown preset: "${t}"`), null);
  }
  if (Array.isArray(t)) {
    if (t.length === 0)
      return {
        vibrations: [],
      };
    if (typeof t[0] == "number") {
      let e = t,
        n = [];
      for (let i = 0; i < e.length; i += 2) {
        let a = i > 0 ? e[i - 1] : 0;
        n.push({
          ...(a > 0 && {
            delay: a,
          }),
          duration: e[i],
        });
      }
      return {
        vibrations: n,
      };
    }
    return {
      vibrations: t.map((e) => ({
        ...e,
      })),
    };
  }
  return {
    vibrations: t.pattern.map((e) => ({
      ...e,
    })),
  };
}
function z(t, e) {
  if (e >= 1) return [t];
  if (e <= 0) return [];
  let n = Math.max(1, Math.round(m * e)),
    i = m - n,
    a = [],
    o = t;
  for (; o >= m; ) (a.push(n), a.push(i), (o -= m));
  if (o > 0) {
    let r = Math.max(1, Math.round(o * e));
    a.push(r);
    let u = o - r;
    u > 0 && a.push(u);
  }
  return a;
}
function D(t, e) {
  let n = [];
  for (let i = 0; i < t.length; i++) {
    let a = t[i],
      o = Math.max(0, Math.min(1, a.intensity ?? e)),
      r = a.delay ?? 0;
    r > 0 &&
      (n.length > 0 && n.length % 2 === 0
        ? (n[n.length - 1] += r)
        : (n.length === 0 && n.push(0), n.push(r)));
    let u = z(a.duration, o);
    if (u.length === 0) {
      n.length > 0 && n.length % 2 === 0
        ? (n[n.length - 1] += a.duration)
        : a.duration > 0 && (n.push(0), n.push(a.duration));
      continue;
    }
    for (let c of u) n.push(c);
  }
  return n;
}
var G = 0,
  H = class g {
    hapticLabel = null;
    domInitialized = !1;
    instanceId;
    debug;
    showSwitch;
    rafId = null;
    patternResolve = null;
    audioCtx = null;
    audioFilter = null;
    audioGain = null;
    audioBuffer = null;
    constructor(e) {
      ((this.instanceId = ++G),
        (this.debug = e?.debug ?? !1),
        (this.showSwitch = e?.showSwitch ?? !1));
    }
    static isSupported =
      typeof navigator < "u" && typeof navigator.vibrate == "function";
    async trigger(
      e = [
        {
          duration: 25,
          intensity: 0.7,
        },
      ],
      n,
    ) {
      let i = T(e);
      if (!i) return;
      let { vibrations: a } = i;
      if (a.length === 0) return;
      let o = Math.max(0, Math.min(1, n?.intensity ?? 0.5));
      for (let r of a)
        if (
          (r.duration > x && (r.duration = x),
          !Number.isFinite(r.duration) ||
            r.duration < 0 ||
            (r.delay !== void 0 && (!Number.isFinite(r.delay) || r.delay < 0)))
        ) {
          console.warn(
            "[web-haptics] Invalid vibration values. Durations and delays must be finite non-negative numbers.",
          );
          return;
        }
      if (
        (g.isSupported && navigator.vibrate(D(a, o)),
        !g.isSupported || this.debug)
      ) {
        if ((this.ensureDOM(), !this.hapticLabel)) return;
        (this.debug && (await this.ensureAudio()), this.stopPattern());
        let r = (a[0]?.delay ?? 0) === 0;
        if (r && (this.hapticLabel.click(), this.debug && this.audioCtx)) {
          let u = Math.max(0, Math.min(1, a[0].intensity ?? o));
          this.playClick(u);
        }
        await this.runPattern(a, o, r);
      }
    }
    cancel() {
      (this.stopPattern(), g.isSupported && navigator.vibrate(0));
    }
    destroy() {
      (this.stopPattern(),
        this.hapticLabel &&
          (this.hapticLabel.remove(),
          (this.hapticLabel = null),
          (this.domInitialized = !1)),
        this.audioCtx &&
          (this.audioCtx.close(),
          (this.audioCtx = null),
          (this.audioFilter = null),
          (this.audioGain = null),
          (this.audioBuffer = null)));
    }
    setDebug(e) {
      ((this.debug = e),
        !e &&
          this.audioCtx &&
          (this.audioCtx.close(),
          (this.audioCtx = null),
          (this.audioFilter = null),
          (this.audioGain = null),
          (this.audioBuffer = null)));
    }
    setShowSwitch(e) {
      if (((this.showSwitch = e), this.hapticLabel)) {
        let n = this.hapticLabel.querySelector("input");
        ((this.hapticLabel.style.display = e ? "" : "none"),
          n && (n.style.display = e ? "" : "none"));
      }
    }
    stopPattern() {
      (this.rafId !== null &&
        (cancelAnimationFrame(this.rafId), (this.rafId = null)),
        this.patternResolve?.(),
        (this.patternResolve = null));
    }
    runPattern(e, n, i) {
      return new Promise((a) => {
        this.patternResolve = a;
        let o = [],
          r = 0;
        for (let l of e) {
          let h = Math.max(0, Math.min(1, l.intensity ?? n)),
            f = l.delay ?? 0;
          (f > 0 &&
            ((r += f),
            o.push({
              end: r,
              isOn: !1,
              intensity: 0,
            })),
            (r += l.duration),
            o.push({
              end: r,
              isOn: !0,
              intensity: h,
            }));
        }
        let u = r,
          c = 0,
          d = -1,
          s = (l) => {
            c === 0 && (c = l);
            let h = l - c;
            if (h >= u) {
              ((this.rafId = null), (this.patternResolve = null), a());
              return;
            }
            let f = o[0];
            for (let y of o)
              if (h < y.end) {
                f = y;
                break;
              }
            if (f.isOn) {
              let y = B + (1 - f.intensity) * R;
              d === -1
                ? ((d = l),
                  i ||
                    (this.hapticLabel?.click(),
                    this.debug && this.audioCtx && this.playClick(f.intensity),
                    (i = !0)))
                : l - d >= y &&
                  (this.hapticLabel?.click(),
                  this.debug && this.audioCtx && this.playClick(f.intensity),
                  (d = l));
            }
            this.rafId = requestAnimationFrame(s);
          };
        this.rafId = requestAnimationFrame(s);
      });
    }
    playClick(e) {
      if (
        !this.audioCtx ||
        !this.audioFilter ||
        !this.audioGain ||
        !this.audioBuffer
      )
        return;
      let n = this.audioBuffer.getChannelData(0);
      for (let r = 0; r < n.length; r++)
        n[r] = (Math.random() * 2 - 1) * Math.exp(-r / 25);
      this.audioGain.gain.value = 0.5 * e;
      let i = 2e3 + e * 2e3,
        a = 1 + (Math.random() - 0.5) * 0.3;
      this.audioFilter.frequency.value = i * a;
      let o = this.audioCtx.createBufferSource();
      ((o.buffer = this.audioBuffer),
        o.connect(this.audioFilter),
        (o.onended = () => o.disconnect()),
        o.start());
    }
    async ensureAudio() {
      if (!this.audioCtx && typeof AudioContext < "u") {
        ((this.audioCtx = new AudioContext()),
          (this.audioFilter = this.audioCtx.createBiquadFilter()),
          (this.audioFilter.type = "bandpass"),
          (this.audioFilter.frequency.value = 4e3),
          (this.audioFilter.Q.value = 8),
          (this.audioGain = this.audioCtx.createGain()),
          this.audioFilter.connect(this.audioGain),
          this.audioGain.connect(this.audioCtx.destination));
        let e = 0.004;
        this.audioBuffer = this.audioCtx.createBuffer(
          1,
          this.audioCtx.sampleRate * e,
          this.audioCtx.sampleRate,
        );
        let n = this.audioBuffer.getChannelData(0);
        for (let i = 0; i < n.length; i++)
          n[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
      }
      this.audioCtx?.state === "suspended" && (await this.audioCtx.resume());
    }
    ensureDOM() {
      if (this.domInitialized || typeof document > "u") return;
      let e = `web-haptics-${this.instanceId}`,
        n = document.createElement("label");
      (n.setAttribute("for", e),
        (n.textContent = "Haptic feedback"),
        (n.style.position = "fixed"),
        (n.style.bottom = "10px"),
        (n.style.left = "10px"),
        (n.style.padding = "5px 10px"),
        (n.style.backgroundColor = "rgba(0, 0, 0, 0.7)"),
        (n.style.color = "white"),
        (n.style.fontFamily = "sans-serif"),
        (n.style.fontSize = "14px"),
        (n.style.borderRadius = "4px"),
        (n.style.zIndex = "9999"),
        (n.style.userSelect = "none"),
        (this.hapticLabel = n));
      let i = document.createElement("input");
      ((i.type = "checkbox"),
        i.setAttribute("switch", ""),
        (i.id = e),
        (i.style.all = "initial"),
        (i.style.appearance = "auto"),
        this.showSwitch ||
          ((n.style.display = "none"), (i.style.display = "none")),
        n.appendChild(i),
        document.body.appendChild(n),
        (this.domInitialized = !0));
    }
  };
const O = '[data-haptic]:not([data-haptic="none"])',
  q = 45;
let p = null,
  C = 0,
  k = !1;
const v = () =>
    typeof window > "u" || typeof navigator > "u"
      ? !1
      : window.matchMedia("(hover: none) and (pointer: coarse)").matches,
  P = () =>
    v()
      ? p ||
        ((p = new H({
          showSwitch: !0,
        })),
        p)
      : null,
  b = (t = "medium", e = {}) => {
    if (!v()) return;
    const n = performance.now();
    (!e.force && n - C < q) || ((C = n), P()?.trigger(t, e));
  },
  $ = () => {
    p?.cancel();
  },
  L = (t) => (t instanceof Element ? t.closest(O) : null),
  S = (t) =>
    t.matches('[aria-disabled="true"], .is-disabled') ||
    (t instanceof HTMLButtonElement && t.disabled),
  M = (t) => t.dataset.haptic?.trim() || "medium",
  K = () => {
    (document.addEventListener(
      "click",
      (t) => {
        const e = L(t.target);
        !e || S(e) || b(M(e));
      },
      {
        capture: !0,
      },
    ),
      document.addEventListener(
        "keydown",
        (t) => {
          if (t.key !== "Enter" && t.key !== " ") return;
          const e = L(t.target);
          !e || S(e) || b(M(e));
        },
        {
          capture: !0,
        },
      ));
  },
  U = () => {
    v() && P();
  },
  N = () => {
    if (k || typeof window > "u") return;
    ((k = !0),
      (window.grizzHaptics = {
        trigger: b,
        cancel: $,
      }),
      K());
    const t = () => {
      U();
    };
    (document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", t, {
          once: !0,
        })
      : t(),
      window.addEventListener("beforeunload", () => {
        (p?.destroy(), (p = null));
      }));
  },
  w = (t) => {
    if (!t) return null;
    try {
      const e = new URL(t, window.location.href);
      return e.origin !== window.location.origin ? null : ((e.hash = ""), e);
    } catch {
      return null;
    }
  },
  E = (t) => /\.[a-z0-9]{2,5}$/i.test(t),
  W = (t) =>
    (t.pathname.startsWith("/assets/artifacts/") && !E(t.pathname)) ||
    t.pathname === "/" ||
    t.pathname === "/artifacts" ||
    t.pathname.startsWith("/artifact/") ||
    t.pathname.startsWith("/book/")
      ? !0
      : !E(t.pathname),
  Q = (t) =>
    t.button === 0 && !t.metaKey && !t.ctrlKey && !t.shiftKey && !t.altKey,
  j = () => navigator.connection,
  J = () => {
    const t = j();
    return t
      ? t.saveData
        ? !0
        : /(^|\b)(slow-2g|2g)(\b|$)/i.test(t.effectiveType ?? "")
      : !1;
  },
  V = () => {
    const t = new Set(),
      e = [];
    return {
      add: (i, a, o, r = !1) => {
        if (!i) return;
        const u = w(i);
        if (!u) return;
        const c = u.href;
        t.has(c) ||
          (t.add(c),
          e.push({
            url: c,
            kind: a,
            priority: o,
            ordered: r,
          }));
      },
      tasks: e,
    };
  },
  X = () => {
    const t = V();
    return (
      document.querySelectorAll("[data-site-preload-url]").forEach((e) => {
        t.add(
          e.dataset.sitePreloadUrl,
          e.dataset.sitePreloadKind ?? "image",
          e.dataset.sitePreloadPriority ?? "low",
        );
      }),
      t.tasks
    );
  },
  Y = (t, e, n) =>
    new Promise((i) => {
      if (n.aborted) {
        i();
        return;
      }
      const a = new Image();
      let o = !1;
      const r = () => {
          o ||
            ((o = !0),
            n.removeEventListener("abort", u),
            (a.onload = null),
            (a.onerror = null),
            i());
        },
        u = () => {
          ((a.src = ""), r());
        };
      ((a.decoding = "async"),
        (a.fetchPriority = e),
        a.setAttribute("fetchpriority", e),
        (a.onload = r),
        (a.onerror = r),
        n.addEventListener("abort", u, {
          once: !0,
        }),
        (a.src = t),
        typeof a.decode == "function" && a.decode().then(r).catch(r));
    }),
  A = async (t, e) => {
    if (e.aborted) return;
    if (t.kind === "image") {
      await Y(t.url, t.priority, e);
      return;
    }
    const n = {
      cache: "force-cache",
      credentials: "same-origin",
      priority: t.priority,
      signal: e,
    };
    try {
      const i = await fetch(t.url, n);
      if (!i.ok) return;
      await i.arrayBuffer();
    } catch (i) {
      i.name;
    }
  },
  I = async (t, e, n) => {
    let i = 0;
    const a = Array.from(
      {
        length: Math.min(n, t.length),
      },
      async () => {
        for (; !e.aborted; ) {
          const o = t[i];
          if (((i += 1), !o)) return;
          await A(o, e);
        }
      },
    );
    await Promise.all(a);
  };
function Z() {
  if (typeof window > "u" || typeof document > "u") return;
  const t = new AbortController(),
    e = new AbortController(),
    n = new Set(),
    i = window.location.pathname.replace(/\/$/, "") || "/",
    a = () => {
      (t.abort(), e.abort());
    },
    o = (d) => {
      if (!Q(d)) return;
      const s =
        d.target instanceof Element ? d.target.closest("a[href]") : null;
      if (!s || s.target || s.hasAttribute("download")) return;
      const l = w(s.href);
      !l || l.pathname === window.location.pathname || a();
    },
    r = (d) => {
      if (e.signal.aborted || J()) return;
      const s = w(d ?? "");
      !s ||
        !W(s) ||
        (s.pathname.replace(/\/$/, "") || "/") === i ||
        n.has(s.href) ||
        (n.add(s.href),
        A(
          {
            url: s.href,
            kind: "document",
            priority: "low",
          },
          e.signal,
        ));
    },
    u = (d) => {
      if (!(d.target instanceof Element)) return;
      const s = d.target.closest("a[href], [data-book-url]");
      if (s) {
        if (s instanceof HTMLAnchorElement) {
          if (s.target || s.hasAttribute("download")) return;
          r(s.href);
          return;
        }
        r(s.dataset.bookUrl);
      }
    };
  (window.addEventListener("pagehide", a, {
    once: !0,
  }),
    document.addEventListener("pointerdown", o, !0),
    document.addEventListener("click", o, !0),
    document.addEventListener("pointerover", u, {
      capture: !0,
      passive: !0,
    }),
    document.addEventListener("focusin", u, !0));
  const c = async () => {
    const d = X(),
      s = d.filter((h) => h.ordered),
      l = d.filter((h) => !h.ordered);
    (await I(s, t.signal, 1), await I(l, t.signal, 4), t.signal.aborted);
  };
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        c();
      },
      {
        once: !0,
      },
    );
    return;
  }
  c();
}
N();
Z();
