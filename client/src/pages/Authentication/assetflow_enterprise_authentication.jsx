import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function assetflow_enterprise_authentication() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const canvasRef = useRef(null);
  const [btnText, setBtnText] = useState('Continue');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isForgotPassword) {
      setBtnText('Sending Link...');
      setTimeout(() => {
        setBtnText('Reset link sent!');
        setTimeout(() => {
          setIsForgotPassword(false);
          setBtnText('Continue');
        }, 2000);
      }, 1000);
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      const isStrongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
      if (!isStrongPassword) {
        setErrorMsg('Password must be at least 8 characters long and contain at least one number and one special character');
        return;
      }
    }

    setBtnText(isLogin ? 'Authenticating...' : 'Registering...');
    
    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name, phone };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setBtnText('Success!');
      if (data.token) {
        login(data.token);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setTimeout(() => setBtnText(isLogin ? 'Continue' : 'Register'), 2000);
      }
    } catch (err) {
      setErrorMsg(err.message);
      setBtnText(isLogin ? 'Continue' : 'Register');
    }
  };

  return (
    <div className="font-body-md text-on-surface bg-background h-screen overflow-hidden flex flex-col">
      <style>{`
        @keyframes subtleFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-subtle-fade-in {
          animation: subtleFadeIn 0.6s ease-out forwards;
        }
      `}</style>
      
      {/* Shader Background */}
      <div className="fixed inset-0 w-full h-full z-0 opacity-40" style={{ display: 'block' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-200">
          <img alt="AssetFlow Logo" className="h-8 w-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLLYUb8W0Iwwp4uNRCrw1PIVggKC3HN7FGIRDaUkCurjTisphZeUevOEGUwve9W-LIQwI-ct-AjjcMdMZpTW6t846LG5NtNzV-VfxxoTjE6izQ_sEKSdF-7Y1OgrqlBxUHH8zbnbTEtyfTe5KP8aDB3-6AXqhumh7HWq3-gpn3F09skTRpuyoW4rbu8ZxGZS2wMkLb4w7Ufu7jLnUDo8SQdROxnqcmoIBenaFUEHO5Gi-x5GwZzmdV8g" />
          <span className="font-display text-xl font-bold text-primary">AssetFlow</span>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          {isLogin && (
            <>
              <button className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-md text-sm hover:bg-surface-container transition-colors shadow-sm">
                Support
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm hover:opacity-90 transition-opacity shadow-sm">
                Security
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row relative z-10 h-screen">
        {/* Left - Visual Hero (Hidden on small screens to save space) */}
        <section className="hidden md:flex w-full md:w-[55%] lg:w-[60%] relative items-center justify-center overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary, #6b4f4f) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          {/* Asset Tracking Radar Animation */}
          <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] rounded-full border border-primary/10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute right-[-5%] top-[25%] w-[450px] h-[450px] rounded-full border border-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
          
          <div className="w-full h-full max-w-4xl flex flex-col items-start justify-center relative px-12 lg:px-20 z-10">
            
            {/* Attractive Marketing Quote */}
            <div className="z-20 max-w-lg text-left animate-subtle-fade-in mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                Next-Gen Workspace
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6 tracking-tight drop-shadow-sm">
                Intelligent Tracking.<br/>Unmatched Clarity.
              </h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed border-l-[3px] border-primary pl-5 opacity-90 backdrop-blur-[2px] bg-background/40 py-3 pr-4 rounded-r-lg">
                Empower your organization with real-time visibility, automated lifecycle management, and military-grade security. 
                Experience a new standard of operational excellence.
              </p>
            </div>

            {/* Floating Cards - Repositioned to avoid overlap */}
            {/* Top Right Card */}
            <div className="absolute top-[15%] right-[5%] glass-card p-5 rounded-xl animate-[bounce_4s_infinite] shadow-lg backdrop-blur-md bg-surface-container/90 border border-outline-variant/30 z-20 hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-2xl">database</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Total Assets</span>
                  <span className="text-2xl font-black text-primary">24,801</span>
                </div>
              </div>
            </div>

            {/* Bottom Left Card - Safely tucked away from text */}
            <div className="absolute bottom-[8%] left-[5%] lg:left-[15%] glass-card p-4 rounded-xl animate-[bounce_5s_infinite_1s] shadow-lg backdrop-blur-md bg-surface-container/90 border border-outline-variant/30 z-20 hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tertiary/10 rounded-full">
                  <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">System Uptime</span>
                  <span className="text-xl font-extrabold text-tertiary">99.9%</span>
                </div>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute bottom-[10%] right-[15%] glass-card p-4 rounded-xl hidden lg:flex items-center gap-4 animate-pulse shadow-lg backdrop-blur-md bg-surface-container/90 border border-outline-variant/30 z-20 hover:scale-105 transition-transform cursor-default">
              <div className="p-2 bg-error/10 rounded-full">
                <span className="material-symbols-outlined text-error text-xl">build</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Active Maintenance</span>
                <span className="text-lg font-extrabold text-on-surface">12 Nodes</span>
              </div>
            </div>

          </div>
        </section>

        {/* Right - Login Form */}
        <section className="w-full md:w-[45%] lg:w-[40%] bg-surface-container-lowest flex flex-col justify-center px-6 md:px-12 z-20 h-screen shadow-[-10px_0_30px_rgba(107,79,79,0.03)] pt-16 md:pt-0">
          <div className="max-w-sm lg:max-w-md w-full mx-auto flex flex-col gap-6 animate-subtle-fade-in">
            <header className="flex flex-col gap-1.5 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-primary transition-all duration-300">
                {isForgotPassword ? 'Reset Password' : (isLogin ? 'Manage your assets.' : 'Join AssetFlow.')}
              </h1>
              <p className="text-sm text-on-surface-variant">
                {isForgotPassword ? 'Enter your email to receive a password reset link.' : (isLogin ? 'Log in to your enterprise workspace.' : 'Create your enterprise-grade workspace.')}
              </p>
            </header>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {!isForgotPassword && (
                <div className="flex justify-center md:justify-start mb-2">
                  <div className="bg-surface-container rounded-lg p-1 flex">
                    <button type="button" onClick={() => { setIsLogin(true); setBtnText('Continue'); setErrorMsg(''); }} className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${isLogin ? 'bg-primary text-on-primary shadow-md transform scale-105' : 'text-on-surface-variant hover:text-on-surface'}`}>Sign In</button>
                    <button type="button" onClick={() => { setIsLogin(false); setBtnText('Register'); setErrorMsg(''); }} className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${!isLogin ? 'bg-primary text-on-primary shadow-md transform scale-105' : 'text-on-surface-variant hover:text-on-surface'}`}>Sign Up</button>
                  </div>
                </div>
              )}
              
              {errorMsg && (
                <div className="bg-error/10 text-error px-4 py-2 rounded-lg text-sm border border-error/20 transition-all">
                  {errorMsg}
                </div>
              )}

              <div className={`flex flex-col gap-3 transition-all duration-500 ease-in-out overflow-hidden ${isForgotPassword ? 'max-h-[80px]' : (isLogin ? 'max-h-[160px]' : 'max-h-[400px]')}`}>
                <div className={`flex flex-col gap-1 transition-all duration-500 ${(isLogin || isForgotPassword) ? 'opacity-0 translate-y-[-10px] hidden' : 'opacity-100 translate-y-0'}`}>
                  <label className="text-xs font-medium text-on-surface ml-1" htmlFor="name">Full Name</label>
                  <div className="relative border border-outline-variant rounded-lg overflow-hidden bg-background">
                    <input value={name} onChange={(e) => setName(e.target.value)} required={!isLogin && !isForgotPassword} className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-secondary text-on-surface placeholder:text-outline-variant text-sm transition-all" id="name" placeholder="John Doe" type="text" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-on-surface ml-1" htmlFor="email">Email</label>
                  <div className="relative border border-outline-variant rounded-lg overflow-hidden bg-background">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-secondary text-on-surface placeholder:text-outline-variant text-sm transition-all" id="email" placeholder="name@company.com" type="email" />
                  </div>
                </div>

                <div className={`flex flex-col gap-1 transition-all duration-500 ${(isLogin || isForgotPassword) ? 'opacity-0 translate-y-[-10px] hidden' : 'opacity-100 translate-y-0'}`}>
                  <label className="text-xs font-medium text-on-surface ml-1" htmlFor="phone">Phone</label>
                  <div className="relative border border-outline-variant rounded-lg overflow-hidden bg-background">
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} required={!isLogin && !isForgotPassword} className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-secondary text-on-surface placeholder:text-outline-variant text-sm transition-all" id="phone" placeholder="+1 (555) 000-0000" type="tel" />
                  </div>
                </div>

                <div className={`flex flex-col gap-1 transition-all duration-500 ${isForgotPassword ? 'opacity-0 translate-y-[10px] hidden' : 'opacity-100 translate-y-0'}`}>
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-medium text-on-surface" htmlFor="password">Password</label>
                    {isLogin && <button type="button" onClick={() => { setIsForgotPassword(true); setBtnText('Send Reset Link'); setErrorMsg(''); }} className="text-[10px] text-secondary hover:underline transition-all">Forgot Password?</button>}
                  </div>
                  <div className="relative border border-outline-variant rounded-lg overflow-hidden bg-background">
                    <input value={password} onChange={(e) => setPassword(e.target.value)} required={!isForgotPassword} className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-secondary text-on-surface placeholder:text-outline-variant text-sm transition-all" id="password" placeholder="••••••••" type="password" />
                  </div>
                </div>

                <div className={`flex flex-col gap-1 transition-all duration-500 ${(isLogin || isForgotPassword) ? 'opacity-0 translate-y-[10px] hidden' : 'opacity-100 translate-y-0'}`}>
                  <label className="text-xs font-medium text-on-surface ml-1" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative border border-outline-variant rounded-lg overflow-hidden bg-background">
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!isLogin && !isForgotPassword} className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-secondary text-on-surface placeholder:text-outline-variant text-sm transition-all" id="confirmPassword" placeholder="••••••••" type="password" />
                  </div>
                </div>
              </div>

              {isLogin && !isForgotPassword && (
                <div className="flex items-center gap-2 mt-1 animate-subtle-fade-in">
                  <input className="w-4 h-4 rounded-[4px] border-outline-variant text-primary focus:ring-secondary transition-all cursor-pointer" id="remember" type="checkbox" />
                  <label className="text-xs text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" htmlFor="remember">Remember me for 30 days</label>
                </div>
              )}
              
              <button type="submit" className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-300 mt-2 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                {btnText}
              </button>

              {isForgotPassword && (
                <button type="button" onClick={() => { setIsForgotPassword(false); setBtnText('Continue'); setErrorMsg(''); }} className="text-xs text-secondary hover:underline mt-2 text-center w-full">
                  Back to Login
                </button>
              )}
            </form>

            {!isForgotPassword && (
              <>
                <div className="flex items-center gap-4 my-1">
                  <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                  <span className="text-[10px] text-outline uppercase tracking-widest font-medium">Enterprise SSO</span>
                  <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                </div>

                <button className="w-full border border-outline-variant py-2 rounded-lg text-sm font-medium text-on-surface-variant flex items-center justify-center gap-2 hover:bg-surface-container hover:text-on-surface transition-all duration-300 active:scale-[0.98]">
                  <span className="material-symbols-outlined text-base">identity_platform</span>
                  Log in with Okta
                </button>
              </>
            )}

            <footer className="flex justify-between items-center pt-4 border-t border-outline-variant/20 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-[11px] font-medium text-on-surface">Secure Login</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                <span className="text-[11px] font-medium text-on-surface">RBAC Controlled</span>
              </div>
            </footer>
          </div>
        </section>
      </main>

      {/* Hidden footer on this layout because we want everything strictly in one viewport without scroll */}
    </div>
  );
}
