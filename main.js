import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const scene=new THREE.Scene();scene.background=new THREE.Color('#a8bbb1');scene.fog=new THREE.FogExp2('#a8bbb1',.011);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,240);camera.position.set(27,16,31);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.outputColorSpace=THREE.SRGBColorSpace;document.getElementById('scene').appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,4,1);orbit.enableDamping=true;orbit.dampingFactor=.06;orbit.minDistance=7;orbit.maxDistance=75;orbit.maxPolarAngle=Math.PI*.48;
scene.add(new THREE.HemisphereLight(0xd8e8ef,0x33442c,2.0));
const sun=new THREE.DirectionalLight(0xffe1ac,3.3);sun.position.set(-19,28,18);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);sun.shadow.camera.left=-40;sun.shadow.camera.right=40;sun.shadow.camera.top=40;sun.shadow.camera.bottom=-40;sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;scene.add(sun);
const fill=new THREE.DirectionalLight(0x8bb9c1,.75);fill.position.set(18,9,-15);scene.add(fill);
let seed=74119;function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function texture(rgb,variation=45,streak=0){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),data=x.createImageData(256,256);for(let y=0;y<256;y++)for(let i=0;i<256;i++){const p=(y*256+i)*4,n=(random()-.5)*variation+Math.sin(y*.25+Math.sin(i*.03))*streak;for(let k=0;k<3;k++)data.data[p+k]=Math.max(0,Math.min(255,rgb[k]+n));data.data[p+3]=255}x.putImageData(data,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);return t}
function textured(rgb,repeat=[5,5],variation=45,streak=0){const m=mat(0xffffff);m.map=texture(rgb,variation,streak);m.map.repeat.set(...repeat);return m}
const turf=textured([68,101,48],[18,18],70),soil=textured([102,88,66],[12,12],60),rock=textured([123,122,108],[6,5],70),stone=textured([158,151,131],[4,3],55),wood=textured([139,94,56],[5,2],30,18),dark=mat(0x242a25,.37,.35),metal=mat(0x65716a,.32,.7),solar=mat(0x152c45,.16,.67),plant=mat(0x3b6637),leaf2=mat(0x628344),flower=mat(0xe5bc67),glass=new THREE.MeshPhysicalMaterial({color:0xc3e5dc,transparent:true,opacity:.24,metalness:.15,roughness:.055,side:THREE.DoubleSide,depthWrite:false}),water=new THREE.MeshPhysicalMaterial({color:0x367f93,metalness:.18,roughness:.12,transparent:true,opacity:.82,side:THREE.DoubleSide});
function mesh(geo,material,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(w,h,d,x,y,z,m,parent){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent)}
function ball(r,x,y,z,m,detail=1){return mesh(new THREE.IcosahedronGeometry(r,detail),m,x,y,z)}
function cylinder(r,h,x,y,z,m,segments=16){return mesh(new THREE.CylinderGeometry(r,r,h,segments),m,x,y,z)}
function line(a,b,r,m){const dir=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const obj=mesh(new THREE.CylinderGeometry(r,r,dir.length(),8),m,...new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5).toArray());obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return obj}
function terrainHeight(x,z){let y=.05+Math.max(0,(-z-2)*.26);y+=1.4*Math.exp(-Math.pow((x+16)/8,2)-Math.pow((z+1)/7,2));y+=1.5*Math.exp(-Math.pow((x-15)/9,2)-Math.pow((z+3)/9,2));y+=.35*Math.sin(x*.24)*Math.cos(z*.28);return y}
const groundGeo=new THREE.PlaneGeometry(105,100,140,140);groundGeo.rotateX(-Math.PI/2);const a=groundGeo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),z=a.getZ(i);a.setY(i,terrainHeight(x,z)-.35)}groundGeo.computeVertexNormals();mesh(groundGeo,turf);
const lower=box(12.7,3.35,9.2,0,1.55,1.6,rock);box(12.2,3,.22,0,1.55,6.28,stone);
for(let i=0;i<65;i++){const x=-6.1+(i%13)*.98,y=.25+Math.floor(i/13)*.62;box(.88,.55,.06,x,y,6.43,i%3===0?rock:stone)}
box(5.8,2.75,.22,0,1.45,6.5,dark);box(5.42,2.42,.13,0,1.45,6.65,glass);box(.1,2.45,.17,0,1.45,6.74,dark);box(6.8,.18,2.6,0,.05,7.65,wood);
const upper=new THREE.Group();scene.add(upper);
box(18.6,.38,10.6,0,3.56,2.25,dark,upper);
box(17.8,.25,9.7,0,3.84,2.25,wood,upper);
for(const x of [-8.55,8.55])box(.28,3.42,9.4,x,5.52,2.25,stone,upper);
box(17.5,3.15,.2,0,5.48,-2.48,wood,upper);
for(let i=0;i<9;i++){const x=-8.15+i*2.04;box(.095,3.17,.13,x,5.5,7.17,dark,upper);if(i<8)box(1.98,3.12,.07,x+1.02,5.5,7.19,glass,upper)}
for(const x of [-8.85,8.85]){box(.11,3.25,9.6,x,5.5,2.25,glass,upper);for(let z=-2.2;z<7;z+=2.1)box(.1,3.2,.11,x,5.5,z,dark,upper)}
box(18.8,.34,11.2,0,7.35,2.25,dark,upper);
box(18.2,.17,10.7,0,7.61,2.25,turf,upper);
for(let i=0;i<130;i++){const x=(random()-.5)*17,z=(random()-.5)*9.7;const r=.08+random()*.16;ball(r,x,7.83,z,random()>.88?flower:random()>.45?plant:leaf2,0)}
// glazed cantilever terrace and railing
box(19,.19,2.4,0,3.52,8.12,wood,upper);for(let x=-9;x<=9;x+=1.5){box(.055,1,.055,x,4.14,9.25,metal,upper)}box(18,.065,.06,0,4.62,9.25,metal,upper);
for(const x of [-6.4,-3.1,.4,4.1]){box(1.8,.5,.85,x,4.1,5.25,mat(0xb5aa90),upper);box(1.8,.22,.65,x,4.48,5.15,mat(0xc4b8a0),upper)}
for(const x of [-5,0,5]){const light=new THREE.PointLight(0xffb96b,12,11,2);light.position.set(x,6.75,4.5);scene.add(light);box(1.8,.04,.35,x,7.06,4.5,mat(0xffd49b,.35),upper)}
// solar panel frames and individual cells
for(let row=0;row<2;row++)for(let col=0;col<7;col++){const x=-7.6+col*2.42,z=-1.4+row*3.15;const panel=new THREE.Group();panel.position.set(x,8.13,z);panel.rotation.x=-.19;upper.add(panel);box(2.22,.07,2.75,0,0,0,dark,panel);box(2.12,.03,2.63,0,.055,0,solar,panel);for(let j=1;j<5;j++)box(2.1,.012,.012,0,.077,-1.3+j*.52,metal,panel);for(let j=1;j<4;j++)box(.012,.012,2.6,-1.06+j*.53,.077,0,metal,panel)}
// Driveway enters from the high ground behind the house, with a raised access bridge.
// The road climbs along the ridge and meets the upper level through a rear entry.
const asphalt=textured([64,68,65],[4,18],24);
const roadPoints=[
 new THREE.Vector3(27,7.35,-32),
 new THREE.Vector3(23,6.8,-28),
 new THREE.Vector3(18,6.05,-23),
 new THREE.Vector3(12,5.35,-18),
 new THREE.Vector3(7,4.7,-14),
 new THREE.Vector3(3.2,4.05,-9),
 new THREE.Vector3(0,3.89,-3.1)
];
const drivewayCurve=new THREE.CatmullRomCurve3(roadPoints,false,'centripetal');
function stripOnDrive(offsetY,width,material){
 const vertices=[],uv=[],indices=[],total=95;
 for(let i=0;i<=total;i++){
  const t=i/total,p=drivewayCurve.getPoint(t),d=drivewayCurve.getTangent(t).normalize();
  const n=new THREE.Vector3(-d.z,0,d.x);
  for(let side of [-1,1]){
   const v=p.clone().addScaledVector(n,side*width);
   vertices.push(v.x,v.y+offsetY,v.z);uv.push(t*14,(side+1)*.5);
  }
  if(i<total){let j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3)}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 return mesh(geo,material);
}
stripOnDrive(-.19,2.25,stone);stripOnDrive(.035,2.06,asphalt);
for(let i=3;i<89;i+=8){
 const p=drivewayCurve.getPoint(i/95),tan=drivewayCurve.getTangent(i/95),n=new THREE.Vector3(-tan.z,0,tan.x);
 for(let sign of [-1,1]){
  const edge=p.clone().addScaledVector(n,sign*2.25);
  // Lightweight retaining piers visually support the elevated driveway.
  const below=Math.max(0,p.y-terrainHeight(edge.x,edge.z));
  if(below>.8)box(.33,below,.33,edge.x,p.y-below/2-.12,edge.z,stone);
  box(.2,.65,.2,edge.x,p.y+.34,edge.z,stone);
 }
}
// Vehicle-scale hints on the driveway: two thin edge guide lines.
for(let i=0;i<70;i++){
 const t=(i+.5)/92,p=drivewayCurve.getPoint(t),tan=drivewayCurve.getTangent(t).normalize();
 const dash=box(.06,.015,.38,p.x,p.y+.055,p.z,mat(0xe1d7a2,.75));
 dash.rotation.y=Math.atan2(tan.x,tan.z);
}
// Rear upper-level doorway and threshold at the driveway arrival.
box(3.3,2.85,.16,0,5.37,-2.64,dark);
box(2.95,2.53,.09,0,5.32,-2.76,glass);
box(.09,2.53,.12,0,5.32,-2.83,metal);
box(3.9,.16,1.55,0,3.82,-3.35,stone);

