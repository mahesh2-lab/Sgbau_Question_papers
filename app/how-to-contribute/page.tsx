"use client";
import React, { useEffect, useRef } from "react";


export default function StepsForContribution() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    // Helper functions
    const getEl = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T | null;
    const playPauseBtn = getEl<HTMLButtonElement>("playPauseBtn");
    const bigPlayBtn = getEl<HTMLDivElement>("bigPlayBtn");
    const rewindBtn = getEl<HTMLButtonElement>("rewindBtn");
    const forwardBtn = getEl<HTMLButtonElement>("forwardBtn");
    const seekSlider = getEl<HTMLInputElement>("seekSlider");
    const timeDisplay = getEl<HTMLSpanElement>("timeDisplay");
    const muteBtn = getEl<HTMLButtonElement>("muteBtn");
    const volumeSlider = getEl<HTMLInputElement>("volumeSlider");
    const speedSelect = getEl<HTMLSelectElement>("speedSelect");
    const pipBtn = getEl<HTMLButtonElement>("pipBtn");
    const fsBtn = getEl<HTMLButtonElement>("fsBtn");

    // Video UI logic
    function formatTime(t: number) {
      if (!isFinite(t)) return "0:00";
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return m + ":" + (s < 10 ? "0" : "") + s;
    }
    function updatePlayUI() {
      if (!playPauseBtn || !bigPlayBtn || !video || !wrapper) return;
      const playing = !video.paused && !video.ended;
      playPauseBtn.textContent = playing ? "⏸" : "▶";
      playPauseBtn.setAttribute(
        "aria-label",
        (playing ? "Pause" : "Play") + " (k)"
      );
      playPauseBtn.setAttribute("aria-pressed", playing.toString());
      wrapper.classList.toggle("paused", !playing);
      bigPlayBtn.textContent = playing ? "⏸" : "▶";
      bigPlayBtn.setAttribute(
        "aria-label",
        playing ? "Pause video" : "Play video"
      );
    }
    function updateTime() {
      if (!seekSlider || !timeDisplay || !video || !video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      seekSlider.value = pct.toString();
      seekSlider.setAttribute("aria-valuenow", pct.toFixed(0));
      timeDisplay.textContent =
        formatTime(video.currentTime) + " / " + formatTime(video.duration);
    }
    function togglePlay() {
      if (!video) return;
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    }
    function seekFromSlider() {
      if (video && video.duration && seekSlider)
        video.currentTime = (Number(seekSlider.value) / 100) * video.duration;
    }
    function step(t: number) {
      if (!video) return;
      video.currentTime = Math.min(
        Math.max(0, video.currentTime + t),
        video.duration || video.currentTime
      );
    }
    function toggleMute() {
      if (!muteBtn || !video) return;
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
      muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
      muteBtn.setAttribute("aria-pressed", video.muted.toString());
    }
    function updateVolume() {
      if (!volumeSlider || !muteBtn || !video) return;
      video.volume = Number(volumeSlider.value);
      if (video.volume === 0) video.muted = true;
      muteBtn.textContent = video.muted || video.volume === 0 ? "🔇" : "🔊";
      muteBtn.setAttribute(
        "aria-label",
        video.muted || video.volume === 0 ? "Unmute" : "Mute"
      );
      muteBtn.setAttribute(
        "aria-pressed",
        (video.muted || video.volume === 0).toString()
      );
    }
    function applySpeed() {
      if (!speedSelect || !video) return;
      video.playbackRate = parseFloat(speedSelect.value) || 1;
    }
    async function togglePiP() {
      if (!("pictureInPictureEnabled" in document) || !pipBtn || !video) return;
      try {
        if ((document as any).pictureInPictureElement) {
          await (document as any).exitPictureInPicture();
        } else {
          await (video as any).requestPictureInPicture();
        }
      } catch (e) {}
    }
    function toggleFullscreen() {
      if (!fsBtn || !wrapper) return;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        wrapper.requestFullscreen().catch(() => {});
      }
    }

    if ("pictureInPictureEnabled" in document && pipBtn) {
      pipBtn.disabled = false;
      pipBtn.setAttribute("aria-disabled", "false");
    }

    // Video events
    const videoEvents = [
      ["loadedmetadata", updateTime],
      ["timeupdate", updateTime],
      ["play", updatePlayUI],
      ["pause", updatePlayUI],
      ["ended", updatePlayUI],
    ] as const;
    videoEvents.forEach(([evt, fn]) => video.addEventListener(evt, fn));

    // Control events
    const onRewind = () => step(-10);
    const onForward = () => step(10);
    const onWrapperClick = (e: Event) => {
      if (e.target === wrapper || e.target === video) {
        togglePlay();
      }
    };
    const onVideoKeydown = (e: KeyboardEvent) => {
      if ([" ", "k"].includes(e.key)) {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowRight") step(5);
      if (e.key === "ArrowLeft") step(-5);
    };

    playPauseBtn?.addEventListener("click", togglePlay);
    bigPlayBtn?.addEventListener("click", togglePlay);
    rewindBtn?.addEventListener("click", onRewind);
    forwardBtn?.addEventListener("click", onForward);
    seekSlider?.addEventListener("input", seekFromSlider);
    muteBtn?.addEventListener("click", toggleMute);
    volumeSlider?.addEventListener("input", updateVolume);
    speedSelect?.addEventListener("change", applySpeed);
    pipBtn?.addEventListener("click", togglePiP);
    fsBtn?.addEventListener("click", toggleFullscreen);
    wrapper.addEventListener("click", onWrapperClick);
    video.addEventListener("keydown", onVideoKeydown);
    updatePlayUI();

    // Steps animation
    const steps = Array.from(
      document.querySelectorAll(".step")
    ) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    steps.forEach((s) => observer.observe(s));

    // Lightbox logic
    const lb = getEl("imageLightbox");
    const lbImg = getEl<HTMLImageElement>("lightboxImg");
    const lbCaption = getEl("lightboxCaption");
    const lbClose = getEl("lightboxClose");
    if (!lb || !lbImg || !lbClose) return;
    let lastFocusedEl: Element | null = null;
    function openLightbox(img: HTMLImageElement | null) {
      if (!img || !lb || !lbImg) return;
      lastFocusedEl = document.activeElement;
      const src = (img.dataset.overlay ||
        img.dataset.full ||
        img.src) as string;
      lbImg.src = src;
      lbImg.alt = img.alt || "";
      if (img.alt && lbCaption) {
        lbCaption.textContent = img.alt;
        lbCaption.removeAttribute("hidden");
      } else {
        lbCaption?.setAttribute("hidden", "");
      }
      lb.classList.add("active");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => (lbClose as HTMLElement).focus());
    }
    function closeLightbox() {
      if (!lb) return;
      lb.classList.remove("active");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(() => {
        if (lbImg) lbImg.src = "";
      }, 250);
      if (lastFocusedEl instanceof HTMLElement) lastFocusedEl.focus();
    }

    // Image and step handlers
    const imageNodes = Array.from(
      document.querySelectorAll(".step-image")
    ) as HTMLImageElement[];
    const imageHandlers: {
      el: HTMLImageElement;
      click: (e: Event) => void;
      key: (e: KeyboardEvent) => void;
    }[] = [];
    imageNodes.forEach((img) => {
      const onClick = (e: Event) => {
        e.stopPropagation();
        openLightbox(img);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(img);
        }
      };
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Open larger view");
      img.style.cursor = "zoom-in";
      img.tabIndex = 0;
      img.addEventListener("click", onClick);
      img.addEventListener("keydown", onKey);
      imageHandlers.push({ el: img, click: onClick, key: onKey });
    });

    const stepHandlers: {
      el: HTMLElement;
      click: (e: Event) => void;
      key: (e: KeyboardEvent) => void;
    }[] = [];
    steps.forEach((step) => {
      const onClick = (e: Event) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        openLightbox(step.querySelector(".step-image"));
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(step.querySelector(".step-image"));
        }
      };
      step.setAttribute("role", "button");
      step.setAttribute("aria-label", "View step image larger");
      if (!step.hasAttribute("tabindex")) step.tabIndex = 0;
      step.addEventListener("click", onClick);
      step.addEventListener("keydown", onKey);
      stepHandlers.push({ el: step, click: onClick, key: onKey });
    });

    // Lightbox events
    const onLbClick = (e: Event) => {
      if (e.target === lb) closeLightbox();
    };
    const onLbCloseClick = () => closeLightbox();
    lb.addEventListener("click", onLbClick);
    lbClose.addEventListener("click", onLbCloseClick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lb.classList.contains("active")) closeLightbox();
      }
    };
    document.addEventListener("keydown", onKey);
    const enforceFocus = (e: FocusEvent) => {
      if (lb.classList.contains("active") && !lb.contains(e.target as Node)) {
        e.stopPropagation();
        (lbClose as HTMLElement).focus();
      }
    };
    document.addEventListener("focus", enforceFocus, true);

    // Cleanup
    return () => {
      videoEvents.forEach(([evt, fn]) => video.removeEventListener(evt, fn));
      playPauseBtn?.removeEventListener("click", togglePlay);
      bigPlayBtn?.removeEventListener("click", togglePlay);
      rewindBtn?.removeEventListener("click", onRewind);
      forwardBtn?.removeEventListener("click", onForward);
      seekSlider?.removeEventListener("input", seekFromSlider);
      muteBtn?.removeEventListener("click", toggleMute);
      volumeSlider?.removeEventListener("input", updateVolume);
      speedSelect?.removeEventListener("change", applySpeed);
      pipBtn?.removeEventListener("click", togglePiP);
      fsBtn?.removeEventListener("click", toggleFullscreen);
      wrapper.removeEventListener("click", onWrapperClick);
      video.removeEventListener("keydown", onVideoKeydown);
      observer.disconnect();
      imageHandlers.forEach((h) => {
        h.el.removeEventListener("click", h.click);
        h.el.removeEventListener("keydown", h.key);
      });
      stepHandlers.forEach((h) => {
        h.el.removeEventListener("click", h.click);
        h.el.removeEventListener("keydown", h.key);
      });
      lb.removeEventListener("click", onLbClick);
      lbClose.removeEventListener("click", onLbCloseClick);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focus", enforceFocus, true);
    };
  }, []);

  return (
    <div className="contribution-page relative min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_#1a0d2e_0%,_#16213e_50%,_#0f172a_100%)] font-sans text-slate-200 px-2 py-4 md:px-6 md:py-8">
      <div
        className="background-pattern pointer-events-none fixed inset-0 opacity-[0.03] [background:url(data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='%23ffffff'%20fill-opacity='0.1'%3E%3Ccircle%20cx='30'%20cy='30'%20r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)_repeat]"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto w-full max-w-[1100px] px-0 sm:px-2 md:px-4">
        <div className="header relative mb-6 md:mb-8 text-center">
          <div
            className="rocket mb-3 md:mb-5 inline-block text-5xl md:text-6xl drop-shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-[float_3s_ease-in-out_infinite]"
            aria-hidden="true"
          >
            🚀
          </div>
          <h1 className="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent text-[clamp(2rem,6vw,3rem)] font-extrabold mb-2 md:mb-3 drop-shadow-[0_0_40px_rgba(236,72,153,0.3)]">
            How to Contribute
          </h1>
          <p className="mx-auto max-w-[650px] text-[0.98rem] md:text-[1.05rem] leading-relaxed text-slate-400 px-2 md:px-0">
            Follow these optimized steps to set up the PDF Code Retriever
            extension and start contributing to the project.
          </p>
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.25)_0%,transparent_70%)] blur-[50px]" />
        </div>
        {/* Video Wrapper */}
        <div
          ref={wrapperRef}
          className="simple-video-wrapper paused mx-auto mb-7 md:mb-10 w-full max-w-[900px] overflow-hidden rounded-[18px] md:rounded-[26px] border border-violet-400/40 bg-slate-900/75 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md"
          aria-label="Contribution walkthrough video"
        >
          <h2 className="mx-4 md:mx-6 mt-4 md:mt-5 mb-1 bg-gradient-to-br from-pink-300 to-violet-300 bg-clip-text text-[1.1rem] md:text-[1.4rem] font-semibold text-transparent">
            Quick Walkthrough Video
          </h2>
          <p className="mx-4 md:mx-6 mb-3 md:mb-4 text-xs md:text-sm text-slate-400">
            Watch this short video showing the contribution flow. Press play if
            it doesn’t start automatically.
          </p>
          <div className="video-frame relative w-full bg-black">
            <div className="pt-[56.25%]" />
            <video
              id="walkthroughVideo"
              ref={videoRef}
              preload="metadata"
              tabIndex={0}
              aria-describedby="videoShortcuts"
              className="absolute inset-0 h-full w-full bg-black object-cover"
              style={{ borderRadius: "16px" }}
            >
              <source src="/VID/Z.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="play-overlay pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="play-overlay__btn flex h-14 w-14 md:h-20 md:w-20 scale-90 items-center justify-center rounded-full border-2 border-violet-500/55 bg-black/60 text-3xl md:text-4xl text-white opacity-0 backdrop-blur-sm transition duration-300"
                id="bigPlayBtn"
                aria-label="Play video"
              >
                ▶
              </div>
            </div>
          </div>
        </div>
        {/* OR separator */}
        <div
          className="or-separator relative mx-auto mb-6 md:mb-8 flex h-10 md:h-12 w-full max-w-[900px] items-center justify-center"
          role="separator"
          aria-label="or"
        >
          <span className="relative z-10 rounded-full border border-violet-500/50 bg-gradient-to-br from-slate-800/85 to-slate-900/85 px-4 md:px-6 py-1.5 md:py-2 text-[0.8rem] md:text-[0.85rem] font-bold tracking-[0.28em] md:tracking-[0.35em] shadow-[0_4px_16px_-6px_rgba(0,0,0,0.6),0_0_0_2px_rgba(236,72,153,0.15)]">
            OR
          </span>
          <div className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-pink-500/0" />
        </div>
        <div className="steps-section-title mb-4 md:mb-5 flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-[0.08em] text-violet-400">
          Steps to Get Started
        </div>
        <div className="steps-grid grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {stepsData.map((step) => (
            <div
              className="step group relative cursor-pointer overflow-hidden rounded-[16px] md:rounded-[22px] border border-slate-600/55 bg-slate-900/70 p-4 md:p-6 opacity-0 backdrop-blur-xl transition duration-500 [animation:slideUp_.55s_ease-out_forwards] [animation-play-state:paused] hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45),0_0_0_1px_rgba(236,72,153,0.18)]"
              data-step={step.num}
              key={step.num}
            >
              <div className="step-header mb-2 md:mb-3 flex items-center">
                <div className="step-number mr-3 md:mr-4 flex h-9 w-9 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 font-bold text-white shadow-[0_4px_18px_rgba(236,72,153,0.28)] text-base md:text-[1.05rem]">
                  {step.num}
                </div>
                <div className="step-title flex flex-1 items-center gap-2 font-bold text-slate-100 text-base md:text-xl">
                  <span className="step-icon text-base md:text-xl drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">
                    {step.icon}
                  </span>
                  {step.title}
                </div>
              </div>
              <div className="step-body flex flex-col md:flex-row items-start gap-3 md:gap-5">
                <div
                  className="step-text step-description text-slate-400 text-[0.95rem] md:text-[0.98rem] leading-relaxed md:ml-0 ml-12 "
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
                <img
                  className="step-image mt-3 md:mt-0 hidden md:block w-32 md:w-44 rounded-xl md:rounded-2xl border border-slate-400/25 bg-slate-900 object-cover shadow-[0_6px_20px_-6px_rgba(0,0,0,0.5)] transition hover:shadow-[0_10px_28px_-4px_rgba(0,0,0,0.55),0_0_0_1px_rgba(236,72,153,0.25)]"
                  src={step.image}
                  data-full={step.image}
                  alt={step.alt}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox */}
      <div
        className="image-lightbox fixed inset-0 z-[3000] hidden items-center justify-center bg-black/75 p-10 backdrop-blur-md opacity-0 transition md:p-12"
        id="imageLightbox"
        aria-modal="true"
        role="dialog"
        aria-hidden="true"
      >
        <button
          className="image-lightbox__close absolute right-6 top-4 flex items-center gap-1 rounded-xl border border-slate-400/40 bg-slate-800/85 px-4 py-2 text-[0.85rem] font-semibold tracking-wide text-slate-200 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-pink-500/55 hover:bg-slate-700/90"
          id="lightboxClose"
          type="button"
          aria-label="Close (Esc)"
        >
          ✕ Close
        </button>
        <img
          id="lightboxImg"
          className="image-lightbox__img max-h-[70vh] max-w-[70vw] rounded-2xl border-2 border-violet-500/40 bg-slate-900 shadow-[0_25px_70px_-12px_rgba(0,0,0,0.7)]"
          alt=""
        />
        <div
          id="lightboxCaption"
          className="image-lightbox__caption absolute bottom-6 left-1/2 max-w-[80ch] -translate-x-1/2 rounded-xl border border-slate-400/25 bg-slate-900/60 px-4 py-2 text-center text-sm text-slate-300 backdrop-blur-md md:text-sm"
          hidden
        />
      </div>
      {/* Accessibility helper */}
      <span className="visually-hidden absolute h-px w-px overflow-hidden" />
      {/* Minimal custom styles not easily replicated with Tailwind */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .paused .play-overlay__btn {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .highlight {
          background: linear-gradient(
            135deg,
            rgba(236, 72, 153, 0.2) 0%,
            rgba(139, 92, 246, 0.2) 100%
          );
          color: #fbbf24;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 600;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .download-btn {
          background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%);
          color: #fff;
          padding: 9px 18px;
          border-radius: 24px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-left: 10px;
          transition: all 0.3s;
          border: 1px solid rgba(220, 38, 38, 0.45);
          font-size: 0.9rem;
          box-shadow: 0 4px 18px rgba(220, 38, 38, 0.32);
        }
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(220, 38, 38, 0.42);
          background: linear-gradient(135deg, #b91c1c 0%, #db2777 100%);
        }
        .step:focus-visible {
          outline: 3px solid #8b5cf6;
          outline-offset: 3px;
        }
        .image-lightbox.active {
          display: flex;
          opacity: 1;
        }
        .image-lightbox__img {
          animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        @keyframes popIn {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rocket {
            animation: none;
          }
        }
        @media (max-width: 768px) {
          .contribution-page {
            padding: 8px 2px;
          }
          .container {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .step {
            padding: 14px 8px;
          }
          .step-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .step-number {
            margin-right: 0;
            margin-bottom: 4px;
          }
          .step-title {
            font-size: 1rem;
          }
          .step-body {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

// Step data separate from component body so it isn't recreated on each render
const stepsData = [
  {
    num: 1,
    icon: "📦",
    title: "Download & Extract",
    description:
      'Download the extension zip file and extract it to your preferred location <a href="https://github.com/mahesh2-lab/test/raw/refs/heads/main/StudyNest.zip" download class="download-btn"><span>📥</span>Download</a>',
    image: "/IMG/1.png",
    alt: "Step 1: Download and extract the extension archive",
  },
  {
    num: 2,
    icon: "🔧",
    title: "Open Extensions Page",
    description:
      'Navigate to <span class="highlight">Chrome → Settings → Extensions</span> or type chrome://extensions/ in the address bar',
    image: "/IMG/2.png",
    alt: "Step 2: Chrome extensions page open (chrome://extensions)",
  },
  {
    num: 3,
    icon: "⚡",
    title: "Enable Developer Mode",
    description:
      'Toggle the <span class="highlight">Developer Mode</span> switch located in the top right corner of the extensions page',
    image: "/IMG/3.png",
    alt: "Step 3: Enable Developer Mode toggle in extensions page",
  },
  {
    num: 4,
    icon: "📁",
    title: "Load Extension",
    description:
      'Click <span class="highlight">Load Unpacked</span> button and select the extracted folder from step 1',
    image: "/IMG/4.png",
    alt: "Step 4: Click Load Unpacked button",
  },
  {
    num: 5,
    icon: "🌐",
    title: "Visit Target Site",
    description:
      'Navigate to the <span class="highlight">Dwivedi site</span> and open any PDF document to begin the extraction process',
    image: "/IMG/5.png",
    alt: "Step 5: Target site with PDF opened",
  },
  {
    num: 6,
    icon: "🔌",
    title: "Activate Extension",
    description:
      'Click the <span class="highlight">PDF Code Retriever</span> extension icon in your browser\'s toolbar',
    image: "/IMG/6.png",
    alt: "Step 6: Click PDF Code Retriever extension icon",
  },
  {
    num: 7,
    icon: "🔐",
    title: "Extract Code",
    description:
      '<span class="highlight">Copy the encrypted code</span> that appears in the extension popup window',
    image: "/IMG/7.png",
    alt: "Step 7: Extension popup displaying encrypted code",
  },
  {
    num: 8,
    icon: "📤",
    title: "Submit Contribution",
    description:
      "Paste the encrypted code on the contribution site along with PDF details to complete your valuable contribution",
    image: "/IMG/8.png",
    alt: "Step 8: Contribution submission form filled with code",
  },
];
