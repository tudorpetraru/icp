(() => {
  const GAP = 8;
  let resizeObserver;
  let mutationObserver;
  let cardObserver;
  let observedNavigation;
  let observedCard;

  function syncBubbleCard() {
    const nav = document.getElementById('sitepages');
    const card = document.getElementById('info') || document.querySelector('.ds-info-panel');
    if (!nav || !card) return false;

    const top = Math.ceil(nav.getBoundingClientRect().bottom) + GAP;
    const styles = {
      top: `${top}px`,
      bottom: 'auto',
      'max-height': `calc(100vh - ${top + GAP}px)`,
      'overflow-y': 'auto',
    };
    Object.entries(styles).forEach(([property, value]) => {
      if (card.style.getPropertyValue(property) !== value || card.style.getPropertyPriority(property) !== 'important') {
        card.style.setProperty(property, value, 'important');
      }
    });
    return true;
  }

  function observeNavigation(nav) {
    if (!nav || nav === observedNavigation) return;
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(syncBubbleCard);
    resizeObserver.observe(nav);
    observedNavigation = nav;
  }

  function observeCard(card) {
    if (!card || card === observedCard) return;
    cardObserver?.disconnect();
    cardObserver = new MutationObserver(syncBubbleCard);
    cardObserver.observe(card, { attributes: true, attributeFilter: ['style'] });
    observedCard = card;
  }

  function initialize() {
    const refresh = () => {
      syncBubbleCard();
      observeNavigation(document.getElementById('sitepages'));
      observeCard(document.getElementById('info') || document.querySelector('.ds-info-panel'));
    };
    mutationObserver = new MutationObserver(refresh);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    refresh();
  }

  window.addEventListener('resize', syncBubbleCard, { passive: true });
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initialize, { once: true })
    : initialize();
})();
