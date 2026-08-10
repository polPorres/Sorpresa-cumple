document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.querySelector(".screen--intro");
  const inviteScreen = document.querySelector(".screen--invite");
  const openInviteBtn = document.getElementById("openInviteBtn");
  const backBtn = document.getElementById("backBtn");
  const holdFill = document.querySelector(".hold-fill");
  const buttonText = document.querySelector(".button-text");

  const HOLD_DURATION = 1200;
  let holdTimeout = null;
  let progressFrame = null;
  let holdStart = 0;
  let holding = false;
  let completed = false;

  function updateProgress(now) {
    if (!holding) return;

    const elapsed = now - holdStart;
    const progress = Math.min(elapsed / HOLD_DURATION, 1);

    if (holdFill) {
      holdFill.style.width = `${progress * 100}%`;
    }

    if (buttonText) {
      if (progress < 0.35) {
        buttonText.textContent = "Sigue pulsando...";
      } else if (progress < 0.75) {
        buttonText.textContent = "Casi...";
      } else {
        buttonText.textContent = "Abriendo...";
      }
    }

    if (progress < 1) {
      progressFrame = requestAnimationFrame(updateProgress);
    }
  }

  function showInvite() {
    introScreen.classList.add("is-exiting");
    inviteScreen.classList.add("is-entering");
    inviteScreen.classList.add("screen--active");

    setTimeout(() => {
      introScreen.classList.remove("screen--active", "is-exiting");
      inviteScreen.classList.remove("is-entering");
    }, 350);
  }

  function showIntro() {
    inviteScreen.classList.add("is-exiting");
    introScreen.classList.add("is-entering");
    introScreen.classList.add("screen--active");

    setTimeout(() => {
      inviteScreen.classList.remove("screen--active", "is-exiting");
      introScreen.classList.remove("is-entering");
      resetHold();
    }, 350);
  }

  function startHold(event) {
    event.preventDefault();
    if (completed || holding) return;

    holding = true;
    holdStart = performance.now();
    openInviteBtn.classList.add("is-holding");

    progressFrame = requestAnimationFrame(updateProgress);

    holdTimeout = setTimeout(() => {
      completed = true;
      holding = false;
      openInviteBtn.classList.remove("is-holding");
      openInviteBtn.classList.add("is-complete");

      if (holdFill) holdFill.style.width = "100%";
      if (buttonText) buttonText.textContent = "Abriendo...";

      setTimeout(() => {
        openInviteBtn.classList.remove("is-complete");
        showInvite();
      }, 180);
    }, HOLD_DURATION);
  }

  function cancelHold() {
    if (!holding || completed) return;
    clearTimeout(holdTimeout);
    cancelAnimationFrame(progressFrame);
    holding = false;
    resetHoldVisual();
  }

  function resetHoldVisual() {
    if (holdFill) holdFill.style.width = "0%";
    if (buttonText) buttonText.textContent = "Mantén pulsado para ver la sorpresa";
    openInviteBtn.classList.remove("is-holding");
  }

  function resetHold() {
    clearTimeout(holdTimeout);
    cancelAnimationFrame(progressFrame);
    holding = false;
    completed = false;
    resetHoldVisual();
  }

  if (openInviteBtn) {
    openInviteBtn.addEventListener("mousedown", startHold);
    openInviteBtn.addEventListener("mouseup", cancelHold);
    openInviteBtn.addEventListener("mouseleave", cancelHold);

    openInviteBtn.addEventListener("touchstart", startHold, { passive: false });
    openInviteBtn.addEventListener("touchend", cancelHold);
    openInviteBtn.addEventListener("touchcancel", cancelHold);

    openInviteBtn.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", showIntro);
  }
});