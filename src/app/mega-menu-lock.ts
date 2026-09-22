let megaLockCount = 0;

export function acquireMegaLock() {
  megaLockCount += 1;
  document.body.classList.add("mega-menu-visible");
}

export function releaseMegaLock() {
  megaLockCount = Math.max(0, megaLockCount - 1);
  if (megaLockCount === 0) {
    document.body.classList.remove("mega-menu-visible");
  }
}
