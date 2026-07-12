import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function assetflow_enterprise_authentication() {
  const canvasRef = useRef(null);
  const [btnText, setBtnText] = useState('Continue');

  useEffect(() => {
    document.title = 'AssetFlow | Secure Login';
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = v_texCoord;
  float n = sin(uv.x * 3.0 + u_time * 0.2) * cos(uv.y * 2.0 - u_time * 0.15);
  float n2 = sin(uv.y * 4.0 - u_time * 0.1) * cos(uv.x * 2.5 + u_time * 0.25);
  vec3 mocha = vec3(0.42, 0.31, 0.31);
  vec3 sage = vec3(0.55, 0.64, 0.57);
  vec3 paper = vec3(0.96, 0.95, 0.94);
  vec3 color = mix(paper, mocha, (n * 0.5 + 0.5) * 0.1);
  color = mix(color, sage, (n2 * 0.5 + 0.5) * 0.08);
  gl_FragColor = vec4(color, 1.0);
}`;
    const cs = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    let rafId;
    const render = (t) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnText('Authenticating...');
    setTimeout(() => setBtnText('Continue'), 1500);
  };

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex flex-col">
      {/* Shader Background */}
      <div className="fixed inset-0 w-full h-full z-0 opacity-40" style={{ display: 'block' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-max-width mx-auto">
        <div className="flex items-center gap-sm cursor-pointer active:scale-95 transition-transform duration-200">
          <img alt="AssetFlow Logo" className="h-8 w-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLLYUb8W0Iwwp4uNRCrw1PIVggKC3HN7FGIRDaUkCurjTisphZeUevOEGUwve9W-LIQwI-ct-AjjcMdMZpTW6t846LG5NtNzV-VfxxoTjE6izQ_sEKSdF-7Y1OgrqlBxUHH8zbnbTEtyfTe5KP8aDB3-6AXqhumh7HWq3-gpn3F09skTRpuyoW4rbu8ZxGZS2wMkLb4w7Ufu7jLnUDo8SQdROxnqcmoIBenaFUEHO5Gi-x5GwZzmdV8g" />
          <span className="font-display text-headline-md font-bold text-primary">AssetFlow</span>
        </div>
        <div className="hidden md:flex gap-lg items-center">
          <span className="font-label-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">Support</span>
          <span className="font-label-md text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">Security</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row relative z-10 min-h-screen">
        {/* Left - Visual Hero */}
        <section className="w-full md:w-[55%] lg:w-[60%] relative flex items-center justify-center pt-24 pb-12 md:py-0 overflow-hidden">
          <div className="w-full h-full max-w-3xl flex flex-col items-center justify-center relative">
            <div className="w-full h-[400px] md:h-[600px] relative">
              {/* Floating Cards */}
              <div className="absolute top-[10%] left-[5%] glass-card p-lg rounded-xl animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary">database</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant">Total Assets</span>
                    <span className="font-headline-md text-primary">24,801</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[15%] right-[5%] glass-card p-lg rounded-xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-on-surface-variant">System Uptime</span>
                    <span className="font-headline-md text-tertiary">99.9%</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-[50%] left-[10%] glass-card p-md rounded-lg hidden lg:flex items-center gap-sm animate-pulse">
                <span className="material-symbols-outlined text-error">build</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-on-surface-variant">Active Maintenance</span>
                  <span className="font-label-md font-bold text-on-surface">12 Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right - Login Form */}
        <section className="w-full md:w-[45%] lg:w-[40%] bg-surface-container-lowest flex flex-col justify-center px-margin-mobile md:px-xl py-xl md:shadow-[-10px_0_30px_rgba(107,79,79,0.03)]">
          <div className="max-w-md w-full mx-auto flex flex-col gap-xl">
            <header className="flex flex-col gap-sm">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary">Manage your assets with focus and clarity.</h1>
              <p className="font-body-md text-on-surface-variant">The enterprise-grade workspace for professional asset management.</p>
            </header>

            <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface ml-1" htmlFor="email">Email</label>
                <div className="relative focus-ring border border-outline-variant rounded-lg transition-custom overflow-hidden bg-background">
                  <input className="w-full px-lg py-md bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant" id="email" placeholder="name@company.com" type="email" />
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex justify-between items-center ml-1">
                  <label className="font-label-md text-on-surface" htmlFor="password">Password</label>
                  <a className="font-label-md text-secondary hover:underline" href="#">Forgot Password?</a>
                </div>
                <div className="relative focus-ring border border-outline-variant rounded-lg transition-custom overflow-hidden bg-background">
                  <input className="w-full px-lg py-md bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant" id="password" placeholder="••••••••" type="password" />
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <input className="w-5 h-5 rounded-[4px] border-outline-variant text-primary focus:ring-secondary transition-custom" id="remember" type="checkbox" />
                <label className="font-label-md text-on-surface-variant cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
              </div>
              <button type="submit" className="w-full bg-primary text-on-primary py-lg rounded-lg font-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200" style={{ boxShadow: '0 4px 24px rgba(107, 79, 79, 0.08)' }}>
                {btnText}
              </button>
            </form>

            <div className="flex items-center gap-md">
              <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              <span className="font-label-sm text-outline uppercase tracking-widest">Enterprise SSO</span>
              <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
            </div>

            <button className="w-full border border-outline-variant py-lg rounded-lg font-label-md text-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">identity_platform</span>
              Log in with Okta
            </button>

            <footer className="flex flex-col md:flex-row gap-lg justify-between items-start md:items-center pt-xl">
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="font-label-sm text-on-surface">Secure Enterprise Login</span>
                </div>
                <p className="font-label-sm text-outline-variant ml-6">256-bit encryption active</p>
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                  <span className="font-label-sm text-on-surface">RBAC Controlled</span>
                </div>
                <p className="font-label-sm text-outline-variant ml-6">Role-based access monitoring</p>
              </div>
            </footer>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 w-full z-40 flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-lg text-center md:text-left bg-transparent text-on-surface-variant font-body-md text-body-md">
        <div className="font-display text-body-md font-bold text-primary">© 2024 AssetFlow Enterprise. All rights reserved.</div>
        <div className="flex gap-lg mt-md md:mt-0">
          <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">Security Whitepaper</a>
        </div>
      </footer>
    </div>
  );
}
