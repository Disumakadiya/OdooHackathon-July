import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function assetflow_asset_verification() {
  useEffect(() => {
    document.title = 'AssetFlow | Asset Verification';
    const scannerLine = document.querySelector('.scanner-line');
    if (scannerLine) {
      const interval = setInterval(() => {
        scannerLine.style.boxShadow = '0 0 30px rgba(74,102,62,1)';
        setTimeout(() => { scannerLine.style.boxShadow = '0 0 15px rgba(74,102,62,0.8)'; }, 200);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, []);

  const handleVerify = (e) => {
    const btn = e.currentTarget;
    if (btn.innerText.includes('Verify')) {
      btn.classList.replace('bg-primary', 'bg-secondary');
      btn.innerHTML = '<span class="material-symbols-outlined text-sm">check_circle</span><span>Verified</span>';
      btn.disabled = true;
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 md:ml-64 flex flex-col h-screen bg-background overflow-hidden">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm h-16 shrink-0">
          <div className="flex items-center space-x-md">
            <button className="md:hidden p-sm text-primary"><span className="material-symbols-outlined">menu</span></button>
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md font-bold text-primary">Asset Verification</h2>
              <p className="hidden sm:block font-label-sm text-label-sm text-on-surface-variant">Session: HQ-West-Section-A</p>
            </div>
          </div>
          <div className="flex items-center space-x-md">
            <div className="hidden lg:flex items-center bg-surface-container rounded-full px-md py-sm w-64">
              <span className="material-symbols-outlined text-outline text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-label-md font-body-md w-full ml-sm" placeholder="Search asset ID..." type="text" />
            </div>
            <div className="flex space-x-sm">
              <button className="p-sm rounded-full hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined">notifications</span></button>
              <button className="p-sm rounded-full hover:bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined">help</span></button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-md md:px-xl py-lg space-y-xl max-w-max-width mx-auto w-full">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Stats */}
            <div className="lg:col-span-4 space-y-lg order-2 lg:order-1">
              <div className="bg-surface-container-lowest p-lg rounded-xl soft-elevation border border-outline-variant">
                <h3 className="font-headline-md text-headline-md text-primary mb-md">Session Progress</h3>
                <div className="space-y-md">
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-md text-label-md text-on-surface-variant">Verified</span>
                      <span className="font-label-md text-label-md text-primary font-bold">42 / 120</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full transition-all duration-500" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-sm pt-sm">
                    <div className="p-sm bg-surface rounded-lg border border-outline-variant">
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Pending</p>
                      <p className="font-headline-md text-headline-md text-primary">78</p>
                    </div>
                    <div className="p-sm bg-surface rounded-lg border border-outline-variant">
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Flagged</p>
                      <p className="font-headline-md text-headline-md text-error">3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-lg rounded-xl soft-elevation border border-outline-variant">
                <h3 className="font-label-md text-label-md font-bold text-primary uppercase tracking-wider mb-md">Verification History</h3>
                <div className="space-y-md">
                  {[
                    { name: 'MacBook Pro M2', id: 'ASSET-8821', time: '2 mins ago' },
                    { name: 'Aeron Office Chair', id: 'ASSET-4451', time: '8 mins ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-md">
                      <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary">check_circle</span>
                      </div>
                      <div className="flex-1 border-b border-outline-variant pb-sm">
                        <p className="font-label-md text-label-md font-bold">{item.name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">ID: {item.id} • {item.time}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-sm text-primary font-label-md text-label-md hover:underline">View All Session Logs</button>
                </div>
              </div>
            </div>

            {/* Scanner Window */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video soft-elevation group">
                <div className="w-full h-full bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCW-HvcRDrCfDEKLPflJEN9SvNRa-HGD-1IGxLWPOgnS9tlr6KEtshErP3y77dsdL-7pGpYwshdfC-dAEAQhd6fdhvUHRUbUxyi6ihiEmP_qNgs_EtghXBNS4h9PQOR6fkUm1BLWZqkALjgiwYgP0VQW60Z8pAYiQjEryaggXRz8Z_fa5OXntuOJWXVfRMfKC2jsQHWbH-BUF6vHhMidpiN22REQX8LHzbgKJpiSfRQ1LKJepbcVgW58Q')" }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 border-2 border-white/50 rounded-2xl flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                    <div className="w-full h-[2px] bg-secondary shadow-[0_0_15px_rgba(74,102,62,0.8)] absolute top-0 scanner-line"></div>
                    <div className="text-center text-white space-y-md">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 200" }}>qr_code_scanner</span>
                      <p className="font-label-md text-label-md">Align Code Within Frame</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-lg bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                  <div className="space-y-xs">
                    <span className="bg-secondary text-on-secondary px-sm py-1 rounded text-[10px] font-bold uppercase tracking-widest">Live Mode</span>
                    <p className="text-white font-headline-md text-headline-md">Scanning...</p>
                  </div>
                  <div className="flex space-x-md">
                    <button className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all">
                      <span className="material-symbols-outlined">flash_on</span>
                    </button>
                    <button className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all">
                      <span className="material-symbols-outlined">cameraswitch</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Asset List */}
          <section className="space-y-lg pb-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">Pending Assets in Section A</h3>
              <div className="flex items-center space-x-sm">
                <button className="flex items-center space-x-xs px-md py-sm bg-surface-container rounded-lg font-label-md text-label-md hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-sm">filter_list</span><span>Filter</span>
                </button>
                <button className="flex items-center space-x-xs px-md py-sm bg-surface-container rounded-lg font-label-md text-label-md hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-sm">sort</span><span>Sort</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {/* Asset Card 1 */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden soft-elevation flex flex-col group cursor-pointer hover:border-primary/30 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyJQukrPE1wmKNTYSo3M9LZLwX-01DGcg51zF-BcabWs-HCtOV4Hu--qG-YLfNnxJ2MCq3aA9MRDMCjWeMHrNdIf63asIGHC9fY4K4WfFo9TCmZJ8XAgrY8U6wcIrwZFucW8SVl0SxO3mDvZJgHwVhcs6BQbB7ElDXW-QZOEQTbOBAHrG21qYnp2I7PMTkgfytPGWGO8reFviPRtFojlwzxk56LEo8QSRlEUX52ro9cuZ47TEHBZIKHQ" alt="Studio Display" />
                  <div className="absolute top-sm right-sm">
                    <span className="bg-white/90 backdrop-blur px-sm py-1 rounded text-[10px] font-bold text-primary">ELECTRONICS</span>
                  </div>
                </div>
                <div className="p-lg space-y-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-primary">Studio Display 5K</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">ID: ASSET-9901</p>
                    </div>
                    <div className="bg-surface px-sm py-1 rounded border border-outline-variant">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Room 302</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-sm">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-tertiary-fixed flex items-center justify-center"><span className="text-[8px] font-bold">AR</span></div>
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center"><span className="text-[8px] font-bold">+2</span></div>
                    </div>
                    <button onClick={handleVerify} className="flex items-center space-x-xs px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined text-sm">check</span><span>Verify</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Asset Card 2 */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden soft-elevation flex flex-col group cursor-pointer hover:border-primary/30 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRL8y6cLC81P-OXffqI_wx3X2P6hpV7hyXcH-idZck1Z8GRORldm76SW5iOyh_vD0daPVYdnALWELR9gfb02FpTOEUzHd5UlgFk06PknPcE9GaQ7HTyjAmQQH4_9TXSLdd7FEq0573FDo4-e4yjsn_Fl8pyGLajr1nKzKJ1CVPpRo8x-CxKNuOlaT9BULorUWUTiwiwObvhPscY7SHGYHnbPaKFBQdrUfnUfn485VLu0XhZWgDZq2mSw" alt="Ergonomic Chair" />
                  <div className="absolute top-sm right-sm">
                    <span className="bg-white/90 backdrop-blur px-sm py-1 rounded text-[10px] font-bold text-primary">FURNITURE</span>
                  </div>
                </div>
                <div className="p-lg space-y-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-primary">Ergonomic Chair V2</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">ID: ASSET-4452</p>
                    </div>
                    <div className="bg-surface px-sm py-1 rounded border border-outline-variant">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Hallway A</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-sm">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-tertiary-fixed flex items-center justify-center"><span className="text-[8px] font-bold">JL</span></div>
                    </div>
                    <button onClick={handleVerify} className="flex items-center space-x-xs px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined text-sm">check</span><span>Verify</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Asset Card 3 - Flagged */}
              <div className="bg-surface-container-lowest rounded-xl border border-error/30 overflow-hidden soft-elevation flex flex-col group cursor-pointer hover:border-error transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmTduCR5yS3XYZWxHCsqhywN51Ckt2JYYTa3iQnVQVNnyYCZUAFRU97yLsLZ9Cl-RiKhwotxYhO9U97GNOdpoogwoxAjYYAc91jgl1xpsJ6B-6erg-Yy_TvUmBNA-FdCCp2eNjjav-bCkh7rqhRktYlMI7uD2A9HDiYbeV4ugd8SeV55Gq0MDTUKrPJeURHeSRnFEz-vQehoBNiBl1Ht-4UgLX3QUH3KMmfB_wecxWt8YVTC56JG1jTQ" alt="Network Switch" />
                  <div className="absolute top-sm right-sm">
                    <span className="bg-error text-white px-sm py-1 rounded text-[10px] font-bold uppercase tracking-widest">DAMAGED</span>
                  </div>
                </div>
                <div className="p-lg space-y-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-primary">Network Switch S1</h4>
                      <p className="font-label-sm text-label-sm text-error">REPORTED ISSUE</p>
                    </div>
                    <div className="bg-error-container px-sm py-1 rounded border border-error/10">
                      <span className="font-label-sm text-label-sm text-on-error-container">Server Rm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-sm">
                    <span className="font-label-sm text-label-sm text-on-surface-variant italic">Awaiting maintenance...</span>
                    <button className="flex items-center space-x-xs px-md py-sm bg-surface-container text-primary rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-all">
                      <span className="material-symbols-outlined text-sm">edit</span><span>Update</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-lg right-lg z-50">
        <button className="w-16 h-16 bg-primary text-on-primary rounded-full soft-elevation flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
          <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
        </button>
      </div>
    </div>
  );
}
