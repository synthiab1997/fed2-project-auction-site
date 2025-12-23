export function getRemainingTime(endsAt) {
    const end = new Date(endsAt).getTime();
    const now = Date.now();
    const diff = end - now;
  
    if (!endsAt || diff <= 0) {
      return { text: "Ended", status: "ended" };
    }
  
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    let text = "";
  
    if (days > 0) {
      text = `Ends in ${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      text = `Ends in ${hours}h ${minutes % 60}m`;
    } else {
      text = `Ends in ${minutes}m`;
    }
  
    const status = diff < 60 * 60 * 1000 ? "soon" : "normal";
  
    return { text, status };
  }
  
  export function startCountdownUpdater() {
    setInterval(() => {
      document.querySelectorAll("[data-ends-at]").forEach((el) => {
        const endsAt = el.dataset.endsAt;
        const { text, status } = getRemainingTime(endsAt);
  
        el.textContent = text;
        el.classList.remove(
          "countdown-normal",
          "countdown-soon",
          "countdown-ended"
        );
  
        el.classList.add(
          status === "soon"
            ? "countdown-soon"
            : status === "ended"
            ? "countdown-ended"
            : "countdown-normal"
        );
      });
    }, 60000); // every minute
  }
  