// rough stone retaining walls
for(let i=0;i<135;i++){const x=-18+(i%27)*1.4,z=9+Math.floor(i/27)*.8;const y=terrainHeight(x,z)+.03;const b=box(1.2,.35,.75,x,y,z,i%3===0?rock:stone);b.rotation.y=(random()-.5)*.3}
// Meandering river following the foot of the hillside, replacing the former lake.
const riverPath=new THREE.CatmullRomCurve3([
 new THREE.Vector3(-48,.09,18),new THREE.Vector3(-29,.09,16),
 new THREE.Vector3(-18,.09,13.3),new THREE.Vector3(-10,.09,14.4),
 new THREE.Vector3(-1,.09,18),new THREE.Vector3(10,.09,22),
 new THREE.Vector3(22,.09,19.5),new THREE.Vector3(40,.09,22)
],false,'centripetal');
const riverVerts=[],riverUV=[],riverIndices=[],riverBank=[];
const riverSegments=135;
for(let i=0;i<=riverSegments;i++){
 const t=i/riverSegments,p=riverPath.getPoint(t),tan=riverPath.getTangent(t).normalize();
 const side=new THREE.Vector3(-tan.z,0,tan.x),width=3.0+.48*Math.sin(t*Math.PI*5);
 for(const sign of [-1,1]){const edge=p.clone().addScaledVector(side,sign*width);riverVerts.push(edge.x,.12,edge.z);riverUV.push(t*16,(sign+1)*.5)}
 riverBank.push([p.clone(),side.clone(),width]);
 if(i<riverSegments){const j=i*2;riverIndices.push(j,j+2,j+1,j+1,j+2,j+3)}
}
const riverGeo=new THREE.BufferGeometry();riverGeo.setAttribute('position',new THREE.Float32BufferAttribute(riverVerts,3));riverGeo.setAttribute('uv',new THREE.Float32BufferAttribute(riverUV,2));riverGeo.setIndex(riverIndices);riverGeo.computeVertexNormals();mesh(riverGeo,water);
for(let i=4;i<riverSegments-4;i+=2){
 const [p,side,width]=riverBank[i];
 for(const sign of [-1,1])for(let j=0;j<3;j++){
  const x=p.x+side.x*sign*(width+.15+random()*1.4),z=p.z+side.z*sign*(width+.15+random()*1.4);
  const r=.16+random()*.52;
  const b=mesh(new THREE.DodecahedronGeometry(r,1),random()>.45?rock:stone,x,.15,z);
  b.scale.set(1.3,.4,1);b.rotation.y=random()*Math.PI;
 }
}
for(let i=0;i<135;i++){
 const t=.04+random()*.92,p=riverPath.getPoint(t),tan=riverPath.getTangent(t),side=new THREE.Vector3(-tan.z,0,tan.x);
 const sign=random()>.5?1:-1,offset=3.6+random()*3.7;
 ball(.08+random()*.24,p.x+side.x*sign*offset,.13,p.z+side.z*sign*offset,random()>.82?flower:plant,0);
}
// cascades
const waterfallMat=new THREE.MeshPhysicalMaterial({color:0x8bc7d5,transparent:true,opacity:.65,roughness:.08,metalness:.1,side:THREE.DoubleSide});
for(let level=0;level<3;level++){const x=-12-level*2,z=9+level*2.2,y=2.5-level*.85;for(let k=0;k<18;k++){const strand=box(.045+random()*.08,1.9,.035,x+(k-9)*.17,y,z,waterfallMat);strand.rotation.z=(random()-.5)*.18}for(let j=0;j<16;j++)ball(.08+random()*.13,x+(random()-.5)*3,y-.95,z+.25,mat(0xd4e6e2,.15),0)}
// terraces and path stepping into the hill
for(let i=0;i<11;i++){const x=11.5,y=.1+i*.32,z=9-i*1.35;box(2.5,.22,1.1,x,y,z,stone);for(let k=0;k<5;k++)ball(.16+random()*.2,x-2.4+random()*.5,y+.2,z,plant,0)}
// greenhouse: sloping glass gable
box(6,.18,4.8,15,2.2,4.8,stone);
for(let x of [12,14,16,18]){for(let z of [2.4,7.2])box(.065,2.5,.065,x,3.5,z,metal);line([x,4.75,2.4],[x,6,4.8],.055,metal);line([x,6,4.8],[x,4.75,7.2],.055,metal)}
for(let z of [2.4,7.2])box(6,.07,.07,15,4.75,z,metal);
for(let z of [2.4,7.2])box(6,2.5,.05,15,3.5,z,glass);
for(let x of [12,18])box(.05,2.5,4.8,x,3.5,4.8,glass);
for(let z of [3,4.5,6])box(4.6,.35,.55,15,2.55,z,soil);
// water tanks and irrigation piping
for(let x of [8.6,10.6]){cylinder(.75,2.35,x,1.18,12.5,metal,32);cylinder(.79,.09,x,2.38,12.5,dark,32);for(let k=0;k<4;k++)cylinder(.77,.025,x,.4+k*.55,12.5,stone,32)}
line([9.6,.5,12.5],[9.6,.5,15],.055,metal);
// turbine with elegant vertical blades
cylinder(.14,9.2,21,6,-8,metal);const rotor=new THREE.Group();rotor.position.set(21,11,-8);scene.add(rotor);
for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const x=Math.cos(a)*1.2,z=Math.sin(a)*1.2;line([x,-2,z],[x*.7,2,z*.7],.12,metal);line([0,-2,0],[x,-2,z],.06,metal);line([0,2,0],[x*.7,2,z*.7],.06,metal)}
// vegetation: multi-layered trees with varied leaf clusters
function tree(x,z,s){const y=terrainHeight(x,z)-.3;const trunk=cylinder(.14*s,2.4*s,x,y+1.2*s,z,wood,8);trunk.rotation.z=(random()-.5)*.08;for(let i=0;i<6;i++){const a=i*2.399,px=x+Math.cos(a)*.55*s,pz=z+Math.sin(a)*.5*s,py=y+(2.6+random()*.9)*s;const b=ball((.7+random()*.35)*s,px,py,pz,i%3?plant:leaf2,1);b.scale.set(1,.8,1)}}
for(let i=0;i<105;i++){const x=(random()-.5)*82,z=-12-random()*36;if(Math.abs(x)<12&&z>-22)continue;tree(x,z,.75+random()*.8)}
for(let i=0;i<170;i++){const x=(random()-.5)*58,z=-3+random()*20;if(Math.abs(x)<10&&z<11)continue;if(x>-1&&x<20&&z>0&&z<13)continue;const y=terrainHeight(x,z);for(let j=0;j<3;j++)ball(.13+random()*.3,x+(random()-.5)*.5,y,z+(random()-.5)*.5,random()>.92?flower:random()>.5?plant:leaf2,0)}
const features=[
['Glass living level','The long upper floor uses high-performance glazing, shading, and daylighting. Real performance depends on glazing specification and orientation.',[0,5.4,7.3]],
['Earth-sheltered entrance','The lower level is recessed into the hillside. Earth contact can help moderate temperatures when waterproofing and insulation are properly designed.',[0,1.5,6.7]],
['Solar array','The roof carries a modeled photovoltaic array. Net-zero operation requires energy modeling, storage, and real production data.',[-3,8.2,1]],
['Living roof','Vegetation and substrate can slow stormwater runoff, support pollinators, and buffer roof temperatures.',[6,7.9,5]],
['River & cascades','A meandering river replaces the former lake, with rocky edges and a waterfall. River water is not assumed safe for drinking.',[-13,1.2,13]],
['Upper driveway','A winding driveway approaches from the high ground and meets a rear door on the glass-walled upper floor.',[3.2,4.3,-9]],
['Rainwater harvesting','Storage tanks can supply treated nonpotable water for landscape irrigation, subject to local requirements.',[9.6,2.3,12.5]],
['Greenhouse & food','A glazed greenhouse and terraced growing areas provide space for food cultivation.',[15,5.7,5]],
['Wind turbine','A vertical-axis turbine illustrates additional renewable generation; feasibility depends on wind resource and siting.',[21,11,-8]],
['Low-impact materials','Wood finishes and stone construction suggest natural materials; real embodied-carbon performance requires product-specific life-cycle data.',[-7,5,7]],
['Water reuse','Greywater recycling and filtration would require separate treatment, plumbing, maintenance, and code review.',[11,.5,15]]
];
const layer=document.getElementById('markers'),featuresEl=document.getElementById('features'),detail=document.getElementById('detail');const markers=[];
features.forEach((f,i)=>{const b=document.createElement('button');b.textContent=f[0];b.onclick=()=>select(i);featuresEl.appendChild(b);const marker=document.createElement('button');marker.className='marker';marker.textContent='+';marker.title=f[0];marker.onclick=()=>select(i);layer.appendChild(marker);markers.push({el:marker,pos:new THREE.Vector3(...f[2])})});
function select(i){detail.innerHTML='<strong>'+features[i][0]+'</strong><p>'+features[i][1]+'</p>';[...featuresEl.children].forEach((b,j)=>b.classList.toggle('selected',i===j))}
const views={overview:[[27,16,31],[0,4,1]],water:[[-15,8,32],[-7,2,13]],roof:[[14,25,17],[0,7,1]],driveway:[[22,12,-23],[5,4.5,-10]],inside:[[5,6,13],[0,5,2]]};
function go(name){const v=views[name];camera.position.set(...v[0]);orbit.target.set(...v[1]);orbit.update();document.querySelectorAll('.toolbar button').forEach(b=>b.classList.toggle('selected',b.id===name||(name==='roof'&&b.id==='roofview')))}
for(const name of Object.keys(views)){const button=document.getElementById(name==='roof'?'roofview':name);if(button)button.onclick=()=>go(name)}
document.getElementById('reset').onclick=()=>go('overview');
document.getElementById('roofToggle').onclick=e=>{upper.visible=true;const show=upper.children.filter(c=>c.position.y>7.2);const visible=!show[0].visible;show.forEach(o=>o.visible=visible);e.target.textContent=visible?'Hide roof':'Show roof'};
document.getElementById('togglePanel').onclick=e=>{const body=document.getElementById('panelBody');body.hidden=!body.hidden;e.target.textContent=body.hidden?'+':'−'};
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{const t=clock.getElapsedTime();rotor.rotation.y=t*.18;orbit.update();for(const marker of markers){const p=marker.pos.clone().project(camera);marker.el.style.display=p.z<1&&p.z>-1?'block':'none';marker.el.style.left=(p.x*.5+.5)*innerWidth+'px';marker.el.style.top=(-p.y*.5+.5)*innerHeight+'px'}renderer.render(scene,camera)});
requestAnimationFrame(()=>document.getElementById('loading').classList.add('hidden'));
