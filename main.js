import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x789c91);scene.fog=new THREE.FogExp2(0x789c91,.013);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,180);camera.position.set(24,15,29);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;document.querySelector('#scene').appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,3,0);orbit.enableDamping=true;orbit.minDistance=9;orbit.maxDistance=65;orbit.maxPolarAngle=Math.PI*.49;
scene.add(new THREE.HemisphereLight(0xe4f6ef,0x42563b,2.4));const sun=new THREE.DirectionalLight(0xffe6af,3.5);sun.position.set(-13,25,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
const m=(c,r=.85,metal=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:metal});const grass=m(0x4e743a),deep=m(0x2c5731),earth=m(0x746448),stone=m(0x8c8b78),wood=m(0x9b6940),dark=m(0x292e29),trim=m(0x302f28),solar=m(0x182e48,.25,.5),water=new THREE.MeshPhysicalMaterial({color:0x337f9b,roughness:.16,metalness:.12,transparent:true,opacity:.87}),glass=new THREE.MeshPhysicalMaterial({color:0xa9d9cb,roughness:.09,metalness:.15,transparent:true,opacity:.42,side:THREE.DoubleSide});
function box(w,h,d,x,y,z,mat,parent=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cylinder(r,h,x,y,z,mat,n=20){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
function sphere(r,x,y,z,mat){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),mat);o.position.set(x,y,z);o.castShadow=true;scene.add(o);return o}
box(100,.4,100,0,-.5,0,deep);
// stepped hill behind and around the earth-sheltered entrance
box(42,6,25,0,1,-13,earth);box(42,.55,25,0,4.25,-13,grass);
box(14,3,14,-15,.5,0,earth);box(14,.5,14,-15,2.2,0,grass);
box(13,3,13,15,.5,-1,earth);box(13,.45,13,15,2.2,-1,grass);
for(let i=0;i<7;i++){box(32-i*2,.45,2,0,2.7+i*.27,-1-i*2.3,grass)}
// stone-faced lower level set into the hill
box(12,3.4,8,0,1.7,1.5,stone);box(11.6,3.05,.22,0,1.65,5.62,earth);
box(5.1,2.7,.15,0,1.55,5.76,trim);box(4.4,2.3,.12,0,1.52,5.85,glass);
box(.16,2.3,.15,0,1.52,5.98,trim);box(6,.2,2.5,0,.13,7.1,wood);
// cantilever upper floor
box(17,.4,10,0,3.85,2.4,trim);box(16.6,3.5,9.4,0,5.8,2.4,wood);
box(17,.26,10.8,0,7.7,2.4,trim);
for(let x=-7.5;x<=7.6;x+=2.5){box(.12,3.12,.13,x,5.8,7.19,trim);box(2.35,2.95,.09,x+1.2,5.8,7.23,glass)}
for(let z=-1.7;z<=6.5;z+=2.4){box(.1,3.1,.1,-8.34,5.8,z,trim);box(.1,3.1,.1,8.34,5.8,z,trim)}
box(17,.12,1.9,0,3.75,8.1,wood);for(let x=-8;x<=8;x+=1.5)box(.06,1,.06,x,4.35,8.9,trim);
for(let x of [-5,-2,1,4]){box(1.1,.48,.7,x,4.35,5.6,m(0x695b48));box(.6,.4,.6,x,4.65,5.6,m(0x9d9376))}
// planted roof with solar panels
const roof=new THREE.Group();scene.add(roof);box(18,.32,11.4,0,7.95,2.4,deep,roof);box(17.5,.17,10.9,0,8.2,2.4,grass,roof);
for(let x=-7;x<8;x+=2.45){const panel=box(2.15,.1,3.15,x,8.63,.2,solar,roof);panel.rotation.x=-.22;for(let k=-.7;k<=.7;k+=.7)box(.025,.015,3.05,x+k,8.72,.2,m(0x7198a9),roof).rotation.x=-.22}
for(let i=0;i<45;i++){const x=Math.sin(i*17)*8,z=Math.cos(i*13)*4+2.5;sphere(.15+(i%3)*.06,x,8.43,z,i%5===0?m(0xc5ae59):deep)}
// waterfall and lake at foreground
const lake=new THREE.Mesh(new THREE.CircleGeometry(12,80),water);lake.rotation.x=-Math.PI/2;lake.scale.set(1.6,.75,1);lake.position.set(-5,-.19,17);scene.add(lake);
for(let i=0;i<30;i++){const x=-17+i*.8;const z=8+Math.sin(i*.7)*1.5;sphere(.5+(i%4)*.16,x,.1,z,stone)}
const falls=box(3,3,.15,-10,1.2,8.6,water);falls.rotation.z=-.13;for(let i=0;i<12;i++)box(.05,2.7,.03,-11.2+i*.22,1.3,8.74,m(0xb3d9d7,.2));
for(let i=0;i<12;i++)sphere(.17,-11.3+i*.26,-.04,9.5,m(0xd6f4e9));
// stone staircase up hillside
for(let i=0;i<9;i++)box(2.4,.22,1.25,10, .2+i*.35,7-i*1.25,stone);
// greenhouse
const greenhouse=new THREE.Group();scene.add(greenhouse);box(5,.15,4,13,2.5,5.7,stone,greenhouse);
for(let x of [10.5,13,15.5])for(let z of [3.7,7.7])box(.07,2.4,.07,x,3.8,z,trim,greenhouse);
for(let z of [3.7,7.7])box(5,.1,.1,13,5,z,trim,greenhouse);
box(5,2.4,.08,13,3.8,7.7,glass,greenhouse);box(5,2.4,.08,13,3.8,3.7,glass,greenhouse);box(.08,2.4,4,10.5,3.8,5.7,glass,greenhouse);box(.08,2.4,4,15.5,3.8,5.7,glass,greenhouse);
for(let i=0;i<7;i++)sphere(.4,11+i*.65,2.9,5.8,deep);
// rain tanks and water infrastructure
for(let x of [8,10]){cylinder(.7,2.2,x,1.1,10.7,m(0x526963,.5,.3));cylinder(.75,.12,x,2.24,10.7,trim)}
// wind turbine
cylinder(.13,8,18,7,-7,m(0xc6c7b5,.3,.5));const rotor=new THREE.Group();rotor.position.set(18,11,-7);scene.add(rotor);for(let i=0;i<3;i++){const blade=box(.24,3.7,.5,0,1.65,0,m(0xd3d6c8,.4,.4),rotor);blade.rotation.z=i*Math.PI*2/3;blade.position.set(Math.sin(i*Math.PI*2/3)*1.5,Math.cos(i*Math.PI*2/3)*1.5,0)}sphere(.35,18,11,-7,trim);
// forest, native shrubs, and terraced plantings
function tree(x,z,s=1){const y=z< -1?4.5:0;cylinder(.17*s,2*s,x,y+s,z,wood,8);const crown=new THREE.Mesh(new THREE.ConeGeometry(1.2*s,3.3*s,8),deep);crown.position.set(x,y+3.1*s,z);crown.castShadow=true;scene.add(crown);sphere(.7*s,x-.4*s,y+2.7*s,z+.3*s,grass)}
for(let i=0;i<55;i++){const x=Math.sin(i*3.89)*27,z=-11-Math.abs(Math.cos(i*5.12))*19;if(Math.abs(x)>10||z< -19)tree(x,z,.7+(i%5)*.16)}
for(let i=0;i<100;i++){const x=Math.sin(i*11.13)*24,z=Math.cos(i*9.27)*15;if((Math.abs(x)>9||z>9)&&!(x<0&&z>9))sphere(.2+(i%4)*.12,x,.05,z,i%7===0?m(0xd0aa54):i%5===0?m(0x8ca755):deep)}
const features=[
['Passive design','The earth-sheltered lower floor and deep roof overhangs can moderate temperatures and reduce cooling demand.',[0,2,5]],
['Solar roof','A roof-mounted photovoltaic array produces electricity in sunlight. Storage and demand analysis would determine independence.',[0,8.6,.2]],
['Wind turbine','A compact turbine illustrates supplementary wind generation; real performance depends on local wind and setbacks.',[18,11,-7]],
['Living roof','Vegetation on the roof helps slow runoff, support biodiversity, and add thermal buffering.',[-6,8.4,5]],
['Natural lake','The lake and waterfall form a landscape water feature. Potable water would still need certified treatment.',[-7,0,16]],
['Rainwater tanks','Collected rainwater could be stored for irrigation and other permitted nonpotable uses.',[9,2.3,10.7]],
['Greenhouse & food','A greenhouse and terraced planting beds support local food production.',[13,5,6]],
['Regenerative materials','Timber finishes, reclaimed materials, and lower-impact construction can reduce embodied carbon.',[-7,5,7]],
['Greywater reuse','A separate, properly treated greywater system could reuse sink, shower, and laundry water where regulations allow.',[7,1,10]],
['Lower-level entrance','The main entrance is tucked into the hillside, with a glazed upper living floor above.',[0,1.7,6]]
];
const detail=document.querySelector('#detail'),list=document.querySelector('#features'),markerLayer=document.querySelector('#markers');const markers=[];
features.forEach((f,i)=>{const b=document.createElement('button');b.textContent=f[0];b.onclick=()=>select(i);list.appendChild(b);const marker=document.createElement('button');marker.className='marker';marker.textContent='+';marker.title=f[0];marker.onclick=()=>select(i);markerLayer.appendChild(marker);markers.push({el:marker,pos:new THREE.Vector3(...f[2])})});
function select(i){detail.innerHTML='<strong>'+features[i][0]+'</strong><p>'+features[i][1]+'</p>';[...list.children].forEach((b,j)=>b.classList.toggle('active',j===i))}
document.querySelector('#roof').onclick=e=>{roof.visible=!roof.visible;e.target.textContent=roof.visible?'Hide roof':'Show roof'};
let showMarkers=true;document.querySelector('#labels').onclick=e=>{showMarkers=!showMarkers;e.target.textContent=showMarkers?'Hide markers':'Show markers'};
document.querySelector('#reset').onclick=()=>{camera.position.set(24,15,29);orbit.target.set(0,3,0);orbit.update()};
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
renderer.setAnimationLoop(()=>{rotor.rotation.z+=.003;orbit.update();for(const item of markers){const p=item.pos.clone().project(camera);item.el.style.display=showMarkers&&p.z<1&&p.z>-1?'grid':'none';item.el.style.left=(p.x*.5+.5)*innerWidth+'px';item.el.style.top=(-p.y*.5+.5)*innerHeight+'px'}renderer.render(scene,camera)});
