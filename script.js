document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.querySelector(".screen--intro");
  const inviteScreen = document.querySelector(".screen--invite");
  const openInviteBtn = document.getElementById("openInviteBtn");
  const backBtn = document.getElementById("backBtn");

  function showInviteScreen() {
    introScreen.classList.remove("screen--active");
    inviteScreen.classList.add("screen--active");
  }

  function showIntroScreen() {
    inviteScreen.classList.remove("screen--active");
    introScreen.classList.add("screen--active");
  }

  if (openInviteBtn) {
    openInviteBtn.addEventListener("click", showInviteScreen);
  }

  if (backBtn) {
    backBtn.addEventListener("click", showIntroScreen);
  }
});
