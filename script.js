document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.querySelector(".screen--intro");
  const inviteScreen = document.querySelector(".screen--invite");
  const openInviteBtn = document.getElementById("openInviteBtn");
  const backBtn = document.getElementById("backBtn");
  const holdFill = document.querySelector(".hold-fill");
  const buttonText = document.querySelector(".button-text");

  const HOLD_DURATION = 1200;
  let holdTimer = null;
  let holdAnimationFrame = null;
  let holdStart = 0;
  let isHolding = false;
  let hasCompleted = false;

  function resetHoldVisuals() {
    if (holdFill) holdFill.style.width = "0%";
    if (buttonText) buttonText.textContent = "Hold to open the invitation";
    openInviteBtn.classList.remove("is-holding");
  }

  function animateHoldProgress(timestamp) {
    if (!isHolding) return;

    const elapsed = timestamp - holdStart;
    const progress = Math.min(elapsed / HOLD_DURATION, 1);

    if (holdFill) {
      holdFill.style.width = `${progress * 100}%`;
    }

    if (buttonText) {
      if (progress < 0.35) buttonText.textContent = "Keep holding...";
      else if (progress < 0.75) buttonText.textContent = "Almost there...";
      else buttonText.textContent = "Opening...";
    }

    if (progress < 1) {
      holdAnimationFrame = requestAnimationFrame(animateHoldProgress);
    }
  }

  function transitionToInvite() {
    introScreen.classList.add("is-exiting");
    inviteScreen.classList.add("is-entering");
    inviteScreen.classList.add("screen--active");

    setTimeout(() => {
      introScreen.classList.remove("screen--active");
      introScreen.classList.remove("is-exiting");
      inviteScreen.classList.remove("is-entering");
    }, 340);
  }

  function transitionToIntro() {
    inviteScreen.classList.add("is-exiting");
    introScreen.classList.add("is-entering");
    introScreen.classList.add("screen--active");

    setTimeout(() => {
      inviteScreen.classList.remove("screen--active");
      inviteScreen.classList.remove("is-exiting");
      introScreen.classList.remove("is-entering");
    }, 340);
  }

  function startHold() {
    if (hasCompleted) return;

    isHolding = true;
    holdStart = performance.now();
    openInviteBtn.classList.add("is-holding");

    holdAnimationFrame = requestAnimationFrame(animateHoldProgress);

    holdTimer = setTimeout(() => {
      hasCompleted = true;
      isHolding = false;

      openInviteBtn.classList.remove("is-holding");
      openInviteBtn.classList.add("is-complete");

      if (holdFill) holdFill.style.width = "100%";
      if (buttonText) buttonText.textContent = "Opening...";

      setTimeout(() => {
        openInviteBtn.classList.remove("is-complete");
        transitionToInvite();
      }, 180);
    }, HOLD_DURATION);
  }

  function cancelHold() {
    if (!isHolding || hasCompleted) return;

    isHolding = false;
    clearTimeout(holdTimer);
    cancelAnimationFrame(holdAnimationFrame);
    resetHoldVisuals();
  }

  function resetAfterBack() {
    hasCompleted = false;
    isHolding = false;
    clearTimeout(holdTimer);
    cancelAnimationFrame(holdAnimationFrame);
    resetHoldVisuals();
  }

  if (openInviteBtn) {
    openInviteBtn.addEventListener("mousedown", startHold);
    openInviteBtn.addEventListener("mouseup", cancelHold);
    openInviteBtn.addEventListener("mouseleave", cancelHold);

    openInviteBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHold();
    }, { passive: false });

    openInviteBtn.addEventListener("touchend", cancelHold);
    openInviteBtn.addEventListener("touchcancel", cancelHold);
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      transitionToIntro();
      setTimeout(resetAfterBack, 360);
    });
  }
});