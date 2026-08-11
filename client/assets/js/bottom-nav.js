// File: client/assets/js/bottom-nav.js
// Centered 7-Item Mobile Bottom Navbar Injector

document.addEventListener('DOMContentLoaded', () => {
  injectBottomNav();
});

function injectBottomNav() {
  const currentPath = window.location.pathname;

  const navItems = [
    { label: 'হোম', icon: '🏠', href: '/client/index.html', key: 'index' },
    { label: 'আমার এলাকা', icon: '📍', href: '/client/my-area.html', key: 'my-area' },
    { label: 'সতর্কতা', icon: '⚠️', href: '/client/alerts.html', key: 'alerts', badge: '২' },
    { label: 'লাইভ টিভি', icon: '🔴', href: '/client/tv.html', key: 'tv', isCenter: true },
    { label: 'দরদাম', icon: '📈', href: '/client/prices.html', key: 'prices' },
    { label: 'সুযোগ', icon: '💼', href: '/client/opportunities.html', key: 'opportunities' },
    { label: 'প্রোফাইল', icon: '👤', href: '/client/profile.html', key: 'profile' },
  ];

  const navContainer = document.createElement('nav');
  navContainer.className = 'fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-1 max-w-md mx-auto sm:max-w-xl md:max-w-2xl';

  let itemsHtml = '<div class="grid grid-cols-7 items-center justify-items-center text-center">';

  navItems.forEach((item) => {
    const isActive = currentPath.includes(item.key) || (item.key === 'index' && (currentPath.endsWith('/') || currentPath.endsWith('index.html')));

    if (item.isCenter) {
      itemsHtml += `
        <a href="${item.href}" className="relative flex flex-col items-center -top-3">
          <div className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 border-2 border-slate-900 transition-transform active:scale-95">
            <span className="text-lg relative">
              ${item.icon}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-400"></span>
              </span>
            </span>
          </div>
          <span className="text-[10px] font-black text-rose-400 mt-0.5 whitespace-nowrap">${item.label}</span>
        </a>
      `;
    } else {
      itemsHtml += `
        <a href="${item.href}" class="flex flex-col items-center justify-center py-1 transition-colors ${isActive ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
          <div class="relative text-base">
            <span>${item.icon}</span>
            ${item.badge ? `<span class="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-black px-1 rounded-full leading-none">${item.badge}</span>` : ''}
          </div>
          <span class="text-[9px] mt-0.5 truncate max-w-[48px]">${item.label}</span>
        </a>
      `;
    }
  });

  itemsHtml += '</div>';
  navContainer.innerHTML = itemsHtml;

  document.body.appendChild(navContainer);
  document.body.classList.add('pb-20');
}
