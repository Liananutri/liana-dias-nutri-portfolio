import numpy as np, wave
SR=44100; D=36.4; L=int(SR*D)
mus=np.zeros(L); fx=np.zeros(L); rng=np.random.default_rng(1)
def add(buf,sig,t):
    i=int(t*SR); n=min(len(sig),L-i); buf[i:i+n]+=sig[:n]
def T(d): return np.arange(int(SR*d))/SR
def env(t,a=.005,dec=8): return np.minimum(1,t/a)*np.exp(-t*dec)
def sweep(f0,f1,d,amp,dec=6,wave_='sin',curve=1):
    t=T(d); f=f0+(f1-f0)*(t/d)**curve; ph=2*np.pi*np.cumsum(f)/SR
    s=np.sin(ph) if wave_=='sin' else (2*((ph/(2*np.pi))%1)-1 if wave_=='saw' else np.sign(np.sin(ph)))
    return amp*s*env(t,.005,dec)
def noise(d,amp,dec=10,smooth=1):
    s=rng.standard_normal(int(SR*d)); 
    if smooth>1: s=np.convolve(s,np.ones(smooth)/smooth,'same')
    return amp*s*env(T(d),.003,dec)
def tone(f,d,amp,dec=4,harm=(1,.4,.15)):
    t=T(d); s=sum(h*np.sin(2*np.pi*f*(k+1)*t) for k,h in enumerate(harm)); return amp*s*env(t,.004,dec)
# ---------- music (Jingle Bells, public domain) ----------
N={'C':523.25,'D':587.33,'E':659.26,'F':698.46,'G':783.99}
mel=("E1 E1 E2 E1 E1 E2 E1 G1 C1.5 D.5 E4 F1 F1 F1.5 F.5 F1 E1 E1 E.5 E.5 E1 D1 D1 E1 D2 G2 "
     "E1 E1 E2 E1 E1 E2 E1 G1 C1.5 D.5 E4 F1 F1 F1 F1 F1 E1 E1 E.5 E.5 G1 G1 F1 D1 C4").split()
beat=34.6/64; t=0.8
for m in mel:
    d=float(m[1:]); add(mus,tone(N[m[0]],max(d*beat,.6),.22,3.2),t); t+=d*beat
B={'C':130.81,'F':174.61,'G':196.0,'D':146.83}
for i,c in enumerate("C C C C F C D G C C C C F C G C".split()):
    for k in (0,2): add(mus,tone(B[c],beat*2,.2,2.5,(1,.3)),0.8+(i*4+k)*beat)
for k in range(128):
    s=np.diff(noise(.07,.05,50),prepend=0); add(mus,s,0.8+k*beat/2)
# ---------- SFX ----------
def pop(t,a=.35): add(fx,sweep(350,1300,.12,a,20),t)
def whoosh(t,a=.25,d=.4):
    s=rng.standard_normal(int(SR*d)); out=np.zeros_like(s); y=0
    cut=np.linspace(.02,.25,len(s))**1.0
    for i in range(len(s)): y+= cut[i]*(s[i]-y); out[i]=y
    add(fx,a*3*out*np.sin(np.linspace(0,np.pi,len(s)))**2,t)
def ding(t,f=1568,a=.3): add(fx,tone(f,1.2,a,3,(1,.5,.25,.1)),t)
def boing(t,a=.35):
    tt=T(.5); f=220+120*np.sin(2*np.pi*14*tt)*np.exp(-tt*5)+tt*200; add(fx,a*np.sin(2*np.pi*np.cumsum(f)/SR)*env(tt,.003,5),t)
def thud(t,a=.7): add(fx,sweep(160,45,.35,a,9),t); add(fx,noise(.08,.25,40,4),t)
# 1 envelope drop + open
whoosh(0.35,.3); thud(1.1,.4); add(fx,noise(.35,.18,9,6),1.75); ding(1.85,1318,.25)
pop(0.15)
# 2 halo angelic chord
for f in (523.25,659.26,783.99,1046.5): add(fx,tone(f,2.0,.09,1.2,(1,.2)),3.9)
pop(3.8); whoosh(4.95,.25)
# scroll unrolling: long ratchet
for k in range(26): add(fx,noise(.025,.22,120,2),5.5+k*.05)
# "pequena" record scratch
add(fx,sweep(900,250,.18,.22,4,'saw'),6.1); add(fx,sweep(250,700,.15,.18,4,'saw'),6.28)
# items
it0=7.0; dur=2.2
for i in range(10):
    t0=it0+i*dur; whoosh(t0-.05,.28,.35); pop(t0+.3,.3); pop(t0+.38,.2)
# 1 old car: horn + engine sputter
t0=it0+0*dur+.6
for k in range(2): add(fx,sweep(415,405,.22,.18,3,'sqr')+sweep(523,515,.22,.12,3,'sqr'),t0+k*.3)
for k in range(7): add(fx,sweep(70,40,.09,.5,20,'sqr')*.5+noise(.09,.15,25,6),t0+.7+k*.11+(.05 if k%3==2 else 0))
# 2 GPS beeps
t0=it0+1*dur+.6
for k in range(3): add(fx,tone(1760,.12,.22,25,(1,)),t0+k*.18)
ding(t0+.62,2093,.22)
# 3 sock squeak + bubble pop
t0=it0+2*dur+.6
add(fx,sweep(1200,2000,.15,.15,8,'sqr'),t0); add(fx,sweep(1800,1100,.15,.12,8,'sqr'),t0+.18)
add(fx,sweep(600,1800,.06,.35,40),t0+.55)
for k in range(6): add(fx,tone(1318*(2**(k*2/12)),.35,.09,9,(1,)),11.8+k*.05)
# 4 water bloops
t0=it0+3*dur+.5
for k,f in enumerate([400,520,350,600]): add(fx,sweep(f,f*2.4,.12,.3,18),t0+k*.28)
# 5 music riff
t0=it0+4*dur+.5
for k,f in enumerate([523,659,784,1047,784,1047]): add(fx,tone(f,.2,.18,12,(1,.5,.3)),t0+k*.11)
# oculos: cool shine
t0=it0+5*dur+.55
add(fx,sweep(1200,3200,.25,.14,6),t0); 
for k in range(5): add(fx,tone(2093*(2**(k*4/12)),.3,.07,10,(1,)),t0+.2+k*.04)
# bermuda: velcro rip + keys jingle
t0=it0+6*dur+.55
s_=rng.standard_normal(int(SR*.35))*(np.sin(2*np.pi*90*T(.35))>0)*np.exp(-T(.35)*3); add(fx,.25*s_,t0)
for k in range(6): add(fx,tone(3000+rng.random()*1500,.12,.08,30,(1,.5)),t0+.5+k*.06)
# 6 fanfare + medal ding
t0=it0+7*dur+.5
for k,f in enumerate([523,659,784]): add(fx,sweep(f,f,.18,.18,6,'saw')*.7,t0+k*.15)
add(fx,sweep(1047,1047,.6,.2,3,'saw')*.7,t0+.45); ding(t0+.5,2349,.25)
# 7 creaky legs
t0=it0+8*dur+.6
for k in range(2):
    tt=T(.45); f=90+40*np.sin(2*np.pi*3*tt); ph=2*np.pi*np.cumsum(f)/SR
    s=np.sign(np.sin(ph))*(np.sin(2*np.pi*np.cumsum(f*9)/SR)>0.6); add(fx,.18*s*np.minimum(1,tt*30)*np.exp(-tt*2),t0+k*.6)
# 8 slide whistle down + boing
t0=it0+9*dur+.5
tt=T(1.2); f=2000*np.exp(-tt*1.6)+300; add(fx,.22*np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,tt*40)*np.minimum(1,(1.2-tt)*10),t0)
boing(t0+1.25,.3)
# s4 cookies
pop(29.2); whoosh(29.45,.25); thud(30.0,.3)
thud(30.4,.8)                       # stamp
add(fx,sweep(1200,500,.2,.12,10,'sqr'),30.4)
for k in range(3): add(fx,noise(.06,.35,30,3),31.7+k*.09)   # bite crunch
pop(31.2,.3)
# s5 signature: pen scribble + sparkle + ta-da
whoosh(32.65,.25)
for k in range(14): add(fx,noise(.07,.12,25,1),33.3+k*.085)
for k in range(10): add(fx,tone(1568*(2**(k/12)),.4,.08,8,(1,)),34.4+k*.05)
for f in (523.25,659.26,783.99,1046.5): add(fx,tone(f,1.6,.12,1.8),34.6)
pop(34.6,.25)
# run footsteps (soft) during list
for k in range(int((28.9-7.3)/.25)): add(fx,noise(.04,.07,80,8),7.3+k*.25)
# ---------- mix: duck music under fx ----------
envfx=np.convolve(np.abs(fx),np.ones(2205)/2205,'same'); duck=1/(1+envfx*6)
mix=mus*0.55*duck+fx
mix=np.tanh(mix*1.2)
mix=mix/np.max(np.abs(mix))*.89
fade=int(SR*1.0); mix[-fade:]*=np.linspace(1,0,fade)
w=wave.open('audio.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close(); print('ok')
