var Rl=Object.defineProperty;var Pl=(s,t,e)=>t in s?Rl(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var I=(s,t,e)=>Pl(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ra="166",Ll=0,ho=1,Dl=2,Il=0,Mc=1,Vr=2,hn=3,Tn=0,Ce=1,Xe=2,wn=0,_i=1,uo=2,fo=3,po=4,Ul=5,Fn=100,Nl=101,Ol=102,zl=103,Fl=104,Bl=200,kl=201,Vl=202,Hl=203,Hr=204,Gr=205,Gl=206,Wl=207,Xl=208,ql=209,Yl=210,$l=211,Kl=212,Zl=213,Jl=214,jl=0,Ql=1,th=2,Vs=3,eh=4,nh=5,ih=6,sh=7,Sc=0,rh=1,ah=2,En=0,oh=1,ch=2,lh=3,hh=4,uh=5,dh=6,fh=7,wc=300,yi=301,Mi=302,Wr=303,Xr=304,Zs=306,qr=1e3,Vn=1001,Yr=1002,Be=1003,ph=1004,ts=1005,qe=1006,ar=1007,Hn=1008,pn=1009,Ec=1010,bc=1011,Xi=1012,Pa=1013,Gn=1014,un=1015,$i=1016,La=1017,Da=1018,Si=1020,Tc=35902,Ac=1021,Cc=1022,Ke=1023,Rc=1024,Pc=1025,vi=1026,wi=1027,Lc=1028,Ia=1029,Dc=1030,Ua=1031,Na=1033,Ls=33776,Ds=33777,Is=33778,Us=33779,$r=35840,Kr=35841,Zr=35842,Jr=35843,jr=36196,Qr=37492,ta=37496,ea=37808,na=37809,ia=37810,sa=37811,ra=37812,aa=37813,oa=37814,ca=37815,la=37816,ha=37817,ua=37818,da=37819,fa=37820,pa=37821,Ns=36492,ma=36494,ga=36495,Ic=36283,_a=36284,va=36285,xa=36286,mh=3200,gh=3201,Uc=0,_h=1,Sn="",Oe="srgb",Cn="srgb-linear",Oa="display-p3",Js="display-p3-linear",Hs="linear",Qt="srgb",Gs="rec709",Ws="p3",Yn=7680,mo=519,vh=512,xh=513,yh=514,Nc=515,Mh=516,Sh=517,wh=518,Eh=519,ya=35044,go="300 es",dn=2e3,Xs=2001;class bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const Se=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _o=1234567;const ki=Math.PI/180,qi=180/Math.PI;function fn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Se[s&255]+Se[s>>8&255]+Se[s>>16&255]+Se[s>>24&255]+"-"+Se[t&255]+Se[t>>8&255]+"-"+Se[t>>16&15|64]+Se[t>>24&255]+"-"+Se[e&63|128]+Se[e>>8&255]+"-"+Se[e>>16&255]+Se[e>>24&255]+Se[n&255]+Se[n>>8&255]+Se[n>>16&255]+Se[n>>24&255]).toLowerCase()}function _e(s,t,e){return Math.max(t,Math.min(e,s))}function za(s,t){return(s%t+t)%t}function bh(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Th(s,t,e){return s!==t?(e-s)/(t-s):0}function Vi(s,t,e){return(1-e)*s+e*t}function Ah(s,t,e,n){return Vi(s,t,1-Math.exp(-e*n))}function Ch(s,t=1){return t-Math.abs(za(s,t*2)-t)}function Rh(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Ph(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Lh(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Dh(s,t){return s+Math.random()*(t-s)}function Ih(s){return s*(.5-Math.random())}function Uh(s){s!==void 0&&(_o=s);let t=_o+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nh(s){return s*ki}function Oh(s){return s*qi}function zh(s){return(s&s-1)===0&&s!==0}function Fh(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Bh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function kh(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(o*h,c*u,c*d,o*l);break;case"YZY":s.set(c*d,o*h,c*u,o*l);break;case"ZXZ":s.set(c*u,c*d,o*h,o*l);break;case"XZX":s.set(o*h,c*g,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*g,o*l);break;case"ZYZ":s.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ye(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function $t(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Me={DEG2RAD:ki,RAD2DEG:qi,generateUUID:fn,clamp:_e,euclideanModulo:za,mapLinear:bh,inverseLerp:Th,lerp:Vi,damp:Ah,pingpong:Ch,smoothstep:Rh,smootherstep:Ph,randInt:Lh,randFloat:Dh,randFloatSpread:Ih,seededRandom:Uh,degToRad:Nh,radToDeg:Oh,isPowerOfTwo:zh,ceilPowerOfTwo:Fh,floorPowerOfTwo:Bh,setQuaternionFromProperEuler:kh,normalize:$t,denormalize:Ye};class rt{constructor(t=0,e=0){rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class It{constructor(t,e,n,i,r,a,o,c,l){It.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l)}set(t,e,n,i,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],v=i[1],M=i[4],E=i[7],D=i[2],b=i[5],T=i[8];return r[0]=a*_+o*v+c*D,r[3]=a*m+o*M+c*b,r[6]=a*p+o*E+c*T,r[1]=l*_+h*v+u*D,r[4]=l*m+h*M+u*b,r[7]=l*p+h*E+u*T,r[2]=d*_+f*v+g*D,r[5]=d*m+f*M+g*b,r[8]=d*p+f*E+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,g=e*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*l-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=d*_,t[4]=(h*e-i*c)*_,t[5]=(i*r-o*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-i*l,i*c,-i*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(or.makeScale(t,e)),this}rotate(t){return this.premultiply(or.makeRotation(-t)),this}translate(t,e){return this.premultiply(or.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const or=new It;function Oc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function qs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Vh(){const s=qs("canvas");return s.style.display="block",s}const vo={};function Fa(s){s in vo||(vo[s]=!0,console.warn(s))}function Hh(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const xo=new It().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),yo=new It().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),es={[Cn]:{transfer:Hs,primaries:Gs,toReference:s=>s,fromReference:s=>s},[Oe]:{transfer:Qt,primaries:Gs,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Js]:{transfer:Hs,primaries:Ws,toReference:s=>s.applyMatrix3(yo),fromReference:s=>s.applyMatrix3(xo)},[Oa]:{transfer:Qt,primaries:Ws,toReference:s=>s.convertSRGBToLinear().applyMatrix3(yo),fromReference:s=>s.applyMatrix3(xo).convertLinearToSRGB()}},Gh=new Set([Cn,Js]),Kt={enabled:!0,_workingColorSpace:Cn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Gh.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=es[t].toReference,i=es[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return es[s].primaries},getTransfer:function(s){return s===Sn?Hs:es[s].transfer}};function xi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function cr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let $n;class Wh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{$n===void 0&&($n=qs("canvas")),$n.width=t.width,$n.height=t.height;const n=$n.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=$n}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=qs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=xi(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(xi(e[n]/255)*255):e[n]=xi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Xh=0;class zc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xh++}),this.uuid=fn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(lr(i[a].image)):r.push(lr(i[a]))}else r=lr(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function lr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Wh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qh=0;class Ae extends bi{constructor(t=Ae.DEFAULT_IMAGE,e=Ae.DEFAULT_MAPPING,n=Vn,i=Vn,r=qe,a=Hn,o=Ke,c=pn,l=Ae.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=fn(),this.name="",this.source=new zc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==wc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case qr:t.x=t.x-Math.floor(t.x);break;case Vn:t.x=t.x<0?0:1;break;case Yr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case qr:t.y=t.y-Math.floor(t.y);break;case Vn:t.y=t.y<0?0:1;break;case Yr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ae.DEFAULT_IMAGE=null;Ae.DEFAULT_MAPPING=wc;Ae.DEFAULT_ANISOTROPY=1;class fe{constructor(t=0,e=0,n=0,i=1){fe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,E=(f+1)/2,D=(p+1)/2,b=(h+d)/4,T=(u+_)/4,L=(g+m)/4;return M>E&&M>D?M<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(M),i=b/n,r=T/n):E>D?E<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(E),n=b/i,r=L/i):D<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(D),n=T/r,i=L/r),this.set(n,i,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yh extends bi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new fe(0,0,t,e),this.scissorTest=!1,this.viewport=new fe(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ae(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new zc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wn extends Yh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Fc extends Ae{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class $h extends Ae{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Be,this.minFilter=Be,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ki{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==g){let m=1-o;const p=c*d+l*f+h*g+u*_,v=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const D=Math.sqrt(M),b=Math.atan2(D,p*v);m=Math.sin(m*b)/D,o=Math.sin(o*b)/D}const E=o*v;if(c=c*m+d*E,l=l*m+f*E,h=h*m+g*E,u=u*m+_*E,m===1-o){const D=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=D,l*=D,h*=D,u*=D}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(r/2),d=c(n/2),f=c(i/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(_e(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*i-o*n),h=2*(o*e-r*i),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=i+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return hr.copy(this).projectOnVector(t),this.sub(hr)}reflect(t){return this.sub(hr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const hr=new C,Mo=new Ki;class Zi{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ve.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ve.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ve.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ve):Ve.fromBufferAttribute(r,a),Ve.applyMatrix4(t.matrixWorld),this.expandByPoint(Ve);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ns.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ns.copy(n.boundingBox)),ns.applyMatrix4(t.matrixWorld),this.union(ns)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Ve),Ve.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ri),is.subVectors(this.max,Ri),Kn.subVectors(t.a,Ri),Zn.subVectors(t.b,Ri),Jn.subVectors(t.c,Ri),gn.subVectors(Zn,Kn),_n.subVectors(Jn,Zn),Pn.subVectors(Kn,Jn);let e=[0,-gn.z,gn.y,0,-_n.z,_n.y,0,-Pn.z,Pn.y,gn.z,0,-gn.x,_n.z,0,-_n.x,Pn.z,0,-Pn.x,-gn.y,gn.x,0,-_n.y,_n.x,0,-Pn.y,Pn.x,0];return!ur(e,Kn,Zn,Jn,is)||(e=[1,0,0,0,1,0,0,0,1],!ur(e,Kn,Zn,Jn,is))?!1:(ss.crossVectors(gn,_n),e=[ss.x,ss.y,ss.z],ur(e,Kn,Zn,Jn,is))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ve).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ve).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const rn=[new C,new C,new C,new C,new C,new C,new C,new C],Ve=new C,ns=new Zi,Kn=new C,Zn=new C,Jn=new C,gn=new C,_n=new C,Pn=new C,Ri=new C,is=new C,ss=new C,Ln=new C;function ur(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Ln.fromArray(s,r);const o=i.x*Math.abs(Ln.x)+i.y*Math.abs(Ln.y)+i.z*Math.abs(Ln.z),c=t.dot(Ln),l=e.dot(Ln),h=n.dot(Ln);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Kh=new Zi,Pi=new C,dr=new C;class Ba{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Kh.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Pi.subVectors(t,this.center);const e=Pi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Pi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(dr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Pi.copy(t.center).add(dr)),this.expandByPoint(Pi.copy(t.center).sub(dr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const an=new C,fr=new C,rs=new C,vn=new C,pr=new C,as=new C,mr=new C;class Zh{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,an)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=an.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(an.copy(this.origin).addScaledVector(this.direction,e),an.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){fr.copy(t).add(e).multiplyScalar(.5),rs.copy(e).sub(t).normalize(),vn.copy(this.origin).sub(fr);const r=t.distanceTo(e)*.5,a=-this.direction.dot(rs),o=vn.dot(this.direction),c=-vn.dot(rs),l=vn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(fr).addScaledVector(rs,d),f}intersectSphere(t,e){an.subVectors(t.center,this.origin);const n=an.dot(this.direction),i=an.dot(an)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,an)!==null}intersectTriangle(t,e,n,i,r){pr.subVectors(e,t),as.subVectors(n,t),mr.crossVectors(pr,as);let a=this.direction.dot(mr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;vn.subVectors(this.origin,t);const c=o*this.direction.dot(as.crossVectors(vn,as));if(c<0)return null;const l=o*this.direction.dot(pr.cross(vn));if(l<0||c+l>a)return null;const h=-o*vn.dot(mr);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,i,r,a,o,c,l,h,u,d,f,g,_,m){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l,h,u,d,f,g,_,m)}set(t,e,n,i,r,a,o,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/jn.setFromMatrixColumn(t,0).length(),r=1/jn.setFromMatrixColumn(t,1).length(),a=1/jn.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-_*l,e[9]=-o*c,e[2]=_-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d+_*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Jh,t,jh)}lookAt(t,e,n){const i=this.elements;return De.subVectors(t,e),De.lengthSq()===0&&(De.z=1),De.normalize(),xn.crossVectors(n,De),xn.lengthSq()===0&&(Math.abs(n.z)===1?De.x+=1e-4:De.z+=1e-4,De.normalize(),xn.crossVectors(n,De)),xn.normalize(),os.crossVectors(De,xn),i[0]=xn.x,i[4]=os.x,i[8]=De.x,i[1]=xn.y,i[5]=os.y,i[9]=De.y,i[2]=xn.z,i[6]=os.z,i[10]=De.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],M=n[7],E=n[11],D=n[15],b=i[0],T=i[4],L=i[8],w=i[12],y=i[1],P=i[5],V=i[9],B=i[13],W=i[2],Y=i[6],G=i[10],K=i[14],H=i[3],dt=i[7],_t=i[11],vt=i[15];return r[0]=a*b+o*y+c*W+l*H,r[4]=a*T+o*P+c*Y+l*dt,r[8]=a*L+o*V+c*G+l*_t,r[12]=a*w+o*B+c*K+l*vt,r[1]=h*b+u*y+d*W+f*H,r[5]=h*T+u*P+d*Y+f*dt,r[9]=h*L+u*V+d*G+f*_t,r[13]=h*w+u*B+d*K+f*vt,r[2]=g*b+_*y+m*W+p*H,r[6]=g*T+_*P+m*Y+p*dt,r[10]=g*L+_*V+m*G+p*_t,r[14]=g*w+_*B+m*K+p*vt,r[3]=v*b+M*y+E*W+D*H,r[7]=v*T+M*P+E*Y+D*dt,r[11]=v*L+M*V+E*G+D*_t,r[15]=v*w+M*B+E*K+D*vt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*u-i*l*u-r*o*d+n*l*d+i*o*f-n*c*f)+_*(+e*c*f-e*l*d+r*a*d-i*a*f+i*l*h-r*c*h)+m*(+e*l*u-e*o*f-r*a*u+n*a*f+r*o*h-n*l*h)+p*(-i*o*h-e*c*u+e*o*d+i*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=u*m*l-_*d*l+_*c*f-o*m*f-u*c*p+o*d*p,M=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,E=h*_*l-g*u*l+g*o*f-a*_*f-h*o*p+a*u*p,D=g*u*c-h*_*c-g*o*d+a*_*d+h*o*m-a*u*m,b=e*v+n*M+i*E+r*D;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/b;return t[0]=v*T,t[1]=(_*d*r-u*m*r-_*i*f+n*m*f+u*i*p-n*d*p)*T,t[2]=(o*m*r-_*c*r+_*i*l-n*m*l-o*i*p+n*c*p)*T,t[3]=(u*c*r-o*d*r-u*i*l+n*d*l+o*i*f-n*c*f)*T,t[4]=M*T,t[5]=(h*m*r-g*d*r+g*i*f-e*m*f-h*i*p+e*d*p)*T,t[6]=(g*c*r-a*m*r-g*i*l+e*m*l+a*i*p-e*c*p)*T,t[7]=(a*d*r-h*c*r+h*i*l-e*d*l-a*i*f+e*c*f)*T,t[8]=E*T,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*T,t[10]=(a*_*r-g*o*r+g*n*l-e*_*l-a*n*p+e*o*p)*T,t[11]=(h*o*r-a*u*r-h*n*l+e*u*l+a*n*f-e*o*f)*T,t[12]=D*T,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*m+e*u*m)*T,t[14]=(g*o*i-a*_*i-g*n*c+e*_*c+a*n*m-e*o*m)*T,t[15]=(a*u*i-h*o*i+h*n*c-e*u*c-a*n*d+e*o*d)*T,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,v=c*l,M=c*h,E=c*u,D=n.x,b=n.y,T=n.z;return i[0]=(1-(_+p))*D,i[1]=(f+E)*D,i[2]=(g-M)*D,i[3]=0,i[4]=(f-E)*b,i[5]=(1-(d+p))*b,i[6]=(m+v)*b,i[7]=0,i[8]=(g+M)*T,i[9]=(m-v)*T,i[10]=(1-(d+_))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=jn.set(i[0],i[1],i[2]).length();const a=jn.set(i[4],i[5],i[6]).length(),o=jn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],He.copy(this);const l=1/r,h=1/a,u=1/o;return He.elements[0]*=l,He.elements[1]*=l,He.elements[2]*=l,He.elements[4]*=h,He.elements[5]*=h,He.elements[6]*=h,He.elements[8]*=u,He.elements[9]*=u,He.elements[10]*=u,e.setFromRotationMatrix(He),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,r,a,o=dn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i);let f,g;if(o===dn)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Xs)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=dn){const c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(a-r),d=(e+t)*l,f=(n+i)*h;let g,_;if(o===dn)g=(a+r)*u,_=-2*u;else if(o===Xs)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const jn=new C,He=new ne,Jh=new C(0,0,0),jh=new C(1,1,1),xn=new C,os=new C,De=new C,So=new ne,wo=new Ki;class Je{constructor(t=0,e=0,n=0,i=Je.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(_e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-_e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(_e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-_e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(_e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-_e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return So.makeRotationFromQuaternion(t),this.setFromRotationMatrix(So,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wo.setFromEuler(this),this.setFromQuaternion(wo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Je.DEFAULT_ORDER="XYZ";class Bc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Qh=0;const Eo=new C,Qn=new Ki,on=new ne,cs=new C,Li=new C,tu=new C,eu=new Ki,bo=new C(1,0,0),To=new C(0,1,0),Ao=new C(0,0,1),Co={type:"added"},nu={type:"removed"},ti={type:"childadded",child:null},gr={type:"childremoved",child:null};class ve extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qh++}),this.uuid=fn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new C,e=new Je,n=new Ki,i=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ne},normalMatrix:{value:new It}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qn.setFromAxisAngle(t,e),this.quaternion.multiply(Qn),this}rotateOnWorldAxis(t,e){return Qn.setFromAxisAngle(t,e),this.quaternion.premultiply(Qn),this}rotateX(t){return this.rotateOnAxis(bo,t)}rotateY(t){return this.rotateOnAxis(To,t)}rotateZ(t){return this.rotateOnAxis(Ao,t)}translateOnAxis(t,e){return Eo.copy(t).applyQuaternion(this.quaternion),this.position.add(Eo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bo,t)}translateY(t){return this.translateOnAxis(To,t)}translateZ(t){return this.translateOnAxis(Ao,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(on.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?cs.copy(t):cs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Li.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?on.lookAt(Li,cs,this.up):on.lookAt(cs,Li,this.up),this.quaternion.setFromRotationMatrix(on),i&&(on.extractRotation(i.matrixWorld),Qn.setFromRotationMatrix(on),this.quaternion.premultiply(Qn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Co),ti.child=t,this.dispatchEvent(ti),ti.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(nu),gr.child=t,this.dispatchEvent(gr),gr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),on.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),on.multiply(t.parent.matrixWorld)),t.applyMatrix4(on),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Co),ti.child=t,this.dispatchEvent(ti),ti.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,t,tu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,eu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}ve.DEFAULT_UP=new C(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ge=new C,cn=new C,_r=new C,ln=new C,ei=new C,ni=new C,Ro=new C,vr=new C,xr=new C,yr=new C;class $e{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Ge.subVectors(t,e),i.cross(Ge);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Ge.subVectors(i,e),cn.subVectors(n,e),_r.subVectors(t,e);const a=Ge.dot(Ge),o=Ge.dot(cn),c=Ge.dot(_r),l=cn.dot(cn),h=cn.dot(_r),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ln)===null?!1:ln.x>=0&&ln.y>=0&&ln.x+ln.y<=1}static getInterpolation(t,e,n,i,r,a,o,c){return this.getBarycoord(t,e,n,i,ln)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ln.x),c.addScaledVector(a,ln.y),c.addScaledVector(o,ln.z),c)}static isFrontFacing(t,e,n,i){return Ge.subVectors(n,e),cn.subVectors(t,e),Ge.cross(cn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ge.subVectors(this.c,this.b),cn.subVectors(this.a,this.b),Ge.cross(cn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return $e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return $e.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return $e.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return $e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return $e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;ei.subVectors(i,n),ni.subVectors(r,n),vr.subVectors(t,n);const c=ei.dot(vr),l=ni.dot(vr);if(c<=0&&l<=0)return e.copy(n);xr.subVectors(t,i);const h=ei.dot(xr),u=ni.dot(xr);if(h>=0&&u<=h)return e.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(ei,a);yr.subVectors(t,r);const f=ei.dot(yr),g=ni.dot(yr);if(g>=0&&f<=g)return e.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(ni,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Ro.subVectors(r,i),o=(u-h)/(u-h+(f-g)),e.copy(i).addScaledVector(Ro,o);const p=1/(m+_+d);return a=_*p,o=d*p,e.copy(n).addScaledVector(ei,a).addScaledVector(ni,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yn={h:0,s:0,l:0},ls={h:0,s:0,l:0};function Mr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ft{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Kt.workingColorSpace){if(t=za(t,1),e=_e(e,0,1),n=_e(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Mr(a,r,t+1/3),this.g=Mr(a,r,t),this.b=Mr(a,r,t-1/3)}return Kt.toWorkingColorSpace(this,i),this}setStyle(t,e=Oe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Oe){const n=kc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=xi(t.r),this.g=xi(t.g),this.b=xi(t.b),this}copyLinearToSRGB(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Oe){return Kt.fromWorkingColorSpace(we.copy(this),t),Math.round(_e(we.r*255,0,255))*65536+Math.round(_e(we.g*255,0,255))*256+Math.round(_e(we.b*255,0,255))}getHexString(t=Oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.fromWorkingColorSpace(we.copy(this),e);const n=we.r,i=we.g,r=we.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.fromWorkingColorSpace(we.copy(this),e),t.r=we.r,t.g=we.g,t.b=we.b,t}getStyle(t=Oe){Kt.fromWorkingColorSpace(we.copy(this),t);const e=we.r,n=we.g,i=we.b;return t!==Oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(yn),this.setHSL(yn.h+t,yn.s+e,yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(yn),t.getHSL(ls);const n=Vi(yn.h,ls.h,e),i=Vi(yn.s,ls.s,e),r=Vi(yn.l,ls.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const we=new Ft;Ft.NAMES=kc;let iu=0;class Ti extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=fn(),this.name="",this.type="Material",this.blending=_i,this.side=Tn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Hr,this.blendDst=Gr,this.blendEquation=Fn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yn,this.stencilZFail=Yn,this.stencilZPass=Yn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_i&&(n.blending=this.blending),this.side!==Tn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Hr&&(n.blendSrc=this.blendSrc),this.blendDst!==Gr&&(n.blendDst=this.blendDst),this.blendEquation!==Fn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class Ji extends Ti{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.combine=Sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const he=new C,hs=new rt;class Ze{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ya,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Fa("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)hs.fromBufferAttribute(this,e),hs.applyMatrix3(t),this.setXY(e,hs.x,hs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyMatrix3(t),this.setXYZ(e,he.x,he.y,he.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyMatrix4(t),this.setXYZ(e,he.x,he.y,he.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyNormalMatrix(t),this.setXYZ(e,he.x,he.y,he.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.transformDirection(t),this.setXYZ(e,he.x,he.y,he.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ye(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=$t(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ye(e,this.array)),e}setX(t,e){return this.normalized&&(e=$t(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ye(e,this.array)),e}setY(t,e){return this.normalized&&(e=$t(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ye(e,this.array)),e}setZ(t,e){return this.normalized&&(e=$t(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ye(e,this.array)),e}setW(t,e){return this.normalized&&(e=$t(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=$t(e,this.array),n=$t(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=$t(e,this.array),n=$t(n,this.array),i=$t(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=$t(e,this.array),n=$t(n,this.array),i=$t(i,this.array),r=$t(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ya&&(t.usage=this.usage),t}}class Vc extends Ze{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Hc extends Ze{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class te extends Ze{constructor(t,e,n){super(new Float32Array(t),e,n)}}let su=0;const Ne=new ne,Sr=new ve,ii=new C,Ie=new Zi,Di=new Zi,ge=new C;class Re extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=fn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Oc(t)?Hc:Vc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new It().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ne.makeRotationFromQuaternion(t),this.applyMatrix4(Ne),this}rotateX(t){return Ne.makeRotationX(t),this.applyMatrix4(Ne),this}rotateY(t){return Ne.makeRotationY(t),this.applyMatrix4(Ne),this}rotateZ(t){return Ne.makeRotationZ(t),this.applyMatrix4(Ne),this}translate(t,e,n){return Ne.makeTranslation(t,e,n),this.applyMatrix4(Ne),this}scale(t,e,n){return Ne.makeScale(t,e,n),this.applyMatrix4(Ne),this}lookAt(t){return Sr.lookAt(t),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ii).negate(),this.translate(ii.x,ii.y,ii.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new te(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Ie.setFromBufferAttribute(r),this.morphTargetsRelative?(ge.addVectors(this.boundingBox.min,Ie.min),this.boundingBox.expandByPoint(ge),ge.addVectors(this.boundingBox.max,Ie.max),this.boundingBox.expandByPoint(ge)):(this.boundingBox.expandByPoint(Ie.min),this.boundingBox.expandByPoint(Ie.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ba);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Ie.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Di.setFromBufferAttribute(o),this.morphTargetsRelative?(ge.addVectors(Ie.min,Di.min),Ie.expandByPoint(ge),ge.addVectors(Ie.max,Di.max),Ie.expandByPoint(ge)):(Ie.expandByPoint(Di.min),Ie.expandByPoint(Di.max))}Ie.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)ge.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ge));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)ge.fromBufferAttribute(o,l),c&&(ii.fromBufferAttribute(t,l),ge.add(ii)),i=Math.max(i,n.distanceToSquared(ge))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ze(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let L=0;L<n.count;L++)o[L]=new C,c[L]=new C;const l=new C,h=new C,u=new C,d=new rt,f=new rt,g=new rt,_=new C,m=new C;function p(L,w,y){l.fromBufferAttribute(n,L),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,y),d.fromBufferAttribute(r,L),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,y),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(P),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(P),o[L].add(_),o[w].add(_),o[y].add(_),c[L].add(m),c[w].add(m),c[y].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let L=0,w=v.length;L<w;++L){const y=v[L],P=y.start,V=y.count;for(let B=P,W=P+V;B<W;B+=3)p(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const M=new C,E=new C,D=new C,b=new C;function T(L){D.fromBufferAttribute(i,L),b.copy(D);const w=o[L];M.copy(w),M.sub(D.multiplyScalar(D.dot(w))).normalize(),E.crossVectors(b,w);const P=E.dot(c[L])<0?-1:1;a.setXYZW(L,M.x,M.y,M.z,P)}for(let L=0,w=v.length;L<w;++L){const y=v[L],P=y.start,V=y.count;for(let B=P,W=P+V;B<W;B+=3)T(t.getX(B+0)),T(t.getX(B+1)),T(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ze(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new C,r=new C,a=new C,o=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ge.fromBufferAttribute(t,e),ge.normalize(),t.setXYZ(e,ge.x,ge.y,ge.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new Ze(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Re,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Po=new ne,Dn=new Zh,us=new Ba,Lo=new C,si=new C,ri=new C,ai=new C,wr=new C,ds=new C,fs=new rt,ps=new rt,ms=new rt,Do=new C,Io=new C,Uo=new C,gs=new C,_s=new C;class ct extends ve{constructor(t=new Re,e=new Ji){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){ds.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(wr.fromBufferAttribute(u,t),a?ds.addScaledVector(wr,h):ds.addScaledVector(wr.sub(e),h))}e.add(ds)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),us.copy(n.boundingSphere),us.applyMatrix4(r),Dn.copy(t.ray).recast(t.near),!(us.containsPoint(Dn.origin)===!1&&(Dn.intersectSphere(us,Lo)===null||Dn.origin.distanceToSquared(Lo)>(t.far-t.near)**2))&&(Po.copy(r).invert(),Dn.copy(t.ray).applyMatrix4(Po),!(n.boundingBox!==null&&Dn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Dn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let E=v,D=M;E<D;E+=3){const b=o.getX(E),T=o.getX(E+1),L=o.getX(E+2);i=vs(this,p,t,n,l,h,u,b,T,L),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=o.getX(m),M=o.getX(m+1),E=o.getX(m+2);i=vs(this,a,t,n,l,h,u,v,M,E),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),M=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let E=v,D=M;E<D;E+=3){const b=E,T=E+1,L=E+2;i=vs(this,p,t,n,l,h,u,b,T,L),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=m,M=m+1,E=m+2;i=vs(this,a,t,n,l,h,u,v,M,E),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function ru(s,t,e,n,i,r,a,o){let c;if(t.side===Ce?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,t.side===Tn,o),c===null)return null;_s.copy(o),_s.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(_s);return l<e.near||l>e.far?null:{distance:l,point:_s.clone(),object:s}}function vs(s,t,e,n,i,r,a,o,c,l){s.getVertexPosition(o,si),s.getVertexPosition(c,ri),s.getVertexPosition(l,ai);const h=ru(s,t,e,n,si,ri,ai,gs);if(h){i&&(fs.fromBufferAttribute(i,o),ps.fromBufferAttribute(i,c),ms.fromBufferAttribute(i,l),h.uv=$e.getInterpolation(gs,si,ri,ai,fs,ps,ms,new rt)),r&&(fs.fromBufferAttribute(r,o),ps.fromBufferAttribute(r,c),ms.fromBufferAttribute(r,l),h.uv1=$e.getInterpolation(gs,si,ri,ai,fs,ps,ms,new rt)),a&&(Do.fromBufferAttribute(a,o),Io.fromBufferAttribute(a,c),Uo.fromBufferAttribute(a,l),h.normal=$e.getInterpolation(gs,si,ri,ai,Do,Io,Uo,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new C,materialIndex:0};$e.getNormal(si,ri,ai,u.normal),h.face=u}return h}class Ht extends Re{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new te(l,3)),this.setAttribute("normal",new te(h,3)),this.setAttribute("uv",new te(u,2));function g(_,m,p,v,M,E,D,b,T,L,w){const y=E/T,P=D/L,V=E/2,B=D/2,W=b/2,Y=T+1,G=L+1;let K=0,H=0;const dt=new C;for(let _t=0;_t<G;_t++){const vt=_t*P-B;for(let Bt=0;Bt<Y;Bt++){const Zt=Bt*y-V;dt[_]=Zt*v,dt[m]=vt*M,dt[p]=W,l.push(dt.x,dt.y,dt.z),dt[_]=0,dt[m]=0,dt[p]=b>0?1:-1,h.push(dt.x,dt.y,dt.z),u.push(Bt/T),u.push(1-_t/L),K+=1}}for(let _t=0;_t<L;_t++)for(let vt=0;vt<T;vt++){const Bt=d+vt+Y*_t,Zt=d+vt+Y*(_t+1),X=d+(vt+1)+Y*(_t+1),Q=d+(vt+1)+Y*_t;c.push(Bt,Zt,Q),c.push(Zt,X,Q),H+=6}o.addGroup(f,H,w),f+=H,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ht(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ei(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Te(s){const t={};for(let e=0;e<s.length;e++){const n=Ei(s[e]);for(const i in n)t[i]=n[i]}return t}function au(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Gc(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const ou={clone:Ei,merge:Te};var cu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class An extends Ti{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cu,this.fragmentShader=lu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ei(t.uniforms),this.uniformsGroups=au(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Wc extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Mn=new C,No=new rt,Oo=new rt;class ze extends Wc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ki*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(ki*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Mn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Mn.x,Mn.y).multiplyScalar(-t/Mn.z),Mn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mn.x,Mn.y).multiplyScalar(-t/Mn.z)}getViewSize(t,e){return this.getViewBounds(t,No,Oo),e.subVectors(Oo,No)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ki*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const oi=-90,ci=1;class hu extends ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new ze(oi,ci,t,e);i.layers=this.layers,this.add(i);const r=new ze(oi,ci,t,e);r.layers=this.layers,this.add(r);const a=new ze(oi,ci,t,e);a.layers=this.layers,this.add(a);const o=new ze(oi,ci,t,e);o.layers=this.layers,this.add(o);const c=new ze(oi,ci,t,e);c.layers=this.layers,this.add(c);const l=new ze(oi,ci,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Xs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Xc extends Ae{constructor(t,e,n,i,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:yi,super(t,e,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class uu extends Wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Xc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:qe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ht(5,5,5),r=new An({name:"CubemapFromEquirect",uniforms:Ei(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ce,blending:wn});r.uniforms.tEquirect.value=e;const a=new ct(i,r),o=e.minFilter;return e.minFilter===Hn&&(e.minFilter=qe),new hu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const Er=new C,du=new C,fu=new It;class On{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Er.subVectors(n,e).cross(du.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Er),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||fu.getNormalMatrix(t),i=this.coplanarPoint(Er).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const In=new Ba,xs=new C;class ka{constructor(t=new On,e=new On,n=new On,i=new On,r=new On,a=new On){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn){const n=this.planes,i=t.elements,r=i[0],a=i[1],o=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],f=i[8],g=i[9],_=i[10],m=i[11],p=i[12],v=i[13],M=i[14],E=i[15];if(n[0].setComponents(c-r,d-l,m-f,E-p).normalize(),n[1].setComponents(c+r,d+l,m+f,E+p).normalize(),n[2].setComponents(c+a,d+h,m+g,E+v).normalize(),n[3].setComponents(c-a,d-h,m-g,E-v).normalize(),n[4].setComponents(c-o,d-u,m-_,E-M).normalize(),e===dn)n[5].setComponents(c+o,d+u,m+_,E+M).normalize();else if(e===Xs)n[5].setComponents(o,u,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),In.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),In.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(In)}intersectsSprite(t){return In.center.set(0,0,0),In.radius=.7071067811865476,In.applyMatrix4(t.matrixWorld),this.intersectsSphere(In)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(xs.x=i.normal.x>0?t.max.x:t.min.x,xs.y=i.normal.y>0?t.max.y:t.min.y,xs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(xs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function qc(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function pu(s){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c._updateRange,d=c.updateRanges;if(s.bindBuffer(l,o),u.count===-1&&d.length===0&&s.bufferSubData(l,0,h),d.length!==0){for(let f=0,g=d.length;f<g;f++){const _=d[f];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}u.count!==-1&&(s.bufferSubData(l,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count),u.count=-1),c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(s.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}class Xn extends Re{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const v=p*d-a;for(let M=0;M<l;M++){const E=M*u-r;g.push(E,-v,0),_.push(0,0,1),m.push(M/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){const M=v+l*p,E=v+l*(p+1),D=v+1+l*(p+1),b=v+1+l*p;f.push(M,E,b),f.push(E,D,b)}this.setIndex(f),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(_,3)),this.setAttribute("uv",new te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.width,t.height,t.widthSegments,t.heightSegments)}}var mu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,_u=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Su=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Eu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Au=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Cu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ru=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Pu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Lu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Du=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Iu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Uu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ou=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Fu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Bu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ku=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Vu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xu="gl_FragColor = linearToOutputTexel( gl_FragColor );",qu=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Yu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,$u=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ku=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Zu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ju=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ju=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,td=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ed=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,id=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ad=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,od=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,cd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ld=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ud=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,fd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,pd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,md=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,gd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_d=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Md=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ed=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Td=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ad=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ld=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Id=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ud=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Od=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Fd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Wd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$d=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Jd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Qd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,tf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ef=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,nf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,rf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,af=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,of=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,lf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,hf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,df=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ff=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,pf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const mf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Sf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,wf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ef=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,bf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Af=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Cf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Rf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Pf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Df=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,If=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Uf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Of=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,zf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ff=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,kf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Wf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$f=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Dt={alphahash_fragment:mu,alphahash_pars_fragment:gu,alphamap_fragment:_u,alphamap_pars_fragment:vu,alphatest_fragment:xu,alphatest_pars_fragment:yu,aomap_fragment:Mu,aomap_pars_fragment:Su,batching_pars_vertex:wu,batching_vertex:Eu,begin_vertex:bu,beginnormal_vertex:Tu,bsdfs:Au,iridescence_fragment:Cu,bumpmap_pars_fragment:Ru,clipping_planes_fragment:Pu,clipping_planes_pars_fragment:Lu,clipping_planes_pars_vertex:Du,clipping_planes_vertex:Iu,color_fragment:Uu,color_pars_fragment:Nu,color_pars_vertex:Ou,color_vertex:zu,common:Fu,cube_uv_reflection_fragment:Bu,defaultnormal_vertex:ku,displacementmap_pars_vertex:Vu,displacementmap_vertex:Hu,emissivemap_fragment:Gu,emissivemap_pars_fragment:Wu,colorspace_fragment:Xu,colorspace_pars_fragment:qu,envmap_fragment:Yu,envmap_common_pars_fragment:$u,envmap_pars_fragment:Ku,envmap_pars_vertex:Zu,envmap_physical_pars_fragment:od,envmap_vertex:Ju,fog_vertex:ju,fog_pars_vertex:Qu,fog_fragment:td,fog_pars_fragment:ed,gradientmap_pars_fragment:nd,lightmap_pars_fragment:id,lights_lambert_fragment:sd,lights_lambert_pars_fragment:rd,lights_pars_begin:ad,lights_toon_fragment:cd,lights_toon_pars_fragment:ld,lights_phong_fragment:hd,lights_phong_pars_fragment:ud,lights_physical_fragment:dd,lights_physical_pars_fragment:fd,lights_fragment_begin:pd,lights_fragment_maps:md,lights_fragment_end:gd,logdepthbuf_fragment:_d,logdepthbuf_pars_fragment:vd,logdepthbuf_pars_vertex:xd,logdepthbuf_vertex:yd,map_fragment:Md,map_pars_fragment:Sd,map_particle_fragment:wd,map_particle_pars_fragment:Ed,metalnessmap_fragment:bd,metalnessmap_pars_fragment:Td,morphinstance_vertex:Ad,morphcolor_vertex:Cd,morphnormal_vertex:Rd,morphtarget_pars_vertex:Pd,morphtarget_vertex:Ld,normal_fragment_begin:Dd,normal_fragment_maps:Id,normal_pars_fragment:Ud,normal_pars_vertex:Nd,normal_vertex:Od,normalmap_pars_fragment:zd,clearcoat_normal_fragment_begin:Fd,clearcoat_normal_fragment_maps:Bd,clearcoat_pars_fragment:kd,iridescence_pars_fragment:Vd,opaque_fragment:Hd,packing:Gd,premultiplied_alpha_fragment:Wd,project_vertex:Xd,dithering_fragment:qd,dithering_pars_fragment:Yd,roughnessmap_fragment:$d,roughnessmap_pars_fragment:Kd,shadowmap_pars_fragment:Zd,shadowmap_pars_vertex:Jd,shadowmap_vertex:jd,shadowmask_pars_fragment:Qd,skinbase_vertex:tf,skinning_pars_vertex:ef,skinning_vertex:nf,skinnormal_vertex:sf,specularmap_fragment:rf,specularmap_pars_fragment:af,tonemapping_fragment:of,tonemapping_pars_fragment:cf,transmission_fragment:lf,transmission_pars_fragment:hf,uv_pars_fragment:uf,uv_pars_vertex:df,uv_vertex:ff,worldpos_vertex:pf,background_vert:mf,background_frag:gf,backgroundCube_vert:_f,backgroundCube_frag:vf,cube_vert:xf,cube_frag:yf,depth_vert:Mf,depth_frag:Sf,distanceRGBA_vert:wf,distanceRGBA_frag:Ef,equirect_vert:bf,equirect_frag:Tf,linedashed_vert:Af,linedashed_frag:Cf,meshbasic_vert:Rf,meshbasic_frag:Pf,meshlambert_vert:Lf,meshlambert_frag:Df,meshmatcap_vert:If,meshmatcap_frag:Uf,meshnormal_vert:Nf,meshnormal_frag:Of,meshphong_vert:zf,meshphong_frag:Ff,meshphysical_vert:Bf,meshphysical_frag:kf,meshtoon_vert:Vf,meshtoon_frag:Hf,points_vert:Gf,points_frag:Wf,shadow_vert:Xf,shadow_frag:qf,sprite_vert:Yf,sprite_frag:$f},st={common:{diffuse:{value:new Ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new Ft(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},Qe={basic:{uniforms:Te([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:Dt.meshbasic_vert,fragmentShader:Dt.meshbasic_frag},lambert:{uniforms:Te([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Dt.meshlambert_vert,fragmentShader:Dt.meshlambert_frag},phong:{uniforms:Te([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new Ft(0)},specular:{value:new Ft(1118481)},shininess:{value:30}}]),vertexShader:Dt.meshphong_vert,fragmentShader:Dt.meshphong_frag},standard:{uniforms:Te([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new Ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag},toon:{uniforms:Te([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Dt.meshtoon_vert,fragmentShader:Dt.meshtoon_frag},matcap:{uniforms:Te([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:Dt.meshmatcap_vert,fragmentShader:Dt.meshmatcap_frag},points:{uniforms:Te([st.points,st.fog]),vertexShader:Dt.points_vert,fragmentShader:Dt.points_frag},dashed:{uniforms:Te([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Dt.linedashed_vert,fragmentShader:Dt.linedashed_frag},depth:{uniforms:Te([st.common,st.displacementmap]),vertexShader:Dt.depth_vert,fragmentShader:Dt.depth_frag},normal:{uniforms:Te([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:Dt.meshnormal_vert,fragmentShader:Dt.meshnormal_frag},sprite:{uniforms:Te([st.sprite,st.fog]),vertexShader:Dt.sprite_vert,fragmentShader:Dt.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Dt.background_vert,fragmentShader:Dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Dt.backgroundCube_vert,fragmentShader:Dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Dt.cube_vert,fragmentShader:Dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Dt.equirect_vert,fragmentShader:Dt.equirect_frag},distanceRGBA:{uniforms:Te([st.common,st.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Dt.distanceRGBA_vert,fragmentShader:Dt.distanceRGBA_frag},shadow:{uniforms:Te([st.lights,st.fog,{color:{value:new Ft(0)},opacity:{value:1}}]),vertexShader:Dt.shadow_vert,fragmentShader:Dt.shadow_frag}};Qe.physical={uniforms:Te([Qe.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new Ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new Ft(0)},specularColor:{value:new Ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag};const ys={r:0,b:0,g:0},Un=new Je,Kf=new ne;function Zf(s,t,e,n,i,r,a){const o=new Ft(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?e:t).get(M)),M}function _(v){let M=!1;const E=g(v);E===null?p(o,c):E&&E.isColor&&(p(E,1),M=!0);const D=s.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(v,M){const E=g(M);E&&(E.isCubeTexture||E.mapping===Zs)?(h===void 0&&(h=new ct(new Ht(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:Ei(Qe.backgroundCube.uniforms),vertexShader:Qe.backgroundCube.vertexShader,fragmentShader:Qe.backgroundCube.fragmentShader,side:Ce,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,b,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Un.copy(M.backgroundRotation),Un.x*=-1,Un.y*=-1,Un.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Un.y*=-1,Un.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Kf.makeRotationFromEuler(Un)),h.material.toneMapped=Kt.getTransfer(E.colorSpace)!==Qt,(u!==E||d!==E.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=E,d=E.version,f=s.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new ct(new Xn(2,2),new An({name:"BackgroundMaterial",uniforms:Ei(Qe.background.uniforms),vertexShader:Qe.background.vertexShader,fragmentShader:Qe.background.fragmentShader,side:Tn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Kt.getTransfer(E.colorSpace)!==Qt,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||d!==E.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=E,d=E.version,f=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,M){v.getRGB(ys,Gc(s)),n.buffers.color.setClear(ys.r,ys.g,ys.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(v,M=1){o.set(v),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(o,c)},render:_,addToRenderList:m}}function Jf(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(y,P,V,B,W){let Y=!1;const G=u(B,V,P);r!==G&&(r=G,l(r.object)),Y=f(y,B,V,W),Y&&g(y,B,V,W),W!==null&&t.update(W,s.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,E(y,P,V,B),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return s.createVertexArray()}function l(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function u(y,P,V){const B=V.wireframe===!0;let W=n[y.id];W===void 0&&(W={},n[y.id]=W);let Y=W[P.id];Y===void 0&&(Y={},W[P.id]=Y);let G=Y[B];return G===void 0&&(G=d(c()),Y[B]=G),G}function d(y){const P=[],V=[],B=[];for(let W=0;W<e;W++)P[W]=0,V[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:V,attributeDivisors:B,object:y,attributes:{},index:null}}function f(y,P,V,B){const W=r.attributes,Y=P.attributes;let G=0;const K=V.getAttributes();for(const H in K)if(K[H].location>=0){const _t=W[H];let vt=Y[H];if(vt===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(vt=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(vt=y.instanceColor)),_t===void 0||_t.attribute!==vt||vt&&_t.data!==vt.data)return!0;G++}return r.attributesNum!==G||r.index!==B}function g(y,P,V,B){const W={},Y=P.attributes;let G=0;const K=V.getAttributes();for(const H in K)if(K[H].location>=0){let _t=Y[H];_t===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(_t=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(_t=y.instanceColor));const vt={};vt.attribute=_t,_t&&_t.data&&(vt.data=_t.data),W[H]=vt,G++}r.attributes=W,r.attributesNum=G,r.index=B}function _(){const y=r.newAttributes;for(let P=0,V=y.length;P<V;P++)y[P]=0}function m(y){p(y,0)}function p(y,P){const V=r.newAttributes,B=r.enabledAttributes,W=r.attributeDivisors;V[y]=1,B[y]===0&&(s.enableVertexAttribArray(y),B[y]=1),W[y]!==P&&(s.vertexAttribDivisor(y,P),W[y]=P)}function v(){const y=r.newAttributes,P=r.enabledAttributes;for(let V=0,B=P.length;V<B;V++)P[V]!==y[V]&&(s.disableVertexAttribArray(V),P[V]=0)}function M(y,P,V,B,W,Y,G){G===!0?s.vertexAttribIPointer(y,P,V,W,Y):s.vertexAttribPointer(y,P,V,B,W,Y)}function E(y,P,V,B){_();const W=B.attributes,Y=V.getAttributes(),G=P.defaultAttributeValues;for(const K in Y){const H=Y[K];if(H.location>=0){let dt=W[K];if(dt===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor)),dt!==void 0){const _t=dt.normalized,vt=dt.itemSize,Bt=t.get(dt);if(Bt===void 0)continue;const Zt=Bt.buffer,X=Bt.type,Q=Bt.bytesPerElement,pt=X===s.INT||X===s.UNSIGNED_INT||dt.gpuType===Pa;if(dt.isInterleavedBufferAttribute){const ht=dt.data,Rt=ht.stride,Ut=dt.offset;if(ht.isInstancedInterleavedBuffer){for(let Ot=0;Ot<H.locationSize;Ot++)p(H.location+Ot,ht.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Ot=0;Ot<H.locationSize;Ot++)m(H.location+Ot);s.bindBuffer(s.ARRAY_BUFFER,Zt);for(let Ot=0;Ot<H.locationSize;Ot++)M(H.location+Ot,vt/H.locationSize,X,_t,Rt*Q,(Ut+vt/H.locationSize*Ot)*Q,pt)}else{if(dt.isInstancedBufferAttribute){for(let ht=0;ht<H.locationSize;ht++)p(H.location+ht,dt.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let ht=0;ht<H.locationSize;ht++)m(H.location+ht);s.bindBuffer(s.ARRAY_BUFFER,Zt);for(let ht=0;ht<H.locationSize;ht++)M(H.location+ht,vt/H.locationSize,X,_t,vt*Q,vt/H.locationSize*ht*Q,pt)}}else if(G!==void 0){const _t=G[K];if(_t!==void 0)switch(_t.length){case 2:s.vertexAttrib2fv(H.location,_t);break;case 3:s.vertexAttrib3fv(H.location,_t);break;case 4:s.vertexAttrib4fv(H.location,_t);break;default:s.vertexAttrib1fv(H.location,_t)}}}}v()}function D(){L();for(const y in n){const P=n[y];for(const V in P){const B=P[V];for(const W in B)h(B[W].object),delete B[W];delete P[V]}delete n[y]}}function b(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const V in P){const B=P[V];for(const W in B)h(B[W].object),delete B[W];delete P[V]}delete n[y.id]}function T(y){for(const P in n){const V=n[P];if(V[y.id]===void 0)continue;const B=V[y.id];for(const W in B)h(B[W].object),delete B[W];delete V[y.id]}}function L(){w(),a=!0,r!==i&&(r=i,l(r.object))}function w(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:L,resetDefaultState:w,dispose:D,releaseStatesOfGeometry:b,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function jf(s,t,e){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_];for(let _=0;_<d.length;_++)e.update(g,n,d[_])}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Qf(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(b){return!(b!==Ke&&n.convert(b)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(b){const T=b===$i&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==pn&&n.convert(b)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==un&&!T)}function c(b){if(b==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),_=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),v=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=f>0,D=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:_,maxAttributes:m,maxVertexUniforms:p,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:E,maxSamples:D}}function tp(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new On,o=new It,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):l();else{const v=r?0:n,M=v*4;let E=p.clippingState||null;c.value=E,E=h(g,d,M,f);for(let D=0;D!==M;++D)E[D]=e[D];p.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,E=f;M!==_;++M,E+=4)a.copy(u[M]).applyMatrix4(v,o),a.normal.toArray(m,E),m[E+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function ep(s){let t=new WeakMap;function e(a,o){return o===Wr?a.mapping=yi:o===Xr&&(a.mapping=Mi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Wr||o===Xr)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new uu(c.height);return l.fromEquirectangularTexture(s,a),t.set(a,l),a.addEventListener("dispose",i),e(l.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Yc extends Wc{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const mi=4,zo=[.125,.215,.35,.446,.526,.582],Bn=20,br=new Yc,Fo=new Ft;let Tr=null,Ar=0,Cr=0,Rr=!1;const zn=(1+Math.sqrt(5))/2,li=1/zn,Bo=[new C(-zn,li,0),new C(zn,li,0),new C(-li,0,zn),new C(li,0,zn),new C(0,zn,-li),new C(0,zn,li),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class ko{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Tr=this._renderer.getRenderTarget(),Ar=this._renderer.getActiveCubeFace(),Cr=this._renderer.getActiveMipmapLevel(),Rr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Go(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ho(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Tr,Ar,Cr),this._renderer.xr.enabled=Rr,t.scissorTest=!1,Ms(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===yi||t.mapping===Mi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Tr=this._renderer.getRenderTarget(),Ar=this._renderer.getActiveCubeFace(),Cr=this._renderer.getActiveMipmapLevel(),Rr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:qe,minFilter:qe,generateMipmaps:!1,type:$i,format:Ke,colorSpace:Cn,depthBuffer:!1},i=Vo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vo(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=np(r)),this._blurMaterial=ip(r,t,e)}return i}_compileMaterial(t){const e=new ct(this._lodPlanes[0],t);this._renderer.compile(e,br)}_sceneToCubeUV(t,e,n,i){const o=new ze(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Fo),h.toneMapping=En,h.autoClear=!1;const f=new Ji({name:"PMREM.Background",side:Ce,depthWrite:!1,depthTest:!1}),g=new ct(new Ht,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Fo),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):v===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const M=this._cubeSize;Ms(i,v*M,p>2?M:0,M,M),h.setRenderTarget(i),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===yi||t.mapping===Mi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Go()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ho());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Ms(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,br)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Bo[(i-r-1)%Bo.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ct(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Bn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Bn;m>Bn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Bn}`);const p=[];let v=0;for(let T=0;T<Bn;++T){const L=T/_,w=Math.exp(-L*L/2);p.push(w),T===0?v+=w:T<m&&(v+=2*w)}for(let T=0;T<p.length;T++)p[T]=p[T]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const E=this._sizeLods[i],D=3*E*(i>M-mi?i-M+mi:0),b=4*(this._cubeSize-E);Ms(e,D,b,3*E,2*E),c.setRenderTarget(e),c.render(u,br)}}function np(s){const t=[],e=[],n=[];let i=s;const r=s-mi+1+zo.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let c=1/o;a>s-mi?c=zo[a-s+mi-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*f),M=new Float32Array(m*g*f),E=new Float32Array(p*g*f);for(let b=0;b<f;b++){const T=b%3*2/3-1,L=b>2?0:-1,w=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];v.set(w,_*g*b),M.set(d,m*g*b);const y=[b,b,b,b,b,b];E.set(y,p*g*b)}const D=new Re;D.setAttribute("position",new Ze(v,_)),D.setAttribute("uv",new Ze(M,m)),D.setAttribute("faceIndex",new Ze(E,p)),t.push(D),i>mi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Vo(s,t,e){const n=new Wn(s,t,e);return n.texture.mapping=Zs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ms(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function ip(s,t,e){const n=new Float32Array(Bn),i=new C(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:Bn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Ho(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Go(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Va(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function sp(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Wr||c===Xr,h=c===yi||c===Mi;if(l||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new ko(s)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new ko(s)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function rp(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Fa("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function ap(s,t,e,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],s.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let M=0,E=v.length;M<E;M+=3){const D=v[M+0],b=v[M+1],T=v[M+2];d.push(D,b,b,T,T,D)}}else if(g!==void 0){const v=g.array;_=g.version;for(let M=0,E=v.length/3-1;M<E;M+=3){const D=M+0,b=M+1,T=M+2;d.push(D,b,b,T,T,D)}}else return;const m=new(Oc(d)?Hc:Vc)(d,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function op(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*a),e.update(f,n,1)}function l(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let v=0;v<g;v++)p+=f[v];for(let v=0;v<_.length;v++)e.update(p,n,_[v])}}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function cp(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function lp(s,t,e){const n=new WeakMap,i=new fe;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let y=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var f=y;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let E=0;g===!0&&(E=1),_===!0&&(E=2),m===!0&&(E=3);let D=o.attributes.position.count*E,b=1;D>t.maxTextureSize&&(b=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const T=new Float32Array(D*b*4*u),L=new Fc(T,D,b,u);L.type=un,L.needsUpdate=!0;const w=E*4;for(let P=0;P<u;P++){const V=p[P],B=v[P],W=M[P],Y=D*b*4*P;for(let G=0;G<V.count;G++){const K=G*w;g===!0&&(i.fromBufferAttribute(V,G),T[Y+K+0]=i.x,T[Y+K+1]=i.y,T[Y+K+2]=i.z,T[Y+K+3]=0),_===!0&&(i.fromBufferAttribute(B,G),T[Y+K+4]=i.x,T[Y+K+5]=i.y,T[Y+K+6]=i.z,T[Y+K+7]=0),m===!0&&(i.fromBufferAttribute(W,G),T[Y+K+8]=i.x,T[Y+K+9]=i.y,T[Y+K+10]=i.z,T[Y+K+11]=W.itemSize===4?i.w:1)}}d={count:u,texture:L,size:new rt(D,b)},n.set(o,d),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",_),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function hp(s,t,e,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function a(){i=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class $c extends Ae{constructor(t,e,n,i,r,a,o,c,l,h=vi){if(h!==vi&&h!==wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===vi&&(n=Gn),n===void 0&&h===wi&&(n=Si),super(null,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Be,this.minFilter=c!==void 0?c:Be,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Kc=new Ae,Wo=new $c(1,1),Zc=new Fc,Jc=new $h,jc=new Xc,Xo=[],qo=[],Yo=new Float32Array(16),$o=new Float32Array(9),Ko=new Float32Array(4);function Ai(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Xo[i];if(r===void 0&&(r=new Float32Array(i),Xo[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function pe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function me(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function js(s,t){let e=qo[t];e===void 0&&(e=new Int32Array(t),qo[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function up(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function dp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2fv(this.addr,t),me(e,t)}}function fp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pe(e,t))return;s.uniform3fv(this.addr,t),me(e,t)}}function pp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4fv(this.addr,t),me(e,t)}}function mp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;Ko.set(n),s.uniformMatrix2fv(this.addr,!1,Ko),me(e,n)}}function gp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;$o.set(n),s.uniformMatrix3fv(this.addr,!1,$o),me(e,n)}}function _p(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;Yo.set(n),s.uniformMatrix4fv(this.addr,!1,Yo),me(e,n)}}function vp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function xp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2iv(this.addr,t),me(e,t)}}function yp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3iv(this.addr,t),me(e,t)}}function Mp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4iv(this.addr,t),me(e,t)}}function Sp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function wp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2uiv(this.addr,t),me(e,t)}}function Ep(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3uiv(this.addr,t),me(e,t)}}function bp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4uiv(this.addr,t),me(e,t)}}function Tp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Wo.compareFunction=Nc,r=Wo):r=Kc,e.setTexture2D(t||r,i)}function Ap(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Jc,i)}function Cp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||jc,i)}function Rp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Zc,i)}function Pp(s){switch(s){case 5126:return up;case 35664:return dp;case 35665:return fp;case 35666:return pp;case 35674:return mp;case 35675:return gp;case 35676:return _p;case 5124:case 35670:return vp;case 35667:case 35671:return xp;case 35668:case 35672:return yp;case 35669:case 35673:return Mp;case 5125:return Sp;case 36294:return wp;case 36295:return Ep;case 36296:return bp;case 35678:case 36198:case 36298:case 36306:case 35682:return Tp;case 35679:case 36299:case 36307:return Ap;case 35680:case 36300:case 36308:case 36293:return Cp;case 36289:case 36303:case 36311:case 36292:return Rp}}function Lp(s,t){s.uniform1fv(this.addr,t)}function Dp(s,t){const e=Ai(t,this.size,2);s.uniform2fv(this.addr,e)}function Ip(s,t){const e=Ai(t,this.size,3);s.uniform3fv(this.addr,e)}function Up(s,t){const e=Ai(t,this.size,4);s.uniform4fv(this.addr,e)}function Np(s,t){const e=Ai(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Op(s,t){const e=Ai(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function zp(s,t){const e=Ai(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Fp(s,t){s.uniform1iv(this.addr,t)}function Bp(s,t){s.uniform2iv(this.addr,t)}function kp(s,t){s.uniform3iv(this.addr,t)}function Vp(s,t){s.uniform4iv(this.addr,t)}function Hp(s,t){s.uniform1uiv(this.addr,t)}function Gp(s,t){s.uniform2uiv(this.addr,t)}function Wp(s,t){s.uniform3uiv(this.addr,t)}function Xp(s,t){s.uniform4uiv(this.addr,t)}function qp(s,t,e){const n=this.cache,i=t.length,r=js(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||Kc,r[a])}function Yp(s,t,e){const n=this.cache,i=t.length,r=js(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Jc,r[a])}function $p(s,t,e){const n=this.cache,i=t.length,r=js(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||jc,r[a])}function Kp(s,t,e){const n=this.cache,i=t.length,r=js(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Zc,r[a])}function Zp(s){switch(s){case 5126:return Lp;case 35664:return Dp;case 35665:return Ip;case 35666:return Up;case 35674:return Np;case 35675:return Op;case 35676:return zp;case 5124:case 35670:return Fp;case 35667:case 35671:return Bp;case 35668:case 35672:return kp;case 35669:case 35673:return Vp;case 5125:return Hp;case 36294:return Gp;case 36295:return Wp;case 36296:return Xp;case 35678:case 36198:case 36298:case 36306:case 35682:return qp;case 35679:case 36299:case 36307:return Yp;case 35680:case 36300:case 36308:case 36293:return $p;case 36289:case 36303:case 36311:case 36292:return Kp}}class Jp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Pp(e.type)}}class jp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Zp(e.type)}}class Qp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const Pr=/(\w+)(\])?(\[|\.)?/g;function Zo(s,t){s.seq.push(t),s.map[t.id]=t}function tm(s,t,e){const n=s.name,i=n.length;for(Pr.lastIndex=0;;){const r=Pr.exec(n),a=Pr.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Zo(e,l===void 0?new Jp(o,s,t):new jp(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new Qp(o),Zo(e,u)),e=u}}}class Os{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),a=t.getUniformLocation(e,r.name);tm(r,a,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Jo(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const em=37297;let nm=0;function im(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function sm(s){const t=Kt.getPrimaries(Kt.workingColorSpace),e=Kt.getPrimaries(s);let n;switch(t===e?n="":t===Ws&&e===Gs?n="LinearDisplayP3ToLinearSRGB":t===Gs&&e===Ws&&(n="LinearSRGBToLinearDisplayP3"),s){case Cn:case Js:return[n,"LinearTransferOETF"];case Oe:case Oa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function jo(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+im(s.getShaderSource(t),a)}else return i}function rm(s,t){const e=sm(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function am(s,t){let e;switch(t){case oh:e="Linear";break;case ch:e="Reinhard";break;case lh:e="OptimizedCineon";break;case hh:e="ACESFilmic";break;case dh:e="AgX";break;case fh:e="Neutral";break;case uh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function om(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fi).join(`
`)}function cm(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function lm(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Fi(s){return s!==""}function Qo(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function tc(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const hm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ma(s){return s.replace(hm,dm)}const um=new Map;function dm(s,t){let e=Dt[t];if(e===void 0){const n=um.get(t);if(n!==void 0)e=Dt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ma(e)}const fm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ec(s){return s.replace(fm,pm)}function pm(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function nc(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function mm(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Mc?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Vr?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===hn&&(t="SHADOWMAP_TYPE_VSM"),t}function gm(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case yi:case Mi:t="ENVMAP_TYPE_CUBE";break;case Zs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function _m(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Mi:t="ENVMAP_MODE_REFRACTION";break}return t}function vm(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Sc:t="ENVMAP_BLENDING_MULTIPLY";break;case rh:t="ENVMAP_BLENDING_MIX";break;case ah:t="ENVMAP_BLENDING_ADD";break}return t}function xm(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function ym(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=mm(e),l=gm(e),h=_m(e),u=vm(e),d=xm(e),f=om(e),g=cm(r),_=i.createProgram();let m,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Fi).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Fi).join(`
`),p.length>0&&(p+=`
`)):(m=[nc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fi).join(`
`),p=[nc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==En?"#define TONE_MAPPING":"",e.toneMapping!==En?Dt.tonemapping_pars_fragment:"",e.toneMapping!==En?am("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Dt.colorspace_pars_fragment,rm("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fi).join(`
`)),a=Ma(a),a=Qo(a,e),a=tc(a,e),o=Ma(o),o=Qo(o,e),o=tc(o,e),a=ec(a),o=ec(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===go?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===go?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=v+m+a,E=v+p+o,D=Jo(i,i.VERTEX_SHADER,M),b=Jo(i,i.FRAGMENT_SHADER,E);i.attachShader(_,D),i.attachShader(_,b),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(P){if(s.debug.checkShaderErrors){const V=i.getProgramInfoLog(_).trim(),B=i.getShaderInfoLog(D).trim(),W=i.getShaderInfoLog(b).trim();let Y=!0,G=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Y=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,D,b);else{const K=jo(i,D,"vertex"),H=jo(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+V+`
`+K+`
`+H)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(B===""||W==="")&&(G=!1);G&&(P.diagnostics={runnable:Y,programLog:V,vertexShader:{log:B,prefix:m},fragmentShader:{log:W,prefix:p}})}i.deleteShader(D),i.deleteShader(b),L=new Os(i,_),w=lm(i,_)}let L;this.getUniforms=function(){return L===void 0&&T(this),L};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,em)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=nm++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=b,this}let Mm=0;class Sm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new wm(t),e.set(t,n)),n}}class wm{constructor(t){this.id=Mm++,this.code=t,this.usedTimes=0}}function Em(s,t,e,n,i,r,a){const o=new Bc,c=new Sm,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return l.add(w),w===0?"uv":`uv${w}`}function m(w,y,P,V,B){const W=V.fog,Y=B.geometry,G=w.isMeshStandardMaterial?V.environment:null,K=(w.isMeshStandardMaterial?e:t).get(w.envMap||G),H=K&&K.mapping===Zs?K.image.height:null,dt=g[w.type];w.precision!==null&&(f=i.getMaxPrecision(w.precision),f!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",f,"instead."));const _t=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,vt=_t!==void 0?_t.length:0;let Bt=0;Y.morphAttributes.position!==void 0&&(Bt=1),Y.morphAttributes.normal!==void 0&&(Bt=2),Y.morphAttributes.color!==void 0&&(Bt=3);let Zt,X,Q,pt;if(dt){const Gt=Qe[dt];Zt=Gt.vertexShader,X=Gt.fragmentShader}else Zt=w.vertexShader,X=w.fragmentShader,c.update(w),Q=c.getVertexShaderID(w),pt=c.getFragmentShaderID(w);const ht=s.getRenderTarget(),Rt=B.isInstancedMesh===!0,Ut=B.isBatchedMesh===!0,Ot=!!w.map,ie=!!w.matcap,R=!!K,ae=!!w.aoMap,Yt=!!w.lightMap,Jt=!!w.bumpMap,yt=!!w.normalMap,oe=!!w.displacementMap,At=!!w.emissiveMap,Pt=!!w.metalnessMap,A=!!w.roughnessMap,x=w.anisotropy>0,k=w.clearcoat>0,J=w.dispersion>0,j=w.iridescence>0,Z=w.sheen>0,Mt=w.transmission>0,at=x&&!!w.anisotropyMap,ut=k&&!!w.clearcoatMap,Lt=k&&!!w.clearcoatNormalMap,tt=k&&!!w.clearcoatRoughnessMap,lt=j&&!!w.iridescenceMap,kt=j&&!!w.iridescenceThicknessMap,Tt=Z&&!!w.sheenColorMap,ft=Z&&!!w.sheenRoughnessMap,Ct=!!w.specularMap,Nt=!!w.specularColorMap,ee=!!w.specularIntensityMap,U=Mt&&!!w.transmissionMap,et=Mt&&!!w.thicknessMap,q=!!w.gradientMap,$=!!w.alphaMap,it=w.alphaTest>0,wt=!!w.alphaHash,Vt=!!w.extensions;let ce=En;w.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(ce=s.toneMapping);const xe={shaderID:dt,shaderType:w.type,shaderName:w.name,vertexShader:Zt,fragmentShader:X,defines:w.defines,customVertexShaderID:Q,customFragmentShaderID:pt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:f,batching:Ut,batchingColor:Ut&&B._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&B.instanceColor!==null,instancingMorph:Rt&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ht===null?s.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:Cn,alphaToCoverage:!!w.alphaToCoverage,map:Ot,matcap:ie,envMap:R,envMapMode:R&&K.mapping,envMapCubeUVHeight:H,aoMap:ae,lightMap:Yt,bumpMap:Jt,normalMap:yt,displacementMap:d&&oe,emissiveMap:At,normalMapObjectSpace:yt&&w.normalMapType===_h,normalMapTangentSpace:yt&&w.normalMapType===Uc,metalnessMap:Pt,roughnessMap:A,anisotropy:x,anisotropyMap:at,clearcoat:k,clearcoatMap:ut,clearcoatNormalMap:Lt,clearcoatRoughnessMap:tt,dispersion:J,iridescence:j,iridescenceMap:lt,iridescenceThicknessMap:kt,sheen:Z,sheenColorMap:Tt,sheenRoughnessMap:ft,specularMap:Ct,specularColorMap:Nt,specularIntensityMap:ee,transmission:Mt,transmissionMap:U,thicknessMap:et,gradientMap:q,opaque:w.transparent===!1&&w.blending===_i&&w.alphaToCoverage===!1,alphaMap:$,alphaTest:it,alphaHash:wt,combine:w.combine,mapUv:Ot&&_(w.map.channel),aoMapUv:ae&&_(w.aoMap.channel),lightMapUv:Yt&&_(w.lightMap.channel),bumpMapUv:Jt&&_(w.bumpMap.channel),normalMapUv:yt&&_(w.normalMap.channel),displacementMapUv:oe&&_(w.displacementMap.channel),emissiveMapUv:At&&_(w.emissiveMap.channel),metalnessMapUv:Pt&&_(w.metalnessMap.channel),roughnessMapUv:A&&_(w.roughnessMap.channel),anisotropyMapUv:at&&_(w.anisotropyMap.channel),clearcoatMapUv:ut&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Lt&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:tt&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:lt&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:kt&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:ft&&_(w.sheenRoughnessMap.channel),specularMapUv:Ct&&_(w.specularMap.channel),specularColorMapUv:Nt&&_(w.specularColorMap.channel),specularIntensityMapUv:ee&&_(w.specularIntensityMap.channel),transmissionMapUv:U&&_(w.transmissionMap.channel),thicknessMapUv:et&&_(w.thicknessMap.channel),alphaMapUv:$&&_(w.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(yt||x),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!Y.attributes.uv&&(Ot||$),fog:!!W,useFog:w.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:B.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:vt,morphTextureStride:Bt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:ce,decodeVideoTexture:Ot&&w.map.isVideoTexture===!0&&Kt.getTransfer(w.map.colorSpace)===Qt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Xe,flipSided:w.side===Ce,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Vt&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Vt&&w.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return xe.vertexUv1s=l.has(1),xe.vertexUv2s=l.has(2),xe.vertexUv3s=l.has(3),l.clear(),xe}function p(w){const y=[];if(w.shaderID?y.push(w.shaderID):(y.push(w.customVertexShaderID),y.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)y.push(P),y.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(v(y,w),M(y,w),y.push(s.outputColorSpace)),y.push(w.customProgramCacheKey),y.join()}function v(w,y){w.push(y.precision),w.push(y.outputColorSpace),w.push(y.envMapMode),w.push(y.envMapCubeUVHeight),w.push(y.mapUv),w.push(y.alphaMapUv),w.push(y.lightMapUv),w.push(y.aoMapUv),w.push(y.bumpMapUv),w.push(y.normalMapUv),w.push(y.displacementMapUv),w.push(y.emissiveMapUv),w.push(y.metalnessMapUv),w.push(y.roughnessMapUv),w.push(y.anisotropyMapUv),w.push(y.clearcoatMapUv),w.push(y.clearcoatNormalMapUv),w.push(y.clearcoatRoughnessMapUv),w.push(y.iridescenceMapUv),w.push(y.iridescenceThicknessMapUv),w.push(y.sheenColorMapUv),w.push(y.sheenRoughnessMapUv),w.push(y.specularMapUv),w.push(y.specularColorMapUv),w.push(y.specularIntensityMapUv),w.push(y.transmissionMapUv),w.push(y.thicknessMapUv),w.push(y.combine),w.push(y.fogExp2),w.push(y.sizeAttenuation),w.push(y.morphTargetsCount),w.push(y.morphAttributeCount),w.push(y.numDirLights),w.push(y.numPointLights),w.push(y.numSpotLights),w.push(y.numSpotLightMaps),w.push(y.numHemiLights),w.push(y.numRectAreaLights),w.push(y.numDirLightShadows),w.push(y.numPointLightShadows),w.push(y.numSpotLightShadows),w.push(y.numSpotLightShadowsWithMaps),w.push(y.numLightProbes),w.push(y.shadowMapType),w.push(y.toneMapping),w.push(y.numClippingPlanes),w.push(y.numClipIntersection),w.push(y.depthPacking)}function M(w,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.skinning&&o.enable(4),y.morphTargets&&o.enable(5),y.morphNormals&&o.enable(6),y.morphColors&&o.enable(7),y.premultipliedAlpha&&o.enable(8),y.shadowMapEnabled&&o.enable(9),y.doubleSided&&o.enable(10),y.flipSided&&o.enable(11),y.useDepthPacking&&o.enable(12),y.dithering&&o.enable(13),y.transmission&&o.enable(14),y.sheen&&o.enable(15),y.opaque&&o.enable(16),y.pointsUvs&&o.enable(17),y.decodeVideoTexture&&o.enable(18),y.alphaToCoverage&&o.enable(19),w.push(o.mask)}function E(w){const y=g[w.type];let P;if(y){const V=Qe[y];P=ou.clone(V.uniforms)}else P=w.uniforms;return P}function D(w,y){let P;for(let V=0,B=h.length;V<B;V++){const W=h[V];if(W.cacheKey===y){P=W,++P.usedTimes;break}}return P===void 0&&(P=new ym(s,y,w,r),h.push(P)),P}function b(w){if(--w.usedTimes===0){const y=h.indexOf(w);h[y]=h[h.length-1],h.pop(),w.destroy()}}function T(w){c.remove(w)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:E,acquireProgram:D,releaseProgram:b,releaseShaderCache:T,programs:h,dispose:L}}function bm(){let s=new WeakMap;function t(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function e(r){s.delete(r)}function n(r,a,o){s.get(r)[a]=o}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Tm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function ic(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function sc(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u,d,f,g,_,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function c(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Tm),n.length>1&&n.sort(d||ic),i.length>1&&i.sort(d||ic)}function h(){for(let u=t,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:o,unshift:c,finish:h,sort:l}}function Am(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new sc,s.set(n,[a])):i>=r.length?(a=new sc,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Cm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Ft};break;case"SpotLight":e={position:new C,direction:new C,color:new Ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Ft,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Ft,groundColor:new Ft};break;case"RectAreaLight":e={color:new Ft,position:new C,halfWidth:new C,halfHeight:new C};break}return s[t.id]=e,e}}}function Rm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Pm=0;function Lm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Dm(s){const t=new Cm,e=Rm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);const i=new C,r=new ne,a=new ne;function o(l){let h=0,u=0,d=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,v=0,M=0,E=0,D=0,b=0,T=0;l.sort(Lm);for(let w=0,y=l.length;w<y;w++){const P=l[w],V=P.color,B=P.intensity,W=P.distance,Y=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=V.r*B,u+=V.g*B,d+=V.b*B;else if(P.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(P.sh.coefficients[G],B);T++}else if(P.isDirectionalLight){const G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const K=P.shadow,H=e.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=Y,n.directionalShadowMatrix[f]=P.shadow.matrix,v++}n.directional[f]=G,f++}else if(P.isSpotLight){const G=t.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(V).multiplyScalar(B),G.distance=W,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,n.spot[_]=G;const K=P.shadow;if(P.map&&(n.spotLightMap[D]=P.map,D++,K.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[_]=K.matrix,P.castShadow){const H=e.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=Y,E++}_++}else if(P.isRectAreaLight){const G=t.get(P);G.color.copy(V).multiplyScalar(B),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=G,m++}else if(P.isPointLight){const G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const K=P.shadow,H=e.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=Y,n.pointShadowMatrix[g]=P.shadow.matrix,M++}n.point[g]=G,g++}else if(P.isHemisphereLight){const G=t.get(P);G.skyColor.copy(P.color).multiplyScalar(B),G.groundColor.copy(P.groundColor).multiplyScalar(B),n.hemi[p]=G,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=st.LTC_FLOAT_1,n.rectAreaLTC2=st.LTC_FLOAT_2):(n.rectAreaLTC1=st.LTC_HALF_1,n.rectAreaLTC2=st.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const L=n.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==p||L.numDirectionalShadows!==v||L.numPointShadows!==M||L.numSpotShadows!==E||L.numSpotMaps!==D||L.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=E+D-b,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=T,L.directionalLength=f,L.pointLength=g,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=p,L.numDirectionalShadows=v,L.numPointShadows=M,L.numSpotShadows=E,L.numSpotMaps=D,L.numLightProbes=T,n.version=Pm++)}function c(l,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const M=l[p];if(M.isDirectionalLight){const E=n.directional[u];E.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(m),u++}else if(M.isSpotLight){const E=n.spot[f];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const E=n.rectArea[g];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const E=n.point[d];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const E=n.hemi[_];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function rc(s){const t=new Dm(s),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Im(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new rc(s),t.set(i,[o])):r>=a.length?(o=new rc(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class Um extends Ti{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Nm extends Ti{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Om=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,zm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Fm(s,t,e){let n=new ka;const i=new rt,r=new rt,a=new fe,o=new Um({depthPacking:gh}),c=new Nm,l={},h=e.maxTextureSize,u={[Tn]:Ce,[Ce]:Tn,[Xe]:Xe},d=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:Om,fragmentShader:zm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Re;g.setAttribute("position",new Ze(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ct(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mc;let p=this.type;this.render=function(b,T,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const w=s.getRenderTarget(),y=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),V=s.state;V.setBlending(wn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const B=p!==hn&&this.type===hn,W=p===hn&&this.type!==hn;for(let Y=0,G=b.length;Y<G;Y++){const K=b[Y],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const dt=H.getFrameExtents();if(i.multiply(dt),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/dt.x),i.x=r.x*dt.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/dt.y),i.y=r.y*dt.y,H.mapSize.y=r.y)),H.map===null||B===!0||W===!0){const vt=this.type!==hn?{minFilter:Be,magFilter:Be}:{};H.map!==null&&H.map.dispose(),H.map=new Wn(i.x,i.y,vt),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const _t=H.getViewportCount();for(let vt=0;vt<_t;vt++){const Bt=H.getViewport(vt);a.set(r.x*Bt.x,r.y*Bt.y,r.x*Bt.z,r.y*Bt.w),V.viewport(a),H.updateMatrices(K,vt),n=H.getFrustum(),E(T,L,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===hn&&v(H,L),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,y,P)};function v(b,T){const L=t.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Wn(i.x,i.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(T,null,L,d,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(T,null,L,f,_,null)}function M(b,T,L,w){let y=null;const P=L.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)y=P;else if(y=L.isPointLight===!0?c:o,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const V=y.uuid,B=T.uuid;let W=l[V];W===void 0&&(W={},l[V]=W);let Y=W[B];Y===void 0&&(Y=y.clone(),W[B]=Y,T.addEventListener("dispose",D)),y=Y}if(y.visible=T.visible,y.wireframe=T.wireframe,w===hn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:u[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const V=s.properties.get(y);V.light=L}return y}function E(b,T,L,w,y){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&y===hn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const B=t.update(b),W=b.material;if(Array.isArray(W)){const Y=B.groups;for(let G=0,K=Y.length;G<K;G++){const H=Y[G],dt=W[H.materialIndex];if(dt&&dt.visible){const _t=M(b,dt,w,y);b.onBeforeShadow(s,b,T,L,B,_t,H),s.renderBufferDirect(L,null,B,_t,b,H),b.onAfterShadow(s,b,T,L,B,_t,H)}}}else if(W.visible){const Y=M(b,W,w,y);b.onBeforeShadow(s,b,T,L,B,Y,null),s.renderBufferDirect(L,null,B,Y,b,null),b.onAfterShadow(s,b,T,L,B,Y,null)}}const V=b.children;for(let B=0,W=V.length;B<W;B++)E(V[B],T,L,w,y)}function D(b){b.target.removeEventListener("dispose",D);for(const L in l){const w=l[L],y=b.target.uuid;y in w&&(w[y].dispose(),delete w[y])}}}function Bm(s){function t(){let U=!1;const et=new fe;let q=null;const $=new fe(0,0,0,0);return{setMask:function(it){q!==it&&!U&&(s.colorMask(it,it,it,it),q=it)},setLocked:function(it){U=it},setClear:function(it,wt,Vt,ce,xe){xe===!0&&(it*=ce,wt*=ce,Vt*=ce),et.set(it,wt,Vt,ce),$.equals(et)===!1&&(s.clearColor(it,wt,Vt,ce),$.copy(et))},reset:function(){U=!1,q=null,$.set(-1,0,0,0)}}}function e(){let U=!1,et=null,q=null,$=null;return{setTest:function(it){it?pt(s.DEPTH_TEST):ht(s.DEPTH_TEST)},setMask:function(it){et!==it&&!U&&(s.depthMask(it),et=it)},setFunc:function(it){if(q!==it){switch(it){case jl:s.depthFunc(s.NEVER);break;case Ql:s.depthFunc(s.ALWAYS);break;case th:s.depthFunc(s.LESS);break;case Vs:s.depthFunc(s.LEQUAL);break;case eh:s.depthFunc(s.EQUAL);break;case nh:s.depthFunc(s.GEQUAL);break;case ih:s.depthFunc(s.GREATER);break;case sh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}q=it}},setLocked:function(it){U=it},setClear:function(it){$!==it&&(s.clearDepth(it),$=it)},reset:function(){U=!1,et=null,q=null,$=null}}}function n(){let U=!1,et=null,q=null,$=null,it=null,wt=null,Vt=null,ce=null,xe=null;return{setTest:function(Gt){U||(Gt?pt(s.STENCIL_TEST):ht(s.STENCIL_TEST))},setMask:function(Gt){et!==Gt&&!U&&(s.stencilMask(Gt),et=Gt)},setFunc:function(Gt,sn,je){(q!==Gt||$!==sn||it!==je)&&(s.stencilFunc(Gt,sn,je),q=Gt,$=sn,it=je)},setOp:function(Gt,sn,je){(wt!==Gt||Vt!==sn||ce!==je)&&(s.stencilOp(Gt,sn,je),wt=Gt,Vt=sn,ce=je)},setLocked:function(Gt){U=Gt},setClear:function(Gt){xe!==Gt&&(s.clearStencil(Gt),xe=Gt)},reset:function(){U=!1,et=null,q=null,$=null,it=null,wt=null,Vt=null,ce=null,xe=null}}}const i=new t,r=new e,a=new n,o=new WeakMap,c=new WeakMap;let l={},h={},u=new WeakMap,d=[],f=null,g=!1,_=null,m=null,p=null,v=null,M=null,E=null,D=null,b=new Ft(0,0,0),T=0,L=!1,w=null,y=null,P=null,V=null,B=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,G=0;const K=s.getParameter(s.VERSION);K.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(K)[1]),Y=G>=1):K.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),Y=G>=2);let H=null,dt={};const _t=s.getParameter(s.SCISSOR_BOX),vt=s.getParameter(s.VIEWPORT),Bt=new fe().fromArray(_t),Zt=new fe().fromArray(vt);function X(U,et,q,$){const it=new Uint8Array(4),wt=s.createTexture();s.bindTexture(U,wt),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Vt=0;Vt<q;Vt++)U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY?s.texImage3D(et,0,s.RGBA,1,1,$,0,s.RGBA,s.UNSIGNED_BYTE,it):s.texImage2D(et+Vt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,it);return wt}const Q={};Q[s.TEXTURE_2D]=X(s.TEXTURE_2D,s.TEXTURE_2D,1),Q[s.TEXTURE_CUBE_MAP]=X(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[s.TEXTURE_2D_ARRAY]=X(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Q[s.TEXTURE_3D]=X(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),a.setClear(0),pt(s.DEPTH_TEST),r.setFunc(Vs),Jt(!1),yt(ho),pt(s.CULL_FACE),ae(wn);function pt(U){l[U]!==!0&&(s.enable(U),l[U]=!0)}function ht(U){l[U]!==!1&&(s.disable(U),l[U]=!1)}function Rt(U,et){return h[U]!==et?(s.bindFramebuffer(U,et),h[U]=et,U===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=et),U===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=et),!0):!1}function Ut(U,et){let q=d,$=!1;if(U){q=u.get(et),q===void 0&&(q=[],u.set(et,q));const it=U.textures;if(q.length!==it.length||q[0]!==s.COLOR_ATTACHMENT0){for(let wt=0,Vt=it.length;wt<Vt;wt++)q[wt]=s.COLOR_ATTACHMENT0+wt;q.length=it.length,$=!0}}else q[0]!==s.BACK&&(q[0]=s.BACK,$=!0);$&&s.drawBuffers(q)}function Ot(U){return f!==U?(s.useProgram(U),f=U,!0):!1}const ie={[Fn]:s.FUNC_ADD,[Nl]:s.FUNC_SUBTRACT,[Ol]:s.FUNC_REVERSE_SUBTRACT};ie[zl]=s.MIN,ie[Fl]=s.MAX;const R={[Bl]:s.ZERO,[kl]:s.ONE,[Vl]:s.SRC_COLOR,[Hr]:s.SRC_ALPHA,[Yl]:s.SRC_ALPHA_SATURATE,[Xl]:s.DST_COLOR,[Gl]:s.DST_ALPHA,[Hl]:s.ONE_MINUS_SRC_COLOR,[Gr]:s.ONE_MINUS_SRC_ALPHA,[ql]:s.ONE_MINUS_DST_COLOR,[Wl]:s.ONE_MINUS_DST_ALPHA,[$l]:s.CONSTANT_COLOR,[Kl]:s.ONE_MINUS_CONSTANT_COLOR,[Zl]:s.CONSTANT_ALPHA,[Jl]:s.ONE_MINUS_CONSTANT_ALPHA};function ae(U,et,q,$,it,wt,Vt,ce,xe,Gt){if(U===wn){g===!0&&(ht(s.BLEND),g=!1);return}if(g===!1&&(pt(s.BLEND),g=!0),U!==Ul){if(U!==_||Gt!==L){if((m!==Fn||M!==Fn)&&(s.blendEquation(s.FUNC_ADD),m=Fn,M=Fn),Gt)switch(U){case _i:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case uo:s.blendFunc(s.ONE,s.ONE);break;case fo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case po:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case _i:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case uo:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case fo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case po:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}p=null,v=null,E=null,D=null,b.set(0,0,0),T=0,_=U,L=Gt}return}it=it||et,wt=wt||q,Vt=Vt||$,(et!==m||it!==M)&&(s.blendEquationSeparate(ie[et],ie[it]),m=et,M=it),(q!==p||$!==v||wt!==E||Vt!==D)&&(s.blendFuncSeparate(R[q],R[$],R[wt],R[Vt]),p=q,v=$,E=wt,D=Vt),(ce.equals(b)===!1||xe!==T)&&(s.blendColor(ce.r,ce.g,ce.b,xe),b.copy(ce),T=xe),_=U,L=!1}function Yt(U,et){U.side===Xe?ht(s.CULL_FACE):pt(s.CULL_FACE);let q=U.side===Ce;et&&(q=!q),Jt(q),U.blending===_i&&U.transparent===!1?ae(wn):ae(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),r.setFunc(U.depthFunc),r.setTest(U.depthTest),r.setMask(U.depthWrite),i.setMask(U.colorWrite);const $=U.stencilWrite;a.setTest($),$&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),At(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?pt(s.SAMPLE_ALPHA_TO_COVERAGE):ht(s.SAMPLE_ALPHA_TO_COVERAGE)}function Jt(U){w!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),w=U)}function yt(U){U!==Ll?(pt(s.CULL_FACE),U!==y&&(U===ho?s.cullFace(s.BACK):U===Dl?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ht(s.CULL_FACE),y=U}function oe(U){U!==P&&(Y&&s.lineWidth(U),P=U)}function At(U,et,q){U?(pt(s.POLYGON_OFFSET_FILL),(V!==et||B!==q)&&(s.polygonOffset(et,q),V=et,B=q)):ht(s.POLYGON_OFFSET_FILL)}function Pt(U){U?pt(s.SCISSOR_TEST):ht(s.SCISSOR_TEST)}function A(U){U===void 0&&(U=s.TEXTURE0+W-1),H!==U&&(s.activeTexture(U),H=U)}function x(U,et,q){q===void 0&&(H===null?q=s.TEXTURE0+W-1:q=H);let $=dt[q];$===void 0&&($={type:void 0,texture:void 0},dt[q]=$),($.type!==U||$.texture!==et)&&(H!==q&&(s.activeTexture(q),H=q),s.bindTexture(U,et||Q[U]),$.type=U,$.texture=et)}function k(){const U=dt[H];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function J(){try{s.compressedTexImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{s.compressedTexImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{s.texSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Mt(){try{s.texSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function at(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ut(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Lt(){try{s.texStorage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function tt(){try{s.texStorage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(){try{s.texImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(){try{s.texImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Tt(U){Bt.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),Bt.copy(U))}function ft(U){Zt.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),Zt.copy(U))}function Ct(U,et){let q=c.get(et);q===void 0&&(q=new WeakMap,c.set(et,q));let $=q.get(U);$===void 0&&($=s.getUniformBlockIndex(et,U.name),q.set(U,$))}function Nt(U,et){const $=c.get(et).get(U);o.get(et)!==$&&(s.uniformBlockBinding(et,$,U.__bindingPointIndex),o.set(et,$))}function ee(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),l={},H=null,dt={},h={},u=new WeakMap,d=[],f=null,g=!1,_=null,m=null,p=null,v=null,M=null,E=null,D=null,b=new Ft(0,0,0),T=0,L=!1,w=null,y=null,P=null,V=null,B=null,Bt.set(0,0,s.canvas.width,s.canvas.height),Zt.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),a.reset()}return{buffers:{color:i,depth:r,stencil:a},enable:pt,disable:ht,bindFramebuffer:Rt,drawBuffers:Ut,useProgram:Ot,setBlending:ae,setMaterial:Yt,setFlipSided:Jt,setCullFace:yt,setLineWidth:oe,setPolygonOffset:At,setScissorTest:Pt,activeTexture:A,bindTexture:x,unbindTexture:k,compressedTexImage2D:J,compressedTexImage3D:j,texImage2D:lt,texImage3D:kt,updateUBOMapping:Ct,uniformBlockBinding:Nt,texStorage2D:Lt,texStorage3D:tt,texSubImage2D:Z,texSubImage3D:Mt,compressedTexSubImage2D:at,compressedTexSubImage3D:ut,scissor:Tt,viewport:ft,reset:ee}}function ac(s,t,e,n){const i=km(n);switch(e){case Ac:return s*t;case Rc:return s*t;case Pc:return s*t*2;case Lc:return s*t/i.components*i.byteLength;case Ia:return s*t/i.components*i.byteLength;case Dc:return s*t*2/i.components*i.byteLength;case Ua:return s*t*2/i.components*i.byteLength;case Cc:return s*t*3/i.components*i.byteLength;case Ke:return s*t*4/i.components*i.byteLength;case Na:return s*t*4/i.components*i.byteLength;case Ls:case Ds:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Is:case Us:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Kr:case Jr:return Math.max(s,16)*Math.max(t,8)/4;case $r:case Zr:return Math.max(s,8)*Math.max(t,8)/2;case jr:case Qr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ta:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ea:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case na:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case ia:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case sa:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case ra:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case aa:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case oa:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ca:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case la:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case ha:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ua:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case da:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case fa:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case pa:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Ns:case ma:case ga:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Ic:case _a:return Math.ceil(s/4)*Math.ceil(t/4)*8;case va:case xa:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function km(s){switch(s){case pn:case Ec:return{byteLength:1,components:1};case Xi:case bc:case $i:return{byteLength:2,components:1};case La:case Da:return{byteLength:2,components:4};case Gn:case Pa:case un:return{byteLength:4,components:1};case Tc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function Vm(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new rt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,x){return f?new OffscreenCanvas(A,x):qs("canvas")}function _(A,x,k){let J=1;const j=Pt(A);if((j.width>k||j.height>k)&&(J=k/Math.max(j.width,j.height)),J<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const Z=Math.floor(J*j.width),Mt=Math.floor(J*j.height);u===void 0&&(u=g(Z,Mt));const at=x?g(Z,Mt):u;return at.width=Z,at.height=Mt,at.getContext("2d").drawImage(A,0,0,Z,Mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+Z+"x"+Mt+")."),at}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),A;return A}function m(A){return A.generateMipmaps&&A.minFilter!==Be&&A.minFilter!==qe}function p(A){s.generateMipmap(A)}function v(A,x,k,J,j=!1){if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Z=x;if(x===s.RED&&(k===s.FLOAT&&(Z=s.R32F),k===s.HALF_FLOAT&&(Z=s.R16F),k===s.UNSIGNED_BYTE&&(Z=s.R8)),x===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(Z=s.R8UI),k===s.UNSIGNED_SHORT&&(Z=s.R16UI),k===s.UNSIGNED_INT&&(Z=s.R32UI),k===s.BYTE&&(Z=s.R8I),k===s.SHORT&&(Z=s.R16I),k===s.INT&&(Z=s.R32I)),x===s.RG&&(k===s.FLOAT&&(Z=s.RG32F),k===s.HALF_FLOAT&&(Z=s.RG16F),k===s.UNSIGNED_BYTE&&(Z=s.RG8)),x===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&(Z=s.RG8UI),k===s.UNSIGNED_SHORT&&(Z=s.RG16UI),k===s.UNSIGNED_INT&&(Z=s.RG32UI),k===s.BYTE&&(Z=s.RG8I),k===s.SHORT&&(Z=s.RG16I),k===s.INT&&(Z=s.RG32I)),x===s.RGB&&k===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),x===s.RGBA){const Mt=j?Hs:Kt.getTransfer(J);k===s.FLOAT&&(Z=s.RGBA32F),k===s.HALF_FLOAT&&(Z=s.RGBA16F),k===s.UNSIGNED_BYTE&&(Z=Mt===Qt?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function M(A,x){let k;return A?x===null||x===Gn||x===Si?k=s.DEPTH24_STENCIL8:x===un?k=s.DEPTH32F_STENCIL8:x===Xi&&(k=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Gn||x===Si?k=s.DEPTH_COMPONENT24:x===un?k=s.DEPTH_COMPONENT32F:x===Xi&&(k=s.DEPTH_COMPONENT16),k}function E(A,x){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Be&&A.minFilter!==qe?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function D(A){const x=A.target;x.removeEventListener("dispose",D),T(x),x.isVideoTexture&&h.delete(x)}function b(A){const x=A.target;x.removeEventListener("dispose",b),w(x)}function T(A){const x=n.get(A);if(x.__webglInit===void 0)return;const k=A.source,J=d.get(k);if(J){const j=J[x.__cacheKey];j.usedTimes--,j.usedTimes===0&&L(A),Object.keys(J).length===0&&d.delete(k)}n.remove(A)}function L(A){const x=n.get(A);s.deleteTexture(x.__webglTexture);const k=A.source,J=d.get(k);delete J[x.__cacheKey],a.memory.textures--}function w(A){const x=n.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(x.__webglFramebuffer[J]))for(let j=0;j<x.__webglFramebuffer[J].length;j++)s.deleteFramebuffer(x.__webglFramebuffer[J][j]);else s.deleteFramebuffer(x.__webglFramebuffer[J]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[J])}else{if(Array.isArray(x.__webglFramebuffer))for(let J=0;J<x.__webglFramebuffer.length;J++)s.deleteFramebuffer(x.__webglFramebuffer[J]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let J=0;J<x.__webglColorRenderbuffer.length;J++)x.__webglColorRenderbuffer[J]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[J]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const k=A.textures;for(let J=0,j=k.length;J<j;J++){const Z=n.get(k[J]);Z.__webglTexture&&(s.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(k[J])}n.remove(A)}let y=0;function P(){y=0}function V(){const A=y;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),y+=1,A}function B(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function W(A,x){const k=n.get(A);if(A.isVideoTexture&&oe(A),A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){const J=A.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Zt(k,A,x);return}}e.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+x)}function Y(A,x){const k=n.get(A);if(A.version>0&&k.__version!==A.version){Zt(k,A,x);return}e.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+x)}function G(A,x){const k=n.get(A);if(A.version>0&&k.__version!==A.version){Zt(k,A,x);return}e.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+x)}function K(A,x){const k=n.get(A);if(A.version>0&&k.__version!==A.version){X(k,A,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+x)}const H={[qr]:s.REPEAT,[Vn]:s.CLAMP_TO_EDGE,[Yr]:s.MIRRORED_REPEAT},dt={[Be]:s.NEAREST,[ph]:s.NEAREST_MIPMAP_NEAREST,[ts]:s.NEAREST_MIPMAP_LINEAR,[qe]:s.LINEAR,[ar]:s.LINEAR_MIPMAP_NEAREST,[Hn]:s.LINEAR_MIPMAP_LINEAR},_t={[vh]:s.NEVER,[Eh]:s.ALWAYS,[xh]:s.LESS,[Nc]:s.LEQUAL,[yh]:s.EQUAL,[wh]:s.GEQUAL,[Mh]:s.GREATER,[Sh]:s.NOTEQUAL};function vt(A,x){if(x.type===un&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===qe||x.magFilter===ar||x.magFilter===ts||x.magFilter===Hn||x.minFilter===qe||x.minFilter===ar||x.minFilter===ts||x.minFilter===Hn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,H[x.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,H[x.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,H[x.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,dt[x.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,dt[x.minFilter]),x.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,_t[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Be||x.minFilter!==ts&&x.minFilter!==Hn||x.type===un&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const k=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Bt(A,x){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",D));const J=x.source;let j=d.get(J);j===void 0&&(j={},d.set(J,j));const Z=B(x);if(Z!==A.__cacheKey){j[Z]===void 0&&(j[Z]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,k=!0),j[Z].usedTimes++;const Mt=j[A.__cacheKey];Mt!==void 0&&(j[A.__cacheKey].usedTimes--,Mt.usedTimes===0&&L(x)),A.__cacheKey=Z,A.__webglTexture=j[Z].texture}return k}function Zt(A,x,k){let J=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(J=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(J=s.TEXTURE_3D);const j=Bt(A,x),Z=x.source;e.bindTexture(J,A.__webglTexture,s.TEXTURE0+k);const Mt=n.get(Z);if(Z.version!==Mt.__version||j===!0){e.activeTexture(s.TEXTURE0+k);const at=Kt.getPrimaries(Kt.workingColorSpace),ut=x.colorSpace===Sn?null:Kt.getPrimaries(x.colorSpace),Lt=x.colorSpace===Sn||at===ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);let tt=_(x.image,!1,i.maxTextureSize);tt=At(x,tt);const lt=r.convert(x.format,x.colorSpace),kt=r.convert(x.type);let Tt=v(x.internalFormat,lt,kt,x.colorSpace,x.isVideoTexture);vt(J,x);let ft;const Ct=x.mipmaps,Nt=x.isVideoTexture!==!0,ee=Mt.__version===void 0||j===!0,U=Z.dataReady,et=E(x,tt);if(x.isDepthTexture)Tt=M(x.format===wi,x.type),ee&&(Nt?e.texStorage2D(s.TEXTURE_2D,1,Tt,tt.width,tt.height):e.texImage2D(s.TEXTURE_2D,0,Tt,tt.width,tt.height,0,lt,kt,null));else if(x.isDataTexture)if(Ct.length>0){Nt&&ee&&e.texStorage2D(s.TEXTURE_2D,et,Tt,Ct[0].width,Ct[0].height);for(let q=0,$=Ct.length;q<$;q++)ft=Ct[q],Nt?U&&e.texSubImage2D(s.TEXTURE_2D,q,0,0,ft.width,ft.height,lt,kt,ft.data):e.texImage2D(s.TEXTURE_2D,q,Tt,ft.width,ft.height,0,lt,kt,ft.data);x.generateMipmaps=!1}else Nt?(ee&&e.texStorage2D(s.TEXTURE_2D,et,Tt,tt.width,tt.height),U&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,tt.width,tt.height,lt,kt,tt.data)):e.texImage2D(s.TEXTURE_2D,0,Tt,tt.width,tt.height,0,lt,kt,tt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Nt&&ee&&e.texStorage3D(s.TEXTURE_2D_ARRAY,et,Tt,Ct[0].width,Ct[0].height,tt.depth);for(let q=0,$=Ct.length;q<$;q++)if(ft=Ct[q],x.format!==Ke)if(lt!==null)if(Nt){if(U)if(x.layerUpdates.size>0){const it=ac(ft.width,ft.height,x.format,x.type);for(const wt of x.layerUpdates){const Vt=ft.data.subarray(wt*it/ft.data.BYTES_PER_ELEMENT,(wt+1)*it/ft.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,wt,ft.width,ft.height,1,lt,Vt,0,0)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,0,ft.width,ft.height,tt.depth,lt,ft.data,0,0)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,q,Tt,ft.width,ft.height,tt.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?U&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,0,ft.width,ft.height,tt.depth,lt,kt,ft.data):e.texImage3D(s.TEXTURE_2D_ARRAY,q,Tt,ft.width,ft.height,tt.depth,0,lt,kt,ft.data)}else{Nt&&ee&&e.texStorage2D(s.TEXTURE_2D,et,Tt,Ct[0].width,Ct[0].height);for(let q=0,$=Ct.length;q<$;q++)ft=Ct[q],x.format!==Ke?lt!==null?Nt?U&&e.compressedTexSubImage2D(s.TEXTURE_2D,q,0,0,ft.width,ft.height,lt,ft.data):e.compressedTexImage2D(s.TEXTURE_2D,q,Tt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?U&&e.texSubImage2D(s.TEXTURE_2D,q,0,0,ft.width,ft.height,lt,kt,ft.data):e.texImage2D(s.TEXTURE_2D,q,Tt,ft.width,ft.height,0,lt,kt,ft.data)}else if(x.isDataArrayTexture)if(Nt){if(ee&&e.texStorage3D(s.TEXTURE_2D_ARRAY,et,Tt,tt.width,tt.height,tt.depth),U)if(x.layerUpdates.size>0){const q=ac(tt.width,tt.height,x.format,x.type);for(const $ of x.layerUpdates){const it=tt.data.subarray($*q/tt.data.BYTES_PER_ELEMENT,($+1)*q/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,$,tt.width,tt.height,1,lt,kt,it)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,lt,kt,tt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Tt,tt.width,tt.height,tt.depth,0,lt,kt,tt.data);else if(x.isData3DTexture)Nt?(ee&&e.texStorage3D(s.TEXTURE_3D,et,Tt,tt.width,tt.height,tt.depth),U&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,lt,kt,tt.data)):e.texImage3D(s.TEXTURE_3D,0,Tt,tt.width,tt.height,tt.depth,0,lt,kt,tt.data);else if(x.isFramebufferTexture){if(ee)if(Nt)e.texStorage2D(s.TEXTURE_2D,et,Tt,tt.width,tt.height);else{let q=tt.width,$=tt.height;for(let it=0;it<et;it++)e.texImage2D(s.TEXTURE_2D,it,Tt,q,$,0,lt,kt,null),q>>=1,$>>=1}}else if(Ct.length>0){if(Nt&&ee){const q=Pt(Ct[0]);e.texStorage2D(s.TEXTURE_2D,et,Tt,q.width,q.height)}for(let q=0,$=Ct.length;q<$;q++)ft=Ct[q],Nt?U&&e.texSubImage2D(s.TEXTURE_2D,q,0,0,lt,kt,ft):e.texImage2D(s.TEXTURE_2D,q,Tt,lt,kt,ft);x.generateMipmaps=!1}else if(Nt){if(ee){const q=Pt(tt);e.texStorage2D(s.TEXTURE_2D,et,Tt,q.width,q.height)}U&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,lt,kt,tt)}else e.texImage2D(s.TEXTURE_2D,0,Tt,lt,kt,tt);m(x)&&p(J),Mt.__version=Z.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function X(A,x,k){if(x.image.length!==6)return;const J=Bt(A,x),j=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+k);const Z=n.get(j);if(j.version!==Z.__version||J===!0){e.activeTexture(s.TEXTURE0+k);const Mt=Kt.getPrimaries(Kt.workingColorSpace),at=x.colorSpace===Sn?null:Kt.getPrimaries(x.colorSpace),ut=x.colorSpace===Sn||Mt===at?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Lt=x.isCompressedTexture||x.image[0].isCompressedTexture,tt=x.image[0]&&x.image[0].isDataTexture,lt=[];for(let $=0;$<6;$++)!Lt&&!tt?lt[$]=_(x.image[$],!0,i.maxCubemapSize):lt[$]=tt?x.image[$].image:x.image[$],lt[$]=At(x,lt[$]);const kt=lt[0],Tt=r.convert(x.format,x.colorSpace),ft=r.convert(x.type),Ct=v(x.internalFormat,Tt,ft,x.colorSpace),Nt=x.isVideoTexture!==!0,ee=Z.__version===void 0||J===!0,U=j.dataReady;let et=E(x,kt);vt(s.TEXTURE_CUBE_MAP,x);let q;if(Lt){Nt&&ee&&e.texStorage2D(s.TEXTURE_CUBE_MAP,et,Ct,kt.width,kt.height);for(let $=0;$<6;$++){q=lt[$].mipmaps;for(let it=0;it<q.length;it++){const wt=q[it];x.format!==Ke?Tt!==null?Nt?U&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it,0,0,wt.width,wt.height,Tt,wt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it,Ct,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?U&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it,0,0,wt.width,wt.height,Tt,ft,wt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it,Ct,wt.width,wt.height,0,Tt,ft,wt.data)}}}else{if(q=x.mipmaps,Nt&&ee){q.length>0&&et++;const $=Pt(lt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,et,Ct,$.width,$.height)}for(let $=0;$<6;$++)if(tt){Nt?U&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,lt[$].width,lt[$].height,Tt,ft,lt[$].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ct,lt[$].width,lt[$].height,0,Tt,ft,lt[$].data);for(let it=0;it<q.length;it++){const Vt=q[it].image[$].image;Nt?U&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it+1,0,0,Vt.width,Vt.height,Tt,ft,Vt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it+1,Ct,Vt.width,Vt.height,0,Tt,ft,Vt.data)}}else{Nt?U&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Tt,ft,lt[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ct,Tt,ft,lt[$]);for(let it=0;it<q.length;it++){const wt=q[it];Nt?U&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it+1,0,0,Tt,ft,wt.image[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,it+1,Ct,Tt,ft,wt.image[$])}}}m(x)&&p(s.TEXTURE_CUBE_MAP),Z.__version=j.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Q(A,x,k,J,j,Z){const Mt=r.convert(k.format,k.colorSpace),at=r.convert(k.type),ut=v(k.internalFormat,Mt,at,k.colorSpace);if(!n.get(x).__hasExternalTextures){const tt=Math.max(1,x.width>>Z),lt=Math.max(1,x.height>>Z);j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?e.texImage3D(j,Z,ut,tt,lt,x.depth,0,Mt,at,null):e.texImage2D(j,Z,ut,tt,lt,0,Mt,at,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),yt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,j,n.get(k).__webglTexture,0,Jt(x)):(j===s.TEXTURE_2D||j>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,J,j,n.get(k).__webglTexture,Z),e.bindFramebuffer(s.FRAMEBUFFER,null)}function pt(A,x,k){if(s.bindRenderbuffer(s.RENDERBUFFER,A),x.depthBuffer){const J=x.depthTexture,j=J&&J.isDepthTexture?J.type:null,Z=M(x.stencilBuffer,j),Mt=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,at=Jt(x);yt(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,at,Z,x.width,x.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,at,Z,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,Z,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Mt,s.RENDERBUFFER,A)}else{const J=x.textures;for(let j=0;j<J.length;j++){const Z=J[j],Mt=r.convert(Z.format,Z.colorSpace),at=r.convert(Z.type),ut=v(Z.internalFormat,Mt,at,Z.colorSpace),Lt=Jt(x);k&&yt(x)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Lt,ut,x.width,x.height):yt(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Lt,ut,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,ut,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ht(A,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W(x.depthTexture,0);const J=n.get(x.depthTexture).__webglTexture,j=Jt(x);if(x.depthTexture.format===vi)yt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0,j):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0);else if(x.depthTexture.format===wi)yt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0,j):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Rt(A){const x=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!x.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");ht(x.__webglFramebuffer,A)}else if(k){x.__webglDepthbuffer=[];for(let J=0;J<6;J++)e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[J]),x.__webglDepthbuffer[J]=s.createRenderbuffer(),pt(x.__webglDepthbuffer[J],A,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=s.createRenderbuffer(),pt(x.__webglDepthbuffer,A,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ut(A,x,k){const J=n.get(A);x!==void 0&&Q(J.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&Rt(A)}function Ot(A){const x=A.texture,k=n.get(A),J=n.get(x);A.addEventListener("dispose",b);const j=A.textures,Z=A.isWebGLCubeRenderTarget===!0,Mt=j.length>1;if(Mt||(J.__webglTexture===void 0&&(J.__webglTexture=s.createTexture()),J.__version=x.version,a.memory.textures++),Z){k.__webglFramebuffer=[];for(let at=0;at<6;at++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[at]=[];for(let ut=0;ut<x.mipmaps.length;ut++)k.__webglFramebuffer[at][ut]=s.createFramebuffer()}else k.__webglFramebuffer[at]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let at=0;at<x.mipmaps.length;at++)k.__webglFramebuffer[at]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(Mt)for(let at=0,ut=j.length;at<ut;at++){const Lt=n.get(j[at]);Lt.__webglTexture===void 0&&(Lt.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&yt(A)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let at=0;at<j.length;at++){const ut=j[at];k.__webglColorRenderbuffer[at]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[at]);const Lt=r.convert(ut.format,ut.colorSpace),tt=r.convert(ut.type),lt=v(ut.internalFormat,Lt,tt,ut.colorSpace,A.isXRRenderTarget===!0),kt=Jt(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,kt,lt,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+at,s.RENDERBUFFER,k.__webglColorRenderbuffer[at])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),pt(k.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){e.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),vt(s.TEXTURE_CUBE_MAP,x);for(let at=0;at<6;at++)if(x.mipmaps&&x.mipmaps.length>0)for(let ut=0;ut<x.mipmaps.length;ut++)Q(k.__webglFramebuffer[at][ut],A,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+at,ut);else Q(k.__webglFramebuffer[at],A,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(x)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Mt){for(let at=0,ut=j.length;at<ut;at++){const Lt=j[at],tt=n.get(Lt);e.bindTexture(s.TEXTURE_2D,tt.__webglTexture),vt(s.TEXTURE_2D,Lt),Q(k.__webglFramebuffer,A,Lt,s.COLOR_ATTACHMENT0+at,s.TEXTURE_2D,0),m(Lt)&&p(s.TEXTURE_2D)}e.unbindTexture()}else{let at=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(at=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(at,J.__webglTexture),vt(at,x),x.mipmaps&&x.mipmaps.length>0)for(let ut=0;ut<x.mipmaps.length;ut++)Q(k.__webglFramebuffer[ut],A,x,s.COLOR_ATTACHMENT0,at,ut);else Q(k.__webglFramebuffer,A,x,s.COLOR_ATTACHMENT0,at,0);m(x)&&p(at),e.unbindTexture()}A.depthBuffer&&Rt(A)}function ie(A){const x=A.textures;for(let k=0,J=x.length;k<J;k++){const j=x[k];if(m(j)){const Z=A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,Mt=n.get(j).__webglTexture;e.bindTexture(Z,Mt),p(Z),e.unbindTexture()}}}const R=[],ae=[];function Yt(A){if(A.samples>0){if(yt(A)===!1){const x=A.textures,k=A.width,J=A.height;let j=s.COLOR_BUFFER_BIT;const Z=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Mt=n.get(A),at=x.length>1;if(at)for(let ut=0;ut<x.length;ut++)e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let ut=0;ut<x.length;ut++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(j|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(j|=s.STENCIL_BUFFER_BIT)),at){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Mt.__webglColorRenderbuffer[ut]);const Lt=n.get(x[ut]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Lt,0)}s.blitFramebuffer(0,0,k,J,0,0,k,J,j,s.NEAREST),c===!0&&(R.length=0,ae.length=0,R.push(s.COLOR_ATTACHMENT0+ut),A.depthBuffer&&A.resolveDepthBuffer===!1&&(R.push(Z),ae.push(Z),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ae)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,R))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),at)for(let ut=0;ut<x.length;ut++){e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,Mt.__webglColorRenderbuffer[ut]);const Lt=n.get(x[ut]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,Lt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const x=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function Jt(A){return Math.min(i.maxSamples,A.samples)}function yt(A){const x=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function oe(A){const x=a.render.frame;h.get(A)!==x&&(h.set(A,x),A.update())}function At(A,x){const k=A.colorSpace,J=A.format,j=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==Cn&&k!==Sn&&(Kt.getTransfer(k)===Qt?(J!==Ke||j!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),x}function Pt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=V,this.resetTextureUnits=P,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=G,this.setTextureCube=K,this.rebindTextures=Ut,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=Yt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=yt}function Hm(s,t){function e(n,i=Sn){let r;const a=Kt.getTransfer(i);if(n===pn)return s.UNSIGNED_BYTE;if(n===La)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Da)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Tc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Ec)return s.BYTE;if(n===bc)return s.SHORT;if(n===Xi)return s.UNSIGNED_SHORT;if(n===Pa)return s.INT;if(n===Gn)return s.UNSIGNED_INT;if(n===un)return s.FLOAT;if(n===$i)return s.HALF_FLOAT;if(n===Ac)return s.ALPHA;if(n===Cc)return s.RGB;if(n===Ke)return s.RGBA;if(n===Rc)return s.LUMINANCE;if(n===Pc)return s.LUMINANCE_ALPHA;if(n===vi)return s.DEPTH_COMPONENT;if(n===wi)return s.DEPTH_STENCIL;if(n===Lc)return s.RED;if(n===Ia)return s.RED_INTEGER;if(n===Dc)return s.RG;if(n===Ua)return s.RG_INTEGER;if(n===Na)return s.RGBA_INTEGER;if(n===Ls||n===Ds||n===Is||n===Us)if(a===Qt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ls)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Is)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Us)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ls)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Is)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Us)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$r||n===Kr||n===Zr||n===Jr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$r)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Kr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Jr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===jr||n===Qr||n===ta)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===jr||n===Qr)return a===Qt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ta)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ea||n===na||n===ia||n===sa||n===ra||n===aa||n===oa||n===ca||n===la||n===ha||n===ua||n===da||n===fa||n===pa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ea)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===na)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ia)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===sa)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ra)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===aa)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oa)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ca)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===la)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ha)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ua)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===da)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fa)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===pa)return a===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ns||n===ma||n===ga)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ns)return a===Qt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ma)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ga)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ic||n===_a||n===va||n===xa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ns)return r.COMPRESSED_RED_RGTC1_EXT;if(n===_a)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===xa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Si?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class Gm extends ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class jt extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wm={type:"move"};class Lr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wm)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new jt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Xm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ym{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Ae,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new An({vertexShader:Xm,fragmentShader:qm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ct(new Xn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $m extends bi{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=new Ym,m=e.getContextAttributes();let p=null,v=null;const M=[],E=[],D=new rt;let b=null;const T=new ze;T.layers.enable(1),T.viewport=new fe;const L=new ze;L.layers.enable(2),L.viewport=new fe;const w=[T,L],y=new Gm;y.layers.enable(1),y.layers.enable(2);let P=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Q=M[X];return Q===void 0&&(Q=new Lr,M[X]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(X){let Q=M[X];return Q===void 0&&(Q=new Lr,M[X]=Q),Q.getGripSpace()},this.getHand=function(X){let Q=M[X];return Q===void 0&&(Q=new Lr,M[X]=Q),Q.getHandSpace()};function B(X){const Q=E.indexOf(X.inputSource);if(Q===-1)return;const pt=M[Q];pt!==void 0&&(pt.update(X.inputSource,X.frame,l||a),pt.dispatchEvent({type:X.type,data:X.inputSource}))}function W(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",Y);for(let X=0;X<M.length;X++){const Q=E[X];Q!==null&&(E[X]=null,M[X].disconnect(Q))}P=null,V=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,i=null,v=null,Zt.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(X){if(i=X,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",W),i.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(D),i.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,Q),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Wn(f.framebufferWidth,f.framebufferHeight,{format:Ke,type:pn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,pt=null,ht=null;m.depth&&(ht=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=m.stencil?wi:vi,pt=m.stencil?Si:Gn);const Rt={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(Rt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new Wn(d.textureWidth,d.textureHeight,{format:Ke,type:pn,depthTexture:new $c(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),Zt.setContext(i),Zt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Y(X){for(let Q=0;Q<X.removed.length;Q++){const pt=X.removed[Q],ht=E.indexOf(pt);ht>=0&&(E[ht]=null,M[ht].disconnect(pt))}for(let Q=0;Q<X.added.length;Q++){const pt=X.added[Q];let ht=E.indexOf(pt);if(ht===-1){for(let Ut=0;Ut<M.length;Ut++)if(Ut>=E.length){E.push(pt),ht=Ut;break}else if(E[Ut]===null){E[Ut]=pt,ht=Ut;break}if(ht===-1)break}const Rt=M[ht];Rt&&Rt.connect(pt)}}const G=new C,K=new C;function H(X,Q,pt){G.setFromMatrixPosition(Q.matrixWorld),K.setFromMatrixPosition(pt.matrixWorld);const ht=G.distanceTo(K),Rt=Q.projectionMatrix.elements,Ut=pt.projectionMatrix.elements,Ot=Rt[14]/(Rt[10]-1),ie=Rt[14]/(Rt[10]+1),R=(Rt[9]+1)/Rt[5],ae=(Rt[9]-1)/Rt[5],Yt=(Rt[8]-1)/Rt[0],Jt=(Ut[8]+1)/Ut[0],yt=Ot*Yt,oe=Ot*Jt,At=ht/(-Yt+Jt),Pt=At*-Yt;Q.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Pt),X.translateZ(At),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const A=Ot+At,x=ie+At,k=yt-Pt,J=oe+(ht-Pt),j=R*ie/x*A,Z=ae*ie/x*A;X.projectionMatrix.makePerspective(k,J,j,Z,A,x),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function dt(X,Q){Q===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Q.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(i===null)return;_.texture!==null&&(X.near=_.depthNear,X.far=_.depthFar),y.near=L.near=T.near=X.near,y.far=L.far=T.far=X.far,(P!==y.near||V!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,V=y.far,T.near=P,T.far=V,L.near=P,L.far=V,T.updateProjectionMatrix(),L.updateProjectionMatrix(),X.updateProjectionMatrix());const Q=X.parent,pt=y.cameras;dt(y,Q);for(let ht=0;ht<pt.length;ht++)dt(pt[ht],Q);pt.length===2?H(y,T,L):y.projectionMatrix.copy(T.projectionMatrix),_t(X,y,Q)};function _t(X,Q,pt){pt===null?X.matrix.copy(Q.matrixWorld):(X.matrix.copy(pt.matrixWorld),X.matrix.invert(),X.matrix.multiply(Q.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Q.projectionMatrix),X.projectionMatrixInverse.copy(Q.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=qi*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(X){c=X,d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let vt=null;function Bt(X,Q){if(h=Q.getViewerPose(l||a),g=Q,h!==null){const pt=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let ht=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,ht=!0);for(let Ut=0;Ut<pt.length;Ut++){const Ot=pt[Ut];let ie=null;if(f!==null)ie=f.getViewport(Ot);else{const ae=u.getViewSubImage(d,Ot);ie=ae.viewport,Ut===0&&(t.setRenderTargetTextures(v,ae.colorTexture,d.ignoreDepthValues?void 0:ae.depthStencilTexture),t.setRenderTarget(v))}let R=w[Ut];R===void 0&&(R=new ze,R.layers.enable(Ut),R.viewport=new fe,w[Ut]=R),R.matrix.fromArray(Ot.transform.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale),R.projectionMatrix.fromArray(Ot.projectionMatrix),R.projectionMatrixInverse.copy(R.projectionMatrix).invert(),R.viewport.set(ie.x,ie.y,ie.width,ie.height),Ut===0&&(y.matrix.copy(R.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ht===!0&&y.cameras.push(R)}const Rt=i.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")){const Ut=u.getDepthInformation(pt[0]);Ut&&Ut.isValid&&Ut.texture&&_.init(t,Ut,i.renderState)}}for(let pt=0;pt<M.length;pt++){const ht=E[pt],Rt=M[pt];ht!==null&&Rt!==void 0&&Rt.update(ht,Q,l||a)}vt&&vt(X,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Zt=new qc;Zt.setAnimationLoop(Bt),this.setAnimationLoop=function(X){vt=X},this.dispose=function(){}}}const Nn=new Je,Km=new ne;function Zm(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Gc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,v,M,E){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,E)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,v,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ce&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ce&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),M=v.envMap,E=v.envMapRotation;M&&(m.envMap.value=M,Nn.copy(E),Nn.x*=-1,Nn.y*=-1,Nn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Nn.y*=-1,Nn.z*=-1),m.envMapRotation.value.setFromMatrix4(Km.makeRotationFromEuler(Nn)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ce&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Jm(s,t,e,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,M){const E=M.program;n.uniformBlockBinding(v,E)}function l(v,M){let E=i[v.id];E===void 0&&(g(v),E=h(v),i[v.id]=E,v.addEventListener("dispose",m));const D=M.program;n.updateUBOMapping(v,D);const b=t.render.frame;r[v.id]!==b&&(d(v),r[v.id]=b)}function h(v){const M=u();v.__bindingPointIndex=M;const E=s.createBuffer(),D=v.__size,b=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,D,b),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,E),E}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const M=i[v.id],E=v.uniforms,D=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let b=0,T=E.length;b<T;b++){const L=Array.isArray(E[b])?E[b]:[E[b]];for(let w=0,y=L.length;w<y;w++){const P=L[w];if(f(P,b,w,D)===!0){const V=P.__offset,B=Array.isArray(P.value)?P.value:[P.value];let W=0;for(let Y=0;Y<B.length;Y++){const G=B[Y],K=_(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,V+W,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,W),W+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,V,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(v,M,E,D){const b=v.value,T=M+"_"+E;if(D[T]===void 0)return typeof b=="number"||typeof b=="boolean"?D[T]=b:D[T]=b.clone(),!0;{const L=D[T];if(typeof b=="number"||typeof b=="boolean"){if(L!==b)return D[T]=b,!0}else if(L.equals(b)===!1)return L.copy(b),!0}return!1}function g(v){const M=v.uniforms;let E=0;const D=16;for(let T=0,L=M.length;T<L;T++){const w=Array.isArray(M[T])?M[T]:[M[T]];for(let y=0,P=w.length;y<P;y++){const V=w[y],B=Array.isArray(V.value)?V.value:[V.value];for(let W=0,Y=B.length;W<Y;W++){const G=B[W],K=_(G),H=E%D;H!==0&&D-H<K.boundary&&(E+=D-H),V.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=E,E+=K.storage}}}const b=E%D;return b>0&&(E+=D-b),v.__size=E,v.__cache={},this}function _(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function m(v){const M=v.target;M.removeEventListener("dispose",m);const E=a.indexOf(M.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(i[M.id]),delete i[M.id],delete r[M.id]}function p(){for(const v in i)s.deleteBuffer(i[v]);a=[],i={},r={}}return{bind:c,update:l,dispose:p}}class jm{constructor(t={}){const{canvas:e=Vh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Oe,this.toneMapping=En,this.toneMappingExposure=1;const M=this;let E=!1,D=0,b=0,T=null,L=-1,w=null;const y=new fe,P=new fe;let V=null;const B=new Ft(0);let W=0,Y=e.width,G=e.height,K=1,H=null,dt=null;const _t=new fe(0,0,Y,G),vt=new fe(0,0,Y,G);let Bt=!1;const Zt=new ka;let X=!1,Q=!1;const pt=new ne,ht=new C,Rt=new fe,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ot=!1;function ie(){return T===null?K:1}let R=n;function ae(S,N){return e.getContext(S,N)}try{const S={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ra}`),e.addEventListener("webglcontextlost",q,!1),e.addEventListener("webglcontextrestored",$,!1),e.addEventListener("webglcontextcreationerror",it,!1),R===null){const N="webgl2";if(R=ae(N,S),R===null)throw ae(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Yt,Jt,yt,oe,At,Pt,A,x,k,J,j,Z,Mt,at,ut,Lt,tt,lt,kt,Tt,ft,Ct,Nt,ee;function U(){Yt=new rp(R),Yt.init(),Ct=new Hm(R,Yt),Jt=new Qf(R,Yt,t,Ct),yt=new Bm(R),oe=new cp(R),At=new bm,Pt=new Vm(R,Yt,yt,At,Jt,Ct,oe),A=new ep(M),x=new sp(M),k=new pu(R),Nt=new Jf(R,k),J=new ap(R,k,oe,Nt),j=new hp(R,J,k,oe),kt=new lp(R,Jt,Pt),Lt=new tp(At),Z=new Em(M,A,x,Yt,Jt,Nt,Lt),Mt=new Zm(M,At),at=new Am,ut=new Im(Yt),lt=new Zf(M,A,x,yt,j,d,c),tt=new Fm(M,j,Jt),ee=new Jm(R,oe,Jt,yt),Tt=new jf(R,Yt,oe),ft=new op(R,Yt,oe),oe.programs=Z.programs,M.capabilities=Jt,M.extensions=Yt,M.properties=At,M.renderLists=at,M.shadowMap=tt,M.state=yt,M.info=oe}U();const et=new $m(M,R);this.xr=et,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const S=Yt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Yt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(S){S!==void 0&&(K=S,this.setSize(Y,G,!1))},this.getSize=function(S){return S.set(Y,G)},this.setSize=function(S,N,z=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=S,G=N,e.width=Math.floor(S*K),e.height=Math.floor(N*K),z===!0&&(e.style.width=S+"px",e.style.height=N+"px"),this.setViewport(0,0,S,N)},this.getDrawingBufferSize=function(S){return S.set(Y*K,G*K).floor()},this.setDrawingBufferSize=function(S,N,z){Y=S,G=N,K=z,e.width=Math.floor(S*z),e.height=Math.floor(N*z),this.setViewport(0,0,S,N)},this.getCurrentViewport=function(S){return S.copy(y)},this.getViewport=function(S){return S.copy(_t)},this.setViewport=function(S,N,z,F){S.isVector4?_t.set(S.x,S.y,S.z,S.w):_t.set(S,N,z,F),yt.viewport(y.copy(_t).multiplyScalar(K).round())},this.getScissor=function(S){return S.copy(vt)},this.setScissor=function(S,N,z,F){S.isVector4?vt.set(S.x,S.y,S.z,S.w):vt.set(S,N,z,F),yt.scissor(P.copy(vt).multiplyScalar(K).round())},this.getScissorTest=function(){return Bt},this.setScissorTest=function(S){yt.setScissorTest(Bt=S)},this.setOpaqueSort=function(S){H=S},this.setTransparentSort=function(S){dt=S},this.getClearColor=function(S){return S.copy(lt.getClearColor())},this.setClearColor=function(){lt.setClearColor.apply(lt,arguments)},this.getClearAlpha=function(){return lt.getClearAlpha()},this.setClearAlpha=function(){lt.setClearAlpha.apply(lt,arguments)},this.clear=function(S=!0,N=!0,z=!0){let F=0;if(S){let O=!1;if(T!==null){const nt=T.texture.format;O=nt===Na||nt===Ua||nt===Ia}if(O){const nt=T.texture.type,ot=nt===pn||nt===Gn||nt===Xi||nt===Si||nt===La||nt===Da,mt=lt.getClearColor(),gt=lt.getClearAlpha(),Et=mt.r,bt=mt.g,St=mt.b;ot?(f[0]=Et,f[1]=bt,f[2]=St,f[3]=gt,R.clearBufferuiv(R.COLOR,0,f)):(g[0]=Et,g[1]=bt,g[2]=St,g[3]=gt,R.clearBufferiv(R.COLOR,0,g))}else F|=R.COLOR_BUFFER_BIT}N&&(F|=R.DEPTH_BUFFER_BIT),z&&(F|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",q,!1),e.removeEventListener("webglcontextrestored",$,!1),e.removeEventListener("webglcontextcreationerror",it,!1),at.dispose(),ut.dispose(),At.dispose(),A.dispose(),x.dispose(),j.dispose(),Nt.dispose(),ee.dispose(),Z.dispose(),et.dispose(),et.removeEventListener("sessionstart",je),et.removeEventListener("sessionend",io),Rn.stop()};function q(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function $(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const S=oe.autoReset,N=tt.enabled,z=tt.autoUpdate,F=tt.needsUpdate,O=tt.type;U(),oe.autoReset=S,tt.enabled=N,tt.autoUpdate=z,tt.needsUpdate=F,tt.type=O}function it(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function wt(S){const N=S.target;N.removeEventListener("dispose",wt),Vt(N)}function Vt(S){ce(S),At.remove(S)}function ce(S){const N=At.get(S).programs;N!==void 0&&(N.forEach(function(z){Z.releaseProgram(z)}),S.isShaderMaterial&&Z.releaseShaderCache(S))}this.renderBufferDirect=function(S,N,z,F,O,nt){N===null&&(N=Ut);const ot=O.isMesh&&O.matrixWorld.determinant()<0,mt=bl(S,N,z,F,O);yt.setMaterial(F,ot);let gt=z.index,Et=1;if(F.wireframe===!0){if(gt=J.getWireframeAttribute(z),gt===void 0)return;Et=2}const bt=z.drawRange,St=z.attributes.position;let Wt=bt.start*Et,se=(bt.start+bt.count)*Et;nt!==null&&(Wt=Math.max(Wt,nt.start*Et),se=Math.min(se,(nt.start+nt.count)*Et)),gt!==null?(Wt=Math.max(Wt,0),se=Math.min(se,gt.count)):St!=null&&(Wt=Math.max(Wt,0),se=Math.min(se,St.count));const re=se-Wt;if(re<0||re===1/0)return;Nt.setup(O,F,mt,z,gt);let Pe,Xt=Tt;if(gt!==null&&(Pe=k.get(gt),Xt=ft,Xt.setIndex(Pe)),O.isMesh)F.wireframe===!0?(yt.setLineWidth(F.wireframeLinewidth*ie()),Xt.setMode(R.LINES)):Xt.setMode(R.TRIANGLES);else if(O.isLine){let xt=F.linewidth;xt===void 0&&(xt=1),yt.setLineWidth(xt*ie()),O.isLineSegments?Xt.setMode(R.LINES):O.isLineLoop?Xt.setMode(R.LINE_LOOP):Xt.setMode(R.LINE_STRIP)}else O.isPoints?Xt.setMode(R.POINTS):O.isSprite&&Xt.setMode(R.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Xt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Yt.get("WEBGL_multi_draw"))Xt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const xt=O._multiDrawStarts,ye=O._multiDrawCounts,qt=O._multiDrawCount,ke=gt?k.get(gt).bytesPerElement:1,qn=At.get(F).currentProgram.getUniforms();for(let Le=0;Le<qt;Le++)qn.setValue(R,"_gl_DrawID",Le),Xt.render(xt[Le]/ke,ye[Le])}else if(O.isInstancedMesh)Xt.renderInstances(Wt,re,O.count);else if(z.isInstancedBufferGeometry){const xt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ye=Math.min(z.instanceCount,xt);Xt.renderInstances(Wt,re,ye)}else Xt.render(Wt,re)};function xe(S,N,z){S.transparent===!0&&S.side===Xe&&S.forceSinglePass===!1?(S.side=Ce,S.needsUpdate=!0,Qi(S,N,z),S.side=Tn,S.needsUpdate=!0,Qi(S,N,z),S.side=Xe):Qi(S,N,z)}this.compile=function(S,N,z=null){z===null&&(z=S),m=ut.get(z),m.init(N),v.push(m),z.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),S!==z&&S.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();const F=new Set;return S.traverse(function(O){const nt=O.material;if(nt)if(Array.isArray(nt))for(let ot=0;ot<nt.length;ot++){const mt=nt[ot];xe(mt,z,O),F.add(mt)}else xe(nt,z,O),F.add(nt)}),v.pop(),m=null,F},this.compileAsync=function(S,N,z=null){const F=this.compile(S,N,z);return new Promise(O=>{function nt(){if(F.forEach(function(ot){At.get(ot).currentProgram.isReady()&&F.delete(ot)}),F.size===0){O(S);return}setTimeout(nt,10)}Yt.get("KHR_parallel_shader_compile")!==null?nt():setTimeout(nt,10)})};let Gt=null;function sn(S){Gt&&Gt(S)}function je(){Rn.stop()}function io(){Rn.start()}const Rn=new qc;Rn.setAnimationLoop(sn),typeof self<"u"&&Rn.setContext(self),this.setAnimationLoop=function(S){Gt=S,et.setAnimationLoop(S),S===null?Rn.stop():Rn.start()},et.addEventListener("sessionstart",je),et.addEventListener("sessionend",io),this.render=function(S,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(N),N=et.getCamera()),S.isScene===!0&&S.onBeforeRender(M,S,N,T),m=ut.get(S,v.length),m.init(N),v.push(m),pt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Zt.setFromProjectionMatrix(pt),Q=this.localClippingEnabled,X=Lt.init(this.clippingPlanes,Q),_=at.get(S,p.length),_.init(),p.push(_),et.enabled===!0&&et.isPresenting===!0){const nt=M.xr.getDepthSensingMesh();nt!==null&&nr(nt,N,-1/0,M.sortObjects)}nr(S,N,0,M.sortObjects),_.finish(),M.sortObjects===!0&&_.sort(H,dt),Ot=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,Ot&&lt.addToRenderList(_,S),this.info.render.frame++,X===!0&&Lt.beginShadows();const z=m.state.shadowsArray;tt.render(z,S,N),X===!0&&Lt.endShadows(),this.info.autoReset===!0&&this.info.reset();const F=_.opaque,O=_.transmissive;if(m.setupLights(),N.isArrayCamera){const nt=N.cameras;if(O.length>0)for(let ot=0,mt=nt.length;ot<mt;ot++){const gt=nt[ot];ro(F,O,S,gt)}Ot&&lt.render(S);for(let ot=0,mt=nt.length;ot<mt;ot++){const gt=nt[ot];so(_,S,gt,gt.viewport)}}else O.length>0&&ro(F,O,S,N),Ot&&lt.render(S),so(_,S,N);T!==null&&(Pt.updateMultisampleRenderTarget(T),Pt.updateRenderTargetMipmap(T)),S.isScene===!0&&S.onAfterRender(M,S,N),Nt.resetDefaultState(),L=-1,w=null,v.pop(),v.length>0?(m=v[v.length-1],X===!0&&Lt.setGlobalState(M.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function nr(S,N,z,F){if(S.visible===!1)return;if(S.layers.test(N.layers)){if(S.isGroup)z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(N);else if(S.isLight)m.pushLight(S),S.castShadow&&m.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Zt.intersectsSprite(S)){F&&Rt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(pt);const ot=j.update(S),mt=S.material;mt.visible&&_.push(S,ot,mt,z,Rt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Zt.intersectsObject(S))){const ot=j.update(S),mt=S.material;if(F&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Rt.copy(S.boundingSphere.center)):(ot.boundingSphere===null&&ot.computeBoundingSphere(),Rt.copy(ot.boundingSphere.center)),Rt.applyMatrix4(S.matrixWorld).applyMatrix4(pt)),Array.isArray(mt)){const gt=ot.groups;for(let Et=0,bt=gt.length;Et<bt;Et++){const St=gt[Et],Wt=mt[St.materialIndex];Wt&&Wt.visible&&_.push(S,ot,Wt,z,Rt.z,St)}}else mt.visible&&_.push(S,ot,mt,z,Rt.z,null)}}const nt=S.children;for(let ot=0,mt=nt.length;ot<mt;ot++)nr(nt[ot],N,z,F)}function so(S,N,z,F){const O=S.opaque,nt=S.transmissive,ot=S.transparent;m.setupLightsView(z),X===!0&&Lt.setGlobalState(M.clippingPlanes,z),F&&yt.viewport(y.copy(F)),O.length>0&&ji(O,N,z),nt.length>0&&ji(nt,N,z),ot.length>0&&ji(ot,N,z),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function ro(S,N,z,F){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[F.id]===void 0&&(m.state.transmissionRenderTarget[F.id]=new Wn(1,1,{generateMipmaps:!0,type:Yt.has("EXT_color_buffer_half_float")||Yt.has("EXT_color_buffer_float")?$i:pn,minFilter:Hn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));const nt=m.state.transmissionRenderTarget[F.id],ot=F.viewport||y;nt.setSize(ot.z,ot.w);const mt=M.getRenderTarget();M.setRenderTarget(nt),M.getClearColor(B),W=M.getClearAlpha(),W<1&&M.setClearColor(16777215,.5),Ot?lt.render(z):M.clear();const gt=M.toneMapping;M.toneMapping=En;const Et=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),m.setupLightsView(F),X===!0&&Lt.setGlobalState(M.clippingPlanes,F),ji(S,z,F),Pt.updateMultisampleRenderTarget(nt),Pt.updateRenderTargetMipmap(nt),Yt.has("WEBGL_multisampled_render_to_texture")===!1){let bt=!1;for(let St=0,Wt=N.length;St<Wt;St++){const se=N[St],re=se.object,Pe=se.geometry,Xt=se.material,xt=se.group;if(Xt.side===Xe&&re.layers.test(F.layers)){const ye=Xt.side;Xt.side=Ce,Xt.needsUpdate=!0,ao(re,z,F,Pe,Xt,xt),Xt.side=ye,Xt.needsUpdate=!0,bt=!0}}bt===!0&&(Pt.updateMultisampleRenderTarget(nt),Pt.updateRenderTargetMipmap(nt))}M.setRenderTarget(mt),M.setClearColor(B,W),Et!==void 0&&(F.viewport=Et),M.toneMapping=gt}function ji(S,N,z){const F=N.isScene===!0?N.overrideMaterial:null;for(let O=0,nt=S.length;O<nt;O++){const ot=S[O],mt=ot.object,gt=ot.geometry,Et=F===null?ot.material:F,bt=ot.group;mt.layers.test(z.layers)&&ao(mt,N,z,gt,Et,bt)}}function ao(S,N,z,F,O,nt){S.onBeforeRender(M,N,z,F,O,nt),S.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),O.transparent===!0&&O.side===Xe&&O.forceSinglePass===!1?(O.side=Ce,O.needsUpdate=!0,M.renderBufferDirect(z,N,F,O,S,nt),O.side=Tn,O.needsUpdate=!0,M.renderBufferDirect(z,N,F,O,S,nt),O.side=Xe):M.renderBufferDirect(z,N,F,O,S,nt),S.onAfterRender(M,N,z,F,O,nt)}function Qi(S,N,z){N.isScene!==!0&&(N=Ut);const F=At.get(S),O=m.state.lights,nt=m.state.shadowsArray,ot=O.state.version,mt=Z.getParameters(S,O.state,nt,N,z),gt=Z.getProgramCacheKey(mt);let Et=F.programs;F.environment=S.isMeshStandardMaterial?N.environment:null,F.fog=N.fog,F.envMap=(S.isMeshStandardMaterial?x:A).get(S.envMap||F.environment),F.envMapRotation=F.environment!==null&&S.envMap===null?N.environmentRotation:S.envMapRotation,Et===void 0&&(S.addEventListener("dispose",wt),Et=new Map,F.programs=Et);let bt=Et.get(gt);if(bt!==void 0){if(F.currentProgram===bt&&F.lightsStateVersion===ot)return co(S,mt),bt}else mt.uniforms=Z.getUniforms(S),S.onBeforeCompile(mt,M),bt=Z.acquireProgram(mt,gt),Et.set(gt,bt),F.uniforms=mt.uniforms;const St=F.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(St.clippingPlanes=Lt.uniform),co(S,mt),F.needsLights=Al(S),F.lightsStateVersion=ot,F.needsLights&&(St.ambientLightColor.value=O.state.ambient,St.lightProbe.value=O.state.probe,St.directionalLights.value=O.state.directional,St.directionalLightShadows.value=O.state.directionalShadow,St.spotLights.value=O.state.spot,St.spotLightShadows.value=O.state.spotShadow,St.rectAreaLights.value=O.state.rectArea,St.ltc_1.value=O.state.rectAreaLTC1,St.ltc_2.value=O.state.rectAreaLTC2,St.pointLights.value=O.state.point,St.pointLightShadows.value=O.state.pointShadow,St.hemisphereLights.value=O.state.hemi,St.directionalShadowMap.value=O.state.directionalShadowMap,St.directionalShadowMatrix.value=O.state.directionalShadowMatrix,St.spotShadowMap.value=O.state.spotShadowMap,St.spotLightMatrix.value=O.state.spotLightMatrix,St.spotLightMap.value=O.state.spotLightMap,St.pointShadowMap.value=O.state.pointShadowMap,St.pointShadowMatrix.value=O.state.pointShadowMatrix),F.currentProgram=bt,F.uniformsList=null,bt}function oo(S){if(S.uniformsList===null){const N=S.currentProgram.getUniforms();S.uniformsList=Os.seqWithValue(N.seq,S.uniforms)}return S.uniformsList}function co(S,N){const z=At.get(S);z.outputColorSpace=N.outputColorSpace,z.batching=N.batching,z.batchingColor=N.batchingColor,z.instancing=N.instancing,z.instancingColor=N.instancingColor,z.instancingMorph=N.instancingMorph,z.skinning=N.skinning,z.morphTargets=N.morphTargets,z.morphNormals=N.morphNormals,z.morphColors=N.morphColors,z.morphTargetsCount=N.morphTargetsCount,z.numClippingPlanes=N.numClippingPlanes,z.numIntersection=N.numClipIntersection,z.vertexAlphas=N.vertexAlphas,z.vertexTangents=N.vertexTangents,z.toneMapping=N.toneMapping}function bl(S,N,z,F,O){N.isScene!==!0&&(N=Ut),Pt.resetTextureUnits();const nt=N.fog,ot=F.isMeshStandardMaterial?N.environment:null,mt=T===null?M.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Cn,gt=(F.isMeshStandardMaterial?x:A).get(F.envMap||ot),Et=F.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,bt=!!z.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),St=!!z.morphAttributes.position,Wt=!!z.morphAttributes.normal,se=!!z.morphAttributes.color;let re=En;F.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(re=M.toneMapping);const Pe=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Xt=Pe!==void 0?Pe.length:0,xt=At.get(F),ye=m.state.lights;if(X===!0&&(Q===!0||S!==w)){const Ue=S===w&&F.id===L;Lt.setState(F,S,Ue)}let qt=!1;F.version===xt.__version?(xt.needsLights&&xt.lightsStateVersion!==ye.state.version||xt.outputColorSpace!==mt||O.isBatchedMesh&&xt.batching===!1||!O.isBatchedMesh&&xt.batching===!0||O.isBatchedMesh&&xt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&xt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&xt.instancing===!1||!O.isInstancedMesh&&xt.instancing===!0||O.isSkinnedMesh&&xt.skinning===!1||!O.isSkinnedMesh&&xt.skinning===!0||O.isInstancedMesh&&xt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&xt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&xt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&xt.instancingMorph===!1&&O.morphTexture!==null||xt.envMap!==gt||F.fog===!0&&xt.fog!==nt||xt.numClippingPlanes!==void 0&&(xt.numClippingPlanes!==Lt.numPlanes||xt.numIntersection!==Lt.numIntersection)||xt.vertexAlphas!==Et||xt.vertexTangents!==bt||xt.morphTargets!==St||xt.morphNormals!==Wt||xt.morphColors!==se||xt.toneMapping!==re||xt.morphTargetsCount!==Xt)&&(qt=!0):(qt=!0,xt.__version=F.version);let ke=xt.currentProgram;qt===!0&&(ke=Qi(F,N,O));let qn=!1,Le=!1,ir=!1;const le=ke.getUniforms(),mn=xt.uniforms;if(yt.useProgram(ke.program)&&(qn=!0,Le=!0,ir=!0),F.id!==L&&(L=F.id,Le=!0),qn||w!==S){le.setValue(R,"projectionMatrix",S.projectionMatrix),le.setValue(R,"viewMatrix",S.matrixWorldInverse);const Ue=le.map.cameraPosition;Ue!==void 0&&Ue.setValue(R,ht.setFromMatrixPosition(S.matrixWorld)),Jt.logarithmicDepthBuffer&&le.setValue(R,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&le.setValue(R,"isOrthographic",S.isOrthographicCamera===!0),w!==S&&(w=S,Le=!0,ir=!0)}if(O.isSkinnedMesh){le.setOptional(R,O,"bindMatrix"),le.setOptional(R,O,"bindMatrixInverse");const Ue=O.skeleton;Ue&&(Ue.boneTexture===null&&Ue.computeBoneTexture(),le.setValue(R,"boneTexture",Ue.boneTexture,Pt))}O.isBatchedMesh&&(le.setOptional(R,O,"batchingTexture"),le.setValue(R,"batchingTexture",O._matricesTexture,Pt),le.setOptional(R,O,"batchingIdTexture"),le.setValue(R,"batchingIdTexture",O._indirectTexture,Pt),le.setOptional(R,O,"batchingColorTexture"),O._colorsTexture!==null&&le.setValue(R,"batchingColorTexture",O._colorsTexture,Pt));const sr=z.morphAttributes;if((sr.position!==void 0||sr.normal!==void 0||sr.color!==void 0)&&kt.update(O,z,ke),(Le||xt.receiveShadow!==O.receiveShadow)&&(xt.receiveShadow=O.receiveShadow,le.setValue(R,"receiveShadow",O.receiveShadow)),F.isMeshGouraudMaterial&&F.envMap!==null&&(mn.envMap.value=gt,mn.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),F.isMeshStandardMaterial&&F.envMap===null&&N.environment!==null&&(mn.envMapIntensity.value=N.environmentIntensity),Le&&(le.setValue(R,"toneMappingExposure",M.toneMappingExposure),xt.needsLights&&Tl(mn,ir),nt&&F.fog===!0&&Mt.refreshFogUniforms(mn,nt),Mt.refreshMaterialUniforms(mn,F,K,G,m.state.transmissionRenderTarget[S.id]),Os.upload(R,oo(xt),mn,Pt)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(Os.upload(R,oo(xt),mn,Pt),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&le.setValue(R,"center",O.center),le.setValue(R,"modelViewMatrix",O.modelViewMatrix),le.setValue(R,"normalMatrix",O.normalMatrix),le.setValue(R,"modelMatrix",O.matrixWorld),F.isShaderMaterial||F.isRawShaderMaterial){const Ue=F.uniformsGroups;for(let rr=0,Cl=Ue.length;rr<Cl;rr++){const lo=Ue[rr];ee.update(lo,ke),ee.bind(lo,ke)}}return ke}function Tl(S,N){S.ambientLightColor.needsUpdate=N,S.lightProbe.needsUpdate=N,S.directionalLights.needsUpdate=N,S.directionalLightShadows.needsUpdate=N,S.pointLights.needsUpdate=N,S.pointLightShadows.needsUpdate=N,S.spotLights.needsUpdate=N,S.spotLightShadows.needsUpdate=N,S.rectAreaLights.needsUpdate=N,S.hemisphereLights.needsUpdate=N}function Al(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(S,N,z){At.get(S.texture).__webglTexture=N,At.get(S.depthTexture).__webglTexture=z;const F=At.get(S);F.__hasExternalTextures=!0,F.__autoAllocateDepthBuffer=z===void 0,F.__autoAllocateDepthBuffer||Yt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),F.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,N){const z=At.get(S);z.__webglFramebuffer=N,z.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(S,N=0,z=0){T=S,D=N,b=z;let F=!0,O=null,nt=!1,ot=!1;if(S){const gt=At.get(S);gt.__useDefaultFramebuffer!==void 0?(yt.bindFramebuffer(R.FRAMEBUFFER,null),F=!1):gt.__webglFramebuffer===void 0?Pt.setupRenderTarget(S):gt.__hasExternalTextures&&Pt.rebindTextures(S,At.get(S.texture).__webglTexture,At.get(S.depthTexture).__webglTexture);const Et=S.texture;(Et.isData3DTexture||Et.isDataArrayTexture||Et.isCompressedArrayTexture)&&(ot=!0);const bt=At.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(bt[N])?O=bt[N][z]:O=bt[N],nt=!0):S.samples>0&&Pt.useMultisampledRTT(S)===!1?O=At.get(S).__webglMultisampledFramebuffer:Array.isArray(bt)?O=bt[z]:O=bt,y.copy(S.viewport),P.copy(S.scissor),V=S.scissorTest}else y.copy(_t).multiplyScalar(K).floor(),P.copy(vt).multiplyScalar(K).floor(),V=Bt;if(yt.bindFramebuffer(R.FRAMEBUFFER,O)&&F&&yt.drawBuffers(S,O),yt.viewport(y),yt.scissor(P),yt.setScissorTest(V),nt){const gt=At.get(S.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+N,gt.__webglTexture,z)}else if(ot){const gt=At.get(S.texture),Et=N||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,gt.__webglTexture,z||0,Et)}L=-1},this.readRenderTargetPixels=function(S,N,z,F,O,nt,ot){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=At.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ot!==void 0&&(mt=mt[ot]),mt){yt.bindFramebuffer(R.FRAMEBUFFER,mt);try{const gt=S.texture,Et=gt.format,bt=gt.type;if(!Jt.textureFormatReadable(Et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Jt.textureTypeReadable(bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=S.width-F&&z>=0&&z<=S.height-O&&R.readPixels(N,z,F,O,Ct.convert(Et),Ct.convert(bt),nt)}finally{const gt=T!==null?At.get(T).__webglFramebuffer:null;yt.bindFramebuffer(R.FRAMEBUFFER,gt)}}},this.readRenderTargetPixelsAsync=async function(S,N,z,F,O,nt,ot){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let mt=At.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ot!==void 0&&(mt=mt[ot]),mt){yt.bindFramebuffer(R.FRAMEBUFFER,mt);try{const gt=S.texture,Et=gt.format,bt=gt.type;if(!Jt.textureFormatReadable(Et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Jt.textureTypeReadable(bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(N>=0&&N<=S.width-F&&z>=0&&z<=S.height-O){const St=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,St),R.bufferData(R.PIXEL_PACK_BUFFER,nt.byteLength,R.STREAM_READ),R.readPixels(N,z,F,O,Ct.convert(Et),Ct.convert(bt),0),R.flush();const Wt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);await Hh(R,Wt,4);try{R.bindBuffer(R.PIXEL_PACK_BUFFER,St),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,nt)}finally{R.deleteBuffer(St),R.deleteSync(Wt)}return nt}}finally{const gt=T!==null?At.get(T).__webglFramebuffer:null;yt.bindFramebuffer(R.FRAMEBUFFER,gt)}}},this.copyFramebufferToTexture=function(S,N=null,z=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),N=arguments[0]||null,S=arguments[1]);const F=Math.pow(2,-z),O=Math.floor(S.image.width*F),nt=Math.floor(S.image.height*F),ot=N!==null?N.x:0,mt=N!==null?N.y:0;Pt.setTexture2D(S,0),R.copyTexSubImage2D(R.TEXTURE_2D,z,0,0,ot,mt,O,nt),yt.unbindTexture()},this.copyTextureToTexture=function(S,N,z=null,F=null,O=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),F=arguments[0]||null,S=arguments[1],N=arguments[2],O=arguments[3]||0,z=null);let nt,ot,mt,gt,Et,bt;z!==null?(nt=z.max.x-z.min.x,ot=z.max.y-z.min.y,mt=z.min.x,gt=z.min.y):(nt=S.image.width,ot=S.image.height,mt=0,gt=0),F!==null?(Et=F.x,bt=F.y):(Et=0,bt=0);const St=Ct.convert(N.format),Wt=Ct.convert(N.type);Pt.setTexture2D(N,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,N.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,N.unpackAlignment);const se=R.getParameter(R.UNPACK_ROW_LENGTH),re=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Pe=R.getParameter(R.UNPACK_SKIP_PIXELS),Xt=R.getParameter(R.UNPACK_SKIP_ROWS),xt=R.getParameter(R.UNPACK_SKIP_IMAGES),ye=S.isCompressedTexture?S.mipmaps[O]:S.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,ye.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ye.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,mt),R.pixelStorei(R.UNPACK_SKIP_ROWS,gt),S.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,O,Et,bt,nt,ot,St,Wt,ye.data):S.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,O,Et,bt,ye.width,ye.height,St,ye.data):R.texSubImage2D(R.TEXTURE_2D,O,Et,bt,nt,ot,St,Wt,ye),R.pixelStorei(R.UNPACK_ROW_LENGTH,se),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,re),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Pe),R.pixelStorei(R.UNPACK_SKIP_ROWS,Xt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,xt),O===0&&N.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),yt.unbindTexture()},this.copyTextureToTexture3D=function(S,N,z=null,F=null,O=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,F=arguments[1]||null,S=arguments[2],N=arguments[3],O=arguments[4]||0);let nt,ot,mt,gt,Et,bt,St,Wt,se;const re=S.isCompressedTexture?S.mipmaps[O]:S.image;z!==null?(nt=z.max.x-z.min.x,ot=z.max.y-z.min.y,mt=z.max.z-z.min.z,gt=z.min.x,Et=z.min.y,bt=z.min.z):(nt=re.width,ot=re.height,mt=re.depth,gt=0,Et=0,bt=0),F!==null?(St=F.x,Wt=F.y,se=F.z):(St=0,Wt=0,se=0);const Pe=Ct.convert(N.format),Xt=Ct.convert(N.type);let xt;if(N.isData3DTexture)Pt.setTexture3D(N,0),xt=R.TEXTURE_3D;else if(N.isDataArrayTexture||N.isCompressedArrayTexture)Pt.setTexture2DArray(N,0),xt=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,N.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,N.unpackAlignment);const ye=R.getParameter(R.UNPACK_ROW_LENGTH),qt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),ke=R.getParameter(R.UNPACK_SKIP_PIXELS),qn=R.getParameter(R.UNPACK_SKIP_ROWS),Le=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,re.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,re.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,gt),R.pixelStorei(R.UNPACK_SKIP_ROWS,Et),R.pixelStorei(R.UNPACK_SKIP_IMAGES,bt),S.isDataTexture||S.isData3DTexture?R.texSubImage3D(xt,O,St,Wt,se,nt,ot,mt,Pe,Xt,re.data):N.isCompressedArrayTexture?R.compressedTexSubImage3D(xt,O,St,Wt,se,nt,ot,mt,Pe,re.data):R.texSubImage3D(xt,O,St,Wt,se,nt,ot,mt,Pe,Xt,re),R.pixelStorei(R.UNPACK_ROW_LENGTH,ye),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,qt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ke),R.pixelStorei(R.UNPACK_SKIP_ROWS,qn),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Le),O===0&&N.generateMipmaps&&R.generateMipmap(xt),yt.unbindTexture()},this.initRenderTarget=function(S){At.get(S).__webglFramebuffer===void 0&&Pt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Pt.setTextureCube(S,0):S.isData3DTexture?Pt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Pt.setTexture2DArray(S,0):Pt.setTexture2D(S,0),yt.unbindTexture()},this.resetState=function(){D=0,b=0,T=null,yt.reset(),Nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Oa?"display-p3":"srgb",e.unpackColorSpace=Kt.workingColorSpace===Js?"display-p3":"srgb"}}class Ha{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ft(t),this.near=e,this.far=n}clone(){return new Ha(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Qm extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Je,this.environmentIntensity=1,this.environmentRotation=new Je,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class tg{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ya,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=fn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Fa("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const be=new C;class Ys{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Ye(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=$t(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=$t(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=$t(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=$t(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=$t(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Ye(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Ye(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Ye(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Ye(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=$t(e,this.array),n=$t(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=$t(e,this.array),n=$t(n,this.array),i=$t(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=$t(e,this.array),n=$t(n,this.array),i=$t(i,this.array),r=$t(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ze(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ys(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Qc extends Ti{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let hi;const Ii=new C,ui=new C,di=new C,fi=new rt,Ui=new rt,tl=new ne,Ss=new C,Ni=new C,ws=new C,oc=new rt,Dr=new rt,cc=new rt;class eg extends ve{constructor(t=new Qc){if(super(),this.isSprite=!0,this.type="Sprite",hi===void 0){hi=new Re;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new tg(e,5);hi.setIndex([0,1,2,0,2,3]),hi.setAttribute("position",new Ys(n,3,0,!1)),hi.setAttribute("uv",new Ys(n,2,3,!1))}this.geometry=hi,this.material=t,this.center=new rt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ui.setFromMatrixScale(this.matrixWorld),tl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),di.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ui.multiplyScalar(-di.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Es(Ss.set(-.5,-.5,0),di,a,ui,i,r),Es(Ni.set(.5,-.5,0),di,a,ui,i,r),Es(ws.set(.5,.5,0),di,a,ui,i,r),oc.set(0,0),Dr.set(1,0),cc.set(1,1);let o=t.ray.intersectTriangle(Ss,Ni,ws,!1,Ii);if(o===null&&(Es(Ni.set(-.5,.5,0),di,a,ui,i,r),Dr.set(0,1),o=t.ray.intersectTriangle(Ss,ws,Ni,!1,Ii),o===null))return;const c=t.ray.origin.distanceTo(Ii);c<t.near||c>t.far||e.push({distance:c,point:Ii.clone(),uv:$e.getInterpolation(Ii,Ss,Ni,ws,oc,Dr,cc,new rt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Es(s,t,e,n,i,r){fi.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Ui.x=r*fi.x-i*fi.y,Ui.y=i*fi.x+r*fi.y):Ui.copy(fi),s.copy(t),s.x+=Ui.x,s.y+=Ui.y,s.applyMatrix4(tl)}class el extends Ae{constructor(t,e,n,i,r,a,o,c,l){super(t,e,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class nn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),c=e||(a.isVector2?new rt:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,i=[],r=[],a=[],o=new C,c=new ne;for(let f=0;f<=t;f++){const g=f/t;i[f]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(_e(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(_e(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ga extends nn{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new rt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class ng extends Ga{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Wa(){let s=0,t=0,e=0,n=0;function i(r,a,o,c){s=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const bs=new C,Ir=new Wa,Ur=new Wa,Nr=new Wa;class ig extends nn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new C){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(bs.subVectors(i[0],i[1]).add(i[0]),l=bs);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(bs.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=bs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ir.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),Ur.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),Nr.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Ir.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ur.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Nr.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ir.calc(c),Ur.calc(c),Nr.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new C().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function lc(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,c=s*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*s+e}function sg(s,t){const e=1-s;return e*e*t}function rg(s,t){return 2*(1-s)*s*t}function ag(s,t){return s*s*t}function Hi(s,t,e,n){return sg(s,t)+rg(s,e)+ag(s,n)}function og(s,t){const e=1-s;return e*e*e*t}function cg(s,t){const e=1-s;return 3*e*e*s*t}function lg(s,t){return 3*(1-s)*s*s*t}function hg(s,t){return s*s*s*t}function Gi(s,t,e,n,i){return og(s,t)+cg(s,e)+lg(s,n)+hg(s,i)}class nl extends nn{constructor(t=new rt,e=new rt,n=new rt,i=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new rt){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gi(t,i.x,r.x,a.x,o.x),Gi(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ug extends nn{constructor(t=new C,e=new C,n=new C,i=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new C){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gi(t,i.x,r.x,a.x,o.x),Gi(t,i.y,r.y,a.y,o.y),Gi(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class il extends nn{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dg extends nn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class sl extends nn{constructor(t=new rt,e=new rt,n=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new rt){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Hi(t,i.x,r.x,a.x),Hi(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fg extends nn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Hi(t,i.x,r.x,a.x),Hi(t,i.y,r.y,a.y),Hi(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class rl extends nn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(lc(o,c.x,l.x,h.x,u.x),lc(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new rt().fromArray(i))}return this}}var hc=Object.freeze({__proto__:null,ArcCurve:ng,CatmullRomCurve3:ig,CubicBezierCurve:nl,CubicBezierCurve3:ug,EllipseCurve:Ga,LineCurve:il,LineCurve3:dg,QuadraticBezierCurve:sl,QuadraticBezierCurve3:fg,SplineCurve:rl});class pg extends nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new hc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new hc[i.type]().fromJSON(i))}return this}}class mg extends pg{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new il(this.currentPoint.clone(),new rt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new sl(this.currentPoint.clone(),new rt(t,e),new rt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){const o=new nl(this.currentPoint.clone(),new rt(t,e),new rt(n,i),new rt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new rl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,a,o,c),this}absellipse(t,e,n,i,r,a,o,c){const l=new Ga(t,e,n,i,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Xa extends Re{constructor(t=[new rt(0,-.5),new rt(.5,0),new rt(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=_e(i,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/e,u=new C,d=new rt,f=new C,g=new C,_=new C;let m=0,p=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),c.push(f.x,f.y,f.z),_.copy(g)}for(let v=0;v<=e;v++){const M=n+v*h*i,E=Math.sin(M),D=Math.cos(M);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*E,u.y=t[b].y,u.z=t[b].x*D,a.push(u.x,u.y,u.z),d.x=v/e,d.y=b/(t.length-1),o.push(d.x,d.y);const T=c[3*b+0]*E,L=c[3*b+1],w=c[3*b+0]*D;l.push(T,L,w)}}for(let v=0;v<e;v++)for(let M=0;M<t.length-1;M++){const E=M+v*t.length,D=E,b=E+t.length,T=E+t.length+1,L=E+1;r.push(D,b,L),r.push(T,L,b)}this.setIndex(r),this.setAttribute("position",new te(a,3)),this.setAttribute("uv",new te(o,2)),this.setAttribute("normal",new te(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xa(t.points,t.segments,t.phiStart,t.phiLength)}}class $s extends Xa{constructor(t=1,e=1,n=4,i=8){const r=new mg;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new $s(t.radius,t.length,t.capSegments,t.radialSegments)}}class Ee extends Re{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;v(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(d,3)),this.setAttribute("uv",new te(f,2));function v(){const E=new C,D=new C;let b=0;const T=(e-t)/n;for(let L=0;L<=r;L++){const w=[],y=L/r,P=y*(e-t)+t;for(let V=0;V<=i;V++){const B=V/i,W=B*c+o,Y=Math.sin(W),G=Math.cos(W);D.x=P*Y,D.y=-y*n+m,D.z=P*G,u.push(D.x,D.y,D.z),E.set(Y,T,G).normalize(),d.push(E.x,E.y,E.z),f.push(B,1-y),w.push(g++)}_.push(w)}for(let L=0;L<i;L++)for(let w=0;w<r;w++){const y=_[w][L],P=_[w+1][L],V=_[w+1][L+1],B=_[w][L+1];h.push(y,P,B),h.push(P,V,B),b+=6}l.addGroup(p,b,0),p+=b}function M(E){const D=g,b=new rt,T=new C;let L=0;const w=E===!0?t:e,y=E===!0?1:-1;for(let V=1;V<=i;V++)u.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),g++;const P=g;for(let V=0;V<=i;V++){const W=V/i*c+o,Y=Math.cos(W),G=Math.sin(W);T.x=w*G,T.y=m*y,T.z=w*Y,u.push(T.x,T.y,T.z),d.push(0,y,0),b.x=Y*.5+.5,b.y=G*.5*y+.5,f.push(b.x,b.y),g++}for(let V=0;V<i;V++){const B=D+V,W=P+V;E===!0?h.push(W,W+1,B):h.push(W+1,W,B),L+=3}l.addGroup(p,L,E===!0?1:2),p+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ee(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class qa extends Ee{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new qa(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qs extends Re{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new te(r,3)),this.setAttribute("normal",new te(r.slice(),3)),this.setAttribute("uv",new te(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const M=new C,E=new C,D=new C;for(let b=0;b<e.length;b+=3)f(e[b+0],M),f(e[b+1],E),f(e[b+2],D),c(M,E,D,v)}function c(v,M,E,D){const b=D+1,T=[];for(let L=0;L<=b;L++){T[L]=[];const w=v.clone().lerp(E,L/b),y=M.clone().lerp(E,L/b),P=b-L;for(let V=0;V<=P;V++)V===0&&L===b?T[L][V]=w:T[L][V]=w.clone().lerp(y,V/P)}for(let L=0;L<b;L++)for(let w=0;w<2*(b-L)-1;w++){const y=Math.floor(w/2);w%2===0?(d(T[L][y+1]),d(T[L+1][y]),d(T[L][y])):(d(T[L][y+1]),d(T[L+1][y+1]),d(T[L+1][y]))}}function l(v){const M=new C;for(let E=0;E<r.length;E+=3)M.x=r[E+0],M.y=r[E+1],M.z=r[E+2],M.normalize().multiplyScalar(v),r[E+0]=M.x,r[E+1]=M.y,r[E+2]=M.z}function h(){const v=new C;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];const E=m(v)/2/Math.PI+.5,D=p(v)/Math.PI+.5;a.push(E,1-D)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const M=a[v+0],E=a[v+2],D=a[v+4],b=Math.max(M,E,D),T=Math.min(M,E,D);b>.9&&T<.1&&(M<.2&&(a[v+0]+=1),E<.2&&(a[v+2]+=1),D<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,M){const E=v*3;M.x=t[E+0],M.y=t[E+1],M.z=t[E+2]}function g(){const v=new C,M=new C,E=new C,D=new C,b=new rt,T=new rt,L=new rt;for(let w=0,y=0;w<r.length;w+=9,y+=6){v.set(r[w+0],r[w+1],r[w+2]),M.set(r[w+3],r[w+4],r[w+5]),E.set(r[w+6],r[w+7],r[w+8]),b.set(a[y+0],a[y+1]),T.set(a[y+2],a[y+3]),L.set(a[y+4],a[y+5]),D.copy(v).add(M).add(E).divideScalar(3);const P=m(D);_(b,y+0,v,P),_(T,y+2,M,P),_(L,y+4,E,P)}}function _(v,M,E,D){D<0&&v.x===1&&(a[M]=v.x-1),E.x===0&&E.z===0&&(a[M]=D/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qs(t.vertices,t.indices,t.radius,t.details)}}class Wi extends Qs{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wi(t.radius,t.detail)}}class Ya extends Qs{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ya(t.radius,t.detail)}}class $a extends Re{constructor(t=.5,e=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/i,f=new C,g=new rt;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<i;_++){const m=_*(n+1);for(let p=0;p<n;p++){const v=p+m,M=v,E=v+n+1,D=v+n+2,b=v+1;o.push(M,E,b),o.push(E,D,b)}}this.setIndex(o),this.setAttribute("position",new te(c,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $a(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class gi extends Re{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new C,d=new C,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const v=[],M=p/n;let E=0;p===0&&a===0?E=.5/e:p===n&&c===Math.PI&&(E=-.5/e);for(let D=0;D<=e;D++){const b=D/e;u.x=-t*Math.cos(i+b*r)*Math.sin(a+M*o),u.y=t*Math.cos(a+M*o),u.z=t*Math.sin(i+b*r)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(b+E,1-M),v.push(l++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const M=h[p][v+1],E=h[p][v],D=h[p+1][v],b=h[p+1][v+1];(p!==0||a>0)&&f.push(M,E,b),(p!==n-1||c<Math.PI)&&f.push(E,D,b)}this.setIndex(f),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(_,3)),this.setAttribute("uv",new te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Yi extends Re{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],c=[],l=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){const _=g/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){const _=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,v=(i+1)*f+g;a.push(_,m,v),a.push(m,p,v)}this.setIndex(a),this.setAttribute("position",new te(o,3)),this.setAttribute("normal",new te(c,3)),this.setAttribute("uv",new te(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class kn extends Ti{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ft(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ft(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uc,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class al extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ft(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class gg extends al{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ft(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Or=new ne,uc=new C,dc=new C;class _g{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ka,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;uc.setFromMatrixPosition(t.matrixWorld),e.position.copy(uc),dc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dc),e.updateMatrixWorld(),Or.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Or),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Or)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class vg extends _g{constructor(){super(new Yc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xg extends al{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new vg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ra}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ra);const Ts=["/audio/music/citymap1.mp3","/audio/music/citymap2.mp3"],yg=["/audio/music/mainmenu1.mp3","/audio/music/mainmenu2.mp3"],Mg={small:Ts,medium:Ts,large:Ts,huge:Ts},Sg={},wg={},Eg="/audio/ui/hover_button.mp3",bg="/audio/ui/click_button.mp3",Tg="/audio/sfx/die_sound.mp3";class Ag{constructor(){I(this,"context",null);I(this,"sfxVolume",.55);I(this,"musicVolume",.22);I(this,"muted",!1);I(this,"musicOscillator",null);I(this,"musicGain",null);I(this,"musicElement",null);I(this,"activeMusicKey",null);I(this,"activeSfx",new Set);I(this,"lastHoverSfxAt",0)}setSfxVolume(t){this.sfxVolume=this.clamp01(t)}setMusicVolume(t){this.musicVolume=this.clamp01(t),this.musicGain&&(this.musicGain.gain.value=this.muted?0:this.musicVolume*.045),this.musicElement&&(this.musicElement.volume=this.muted?0:this.musicVolume)}setMuted(t){this.muted=t,this.musicGain&&(this.musicGain.gain.value=t?0:this.musicVolume*.045),this.musicElement&&(this.musicElement.muted=t,this.musicElement.volume=t?0:this.musicVolume)}getSfxVolume(){return this.sfxVolume}getMusicVolume(){return this.musicVolume}isMuted(){return this.muted}playSwallow(){this.playGeneratedSwallow("decor",4)}playObjectSwallow(t,e,n){const i=Sg[t];if(i){this.playSfxAsset(i,.95,this.randomRate(.95,1.06),()=>this.playGeneratedSwallow(e,n));return}this.playGeneratedSwallow(e,n)}playPowerUp(t){const e=wg[t];if(e){this.playSfxAsset(e,.82,this.randomRate(.98,1.08),()=>this.playGeneratedPowerUp(t));return}this.playGeneratedPowerUp(t)}playHoleSwallow(){this.playTone(98,24,.32,"sawtooth",.36),this.playTone(180,42,.18,"triangle",.18)}playDeath(){this.playSfxAsset(Tg,.36,this.randomRate(.98,1.02),()=>{this.playTone(180,34,.42,"sawtooth",.34),this.playTone(72,24,.34,"sine",.24)},{fadeInSeconds:.08,fadeOutSeconds:.42})}playUiClick(){this.playButtonClick()}playButtonHover(){const t=performance.now();t-this.lastHoverSfxAt<55||(this.lastHoverSfxAt=t,this.playSfxAsset(Eg,.42,this.randomRate(.98,1.03),()=>{this.playTone(460,620,.045,"triangle",.08)}))}playButtonClick(){this.playSfxAsset(bg,.64,this.randomRate(.98,1.02),()=>{this.playTone(520,780,.055,"triangle",.16)})}playMatchStart(){this.playTone(260,520,.22,"triangle",.22)}playMatchEnd(){this.playTone(360,140,.45,"sine",.22)}startMenuMusic(){this.startTrackGroup("menu",yg)}startMusic(t){const e=t?Mg[t]:void 0;if(e!=null&&e.length){this.startTrackGroup(`map:${t}`,e);return}this.startGeneratedMusic()}startTrackGroup(t,e){if(this.musicElement&&this.activeMusicKey===t&&!this.musicElement.paused)return;if(e.length===0){this.startGeneratedMusic();return}this.stopMusic();const n=new Audio(this.pickRandom(e));n.loop=!0,n.preload="auto",n.volume=this.muted?0:this.musicVolume,n.muted=this.muted,this.musicElement=n,this.activeMusicKey=t,n.play().catch(()=>{this.musicElement===n&&(this.musicElement=null,this.activeMusicKey=null)})}startGeneratedMusic(){const t=this.getContext();if(!t||this.musicOscillator)return;const e=t.createOscillator(),n=t.createGain();e.type="sine",e.frequency.value=62,n.gain.value=this.muted?0:this.musicVolume*.045,e.connect(n),n.connect(t.destination),e.start(),this.musicOscillator=e,this.musicGain=n}stopMusic(){var t,e;(t=this.musicOscillator)==null||t.stop(),this.musicOscillator=null,this.musicGain=null,(e=this.musicElement)==null||e.pause(),this.musicElement=null,this.activeMusicKey=null}playGeneratedSwallow(t,e){const n=e>=24;switch(t){case"traffic":this.playTone(92,32,n?.28:.2,"sawtooth",n?.36:.28),this.playTone(220,74,.08,"square",.12);break;case"building":case"ad":this.playTone(74,28,.34,"sawtooth",.4),this.playTone(138,48,.16,"triangle",.2);break;case"nature":this.playTone(160,62,.18,"triangle",.22);break;case"utility":case"sidewalk":this.playTone(210,58,.14,"square",.18);break;case"pedestrian":this.playTone(260,110,.12,"triangle",.14);break;default:this.playTone(120,54,.16,"sawtooth",.28);break}}playGeneratedPowerUp(t){switch(t){case"haste":this.playTone(420,820,.11,"triangle",.18);break;case"shield":this.playTone(240,420,.18,"sine",.2);break;case"magnet":this.playTone(170,520,.2,"sawtooth",.16);break;case"mass":this.playTone(150,74,.22,"triangle",.24);break;case"shrink":this.playTone(520,180,.15,"square",.14);break;case"stamina":default:this.playTone(520,780,.055,"triangle",.16);break}}playSfxAsset(t,e,n,i,r){if(this.muted)return;const a=new Audio(t),o=this.clamp01(this.sfxVolume*e);a.volume=r!=null&&r.fadeInSeconds?0:o,a.playbackRate=n;let c=0;const l=()=>{c&&window.cancelAnimationFrame(c),a.removeEventListener("ended",l),a.removeEventListener("error",l),this.activeSfx.delete(a)},h=()=>{const u=(r==null?void 0:r.fadeInSeconds)??0,d=(r==null?void 0:r.fadeOutSeconds)??0;let f=1;u>0&&(f=Math.min(f,a.currentTime/u)),d>0&&Number.isFinite(a.duration)&&a.duration>0&&(f=Math.min(f,Math.max(0,(a.duration-a.currentTime)/d))),a.volume=o*Math.max(0,Math.min(1,f)),!a.paused&&!a.ended&&(c=window.requestAnimationFrame(h))};a.addEventListener("ended",l),a.addEventListener("error",l),this.activeSfx.add(a),a.play().then(()=>{r&&h()}).catch(u=>{l(),i()})}playTone(t,e,n,i,r){if(this.muted)return;const a=this.getContext();if(!a)return;const o=a.createOscillator(),c=a.createGain();o.type=i,o.frequency.setValueAtTime(t,a.currentTime),o.frequency.exponentialRampToValueAtTime(Math.max(1,e),a.currentTime+n),c.gain.setValueAtTime(this.sfxVolume*r,a.currentTime),c.gain.exponentialRampToValueAtTime(1e-4,a.currentTime+n),o.connect(c),c.connect(a.destination),o.start(),o.stop(a.currentTime+n)}getContext(){if(this.context)return this.context.state==="suspended"&&this.context.resume(),this.context;const t=window.AudioContext??window.webkitAudioContext;return t?(this.context=new t,this.context.state==="suspended"&&this.context.resume(),this.context):null}randomRate(t,e){return t+Math.random()*(e-t)}pickRandom(t){return t[Math.floor(Math.random()*t.length)]}clamp01(t){return Math.max(0,Math.min(1,t))}}const Cg="0.1.0-codex-prototype",Rg=180,Ka=1,Pg=8,Lg=4,Dg=.13,ol=1.08,Ig=1.15,Ug=3.5,As=100,Ng=1.7,Og=36,zg=22,Fg=.75,Bg=22,kg=18,pi={small:{label:"Small",halfExtent:48,objectCount:190,blockSize:24,roadWidth:6,spawnClearRadius:13},medium:{label:"Medium",halfExtent:78,objectCount:430,blockSize:28,roadWidth:7,spawnClearRadius:15},large:{label:"Large",halfExtent:150,objectCount:980,blockSize:34,roadWidth:8,spawnClearRadius:18},huge:{label:"Huge",halfExtent:235,objectCount:1680,blockSize:42,roadWidth:9,spawnClearRadius:22}},Cs=["Bot Nova","Bot Byte","Bot Orbit","Bot Flux","Bot Vortex","Bot Echo","Bot Titan","Bot Pixel","Bot Quasar","Bot Cinder","Bot Ion","Bot Zenith"],Oi=["#5eead4","#f6c453","#fb7185","#91e88c","#60a5fa","#f97316","#d8b4fe","#f9a8d4","#a3e635","#facc15"],Vg={magnet:{label:"Magnet Field",color:"#5eead4",durationSeconds:9},shrink:{label:"Shrink Pulse",color:"#fb7185",durationSeconds:8},haste:{label:"Overdrive",color:"#f6c453",durationSeconds:7},shield:{label:"Void Shield",color:"#60a5fa",durationSeconds:8},stamina:{label:"Stamina Cell",color:"#91e88c",durationSeconds:0},mass:{label:"Mass Core",color:"#d8b4fe",durationSeconds:0}};class Hg{constructor(t){I(this,"pressed",new Set);I(this,"movement",new C);I(this,"clear",()=>{this.pressed.clear()});I(this,"handleKeyDown",t=>{if(t.key==="Escape"){t.preventDefault(),this.callbacks.onEscape();return}if(t.key==="Enter"){this.callbacks.onEnter();return}this.isTypingTarget(t.target)||this.pressed.add(t.code)});I(this,"handleKeyUp",t=>{this.pressed.delete(t.code)});this.callbacks=t,window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.clear)}getMovementVector(){return this.movement.set(0,0,0),(this.pressed.has("KeyW")||this.pressed.has("ArrowUp"))&&(this.movement.z-=1),(this.pressed.has("KeyS")||this.pressed.has("ArrowDown"))&&(this.movement.z+=1),(this.pressed.has("KeyA")||this.pressed.has("ArrowLeft"))&&(this.movement.x-=1),(this.pressed.has("KeyD")||this.pressed.has("ArrowRight"))&&(this.movement.x+=1),this.movement.lengthSq()>1&&this.movement.normalize(),this.movement}wantsBoost(){return this.pressed.has("ShiftLeft")||this.pressed.has("ShiftRight")||this.pressed.has("Space")}dispose(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.clear)}isTypingTarget(t){if(!(t instanceof HTMLElement))return!1;const e=t.tagName.toLowerCase();return e==="input"||e==="textarea"||t.isContentEditable}}const en=Object.create(null);en.open="0";en.close="1";en.ping="2";en.pong="3";en.message="4";en.upgrade="5";en.noop="6";const zs=Object.create(null);Object.keys(en).forEach(s=>{zs[en[s]]=s});const Sa={type:"error",data:"parser error"},cl=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ll=typeof ArrayBuffer=="function",hl=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,Za=({type:s,data:t},e,n)=>cl&&t instanceof Blob?e?n(t):fc(t,n):ll&&(t instanceof ArrayBuffer||hl(t))?e?n(t):fc(new Blob([t]),n):n(en[s]+(t||"")),fc=(s,t)=>{const e=new FileReader;return e.onload=function(){const n=e.result.split(",")[1];t("b"+(n||""))},e.readAsDataURL(s)};function pc(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let zr;function Gg(s,t){if(cl&&s.data instanceof Blob)return s.data.arrayBuffer().then(pc).then(t);if(ll&&(s.data instanceof ArrayBuffer||hl(s.data)))return t(pc(s.data));Za(s,!1,e=>{zr||(zr=new TextEncoder),t(zr.encode(e))})}const mc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Bi=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<mc.length;s++)Bi[mc.charCodeAt(s)]=s;const Wg=s=>{let t=s.length*.75,e=s.length,n,i=0,r,a,o,c;s[s.length-1]==="="&&(t--,s[s.length-2]==="="&&t--);const l=new ArrayBuffer(t),h=new Uint8Array(l);for(n=0;n<e;n+=4)r=Bi[s.charCodeAt(n)],a=Bi[s.charCodeAt(n+1)],o=Bi[s.charCodeAt(n+2)],c=Bi[s.charCodeAt(n+3)],h[i++]=r<<2|a>>4,h[i++]=(a&15)<<4|o>>2,h[i++]=(o&3)<<6|c&63;return l},Xg=typeof ArrayBuffer=="function",Ja=(s,t)=>{if(typeof s!="string")return{type:"message",data:ul(s,t)};const e=s.charAt(0);return e==="b"?{type:"message",data:qg(s.substring(1),t)}:zs[e]?s.length>1?{type:zs[e],data:s.substring(1)}:{type:zs[e]}:Sa},qg=(s,t)=>{if(Xg){const e=Wg(s);return ul(e,t)}else return{base64:!0,data:s}},ul=(s,t)=>{switch(t){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},dl="",Yg=(s,t)=>{const e=s.length,n=new Array(e);let i=0;s.forEach((r,a)=>{Za(r,!1,o=>{n[a]=o,++i===e&&t(n.join(dl))})})},$g=(s,t)=>{const e=s.split(dl),n=[];for(let i=0;i<e.length;i++){const r=Ja(e[i],t);if(n.push(r),r.type==="error")break}return n};function Kg(){return new TransformStream({transform(s,t){Gg(s,e=>{const n=e.length;let i;if(n<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,n);else if(n<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,n)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(n))}s.data&&typeof s.data!="string"&&(i[0]|=128),t.enqueue(i),t.enqueue(e)})}})}let Fr;function Rs(s){return s.reduce((t,e)=>t+e.length,0)}function Ps(s,t){if(s[0].length===t)return s.shift();const e=new Uint8Array(t);let n=0;for(let i=0;i<t;i++)e[i]=s[0][n++],n===s[0].length&&(s.shift(),n=0);return s.length&&n<s[0].length&&(s[0]=s[0].slice(n)),e}function Zg(s,t){Fr||(Fr=new TextDecoder);const e=[];let n=0,i=-1,r=!1;return new TransformStream({transform(a,o){for(e.push(a);;){if(n===0){if(Rs(e)<1)break;const c=Ps(e,1);r=(c[0]&128)===128,i=c[0]&127,i<126?n=3:i===126?n=1:n=2}else if(n===1){if(Rs(e)<2)break;const c=Ps(e,2);i=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),n=3}else if(n===2){if(Rs(e)<8)break;const c=Ps(e,8),l=new DataView(c.buffer,c.byteOffset,c.length),h=l.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(Sa);break}i=h*Math.pow(2,32)+l.getUint32(4),n=3}else{if(Rs(e)<i)break;const c=Ps(e,i);o.enqueue(Ja(r?c:Fr.decode(c),t)),n=0}if(i===0||i>s){o.enqueue(Sa);break}}}})}const fl=4;function de(s){if(s)return Jg(s)}function Jg(s){for(var t in de.prototype)s[t]=de.prototype[t];return s}de.prototype.on=de.prototype.addEventListener=function(s,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(t),this};de.prototype.once=function(s,t){function e(){this.off(s,e),t.apply(this,arguments)}return e.fn=t,this.on(s,e),this};de.prototype.off=de.prototype.removeListener=de.prototype.removeAllListeners=de.prototype.removeEventListener=function(s,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var e=this._callbacks["$"+s];if(!e)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var n,i=0;i<e.length;i++)if(n=e[i],n===t||n.fn===t){e.splice(i,1);break}return e.length===0&&delete this._callbacks["$"+s],this};de.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),e=this._callbacks["$"+s],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(e){e=e.slice(0);for(var n=0,i=e.length;n<i;++n)e[n].apply(this,t)}return this};de.prototype.emitReserved=de.prototype.emit;de.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};de.prototype.hasListeners=function(s){return!!this.listeners(s).length};const tr=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,e)=>e(t,0),Fe=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),jg="arraybuffer";function pl(s,...t){return t.reduce((e,n)=>(s.hasOwnProperty(n)&&(e[n]=s[n]),e),{})}const Qg=Fe.setTimeout,t0=Fe.clearTimeout;function er(s,t){t.useNativeTimers?(s.setTimeoutFn=Qg.bind(Fe),s.clearTimeoutFn=t0.bind(Fe)):(s.setTimeoutFn=Fe.setTimeout.bind(Fe),s.clearTimeoutFn=Fe.clearTimeout.bind(Fe))}const e0=1.33;function n0(s){return typeof s=="string"?i0(s):Math.ceil((s.byteLength||s.size)*e0)}function i0(s){let t=0,e=0;for(let n=0,i=s.length;n<i;n++)t=s.charCodeAt(n),t<128?e+=1:t<2048?e+=2:t<55296||t>=57344?e+=3:(n++,e+=4);return e}function ml(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function s0(s){let t="";for(let e in s)s.hasOwnProperty(e)&&(t.length&&(t+="&"),t+=encodeURIComponent(e)+"="+encodeURIComponent(s[e]));return t}function r0(s){let t={},e=s.split("&");for(let n=0,i=e.length;n<i;n++){let r=e[n].split("=");t[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return t}class a0 extends Error{constructor(t,e,n){super(t),this.description=e,this.context=n,this.type="TransportError"}}class ja extends de{constructor(t){super(),this.writable=!1,er(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,e,n){return super.emitReserved("error",new a0(t,e,n)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const e=Ja(t,this.socket.binaryType);this.onPacket(e)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,e={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(e)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const e=s0(t);return e.length?"?"+e:""}}class o0 extends ja{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const e=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let n=0;this._polling&&(n++,this.once("pollComplete",function(){--n||e()})),this.writable||(n++,this.once("drain",function(){--n||e()}))}else e()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const e=n=>{if(this.readyState==="opening"&&n.type==="open"&&this.onOpen(),n.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(n)};$g(t,this.socket.binaryType).forEach(e),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,Yg(t,e=>{this.doWrite(e,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",e=this.query||{};return this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=ml()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.createUri(t,e)}}let gl=!1;try{gl=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const c0=gl;function l0(){}class h0 extends o0{constructor(t){if(super(t),typeof location<"u"){const e=location.protocol==="https:";let n=location.port;n||(n=e?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||n!==t.port}}doWrite(t,e){const n=this.request({method:"POST",data:t});n.on("success",e),n.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(e,n)=>{this.onError("xhr poll error",e,n)}),this.pollXhr=t}}class tn extends de{constructor(t,e,n){super(),this.createRequest=t,er(this,n),this._opts=n,this._method=n.method||"GET",this._uri=e,this._data=n.data!==void 0?n.data:null,this._create()}_create(){var t;const e=pl(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this._opts.xd;const n=this._xhr=this.createRequest(e);try{n.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&n.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{n.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(n),"withCredentials"in n&&(n.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(n.timeout=this._opts.requestTimeout),n.onreadystatechange=()=>{var i;n.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(n.getResponseHeader("set-cookie"))),n.readyState===4&&(n.status===200||n.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof n.status=="number"?n.status:0)},0))},n.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=tn.requestsCount++,tn.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=l0,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete tn.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}tn.requestsCount=0;tn.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",gc);else if(typeof addEventListener=="function"){const s="onpagehide"in Fe?"pagehide":"unload";addEventListener(s,gc,!1)}}function gc(){for(let s in tn.requests)tn.requests.hasOwnProperty(s)&&tn.requests[s].abort()}const u0=function(){const s=_l({xdomain:!1});return s&&s.responseType!==null}();class d0 extends h0{constructor(t){super(t);const e=t&&t.forceBase64;this.supportsBinary=u0&&!e}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new tn(_l,this.uri(),t)}}function _l(s){const t=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||c0))return new XMLHttpRequest}catch{}if(!t)try{return new Fe[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const vl=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class f0 extends ja{get name(){return"websocket"}doOpen(){const t=this.uri(),e=this.opts.protocols,n=vl?{}:pl(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(n.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,e,n)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let e=0;e<t.length;e++){const n=t[e],i=e===t.length-1;Za(n,this.supportsBinary,r=>{try{this.doWrite(n,r)}catch{}i&&tr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",e=this.query||{};return this.opts.timestampRequests&&(e[this.opts.timestampParam]=ml()),this.supportsBinary||(e.b64=1),this.createUri(t,e)}}const Br=Fe.WebSocket||Fe.MozWebSocket;class p0 extends f0{createSocket(t,e,n){return vl?new Br(t,e,n):e?new Br(t,e):new Br(t)}doWrite(t,e){this.ws.send(e)}}class m0 extends ja{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const e=Zg(Number.MAX_SAFE_INTEGER,this.socket.binaryType),n=t.readable.pipeThrough(e).getReader(),i=Kg();i.readable.pipeTo(t.writable),this._writer=i.writable.getWriter();const r=()=>{n.read().then(({done:o,value:c})=>{o||(this.onPacket(c),r())}).catch(o=>{})};r();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let e=0;e<t.length;e++){const n=t[e],i=e===t.length-1;this._writer.write(n).then(()=>{i&&tr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const g0={websocket:p0,webtransport:m0,polling:d0},_0=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,v0=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function wa(s){if(s.length>8e3)throw"URI too long";const t=s,e=s.indexOf("["),n=s.indexOf("]");e!=-1&&n!=-1&&(s=s.substring(0,e)+s.substring(e,n).replace(/:/g,";")+s.substring(n,s.length));let i=_0.exec(s||""),r={},a=14;for(;a--;)r[v0[a]]=i[a]||"";return e!=-1&&n!=-1&&(r.source=t,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=x0(r,r.path),r.queryKey=y0(r,r.query),r}function x0(s,t){const e=/\/{2,9}/g,n=t.replace(e,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&n.splice(0,1),t.slice(-1)=="/"&&n.splice(n.length-1,1),n}function y0(s,t){const e={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(n,i,r){i&&(e[i]=r)}),e}const Ea=typeof addEventListener=="function"&&typeof removeEventListener=="function",Fs=[];Ea&&addEventListener("offline",()=>{Fs.forEach(s=>s())},!1);class bn extends de{constructor(t,e){if(super(),this.binaryType=jg,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(e=t,t=null),t){const n=wa(t);e.hostname=n.host,e.secure=n.protocol==="https"||n.protocol==="wss",e.port=n.port,n.query&&(e.query=n.query)}else e.host&&(e.hostname=wa(e.host).host);er(this,e),this.secure=e.secure!=null?e.secure:typeof location<"u"&&location.protocol==="https:",e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.hostname=e.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=e.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},e.transports.forEach(n=>{const i=n.prototype.name;this.transports.push(i),this._transportsByName[i]=n}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},e),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=r0(this.opts.query)),Ea&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Fs.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const e=Object.assign({},this.opts.query);e.EIO=fl,e.transport=t,this.id&&(e.sid=this.id);const n=Object.assign({},this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](n)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&bn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const e=this.createTransport(t);e.open(),this.setTransport(e)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",e=>this._onClose("transport close",e))}onOpen(){this.readyState="open",bn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const e=new Error("server error");e.code=t.data,this._onError(e);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let e=1;for(let n=0;n<this.writeBuffer.length;n++){const i=this.writeBuffer[n].data;if(i&&(e+=n0(i)),n>0&&e>this._maxPayload)return this.writeBuffer.slice(0,n);e+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,tr(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,e,n){return this._sendPacket("message",t,e,n),this}send(t,e,n){return this._sendPacket("message",t,e,n),this}_sendPacket(t,e,n,i){if(typeof e=="function"&&(i=e,e=void 0),typeof n=="function"&&(i=n,n=null),this.readyState==="closing"||this.readyState==="closed")return;n=n||{},n.compress=n.compress!==!1;const r={type:t,data:e,options:n};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},e=()=>{this.off("upgrade",e),this.off("upgradeError",e),t()},n=()=>{this.once("upgrade",e),this.once("upgradeError",e)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?n():t()}):this.upgrading?n():t()),this}_onError(t){if(bn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Ea&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const n=Fs.indexOf(this._offlineEventListener);n!==-1&&Fs.splice(n,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,e),this.writeBuffer=[],this._prevBufferLen=0}}}bn.protocol=fl;class M0 extends bn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let e=this.createTransport(t),n=!1;bn.priorWebsocketSuccess=!1;const i=()=>{n||(e.send([{type:"ping",data:"probe"}]),e.once("packet",u=>{if(!n)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",e),!e)return;bn.priorWebsocketSuccess=e.name==="websocket",this.transport.pause(()=>{n||this.readyState!=="closed"&&(h(),this.setTransport(e),e.send([{type:"upgrade"}]),this.emitReserved("upgrade",e),e=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=e.name,this.emitReserved("upgradeError",d)}}))};function r(){n||(n=!0,h(),e.close(),e=null)}const a=u=>{const d=new Error("probe error: "+u);d.transport=e.name,r(),this.emitReserved("upgradeError",d)};function o(){a("transport closed")}function c(){a("socket closed")}function l(u){e&&u.name!==e.name&&r()}const h=()=>{e.removeListener("open",i),e.removeListener("error",a),e.removeListener("close",o),this.off("close",c),this.off("upgrading",l)};e.once("open",i),e.once("error",a),e.once("close",o),this.once("close",c),this.once("upgrading",l),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{n||e.open()},200):e.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const e=[];for(let n=0;n<t.length;n++)~this.transports.indexOf(t[n])&&e.push(t[n]);return e}}let S0=class extends M0{constructor(t,e={}){const n=typeof t=="object"?t:e;(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(i=>g0[i]).filter(i=>!!i)),super(t,n)}};function w0(s,t="",e){let n=s;e=e||typeof location<"u"&&location,s==null&&(s=e.protocol+"//"+e.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=e.protocol+s:s=e.host+s),/^(https?|wss?):\/\//.test(s)||(typeof e<"u"?s=e.protocol+"//"+s:s="https://"+s),n=wa(s)),n.port||(/^(http|ws)$/.test(n.protocol)?n.port="80":/^(http|ws)s$/.test(n.protocol)&&(n.port="443")),n.path=n.path||"/";const r=n.host.indexOf(":")!==-1?"["+n.host+"]":n.host;return n.id=n.protocol+"://"+r+":"+n.port+t,n.href=n.protocol+"://"+r+(e&&e.port===n.port?"":":"+n.port),n}const E0=typeof ArrayBuffer=="function",b0=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,xl=Object.prototype.toString,T0=typeof Blob=="function"||typeof Blob<"u"&&xl.call(Blob)==="[object BlobConstructor]",A0=typeof File=="function"||typeof File<"u"&&xl.call(File)==="[object FileConstructor]";function Qa(s){return E0&&(s instanceof ArrayBuffer||b0(s))||T0&&s instanceof Blob||A0&&s instanceof File}function Bs(s,t){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let e=0,n=s.length;e<n;e++)if(Bs(s[e]))return!0;return!1}if(Qa(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return Bs(s.toJSON(),!0);for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e)&&Bs(s[e]))return!0;return!1}function C0(s){const t=[],e=s.data,n=s;return n.data=ba(e,t),n.attachments=t.length,{packet:n,buffers:t}}function ba(s,t){if(!s)return s;if(Qa(s)){const e={_placeholder:!0,num:t.length};return t.push(s),e}else if(Array.isArray(s)){const e=new Array(s.length);for(let n=0;n<s.length;n++)e[n]=ba(s[n],t);return e}else if(typeof s=="object"&&!(s instanceof Date)){const e={};for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=ba(s[n],t));return e}return s}function R0(s,t){return s.data=Ta(s.data,t),delete s.attachments,s}function Ta(s,t){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<t.length)return t[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let e=0;e<s.length;e++)s[e]=Ta(s[e],t);else if(typeof s=="object")for(const e in s)Object.prototype.hasOwnProperty.call(s,e)&&(s[e]=Ta(s[e],t));return s}const P0=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var zt;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(zt||(zt={}));class L0{constructor(t){this.replacer=t}encode(t){return(t.type===zt.EVENT||t.type===zt.ACK)&&Bs(t)?this.encodeAsBinary({type:t.type===zt.EVENT?zt.BINARY_EVENT:zt.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let e=""+t.type;return(t.type===zt.BINARY_EVENT||t.type===zt.BINARY_ACK)&&(e+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(e+=t.nsp+","),t.id!=null&&(e+=t.id),t.data!=null&&(e+=JSON.stringify(t.data,this.replacer)),e}encodeAsBinary(t){const e=C0(t),n=this.encodeAsString(e.packet),i=e.buffers;return i.unshift(n),i}}class to extends de{constructor(t){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof t=="function"?{reviver:t}:t)}add(t){let e;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");e=this.decodeString(t);const n=e.type===zt.BINARY_EVENT;n||e.type===zt.BINARY_ACK?(e.type=n?zt.EVENT:zt.ACK,this.reconstructor=new D0(e),e.attachments===0&&super.emitReserved("decoded",e)):super.emitReserved("decoded",e)}else if(Qa(t)||t.base64)if(this.reconstructor)e=this.reconstructor.takeBinaryData(t),e&&(this.reconstructor=null,super.emitReserved("decoded",e));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let e=0;const n={type:Number(t.charAt(0))};if(zt[n.type]===void 0)throw new Error("unknown packet type "+n.type);if(n.type===zt.BINARY_EVENT||n.type===zt.BINARY_ACK){const r=e+1;for(;t.charAt(++e)!=="-"&&e!=t.length;);const a=t.substring(r,e);if(a!=Number(a)||t.charAt(e)!=="-")throw new Error("Illegal attachments");const o=Number(a);if(!I0(o)||o<0)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");n.attachments=o}if(t.charAt(e+1)==="/"){const r=e+1;for(;++e&&!(t.charAt(e)===","||e===t.length););n.nsp=t.substring(r,e)}else n.nsp="/";const i=t.charAt(e+1);if(i!==""&&Number(i)==i){const r=e+1;for(;++e;){const a=t.charAt(e);if(a==null||Number(a)!=a){--e;break}if(e===t.length)break}n.id=Number(t.substring(r,e+1))}if(t.charAt(++e)){const r=this.tryParse(t.substr(e));if(to.isPayloadValid(n.type,r))n.data=r;else throw new Error("invalid payload")}return n}tryParse(t){try{return JSON.parse(t,this.opts.reviver)}catch{return!1}}static isPayloadValid(t,e){switch(t){case zt.CONNECT:return _c(e);case zt.DISCONNECT:return e===void 0;case zt.CONNECT_ERROR:return typeof e=="string"||_c(e);case zt.EVENT:case zt.BINARY_EVENT:return Array.isArray(e)&&(typeof e[0]=="number"||typeof e[0]=="string"&&P0.indexOf(e[0])===-1);case zt.ACK:case zt.BINARY_ACK:return Array.isArray(e)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class D0{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const e=R0(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const I0=Number.isInteger||function(s){return typeof s=="number"&&isFinite(s)&&Math.floor(s)===s};function _c(s){return Object.prototype.toString.call(s)==="[object Object]"}const U0=Object.freeze(Object.defineProperty({__proto__:null,Decoder:to,Encoder:L0,get PacketType(){return zt}},Symbol.toStringTag,{value:"Module"}));function We(s,t,e){return s.on(t,e),function(){s.off(t,e)}}const N0=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class yl extends de{constructor(t,e,n){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=e,n&&n.auth&&(this.auth=n.auth),this._opts=Object.assign({},n),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[We(t,"open",this.onopen.bind(this)),We(t,"packet",this.onpacket.bind(this)),We(t,"error",this.onerror.bind(this)),We(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...e){var n,i,r;if(N0.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(e.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(e),this;const a={type:zt.EVENT,data:e};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof e[e.length-1]=="function"){const h=this.ids++,u=e.pop();this._registerAckCallback(h,u),a.id=h}const o=(i=(n=this.io.engine)===null||n===void 0?void 0:n.transport)===null||i===void 0?void 0:i.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!o||(c?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(t,e){var n;const i=(n=this.flags.timeout)!==null&&n!==void 0?n:this._opts.ackTimeout;if(i===void 0){this.acks[t]=e;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===t&&this.sendBuffer.splice(o,1);e.call(this,new Error("operation has timed out"))},i),a=(...o)=>{this.io.clearTimeoutFn(r),e.apply(this,o)};a.withError=!0,this.acks[t]=a}emitWithAck(t,...e){return new Promise((n,i)=>{const r=(a,o)=>a?i(a):n(o);r.withError=!0,e.push(r),this.emit(t,...e)})}_addToQueue(t){let e;typeof t[t.length-1]=="function"&&(e=t.pop());const n={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((i,...r)=>(this._queue[0],i!==null?n.tryCount>this._opts.retries&&(this._queue.shift(),e&&e(i)):(this._queue.shift(),e&&e(null,...r)),n.pending=!1,this._drainQueue())),this._queue.push(n),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const e=this._queue[0];e.pending&&!t||(e.pending=!0,e.tryCount++,this.flags=e.flags,this.emit.apply(this,e.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:zt.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,e){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,e),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(n=>String(n.id)===t)){const n=this.acks[t];delete this.acks[t],n.withError&&n.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case zt.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case zt.EVENT:case zt.BINARY_EVENT:this.onevent(t);break;case zt.ACK:case zt.BINARY_ACK:this.onack(t);break;case zt.DISCONNECT:this.ondisconnect();break;case zt.CONNECT_ERROR:this.destroy();const n=new Error(t.data.message);n.data=t.data.data,this.emitReserved("connect_error",n);break}}onevent(t){const e=t.data||[];t.id!=null&&e.push(this.ack(t.id)),this.connected?this.emitEvent(e):this.receiveBuffer.push(Object.freeze(e))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const e=this._anyListeners.slice();for(const n of e)n.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const e=this;let n=!1;return function(...i){n||(n=!0,e.packet({type:zt.ACK,id:t,data:i}))}}onack(t){const e=this.acks[t.id];typeof e=="function"&&(delete this.acks[t.id],e.withError&&t.data.unshift(null),e.apply(this,t.data))}onconnect(t,e){this.id=t,this.recovered=e&&this._pid===e,this._pid=e,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:zt.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const e=this._anyListeners;for(let n=0;n<e.length;n++)if(t===e[n])return e.splice(n,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const e=this._anyOutgoingListeners;for(let n=0;n<e.length;n++)if(t===e[n])return e.splice(n,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const e=this._anyOutgoingListeners.slice();for(const n of e)n.apply(this,t.data)}}}function Ci(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}Ci.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),e=Math.floor(t*this.jitter*s);s=Math.floor(t*10)&1?s+e:s-e}return Math.min(s,this.max)|0};Ci.prototype.reset=function(){this.attempts=0};Ci.prototype.setMin=function(s){this.ms=s};Ci.prototype.setMax=function(s){this.max=s};Ci.prototype.setJitter=function(s){this.jitter=s};class Aa extends de{constructor(t,e){var n;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.opts=e,er(this,e),this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor((n=e.randomizationFactor)!==null&&n!==void 0?n:.5),this.backoff=new Ci({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(e.timeout==null?2e4:e.timeout),this._readyState="closed",this.uri=t;const i=e.parser||U0;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=e.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var e;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(e=this.backoff)===null||e===void 0||e.setMin(t),this)}randomizationFactor(t){var e;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(e=this.backoff)===null||e===void 0||e.setJitter(t),this)}reconnectionDelayMax(t){var e;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(e=this.backoff)===null||e===void 0||e.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new S0(this.uri,this.opts);const e=this.engine,n=this;this._readyState="opening",this.skipReconnect=!1;const i=We(e,"open",function(){n.onopen(),t&&t()}),r=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),t?t(o):this.maybeReconnectOnOpen()},a=We(e,"error",r);if(this._timeout!==!1){const o=this._timeout,c=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),e.close()},o);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(i),this.subs.push(a),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(We(t,"ping",this.onping.bind(this)),We(t,"data",this.ondata.bind(this)),We(t,"error",this.onerror.bind(this)),We(t,"close",this.onclose.bind(this)),We(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(e){this.onclose("parse error",e)}}ondecoded(t){tr(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,e){let n=this.nsps[t];return n?this._autoConnect&&!n.active&&n.connect():(n=new yl(this,t,e),this.nsps[t]=n),n}_destroy(t){const e=Object.keys(this.nsps);for(const n of e)if(this.nsps[n].active)return;this._close()}_packet(t){const e=this.encoder.encode(t);for(let n=0;n<e.length;n++)this.engine.write(e[n],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,e){var n;this.cleanup(),(n=this.engine)===null||n===void 0||n.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,e),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const e=this.backoff.duration();this._reconnecting=!0;const n=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(i=>{i?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",i)):t.onreconnect()}))},e);this.opts.autoUnref&&n.unref(),this.subs.push(()=>{this.clearTimeoutFn(n)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const zi={};function ks(s,t){typeof s=="object"&&(t=s,s=void 0),t=t||{};const e=w0(s,t.path||"/socket.io"),n=e.source,i=e.id,r=e.path,a=zi[i]&&r in zi[i].nsps,o=t.forceNew||t["force new connection"]||t.multiplex===!1||a;let c;return o?c=new Aa(n,t):(zi[i]||(zi[i]=new Aa(n,t)),c=zi[i]),e.query&&!t.query&&(t.query=e.queryKey),c.socket(e.path,t)}Object.assign(ks,{Manager:Aa,Socket:yl,io:ks,connect:ks});class O0{constructor(t="http://localhost:3001"){I(this,"socket",null);I(this,"baseUrl");this.baseUrl=t}get connected(){var t;return!!((t=this.socket)!=null&&t.connected)}get socketId(){var t;return((t=this.socket)==null?void 0:t.id)??null}async connect(){var t;(t=this.socket)!=null&&t.connected||(this.socket=ks(this.baseUrl,{transports:["websocket","polling"],autoConnect:!0}),await new Promise((e,n)=>{var r,a;const i=window.setTimeout(()=>n(new Error("Multiplayer server timeout")),4500);(r=this.socket)==null||r.once("connect",()=>{window.clearTimeout(i),e()}),(a=this.socket)==null||a.once("connect_error",o=>{window.clearTimeout(i),n(o)})}))}async listRooms(){const t=await fetch(`${this.baseUrl}/rooms`);if(!t.ok)throw new Error(`Could not list rooms: ${t.status}`);return await t.json()}async createRoom(t){const e=await fetch(`${this.baseUrl}/rooms`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error(`Could not create room: ${e.status}`);return await e.json()}async joinRoom(t,e){return await this.connect(),new Promise(n=>{var i;(i=this.socket)==null||i.emit("room:join",{roomId:t,playerName:e},r=>{n(r)})})}onRooms(t){var e;(e=this.socket)==null||e.on("rooms:list",t)}onPlayerStates(t){var e;(e=this.socket)==null||e.on("state:players",t)}onChat(t){var e;(e=this.socket)==null||e.on("chat:message",t)}onHoleSwallowed(t){var e;(e=this.socket)==null||e.on("hole:swallowed",t)}sendPlayerState(t,e){var n;(n=this.socket)==null||n.emit("state:update",{roomId:t,state:e})}sendChat(t,e,n){var i;(i=this.socket)==null||i.emit("chat:send",{roomId:t,sender:e,text:n})}sendHoleSwallowed(t,e,n){var i;(i=this.socket)==null||i.emit("hole:swallowed",{roomId:t,attackerId:e,victimId:n,timestamp:Date.now()})}disconnect(){var t;(t=this.socket)==null||t.disconnect(),this.socket=null}}class z0{constructor(t){I(this,"views",new Map);I(this,"timeAccumulator",0);this.scene=t}setSurfaces(t){this.clear();for(const e of t){const n=this.createView(e);this.views.set(e.id,n),this.scene.add(n.group)}}update(t,e){this.timeAccumulator+=t;for(const n of this.views.values()){const i=n.surface.attachedObjectId?e.get(n.surface.attachedObjectId):null;i&&(n.group.visible=i.active||!!i.swallowAnimation,n.group.position.set(i.position.x,i.position.y+i.size.y*.18,i.position.z),n.group.rotation.y=i.rotation.y+Math.PI/2,n.group.scale.setScalar(i.swallowScale)),n.surface.dynamic&&(this.drawSurface(n,this.timeAccumulator),n.texture.needsUpdate=!0)}}clear(){for(const t of this.views.values())this.scene.remove(t.group),t.texture.dispose(),t.group.traverse(e=>{const n=e;if(n.geometry&&n.geometry.dispose(),n.material){const i=Array.isArray(n.material)?n.material:[n.material];for(const r of i)r.dispose()}});this.views.clear()}createView(t){const e=document.createElement("canvas");e.width=512,e.height=256;const n=e.getContext("2d");if(!n)throw new Error("Canvas 2D context unavailable");const i=new el(e);i.colorSpace=Oe;const r=new Ji({map:i,side:Xe,toneMapped:!1}),a=new ct(new Xn(t.width,t.height),r),o=new jt;o.position.set(t.position.x,t.position.y,t.position.z),o.rotation.y=t.rotationY,o.add(a);const c={surface:t,group:o,texture:i,canvas:e,context:n};return this.drawSurface(c,0),i.needsUpdate=!0,c}drawSurface(t,e){const{context:n,canvas:i,surface:r}=t,a=r.dynamic?Math.floor(e*65%360):174;n.clearRect(0,0,i.width,i.height),n.fillStyle=r.dynamic?`hsl(${a}, 72%, 22%)`:"#121722",n.fillRect(0,0,i.width,i.height),n.strokeStyle=r.dynamic?`hsl(${(a+90)%360}, 80%, 62%)`:"#5eead4",n.lineWidth=12,n.strokeRect(16,16,i.width-32,i.height-32),n.fillStyle="#ffffff",n.font="800 42px Inter, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(r.text,i.width/2,i.height/2-6,i.width-70),n.font="700 24px Inter, Arial, sans-serif",n.fillStyle=r.dynamic?"#f6c453":"#b9c1d6",n.fillText(r.dynamic?"LIVE SLOT":r.type.toUpperCase().replace(/-/g," "),i.width/2,i.height/2+54)}}class F0{constructor(){I(this,"desiredPosition",new C);I(this,"lookTarget",new C)}update(t,e,n,i=!1,r=1){if(!e)return;const a=Math.min(26,e.radius*4.2),o=Me.clamp(r,.72,1.42);if(this.desiredPosition.set(e.position.x,(24+a)*o,e.position.z+(24+a)*o),this.lookTarget.set(e.position.x,0,e.position.z),i)t.position.copy(this.desiredPosition);else{const c=1-Math.pow(.001,n);t.position.lerp(this.desiredPosition,c)}t.lookAt(this.lookTarget)}}class Ml{createLabel(t,e){const n=document.createElement("canvas");n.width=384,n.height=96;const i=n.getContext("2d");if(!i)throw new Error("Canvas 2D context unavailable");i.clearRect(0,0,n.width,n.height),i.fillStyle="rgba(3, 6, 12, 0.72)",this.roundRect(i,6,12,372,72,14),i.fill(),i.strokeStyle=e,i.lineWidth=4,this.roundRect(i,6,12,372,72,14),i.stroke(),i.fillStyle="#ffffff",i.font='800 34px "Open Sans", Arial, sans-serif',i.textAlign="center",i.textBaseline="middle",i.fillText(t.slice(0,20),192,50);const r=new el(n);r.colorSpace=Oe;const a=new Qc({map:r,transparent:!0,depthTest:!1,depthWrite:!1}),o=new eg(a);return o.renderOrder=20,o}roundRect(t,e,n,i,r,a){t.beginPath(),t.moveTo(e+a,n),t.lineTo(e+i-a,n),t.quadraticCurveTo(e+i,n,e+i,n+a),t.lineTo(e+i,n+r-a),t.quadraticCurveTo(e+i,n+r,e+i-a,n+r),t.lineTo(e+a,n+r),t.quadraticCurveTo(e,n+r,e,n+r-a),t.lineTo(e,n+a),t.quadraticCurveTo(e,n,e+a,n),t.closePath()}}class B0{constructor(t){I(this,"views",new Map);I(this,"labelRenderer",new Ml);I(this,"centerGeometry",new Ee(1,1,.06,64));I(this,"rimGeometry",new Yi(1,.075,12,64));I(this,"shadowGeometry",new $a(.92,1.18,64));this.scene=t}update(t){const e=new Set(t.map(n=>n.id));for(const[n,i]of this.views)e.has(n)||(this.disposeView(i),this.views.delete(n));for(const n of t){const i=this.views.get(n.id)??this.createView(n),r=n.radius*n.visualScale;i.group.visible=n.renderVisible,i.label.visible=n.renderVisible,i.group.position.set(n.position.x,.16+n.visualY,n.position.z),i.group.scale.set(r,1,r),i.label.position.set(n.position.x,1.55+n.radius*.78+n.visualY,n.position.z),i.label.scale.set(5.65+n.radius*.36,1.42+n.radius*.08,1)}}dispose(){for(const t of this.views.values())this.disposeView(t);this.views.clear(),this.centerGeometry.dispose(),this.rimGeometry.dispose(),this.shadowGeometry.dispose()}clear(){for(const t of this.views.values())this.disposeView(t);this.views.clear()}createView(t){const e=new jt,n=new kn({color:"#010101",roughness:.8,metalness:0,depthWrite:!0}),i=new kn({color:t.rimColor,emissive:t.rimColor,emissiveIntensity:.32,roughness:.35,metalness:.2}),r=new Ji({color:"#000000",transparent:!0,opacity:.35,side:Xe}),a=new ct(this.centerGeometry,n);a.receiveShadow=!0,a.position.y=.025,a.renderOrder=6;const o=new ct(this.rimGeometry,i);o.rotation.x=Math.PI/2,o.position.y=.09,o.renderOrder=7;const c=new ct(this.shadowGeometry,r);c.rotation.x=-Math.PI/2,c.position.y=-.045,c.renderOrder=5,e.add(c,a,o);const l=this.labelRenderer.createLabel(t.name,t.rimColor);this.scene.add(e,l);const h={group:e,label:l};return this.views.set(t.id,h),h}disposeView(t){this.scene.remove(t.group,t.label),t.group.traverse(n=>{const i=n;if(i.material){const r=Array.isArray(i.material)?i.material:[i.material];for(const a of r)a.dispose()}});const e=t.label.material;e.map&&e.map.dispose(),e.dispose()}}class k0{constructor(){I(this,"materialCache",new Map)}createGround(t){const e=new Xn(t*2,t*2,1,1),n=new kn({color:"#263228",roughness:.95}),i=new ct(e,n);return i.position.y=.005,i.rotation.x=-Math.PI/2,i.receiveShadow=!0,i}createWater(t){const e=new jt,n=new Xn(t*5.2,t*5.2,1,1),i=new kn({color:"#155a73",emissive:"#063345",emissiveIntensity:.25,roughness:.42,metalness:.18}),r=new ct(n,i);r.rotation.x=-Math.PI/2,r.position.y=-.1;const a=this.getMaterial("#8aa79d",.88,.02),o=2.6,c=t*2+o,l=new Ht(c,.08,o),h=new Ht(o,.08,c),u=new ct(l,a);u.position.set(0,.045,-t-o*.45);const d=u.clone();d.position.z=t+o*.45;const f=new ct(h,a);f.position.set(-t-o*.45,.045,0);const g=f.clone();return g.position.x=t+o*.45,e.add(r,u,d,f,g),e}createRoad(t){const e=new Ht(t.width,.035,t.length),n=this.getMaterial("#1e2430",.9,.02),i=new ct(e,n);return i.position.set(t.x,.025,t.z),i.rotation.y=t.rotationY,i.receiveShadow=!0,i}createSurface(t){if(t.kind==="crosswalk")return this.createCrosswalk(t);if(t.kind==="plaza")return this.createPlaza(t);const e=new Ht(t.width,.04,t.length),n=t.kind==="sidewalk"?"#747c77":"#f6f4d7",i=this.getMaterial(n,t.kind==="sidewalk"?.86:.58,.02),r=new ct(e,i);return r.position.set(t.x,t.kind==="sidewalk"?.06:.08,t.z),r.rotation.y=t.rotationY,r.receiveShadow=!0,r}createCrosswalk(t){const e=new jt,n=this.getMaterial("#e7edf1",.58,.02),i=Math.max(5,Math.floor(t.width/.72)),r=t.width/(i*1.75),a=t.width/i;for(let o=0;o<i;o+=1){const c=new ct(new Ht(r,.05,t.length),n);c.position.x=-t.width*.5+a*(o+.5),c.receiveShadow=!0,e.add(c)}return e.position.set(t.x,.085,t.z),e.rotation.y=t.rotationY,e}createPlaza(t){const e=new Ht(t.width,.045,t.length),n=this.getMaterial("#66736c",.88,.02),i=new ct(e,n);return i.position.set(t.x,.045,t.z),i.rotation.y=t.rotationY,i.receiveShadow=!0,i}createBoundary(t){const e=new jt,n=this.getMaterial("#6f8083",.78,.03),i=1,r=.35,a=t*2+i,o=new Ht(a,r,i),c=new Ht(i,r,a),l=new ct(o,n);l.position.set(0,r/2+.02,-t-i/2);const h=l.clone();h.position.z=t+i/2;const u=new ct(c,n);u.position.set(-t-i/2,r/2,0);const d=u.clone();return d.position.x=t+i/2,e.add(l,h,u,d),e}createWorldObjectMesh(t){switch(t.kind){case"tree":return this.createTree(t);case"bench":return this.createBench(t);case"hydrant":return this.createHydrant(t);case"trash":return this.createTrash(t);case"pedestrian":return this.createPedestrian(t);case"post":return this.createPost(t);case"cone":return this.createCone(t);case"mailbox":return this.createMailbox(t);case"bike":return this.createBike(t);case"planter":return this.createPlanter(t);case"kiosk":return this.createKiosk(t);case"fountain":return this.createFountain(t);case"statue":return this.createStatue(t);case"rock":return this.createRock(t);case"car":case"truck":return this.createVehicle(t);case"billboard":case"screen":return this.createAdFrame(t);case"building":case"structure":return this.createBuilding(t);case"crate":default:return this.createBoxObject(t)}}disposeObject(t){t.traverse(e=>{const n=e;if(n.geometry&&n.geometry.dispose(),n.material){const i=Array.isArray(n.material)?n.material:[n.material];for(const r of i)this.isCachedMaterial(r)||r.dispose()}})}dispose(){for(const t of this.materialCache.values())t.dispose();this.materialCache.clear()}createPowerUpMesh(t){const e=new jt,n=new ct(new Ya(t.radius*.72,0),new kn({color:t.color,emissive:t.color,emissiveIntensity:.55,roughness:.35,metalness:.2})),i=new ct(new Yi(t.radius*.72,.045,8,28),new Ji({color:t.color,transparent:!0,opacity:.82}));return i.rotation.x=Math.PI/2,e.add(n,i),e}createBoxObject(t){const e=new Ht(t.size.x,t.size.y,t.size.z),n=new ct(e,this.getMaterial(t.color,.7,.04));return n.castShadow=!0,n.receiveShadow=!0,n}createBuilding(t){const e=new jt,n=new ct(new Ht(t.size.x,t.size.y,t.size.z),this.getMaterial(t.color,.82,.06));n.castShadow=!0,n.receiveShadow=!0;const i=new ct(new Ht(t.size.x*1.04,.22,t.size.z*1.04),this.getMaterial("#313845",.75,.08));return i.position.y=t.size.y*.5+.12,i.castShadow=!0,e.add(n,i),e}createTree(t){const e=new jt,n=new ct(new Ee(.16,.22,t.size.y*.5,8),this.getMaterial("#7b5233",.86,.02));n.position.y=-t.size.y*.2;const i=new ct(new Wi(t.size.x*.65,0),this.getMaterial(t.color,.88,.02));return i.position.y=t.size.y*.12,n.castShadow=!0,i.castShadow=!0,e.add(n,i),e}createPost(t){const e=new jt,n=new ct(new Ee(.09,.12,t.size.y,8),this.getMaterial(t.color,.55,.3)),i=new ct(new gi(.18,8,6),this.getMaterial("#f6c453",.4,.2));return i.position.y=t.size.y*.5+.12,n.castShadow=!0,i.castShadow=!0,e.add(n,i),e}createBench(t){const e=new jt,n=this.getMaterial(t.color,.78,.03),i=new ct(new Ht(t.size.x,.16,t.size.z),n);i.position.y=-t.size.y*.08;const r=new ct(new Ht(t.size.x,.16,.12),n);r.position.set(0,t.size.y*.22,-t.size.z*.45);const a=this.getMaterial("#303641",.7,.08);for(const o of[-t.size.x*.38,t.size.x*.38]){const c=new ct(new Ht(.12,.42,.12),a);c.position.set(o,-t.size.y*.34,0),e.add(c)}return i.castShadow=!0,r.castShadow=!0,e.add(i,r),e}createHydrant(t){const e=new jt,n=this.getMaterial(t.color,.45,.18),i=new ct(new Ee(.17,.2,t.size.y*.72,10),n),r=new ct(new gi(.19,10,6),n);r.position.y=t.size.y*.36;const a=new ct(new Ee(.08,.08,.46,8),n);return a.rotation.z=Math.PI/2,a.position.y=t.size.y*.1,e.add(i,r,a),e}createCone(t){const e=new jt,n=new ct(new qa(t.size.x*.42,t.size.y,12),this.getMaterial("#f97316",.62,.03)),i=new ct(new Ee(t.size.x*.26,t.size.x*.31,.06,12),this.getMaterial("#f8fafc",.45,.02));return i.position.y=t.size.y*.12,n.castShadow=!0,e.add(n,i),e}createMailbox(t){const e=new jt,n=new ct(new Ee(.06,.08,t.size.y*.65,8),this.getMaterial("#26313c",.68,.08));n.position.y=-t.size.y*.2;const i=new ct(new Ht(t.size.x,t.size.y*.42,t.size.z),this.getMaterial(t.color,.58,.08));i.position.y=t.size.y*.22;const r=new ct(new Ht(.04,t.size.y*.28,.22),this.getMaterial("#f6c453",.44,.05));return r.position.set(t.size.x*.52,t.size.y*.28,-t.size.z*.12),e.add(n,i,r),e}createBike(t){const e=new jt,n=this.getMaterial("#111318",.75,.08),i=this.getMaterial(t.color,.42,.18),r=new Yi(.28,.035,8,18);for(const c of[-t.size.z*.28,t.size.z*.28]){const l=new ct(r,n);l.rotation.y=Math.PI/2,l.position.set(0,-t.size.y*.18,c),e.add(l)}const a=new ct(new Ht(.08,.12,t.size.z*.72),i);a.position.y=t.size.y*.08;const o=new ct(new Ht(.52,.05,.06),i);return o.position.set(0,t.size.y*.34,-t.size.z*.38),e.add(a,o),e}createPlanter(t){const e=new jt,n=new ct(new Ht(t.size.x,t.size.y*.46,t.size.z),this.getMaterial("#7a5140",.86,.02));n.position.y=-t.size.y*.18;const i=new ct(new Wi(Math.max(t.size.x,t.size.z)*.34,0),this.getMaterial(t.color,.9,.01));return i.position.y=t.size.y*.18,n.castShadow=!0,i.castShadow=!0,e.add(n,i),e}createKiosk(t){const e=new jt,n=new ct(new Ht(t.size.x,t.size.y*.78,t.size.z),this.getMaterial(t.color,.68,.06));n.position.y=-t.size.y*.05;const i=new ct(new Ht(t.size.x*1.16,.16,t.size.z*1.12),this.getMaterial("#2f4858",.58,.04));i.position.y=t.size.y*.42;const r=new ct(new Ht(t.size.x*.58,t.size.y*.22,.04),this.getMaterial("#9bd6e5",.26,.1));return r.position.set(0,t.size.y*.08,-t.size.z*.52),e.add(n,i,r),e}createFountain(t){const e=new jt,n=this.getMaterial("#a7b0ad",.8,.03),i=new ct(new Ee(t.size.x*.5,t.size.x*.56,t.size.y*.28,24),n);i.position.y=-t.size.y*.28;const r=new ct(new Ee(t.size.x*.42,t.size.x*.42,.05,24),new kn({color:"#5eead4",emissive:"#155a73",emissiveIntensity:.24,roughness:.35,metalness:.12,transparent:!0,opacity:.82}));r.position.y=-t.size.y*.12;const a=new ct(new Ee(.06,.08,t.size.y*.58,10),n);return a.position.y=t.size.y*.12,e.add(i,r,a),e}createStatue(t){const e=new jt,n=this.getMaterial(t.color,.72,.06),i=new ct(new Ht(t.size.x,t.size.y*.22,t.size.z),n);i.position.y=-t.size.y*.38;const r=new ct(new $s(t.size.x*.18,t.size.y*.48,4,8),n);r.position.y=-t.size.y*.02;const a=new ct(new gi(t.size.x*.18,10,8),n);return a.position.y=t.size.y*.36,e.add(i,r,a),e}createTrash(t){const e=new jt,n=new ct(new Ee(t.size.x*.45,t.size.x*.5,t.size.y,8),this.getMaterial(t.color,.7,.08)),i=new ct(new Ht(t.size.x*1.1,.08,t.size.z*1.1),this.getMaterial("#1f2933",.72,.1));return i.position.y=t.size.y*.52,n.castShadow=!0,e.add(n,i),e}createPedestrian(t){const e=new jt,n=new ct(new $s(.17,t.size.y*.45,4,8),this.getMaterial(t.color,.62,.04));n.position.y=.02;const i=new ct(new gi(.18,10,8),this.getMaterial("#e9bd8a",.65,.02));return i.position.y=t.size.y*.42,n.castShadow=!0,i.castShadow=!0,e.add(n,i),e}createRock(t){const e=new ct(new Wi(Math.max(t.size.x,t.size.z)*.55,0),this.getMaterial(t.color,.94,0));return e.scale.y=.72,e.castShadow=!0,e.receiveShadow=!0,e}createVehicle(t){const e=new jt,n=new ct(new Ht(t.size.x,t.size.y*.65,t.size.z),this.getMaterial(t.color,.55,.12));n.position.y=-t.size.y*.08;const i=new ct(new Ht(t.size.x*.72,t.size.y*.52,t.size.z*.38),this.getMaterial("#dce8ef",.4,.08));i.position.set(0,t.size.y*.32,-t.size.z*.12);const r=this.getMaterial("#111318",.8,.1),a=new Ee(.23,.23,.2,10);for(const o of[-t.size.x*.52,t.size.x*.52])for(const c of[-t.size.z*.32,t.size.z*.32]){const l=new ct(a,r);l.rotation.z=Math.PI/2,l.position.set(o,-t.size.y*.36,c),e.add(l)}return n.castShadow=!0,i.castShadow=!0,e.add(n,i),e}createAdFrame(t){const e=new jt,n=new ct(new Ht(t.size.x,t.size.y,t.size.z),this.getMaterial(t.color,.5,.08)),i=this.getMaterial("#202733",.68,.05),r=new Ee(.12,.16,t.size.y*1.1,8),a=new ct(r,i),o=a.clone();return a.position.set(-t.size.x*.42,-t.size.y*.42,-.08),o.position.set(t.size.x*.42,-t.size.y*.42,-.08),n.castShadow=!0,a.castShadow=!0,o.castShadow=!0,e.add(n,a,o),e}getMaterial(t,e,n){const i=`${t}:${e}:${n}`,r=this.materialCache.get(i);if(r)return r;const a=new kn({color:t,roughness:e,metalness:n});return this.materialCache.set(i,a),a}isCachedMaterial(t){for(const e of this.materialCache.values())if(e===t)return!0;return!1}}class V0{constructor(t){I(this,"scene",new Qm);I(this,"camera",new ze(58,1,.1,1200));I(this,"renderer",new jm({antialias:!0,alpha:!1,powerPreference:"high-performance"}));I(this,"objectFactory",new k0);I(this,"cameraController",new F0);I(this,"holeRenderer",new B0(this.scene));I(this,"labelRenderer",new Ml);I(this,"adSurfaceRenderer",new z0(this.scene));I(this,"worldRoot",new jt);I(this,"objectMeshes",new Map);I(this,"powerUpMeshes",new Map);I(this,"powerUpLabels",new Map);I(this,"objectById",new Map);I(this,"firstCameraFrame",!0);I(this,"resize",()=>{const t=this.container.clientWidth||window.innerWidth,e=this.container.clientHeight||window.innerHeight;this.camera.aspect=t/Math.max(1,e),this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e,!1)});this.container=t,this.scene.background=new Ft("#0b2330"),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Vr,this.container.appendChild(this.renderer.domElement),this.scene.add(this.worldRoot),this.setupLights(),this.setGraphicsQuality("balanced"),this.resize(),window.addEventListener("resize",this.resize)}loadWorld(t){this.clearWorld(),this.firstCameraFrame=!0,this.scene.fog=new Ha("#0b2330",t.halfExtent*1.2,t.halfExtent*3),this.worldRoot.add(this.objectFactory.createWater(t.halfExtent));const e=this.objectFactory.createGround(t.halfExtent);this.worldRoot.add(e);for(const n of t.mapData.surfaces.filter(i=>i.kind==="sidewalk"||i.kind==="plaza"))this.worldRoot.add(this.objectFactory.createSurface(n));for(const n of t.mapData.roads)this.worldRoot.add(this.objectFactory.createRoad(n));for(const n of t.mapData.surfaces.filter(i=>i.kind!=="sidewalk"&&i.kind!=="plaza"))this.worldRoot.add(this.objectFactory.createSurface(n));this.worldRoot.add(this.objectFactory.createBoundary(t.halfExtent));for(const n of t.objects){const i=this.objectFactory.createWorldObjectMesh(n);i.position.copy(n.position),i.rotation.copy(n.rotation),i.userData.objectId=n.id,n.mesh=i,this.objectMeshes.set(n.id,i),this.objectById.set(n.id,n),this.worldRoot.add(i)}for(const n of t.powerUps){const i=this.objectFactory.createPowerUpMesh(n);i.position.copy(n.position),n.mesh=i,this.powerUpMeshes.set(n.id,i),this.worldRoot.add(i);const r=this.labelRenderer.createLabel(n.label,n.color);r.scale.set(5.25,1.32,1),this.powerUpLabels.set(n.id,r),this.scene.add(r)}this.adSurfaceRenderer.setSurfaces(t.mapData.adSurfaces)}setGraphicsQuality(t){const e=t==="performance"?1:t==="balanced"?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2);this.renderer.setPixelRatio(e),this.renderer.shadowMap.enabled=t!=="performance",this.renderer.shadowMap.type=t==="quality"?Vr:Il,this.resize()}update(t,e,n,i,r=1){t&&(this.syncWorld(t,i),this.adSurfaceRenderer.update(i,this.objectById)),e&&this.holeRenderer.update(e.all()),this.cameraController.update(this.camera,n,i,this.firstCameraFrame,r),this.firstCameraFrame=!1}updateDeathDive(t,e,n,i,r){this.syncWorld(t,i),this.adSurfaceRenderer.update(i,this.objectById),this.holeRenderer.update(e.all());const a=Me.clamp(r/1.35,0,1),o=1-Math.pow(1-a,3),c=Math.sin(r*5.2)*(1-o)*Math.max(.8,n.radius*.45),l=Me.lerp(12+n.radius*1.4,-1.1-n.radius*.48,Math.pow(a,1.45)),h=(1-o)*(12+n.radius*1.2);this.camera.position.lerp(new C(n.position.x+c,l,n.position.z+h),1-Math.pow(6e-4,i)),this.camera.lookAt(n.position.x,-2.2-n.radius*.3,n.position.z)}updateMenuPreview(t,e,n){this.syncWorld(t,e),this.adSurfaceRenderer.update(e,this.objectById),this.holeRenderer.update([]);const i=t.halfExtent,r=i*1.8,a=-i*.9+n*10.5%r,o=Math.sin(n*.16)*Math.min(18,i*.22);this.renderer.domElement.dataset.menuPreview=`${n.toFixed(2)}:${a.toFixed(2)}`,this.camera.position.set(o,15.5,a-20),this.camera.lookAt(o*.42,1.4,a+28)}render(){this.renderer.render(this.scene,this.camera)}clearWorld(){this.holeRenderer.clear(),this.adSurfaceRenderer.clear();for(const t of this.powerUpLabels.values())this.disposeSprite(t),this.scene.remove(t);for(const t of this.worldRoot.children)this.objectFactory.disposeObject(t);this.worldRoot.clear(),this.objectMeshes.clear(),this.powerUpMeshes.clear(),this.powerUpLabels.clear(),this.objectById.clear()}dispose(){window.removeEventListener("resize",this.resize),this.clearWorld(),this.holeRenderer.dispose(),this.objectFactory.dispose(),this.renderer.dispose()}setupLights(){const t=new gg("#d7f6ff","#1d241e",1.5);this.scene.add(t);const e=new xg("#ffffff",2.1);e.position.set(34,58,28),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),e.shadow.camera.near=1,e.shadow.camera.far=160,e.shadow.camera.left=-85,e.shadow.camera.right=85,e.shadow.camera.top=85,e.shadow.camera.bottom=-85,this.scene.add(e)}syncWorld(t,e){for(const n of t.objects){const i=this.objectMeshes.get(n.id);i&&(i.visible=n.active||!!n.swallowAnimation,i.position.copy(n.position),i.rotation.copy(n.rotation),i.scale.setScalar(n.swallowScale*n.temporaryScale))}for(const n of t.powerUps){const i=this.powerUpMeshes.get(n.id);if(!i)continue;i.visible=n.active,i.position.set(n.position.x,n.position.y+Math.sin(n.rotation*1.6)*.14,n.position.z),i.rotation.y=n.rotation,i.rotation.x=Math.sin(n.rotation)*.22;const r=this.powerUpLabels.get(n.id);r&&(r.visible=n.active,r.position.set(n.position.x,n.position.y+1.35,n.position.z))}}disposeSprite(t){const e=t.material;e.map&&e.map.dispose(),e.dispose()}}class H0{constructor(t){I(this,"element",null);I(this,"log",null);I(this,"input",null);I(this,"enabled",!0);I(this,"callbacks",null);this.root=t}show(t){var n;if(this.callbacks=t,this.element){this.setEnabled(this.enabled);return}const e=document.createElement("div");e.className="chat",e.innerHTML=`
      <h3>Chat</h3>
      <div class="chat-log"></div>
      <input class="chat-input" maxlength="120" placeholder="Press Enter to chat" />
    `,this.root.appendChild(e),this.element=e,this.log=e.querySelector(".chat-log"),this.input=e.querySelector(".chat-input"),(n=this.input)==null||n.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),i.stopPropagation(),this.sendCurrentMessage())}),this.setEnabled(this.enabled)}clear(){this.log&&(this.log.innerHTML="")}setEnabled(t){var e;this.enabled=t,(e=this.element)==null||e.classList.toggle("disabled",!t)}isInputFocused(){return document.activeElement===this.input}handleEnter(){if(!(!this.enabled||!this.input)){if(this.isInputFocused()){this.sendCurrentMessage();return}this.input.focus()}}handleEscape(){var t;return this.isInputFocused()?((t=this.input)==null||t.blur(),!0):!1}addMessage(t){if(!this.log)return;const e=document.createElement("div");e.className=`chat-message${t.system?" system":""}`,e.textContent=t.system?t.text:`${t.sender}: ${t.text}`,this.log.appendChild(e),this.log.scrollTop=this.log.scrollHeight}hide(){var t;(t=this.element)==null||t.remove(),this.element=null,this.log=null,this.input=null}sendCurrentMessage(){var e,n,i;const t=((e=this.input)==null?void 0:e.value.trim())??"";if(!t){(n=this.input)==null||n.blur();return}this.input.value="",(i=this.callbacks)==null||i.onSend(t)}}class G0{constructor(t){I(this,"element",null);this.root=t}show(t,e){var i,r;this.hide();const n=document.createElement("div");n.className="screen",n.innerHTML=`
      <section class="menu-panel narrow">
        <h2>Match Complete</h2>
        <p class="subtitle">Winner: <strong>${t.winnerName}</strong></p>
        <div class="form-grid">
          <div class="hud-row"><span>Your placement</span><strong>#${t.placement}</strong></div>
          <div class="hud-row"><span>Final score</span><strong>${t.finalScore}</strong></div>
          <div class="hud-row"><span>Final size</span><strong>${t.finalRadius.toFixed(2)}</strong></div>
          <div class="hud-row"><span>Objects swallowed</span><strong>${t.objectsSwallowed}</strong></div>
          <div class="hud-row"><span>Eliminations</span><strong>${t.eliminations}</strong></div>
        </div>
        <div class="button-grid">
          <button class="primary play-again">Play Again</button>
          <button class="main-menu">Back to Main Menu</button>
        </div>
      </section>
    `,(i=n.querySelector(".play-again"))==null||i.addEventListener("click",e.onPlayAgain),(r=n.querySelector(".main-menu"))==null||r.addEventListener("click",e.onMainMenu),this.root.appendChild(n),this.element=n}hide(){var t;(t=this.element)==null||t.remove(),this.element=null}}var ue=(s=>(s.Timed="timed",s.LastHoleStanding="last-hole-standing",s))(ue||{});function eo(s){return s==="timed"?"Timed Match":"Last Hole Standing"}class W0{constructor(t){I(this,"element",null);this.root=t}show(t,e){var i;this.hide();const n=document.createElement("div");n.className="screen",n.innerHTML=`
      <section class="menu-panel">
        <h2>Find Games</h2>
        <p class="subtitle">Rooms come from the local Socket.IO server when it is running; mock rooms appear only as an offline fallback.</p>
        <div class="rooms">
          ${t.map(r=>`
                <div class="room-row" data-room-id="${r.id}">
                  <div>
                    <div class="room-name">${r.roomName}</div>
                    <div class="muted">${r.mapSize.toUpperCase()} map</div>
                  </div>
                  <div>${r.players}/${r.maxPlayers}</div>
                  <div>${r.botsEnabled?`Bots ${"bots"in r?r.bots:"on"}`:"Bots off"}</div>
                  <div>${eo(r.matchMode)}</div>
                  <div>${r.mapSize}</div>
                  <button class="join">Join</button>
                </div>`).join("")}
        </div>
        <div class="button-grid">
          <button class="back">Back</button>
        </div>
      </section>
    `,n.querySelectorAll(".join").forEach(r=>{r.addEventListener("click",()=>{var c;const a=(c=r.closest(".room-row"))==null?void 0:c.dataset.roomId,o=t.find(l=>l.id===a);o&&e.onJoin(o)})}),(i=n.querySelector(".back"))==null||i.addEventListener("click",e.onBack),this.root.appendChild(n),this.element=n}hide(){var t;(t=this.element)==null||t.remove(),this.element=null}}function Ks(s=""){return{playerName:s,mapSize:"medium",matchMode:ue.Timed,durationSeconds:Rg,botCount:10,botDifficultyMix:"balanced",enableAds:!0,enableChat:!0,graphicsQuality:"balanced",cameraZoom:1,deathCameraEnabled:!0,multiplayer:!1,objectDensityMultiplier:1,powerUpCount:14,respawnSafeRadius:12}}function X0(){return`Player_${Math.floor(1e3+Math.random()*9e3)}`}class q0{constructor(t){I(this,"element",null);this.root=t}show(t,e,n){var o,c;this.hide();const i={...Ks(t),...n,roomName:`${t}'s Arena`,maxPlayers:16,fillBots:!0,botCount:15},r=document.createElement("div");r.className="screen",r.innerHTML=`
      <section class="menu-panel">
        <h2>Host Match</h2>
        <p class="subtitle">This creates a local room preview now and matches the data model intended for the server room manager.</p>
        <div class="form-grid">
          <label class="field">Room name<input class="room-name-input" maxlength="28" value="${i.roomName}" /></label>
          ${this.segment("Max players","maxPlayers",[["8","8"],["16","16"],["32","32"],["64","64"],["100","100"]],String(i.maxPlayers))}
          ${this.segment("Fill empty slots","fillBots",[["true","On"],["false","Off"]],String(i.fillBots))}
          ${this.segment("Bot skill","botDifficultyMix",[["relaxed","Relaxed"],["balanced","Balanced"],["competitive","Competitive"],["chaos","Chaos"]],i.botDifficultyMix)}
          ${this.segment("Map size","mapSize",[["small","Small"],["medium","Medium"],["large","Large"],["huge","Huge"]],i.mapSize)}
          ${this.segment("Match mode","matchMode",[[ue.Timed,eo(ue.Timed)],[ue.LastHoleStanding,"Last Hole Standing"]],i.matchMode)}
          ${this.segment("Duration","durationSeconds",[["120","2 minutes"],["180","3 minutes"],["300","5 minutes"],["600","10 minutes"]],String(i.durationSeconds))}
          ${this.segment("Chat","enableChat",[["true","On"],["false","Off"]],String(i.enableChat))}
          ${this.segment("In-world ads","enableAds",[["true","On"],["false","Off"]],String(i.enableAds))}
          ${this.segment("Graphics","graphicsQuality",[["performance","Fast"],["balanced","Balanced"],["quality","Quality"]],i.graphicsQuality)}
          ${this.segment("Camera","cameraZoom",[["0.82","Close"],["1","Normal"],["1.18","Far"]],String(i.cameraZoom))}
          ${this.segment("Death camera","deathCameraEnabled",[["true","On"],["false","Off"]],String(i.deathCameraEnabled))}
          ${this.segment("Map elements","objectDensityMultiplier",[["0.65","Light"],["1","Normal"],["1.35","Dense"],["1.7","Packed"]],String(i.objectDensityMultiplier))}
          ${this.segment("Powerups","powerUpCount",[["0","0"],["8","8"],["14","14"],["28","28"],["48","48"]],String(i.powerUpCount))}
          ${this.segment("Respawn range","respawnSafeRadius",[["8","8m"],["12","12m"],["18","18m"],["26","26m"]],String(i.respawnSafeRadius))}
        </div>
        <div class="button-grid">
          <button class="primary host">Host Multiplayer Match</button>
          <button class="back">Back</button>
        </div>
      </section>
    `,this.bindSegments(r,i);const a=r.querySelector(".room-name-input");(o=r.querySelector(".host"))==null||o.addEventListener("click",()=>{i.roomName=(a==null?void 0:a.value.trim())||`${t}'s Arena`,i.botCount=i.fillBots?Math.max(0,(i.maxPlayers??16)-1):0,e.onHost({...i})}),(c=r.querySelector(".back"))==null||c.addEventListener("click",e.onBack),this.root.appendChild(r),this.element=r}hide(){var t;(t=this.element)==null||t.remove(),this.element=null}segment(t,e,n,i){const r=n.map(([a,o])=>`<button data-field="${e}" data-value="${a}" class="${a===i?"active":""}">${o}</button>`).join("");return`<div class="field"><label>${t}</label><div class="segmented">${r}</div></div>`}bindSegments(t,e){t.querySelectorAll(".segmented button").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.field,r=n.dataset.value;if(!i||r===void 0)return;switch(i){case"maxPlayers":e.maxPlayers=Number(r);break;case"fillBots":e.fillBots=r==="true";break;case"botDifficultyMix":e.botDifficultyMix=r;break;case"mapSize":e.mapSize=r;break;case"matchMode":e.matchMode=r;break;case"durationSeconds":e.durationSeconds=Number(r);break;case"enableChat":e.enableChat=r==="true";break;case"enableAds":e.enableAds=r==="true";break;case"graphicsQuality":e.graphicsQuality=r;break;case"cameraZoom":e.cameraZoom=Number(r);break;case"deathCameraEnabled":e.deathCameraEnabled=r==="true";break;case"objectDensityMultiplier":e.objectDensityMultiplier=Number(r);break;case"powerUpCount":e.powerUpCount=Number(r);break;case"respawnSafeRadius":e.respawnSafeRadius=Number(r);break}const a=n.closest(".segmented");a==null||a.querySelectorAll("button").forEach(o=>o.classList.remove("active")),n.classList.add("active")})})}}class Y0{constructor(t){I(this,"element",null);I(this,"playerStats",null);I(this,"leaderboard",null);I(this,"zoomValue",null);I(this,"callbacks",null);this.root=t}show(t){var n,i;this.hide(),this.callbacks=t??null;const e=document.createElement("div");e.className="hud",e.innerHTML=`
      <section class="hud-panel">
        <h3>Player</h3>
        <div class="player-stats"></div>
      </section>
      <section class="leaderboard">
        <h3>Leaderboard</h3>
        <div class="leaderboard-list"></div>
      </section>
      <section class="zoom-controls" aria-label="Camera zoom">
        <button class="zoom-out" type="button" aria-label="Zoom out">-</button>
        <span class="zoom-value">100%</span>
        <button class="zoom-in" type="button" aria-label="Zoom in">+</button>
      </section>
      <div class="help">WASD / Arrows to move - Shift/Space boost - ESC menu - Enter chat - +/- zoom</div>
    `,this.root.appendChild(e),this.element=e,this.playerStats=e.querySelector(".player-stats"),this.leaderboard=e.querySelector(".leaderboard-list"),this.zoomValue=e.querySelector(".zoom-value"),(n=e.querySelector(".zoom-in"))==null||n.addEventListener("click",()=>{var r;return(r=this.callbacks)==null?void 0:r.onZoomIn()}),(i=e.querySelector(".zoom-out"))==null||i.addEventListener("click",()=>{var r;return(r=this.callbacks)==null?void 0:r.onZoomOut()})}update(t,e,n,i,r=1){this.element||this.show(this.callbacks??void 0),this.playerStats&&(t?this.playerStats.innerHTML=`
          <div class="hud-row"><span>Name</span><strong>${t.name}</strong></div>
          <div class="hud-row"><span>Score</span><strong>${t.score}</strong></div>
          <div class="hud-row"><span>Size</span><strong>${t.radius.toFixed(2)}</strong></div>
          <div class="hud-row stamina-row">
            <span>Stamina</span>
            <div class="stamina-bar" aria-label="Stamina">
              <div class="stamina-fill" style="width: ${Math.max(0,Math.min(100,t.stamina))}%"></div>
            </div>
          </div>
          <div class="hud-row"><span>Powerups</span><strong>${t.activePowerUps.size||"-"}</strong></div>
          <div class="hud-row"><span>Objects</span><strong>${t.swallowedObjects}</strong></div>
          <div class="hud-row"><span>Eliminations</span><strong>${t.eliminations}</strong></div>
          <div class="hud-row"><span>${n?"Timer":"Alive"}</span><strong>${n?n.format():i}</strong></div>
        `:this.playerStats.textContent="Waiting for player..."),this.leaderboard&&(this.leaderboard.innerHTML=e.slice(0,10).map((a,o)=>`
          <div class="leader-row ${a.isLocal?"local":""}">
            <span>${o+1}</span>
            <span>${a.alive?"":"KO "} ${a.name}</span>
            <strong>${a.score}</strong>
          </div>`).join("")),this.zoomValue&&(this.zoomValue.textContent=`${Math.round(100/r)}%`)}hide(){var t;(t=this.element)==null||t.remove(),this.element=null,this.playerStats=null,this.leaderboard=null,this.zoomValue=null}}class $0{constructor(t){I(this,"element",null);this.root=t}show(t,e=""){var a,o,c,l;this.hide();const n=document.createElement("div");n.className="screen main-screen",n.innerHTML=`
      <section class="menu-panel narrow main-menu-panel">
        <h1 class="title neon-title">VOID ARENA</h1>
        <p class="subtitle">Swallow the city, grow the void, and outlast every rival hole in the arena.</p>
        <label class="field">
          Player name
          <input class="player-name" maxlength="18" autocomplete="off" placeholder="Player_1234" />
        </label>
        <div class="button-grid">
          <button class="primary start-solo">Start Solo Match</button>
          <button class="find-games">Find Games</button>
          <button class="host-match">Host Match</button>
          <button class="settings">Settings</button>
        </div>
        <div class="version">Version ${Cg}</div>
      </section>
    `;const i=n.querySelector(".player-name");i&&(i.value=e);const r=()=>{const u=((i==null?void 0:i.value.trim())??"")||X0();return i&&(i.value=u),u};(a=n.querySelector(".start-solo"))==null||a.addEventListener("click",()=>t.onStartSolo(r())),(o=n.querySelector(".find-games"))==null||o.addEventListener("click",()=>t.onFindGames(r())),(c=n.querySelector(".host-match"))==null||c.addEventListener("click",()=>t.onHostMatch(r())),(l=n.querySelector(".settings"))==null||l.addEventListener("click",()=>t.onSettings()),this.root.appendChild(n),this.element=n,i==null||i.focus()}hide(){var t;(t=this.element)==null||t.remove(),this.element=null}}class K0{constructor(t){I(this,"element",null);this.root=t}show(t,e,n){var a,o;this.hide();const i={...Ks(t),...n,playerName:t},r=document.createElement("div");r.className="screen",r.innerHTML=`
      <section class="menu-panel">
        <h2>Solo Match Setup</h2>
        <p class="subtitle">Tune the arena before dropping in.</p>
        <div class="form-grid">
          ${this.segment("Map size","mapSize",[["small","Small"],["medium","Medium"],["large","Large"],["huge","Huge"]],i.mapSize)}
          ${this.segment("Match mode","matchMode",[[ue.Timed,eo(ue.Timed)],[ue.LastHoleStanding,"Last Hole Standing"]],i.matchMode)}
          ${this.segment("Match duration","durationSeconds",[["120","2 minutes"],["180","3 minutes"],["300","5 minutes"],["600","10 minutes"]],String(i.durationSeconds))}
          ${this.segment("Bots","botCount",[["0","0"],["5","5"],["10","10"],["25","25"],["50","50"],["100","100"]],String(i.botCount))}
          ${this.segment("Bot skill","botDifficultyMix",[["relaxed","Relaxed"],["balanced","Balanced"],["competitive","Competitive"],["chaos","Chaos"]],i.botDifficultyMix)}
          ${this.segment("In-world ads","enableAds",[["true","On"],["false","Off"]],String(i.enableAds))}
          ${this.segment("Chat","enableChat",[["true","On"],["false","Off"]],String(i.enableChat))}
          ${this.segment("Graphics","graphicsQuality",[["performance","Fast"],["balanced","Balanced"],["quality","Quality"]],i.graphicsQuality)}
          ${this.segment("Camera","cameraZoom",[["0.82","Close"],["1","Normal"],["1.18","Far"]],String(i.cameraZoom))}
          ${this.segment("Death camera","deathCameraEnabled",[["true","On"],["false","Off"]],String(i.deathCameraEnabled))}
          ${this.segment("Map elements","objectDensityMultiplier",[["0.65","Light"],["1","Normal"],["1.35","Dense"],["1.7","Packed"]],String(i.objectDensityMultiplier))}
          ${this.segment("Powerups","powerUpCount",[["0","0"],["8","8"],["14","14"],["28","28"],["48","48"]],String(i.powerUpCount))}
          ${this.segment("Respawn range","respawnSafeRadius",[["8","8m"],["12","12m"],["18","18m"],["26","26m"]],String(i.respawnSafeRadius))}
        </div>
        <div class="button-grid">
          <button class="primary start-match">Start Match</button>
          <button class="back">Back</button>
        </div>
      </section>
    `,this.bindSegments(r,i),(a=r.querySelector(".start-match"))==null||a.addEventListener("click",()=>e.onStart({...i})),(o=r.querySelector(".back"))==null||o.addEventListener("click",e.onBack),this.root.appendChild(r),this.element=r}hide(){var t;(t=this.element)==null||t.remove(),this.element=null}segment(t,e,n,i){const r=n.map(([a,o])=>`<button data-field="${e}" data-value="${a}" class="${a===i?"active":""}">${o}</button>`).join("");return`<div class="field"><label>${t}</label><div class="segmented">${r}</div></div>`}bindSegments(t,e){t.querySelectorAll(".segmented button").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.field,r=n.dataset.value;if(!i||r===void 0)return;switch(i){case"mapSize":e.mapSize=r;break;case"matchMode":e.matchMode=r;break;case"durationSeconds":e.durationSeconds=Number(r);break;case"botCount":e.botCount=Number(r);break;case"botDifficultyMix":e.botDifficultyMix=r;break;case"enableAds":e.enableAds=r==="true";break;case"enableChat":e.enableChat=r==="true";break;case"graphicsQuality":e.graphicsQuality=r;break;case"cameraZoom":e.cameraZoom=Number(r);break;case"deathCameraEnabled":e.deathCameraEnabled=r==="true";break;case"objectDensityMultiplier":e.objectDensityMultiplier=Number(r);break;case"powerUpCount":e.powerUpCount=Number(r);break;case"respawnSafeRadius":e.respawnSafeRadius=Number(r);break}const a=n.closest(".segmented");a==null||a.querySelectorAll("button").forEach(o=>o.classList.remove("active")),n.classList.add("active")})})}}class Z0{constructor(t,e){I(this,"element",null);this.root=t,this.audioManager=e}show(t,e){var f,g;this.hide();const n=document.createElement("div");n.className="pause-screen",n.innerHTML=`
      <section class="menu-panel narrow">
        <h2>${e.inMatch?"Paused":"Settings"}</h2>
        <div class="form-grid">
          <label class="field">Sound Effects
            <div class="range-row"><input class="sfx" type="range" min="0" max="100" value="${Math.round(this.audioManager.getSfxVolume()*100)}" /><span class="sfx-value"></span></div>
          </label>
          <label class="field">Music
            <div class="range-row"><input class="music" type="range" min="0" max="100" value="${Math.round(this.audioManager.getMusicVolume()*100)}" /><span class="music-value"></span></div>
          </label>
          <div class="field">
            <label>Chat</label>
            <button class="toggle chat-toggle ${e.chatEnabled?"active":""}">${e.chatEnabled?"Enabled":"Disabled"}</button>
          </div>
          <div class="field">
            <label>Death camera</label>
            <button class="toggle death-camera-toggle ${e.deathCameraEnabled!==!1?"active":""}">${e.deathCameraEnabled!==!1?"Enabled":"Disabled"}</button>
          </div>
        </div>
        <div class="button-grid">
          <button class="primary resume">${e.inMatch?"Resume":"Back"}</button>
          ${e.inMatch?'<button class="danger back-menu">Back to Main Menu</button>':""}
        </div>
      </section>
    `;const i=n.querySelector(".sfx"),r=n.querySelector(".music"),a=n.querySelector(".sfx-value"),o=n.querySelector(".music-value"),c=()=>{a&&i&&(a.textContent=`${i.value}%`),o&&r&&(o.textContent=`${r.value}%`)};c(),i==null||i.addEventListener("input",()=>{this.audioManager.setSfxVolume(Number(i.value)/100),c()}),r==null||r.addEventListener("input",()=>{this.audioManager.setMusicVolume(Number(r.value)/100),c()});let l=e.chatEnabled;const h=n.querySelector(".chat-toggle");h==null||h.addEventListener("click",()=>{l=!l,h.classList.toggle("active",l),h.textContent=l?"Enabled":"Disabled",t.onChatToggle(l)});let u=e.deathCameraEnabled!==!1;const d=n.querySelector(".death-camera-toggle");d==null||d.addEventListener("click",()=>{var _;u=!u,d.classList.toggle("active",u),d.textContent=u?"Enabled":"Disabled",(_=t.onDeathCameraToggle)==null||_.call(t,u)}),(f=n.querySelector(".resume"))==null||f.addEventListener("click",t.onResume),(g=n.querySelector(".back-menu"))==null||g.addEventListener("click",t.onBackToMenu),this.root.appendChild(n),this.element=n}hide(){var t;(t=this.element)==null||t.remove(),this.element=null}}function Ca(s){return Ka+Math.sqrt(Math.max(0,s))*Dg}function J0(s){const t=Math.max(0,s-Ka)*.72;return Math.max(Lg,Pg+Math.min(7.5,t))}function no(s,t){return t<=s*ol}function Sl(s,t){return s>=t*Ig&&t<=s*ol}const wl={easy:{difficulty:"easy",label:"Easy",shortLabel:"E",reactionMin:.46,reactionJitter:.42,mistakeChance:.22,wanderChance:.62,directionJitter:.58,objectAwareness:.72,preyAwareness:.62,dangerAwareness:.72,preyAggression:.64,objectGreed:.76,distanceDiscipline:.78,boostWhenFleeing:.54,boostWhenChasing:.2},normal:{difficulty:"normal",label:"Normal",shortLabel:"N",reactionMin:.28,reactionJitter:.28,mistakeChance:.1,wanderChance:.46,directionJitter:.3,objectAwareness:1,preyAwareness:1,dangerAwareness:1,preyAggression:1,objectGreed:1,distanceDiscipline:1,boostWhenFleeing:.86,boostWhenChasing:.62},hard:{difficulty:"hard",label:"Hard",shortLabel:"H",reactionMin:.16,reactionJitter:.16,mistakeChance:.035,wanderChance:.28,directionJitter:.16,objectAwareness:1.22,preyAwareness:1.26,dangerAwareness:1.22,preyAggression:1.28,objectGreed:1.12,distanceDiscipline:1.18,boostWhenFleeing:.96,boostWhenChasing:.82},expert:{difficulty:"expert",label:"Expert",shortLabel:"X",reactionMin:.08,reactionJitter:.08,mistakeChance:.01,wanderChance:.18,directionJitter:.07,objectAwareness:1.45,preyAwareness:1.52,dangerAwareness:1.42,preyAggression:1.55,objectGreed:1.25,distanceDiscipline:1.36,boostWhenFleeing:1,boostWhenChasing:.94}},vc={relaxed:["easy","easy","easy","normal","normal","hard"],balanced:["easy","normal","normal","hard","normal","hard","expert"],competitive:["normal","hard","hard","expert","hard","expert"],chaos:["easy","expert","normal","hard","expert","easy","hard","normal"]};function j0(s,t){const e=vc[t]??vc.balanced;return e[s%e.length]}class Q0{constructor(t,e="normal"){I(this,"decisionCooldown",0);I(this,"wantsBoost",!1);I(this,"direction",new C);I(this,"profile");this.bot=t,this.profile=wl[e],this.pickWanderDirection()}update(t,e,n){if(!this.bot.alive)return;this.decisionCooldown-=t,this.decisionCooldown<=0&&(this.wantsBoost=this.decide(e,n),this.decisionCooldown=this.profile.reactionMin+Math.random()*this.profile.reactionJitter),this.bot.updateResources(t,this.wantsBoost);const i=this.bot.getSpeed(this.bot.isBoosting)*t;this.bot.position.x+=this.direction.x*i,this.bot.position.z+=this.direction.z*i,e.clampToArena(this.bot.position,this.bot.radius)}decide(t,e){if(Math.random()<this.profile.mistakeChance)return this.pickWanderDirection(),!1;const n=this.findDanger(e);if(n)return this.direction.subVectors(this.bot.position,n.position),this.normalizeDirection(),Math.random()<this.profile.boostWhenFleeing;const i=this.findPrey(e);if(i)return this.direction.subVectors(i.position,this.bot.position),this.normalizeDirection(),Math.random()<this.profile.boostWhenChasing;const r=this.findEdibleObject(t);return r?(this.direction.subVectors(r.position,this.bot.position),this.normalizeDirection(),!1):(Math.random()<this.profile.wanderChance&&this.pickWanderDirection(),!1)}findDanger(t){let e=null,n=Number.POSITIVE_INFINITY;for(const i of t.alivePlayers()){if(i.id===this.bot.id||i.radius<this.bot.radius*1.32)continue;const r=this.bot.position.distanceToSquared(i.position),a=Math.max(12,i.radius*5.2*this.profile.dangerAwareness);r<a*a&&r<n&&(e=i,n=r)}return e}findPrey(t){let e=null,n=Number.NEGATIVE_INFINITY;for(const i of t.alivePlayers()){if(i.id===this.bot.id||!Sl(this.bot.radius,i.radius))continue;const r=this.bot.position.distanceToSquared(i.position),a=Math.max(16,this.bot.radius*8.5*this.profile.preyAwareness),o=i.score*.03+i.radius*12*this.profile.preyAggression-Math.sqrt(r);r<a*a&&o>n&&(e=i,n=o)}return e}findEdibleObject(t){const e=Math.max(18,this.bot.radius*8*this.profile.objectAwareness);let n=null,i=Number.NEGATIVE_INFINITY;for(const r of t.queryObjects(this.bot.position,e)){if(!r.active||!no(this.bot.radius,r.effectiveBoundingRadius))continue;const a=Math.max(.1,this.bot.position.distanceTo(r.position)),o=r.mass*(2.2+this.profile.objectGreed)+r.score*.4*this.profile.objectGreed-a*this.profile.distanceDiscipline;o>i&&(n=r,i=o)}return n}pickWanderDirection(){const t=Math.random()*Math.PI*2;this.direction.set(Math.cos(t),0,Math.sin(t))}normalizeDirection(){if(this.direction.y=0,this.direction.lengthSq()<.001){this.pickWanderDirection();return}this.direction.normalize();const t=(Math.random()-.5)*this.profile.directionJitter;this.direction.applyAxisAngle(new C(0,1,0),t)}}class t_{constructor(){I(this,"controllers",[])}addBotController(t){this.controllers.push(t)}update(t,e,n){for(const i of this.controllers)i.update(t,e,n)}clear(){this.controllers.length=0}}class e_{constructor(t){I(this,"remainingSeconds");I(this,"active",!0);this.durationSeconds=t,this.remainingSeconds=t}update(t){this.active&&(this.remainingSeconds=Math.max(0,this.remainingSeconds-t))}get complete(){return this.remainingSeconds<=0}format(){const t=Math.ceil(this.remainingSeconds),e=Math.floor(t/60),n=t%60;return`${e}:${n.toString().padStart(2,"0")}`}}class kr{constructor(t){I(this,"id");I(this,"name");I(this,"isBot");I(this,"rimColor");I(this,"radius",Ka);I(this,"mass",0);I(this,"score",0);I(this,"swallowedObjects",0);I(this,"eliminations",0);I(this,"botDifficulty");I(this,"position");I(this,"velocity",new C);I(this,"alive",!0);I(this,"renderVisible",!0);I(this,"respawnAt",0);I(this,"visualY",0);I(this,"visualScale",1);I(this,"stamina",As);I(this,"isBoosting",!1);I(this,"staminaRegenDelay",0);I(this,"activePowerUps",new Map);I(this,"swallowAnimation",null);this.id=t.id,this.name=t.name,this.isBot=t.isBot,this.rimColor=t.rimColor,this.position=t.position.clone(),this.botDifficulty=t.botDifficulty}get speed(){return this.getSpeed(!1)}getSpeed(t=!1){let e=J0(this.radius);return this.activePowerUps.has("haste")&&(e*=1.32),t&&this.stamina>0&&(e*=Ng),e}addMass(t){this.mass+=Math.max(0,t),this.radius=Ca(this.mass)}addScore(t){this.score+=Math.max(0,Math.round(t))}addPowerUp(t,e,n){if(t==="stamina"){this.stamina=As;return}if(t==="mass"){this.addMass(18),this.addScore(35);return}this.activePowerUps.set(t,n+e)}updateResources(t,e){if(this.isBoosting=!1,e&&this.stamina>1&&this.alive){this.isBoosting=!0,this.stamina=Math.max(0,this.stamina-Og*t),this.staminaRegenDelay=Fg;return}this.staminaRegenDelay=Math.max(0,this.staminaRegenDelay-t),this.staminaRegenDelay<=0&&(this.stamina=Math.min(As,this.stamina+zg*t))}updatePowerUps(t){for(const[e,n]of this.activePowerUps)t>=n&&this.activePowerUps.delete(e)}hasPowerUp(t){return this.activePowerUps.has(t)}markSwallowed(t,e){this.alive=!1,this.renderVisible=!0,this.respawnAt=e+Ug,this.velocity.set(0,0,0),this.swallowAnimation={attackerId:t,elapsed:0,duration:.86,startPosition:this.position.clone()}}updateSwallowAnimation(t,e){if(!this.swallowAnimation)return!1;const n=this.swallowAnimation;n.elapsed+=t;const i=Math.min(1,n.elapsed/n.duration),r=1-Math.pow(1-i,3),a=(e==null?void 0:e.position)??n.startPosition;if(e){const l=new C(a.x-this.position.x,0,a.z-this.position.z),h=Math.max(.001,l.length()),u=Me.clamp(1-h/Math.max(e.radius*2.2,3),0,1);l.normalize();const d=30+e.radius*9+u*32;this.velocity.x+=l.x*d*t,this.velocity.z+=l.z*d*t,this.velocity.multiplyScalar(Math.max(0,1-t*4.5)),this.position.x+=this.velocity.x*t,this.position.z+=this.velocity.z*t}const o=Math.pow(i,4);this.position.x=Me.lerp(this.position.x,a.x,o),this.position.z=Me.lerp(this.position.z,a.z,o);const c=1.6+this.radius*.42+((e==null?void 0:e.radius)??this.radius)*.46;return this.visualY=-c*(i*i)-Math.sin(i*Math.PI)*.22,this.visualScale=Math.max(.1,1-r*.88),i>=1?(this.swallowAnimation=null,this.renderVisible=!1,this.visualY=0,this.visualScale=1,!0):!1}respawn(t){this.position.copy(t),this.velocity.set(0,0,0),this.alive=!0,this.renderVisible=!0,this.visualY=0,this.visualScale=1,this.swallowAnimation=null,this.radius=Ca(this.mass),this.stamina=As,this.activePowerUps.clear()}}class n_{constructor(){I(this,"players",new Map);I(this,"localPlayerId","")}createLocalPlayer(t,e,n="local-player"){const i=new kr({id:n,name:t,isBot:!1,rimColor:Oi[0],position:e});return this.localPlayerId=i.id,this.players.set(i.id,i),i}createRemotePlayer(t,e,n,i){const r=new kr({id:t,name:e,isBot:!1,rimColor:Oi[i%Oi.length],position:n});return this.players.set(r.id,r),r}createBot(t,e,n,i,r){const a=new kr({id:t,name:e,isBot:!0,rimColor:Oi[i%Oi.length],position:n,botDifficulty:r});return this.players.set(a.id,a),a}get(t){return this.players.get(t)}getLocalPlayer(){return this.players.get(this.localPlayerId)}all(){return[...this.players.values()]}alivePlayers(){return this.all().filter(t=>t.alive)}clear(){this.players.clear(),this.localPlayerId=""}remove(t){this.players.delete(t)}getLeaderboard(t){return this.all().map(n=>({id:n.id,name:n.name,score:n.score,radius:n.radius,eliminations:n.eliminations,alive:n.alive,isLocal:n.id===this.localPlayerId,isBot:n.isBot})).sort((n,i)=>t===ue.LastHoleStanding&&n.alive!==i.alive?n.alive?-1:1:i.score!==n.score?i.score-n.score:i.eliminations!==n.eliminations?i.eliminations-n.eliminations:i.radius-n.radius)}}const xc=["YOUR BRAND HERE","SPONSOR","VOID ARENA AD","VIDEO AD SCREEN","BRANDED VEHICLE"];class i_{constructor(){I(this,"nextId",1)}createBillboardAd(t,e,n=this.randomText()){return{id:this.createId("billboard"),type:"billboard",text:n,position:t,rotationY:e,width:7,height:3.2,dynamic:!1}}createBuildingBannerAd(t,e,n,i,r=this.randomText()){return{id:this.createId("banner"),type:"building-banner",text:r,position:t,rotationY:e,width:n,height:i,dynamic:!1}}createVehicleBranding(t,e,n,i="BRANDED VEHICLE"){return{id:this.createId("vehicle-brand"),type:"vehicle-branding",text:i,position:e,rotationY:n,width:2.4,height:.72,dynamic:!1,attachedObjectId:t}}createDigitalVideoScreen(t,e){return{id:this.createId("video-screen"),type:"digital-video-screen",text:"VIDEO AD SCREEN",position:t,rotationY:e,width:6.4,height:3.4,dynamic:!0}}createRooftopSign(t,e,n="SPONSOR"){return{id:this.createId("rooftop"),type:"rooftop-sign",text:n,position:t,rotationY:e,width:5.4,height:1.6,dynamic:!1}}createId(t){const e=`${t}-${this.nextId}`;return this.nextId+=1,e}randomText(){return xc[Math.floor(Math.random()*xc.length)]}}class s_{constructor(t){I(this,"state");this.state=this.hash(t)}next(){this.state+=1831565813;let t=this.state;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+(e-t)*this.next()}int(t,e){return Math.floor(this.range(t,e+1))}chance(t){return this.next()<t}pick(t){return t[Math.floor(this.next()*t.length)]}hash(t){let e=2166136261;for(let n=0;n<t.length;n+=1)e^=t.charCodeAt(n),e=Math.imul(e,16777619);return e>>>0}}class r_{generate(t){const e=t.seed??`void-${Date.now()}-${Math.floor(Math.random()*1e5)}`,n=new s_(e),i=pi[t.size],r=this.createRoadNetwork(t.size,n),a=Math.round(i.objectCount*(t.objectDensityMultiplier??1)),o=this.createSpawnPoints(i.halfExtent,n),c=[],l=[],h=[],u=new i_,d=[];return this.addPlazas(c,d,r.surfaces,r.roads,o,n,t.size),this.addBuildings(c,d,r.roads,o,n,a),this.addRoadsideObjects(c,d,r.roads,o,n,a),this.addTraffic(c,d,r.trafficRoutes,n,a),this.addPedestrians(c,d,r.pedestrianPaths,n,a),this.addLooseCityObjects(c,d,r.roads,o,n,t.size,a),this.addPowerUps(l,d,r.roads,o,n,t.size,t.powerUpCount),t.enableAds&&this.addAdPlacements(c,h,d,r.roads,o,u,n,t.size),{seed:e,size:t.size,halfExtent:i.halfExtent,roads:r.roads,surfaces:r.surfaces,trafficRoutes:r.trafficRoutes,pedestrianPaths:r.pedestrianPaths,objects:c,powerUps:l,spawnPoints:o,adSurfaces:h}}createRoadNetwork(t,e){const n=pi[t],i=[],r=[],a=[],o=[],c=n.halfExtent,l=Math.max(3,Math.floor(c/n.blockSize)+1),h=(g,_,m,p,v,M=n.roadWidth+e.range(-.8,1.2))=>{const E=2.4+e.range(0,.8),D={id:g,x:_,z:m,width:M,length:p,rotationY:v,lanes:M>7.6?2:1,sidewalkWidth:E};i.some(b=>this.roadsOverlapParallel(D,b))||(i.push(D),a.push(...this.createTrafficRoutesForRoad(D)),o.push(...this.createPedestrianPathsForRoad(D)))},u=this.cityAxisPositions(l,c,n.blockSize,e),d=this.cityAxisPositions(l,c,n.blockSize,e);u.forEach((g,_)=>h(`avenue-v-${_}`,g,0,c*1.9,0)),d.forEach((g,_)=>h(`avenue-h-${_}`,0,g,c*1.9,Math.PI/2));const f=Math.floor(l*.55);for(let g=0;g<f;g+=1){const _=e.chance(.5),m=e.pick(_?u:d),p=e.pick([-1,1])*e.range(n.blockSize*.28,n.blockSize*.52),v=e.range(-c*.45,c*.45),M=e.range(c*.45,c*.95);_?h(`side-v-${g}`,m+p,v,M,0,n.roadWidth*.72):h(`side-h-${g}`,v,m+p,M,Math.PI/2,n.roadWidth*.72)}for(const g of i)this.addRoadSurfaces(g,i,r);return this.addCrosswalks(i,r,n.roadWidth),{roads:i,surfaces:r,trafficRoutes:a,pedestrianPaths:o}}cityAxisPositions(t,e,n,i){const r=new Set([0]),a=-e*.72,o=e*1.44,c=n*.48;for(let l=0;l<t;l+=1){const h=a+o*l/Math.max(1,t-1),u=Math.round((h+i.range(-n*.26,n*.26))*10)/10;[...r].some(d=>Math.abs(d-u)<c)||r.add(u)}return[...r].sort((l,h)=>l-h)}addRoadSurfaces(t,e,n){const i=t.width*.5+t.sidewalkWidth*.5,r=this.sideVector(t.rotationY),a=this.forwardVector(t.rotationY);for(const h of[-1,1]){const u=this.sidewalkCutsForRoadSide(t,e,h,i);this.subtractRanges(-t.length*.5,t.length*.5,u,3.2).forEach((f,g)=>{const _=(f.start+f.end)*.5;n.push({id:`${t.id}-sidewalk-${h}-${g}`,x:t.x+a.x*_+r.x*i*h,z:t.z+a.z*_+r.z*i*h,width:t.sidewalkWidth,length:f.end-f.start,rotationY:t.rotationY,kind:"sidewalk"})})}const o=8,c=Math.floor(t.length/o),l=this.intersectionCutsForRoad(t,e,h=>h.width*.5+2.05+t.width*.44);for(let h=0;h<c;h+=1){const u=-t.length*.5+h*o+o*.5,d=1.6;l.some(f=>u+d>f.start&&u-d<f.end)||n.push({id:`${t.id}-lane-${h}`,x:t.x+a.x*u,z:t.z+a.z*u,width:.18,length:3.2,rotationY:t.rotationY,kind:"lane-marking"})}}addCrosswalks(t,e,n){let i=0;const r=[];for(const a of t)for(const o of t){if(a.id>=o.id||Math.abs(Math.sin(a.rotationY-o.rotationY))<.8||!a.id.startsWith("avenue")&&!o.id.startsWith("avenue"))continue;const c=Math.abs(Math.sin(a.rotationY))<.5?a:o,l=c===a?o:a,h=Math.abs(l.z-c.z)<=c.length*.5,u=Math.abs(c.x-l.x)<=l.length*.5;if(!h||!u)continue;const d=this.forwardVector(c.rotationY),f=this.forwardVector(l.rotationY),g=l.width*.5+2.05,_=c.width*.5+2.05,m=v=>Math.max(4.2,Math.min(5.8,v.width*.72)),p=[];for(const v of[-1,1])p.push({id:`crosswalk-${i}`,x:c.x+d.x*g*v,z:l.z+d.z*g*v,width:m(c),length:c.width+1.1,rotationY:c.rotationY+Math.PI/2,kind:"crosswalk"},{id:`crosswalk-${i+1}`,x:c.x+f.x*_*v,z:l.z+f.z*_*v,width:m(l),length:l.width+1.1,rotationY:l.rotationY+Math.PI/2,kind:"crosswalk"});for(const v of p)r.some(M=>Math.hypot(M.x-v.x,M.z-v.z)<n*.32)||(v.id=`crosswalk-${i}`,e.push(v),r.push({x:v.x,z:v.z}),i+=1)}}roadsOverlapParallel(t,e){if(Math.abs(Math.sin(t.rotationY-e.rotationY))>.2)return!1;const n=this.forwardVector(t.rotationY),i=this.sideVector(t.rotationY),r=t.x-e.x,a=t.z-e.z,o=Math.abs(r*n.x+a*n.z),c=Math.abs(r*i.x+a*i.z),l=o<t.length*.5+e.length*.5+1.2,h=t.width*.5+t.sidewalkWidth+e.width*.5+e.sidewalkWidth+.9;return l&&c<h}sidewalkCutsForRoadSide(t,e,n,i){const r=[],a=this.forwardVector(t.rotationY),o=this.sideVector(t.rotationY),c=i*n;for(const l of e){if(l===t||Math.abs(Math.sin(t.rotationY-l.rotationY))<.8)continue;const h=l.x-t.x,u=l.z-t.z,d=h*a.x+u*a.z,f=h*o.x+u*o.z,g=Math.abs(f-c)<=l.length*.5+t.sidewalkWidth*.5+.08,_=Math.abs(d)<=t.length*.5+l.width*.5;if(!g||!_)continue;const m=l.width*.5+.32;r.push({start:Math.max(-t.length*.5,d-m),end:Math.min(t.length*.5,d+m)})}return r.sort((l,h)=>l.start-h.start),r}intersectionCutsForRoad(t,e,n){const i=[];for(const r of e){if(r===t||Math.abs(Math.sin(t.rotationY-r.rotationY))<.8)continue;const a=this.intersectionAlong(t,r);if(a===null)continue;const o=n(r);i.push({start:Math.max(-t.length*.5,a-o),end:Math.min(t.length*.5,a+o)})}return i.sort((r,a)=>r.start-a.start),i}intersectionAlong(t,e){const n=this.forwardVector(t.rotationY),i=this.sideVector(t.rotationY),r=this.forwardVector(e.rotationY),a=e.x-t.x,o=e.z-t.z,c=a*n.x+o*n.z,l=Math.abs(a*i.x+o*i.z),h=(t.x-e.x)*r.x+(t.z-e.z)*r.z;return l>t.width*.5+e.length*.5||Math.abs(c)>t.length*.5+e.width*.5||Math.abs(h)>e.length*.5+t.width*.5?null:Math.max(-t.length*.5,Math.min(t.length*.5,c))}subtractRanges(t,e,n,i){const r=[];let a=t;for(const o of n){const c=Math.max(t,Math.min(e,o.start)),l=Math.max(t,Math.min(e,o.end));c-a>=i&&r.push({start:a,end:c}),a=Math.max(a,l)}return e-a>=i&&r.push({start:a,end:e}),r}createTrafficRoutesForRoad(t){const e=this.forwardVector(t.rotationY),n=this.sideVector(t.rotationY),i=t.lanes===2?t.width*.21:0,r=-t.length*.48,a=t.length*.48,o=[];for(const c of t.lanes===2?[-1,1]:[0])o.push({id:`${t.id}-traffic-${c}`,loop:!0,points:[{x:t.x+e.x*r+n.x*i*c,z:t.z+e.z*r+n.z*i*c},{x:t.x+e.x*a+n.x*i*c,z:t.z+e.z*a+n.z*i*c}]});return o}createPedestrianPathsForRoad(t){const e=this.forwardVector(t.rotationY),n=this.sideVector(t.rotationY),i=-t.length*.48,r=t.length*.48,a=t.width*.5+t.sidewalkWidth*.55;return[-1,1].map(o=>({id:`${t.id}-walk-${o}`,loop:!0,points:[{x:t.x+e.x*i+n.x*a*o,z:t.z+e.z*i+n.z*a*o},{x:t.x+e.x*r+n.x*a*o,z:t.z+e.z*r+n.z*a*o}]}))}createSpawnPoints(t,e){const n=[{x:-t*.32,y:0,z:-t*.32},{x:t*.32,y:0,z:t*.32},{x:-t*.32,y:0,z:t*.32},{x:t*.32,y:0,z:-t*.32},{x:0,y:0,z:0}];for(let i=0;i<180;i+=1)n.push({x:e.range(-t*.78,t*.78),y:0,z:e.range(-t*.78,t*.78)});return n}addPlazas(t,e,n,i,r,a,o){const c=pi[o],l={small:1,medium:2,large:4,huge:7};for(let h=0;h<l[o];h+=1){let u=null,d=0,f=0,g=0;for(let M=0;M<80;M+=1){d=a.range(8,o==="small"?12:18),f=a.range(8,o==="small"?13:20);const E=a.range(-c.halfExtent*.72,c.halfExtent*.72),D=a.range(-c.halfExtent*.72,c.halfExtent*.72),b=a.pick([0,Math.PI/2]);if(g=Math.hypot(d,f)*.54,!(this.overlapsOccupied(E,D,g+1.2,e)||this.pointConflictsRoads(E,D,g,i)||this.isTooCloseToAnySpawn(E,D,r.slice(0,5),c.spawnClearRadius+g*.35))){u={x:E,z:D,rotationY:b};break}}if(!u)continue;n.push({id:`plaza-${h}`,x:u.x,z:u.z,width:d,length:f,rotationY:u.rotationY,kind:"plaza"});const _=[],m=this.sideVector(u.rotationY),p=this.forwardVector(u.rotationY),v=(M,E,D,b=u.rotationY)=>{const T=u.x+m.x*E+p.x*D,L=u.z+m.z*E+p.z*D,w=this.createObjectDefinition(M,t.length,{x:T,z:L,rotationY:b},a);this.overlapsOccupied(T,L,w.boundingRadius,e)||this.overlapsOccupied(T,L,w.boundingRadius,_)||this.pointConflictsRoads(T,L,w.boundingRadius,i)||(t.push(w),_.push({x:T,z:L,radius:w.boundingRadius}),e.push({x:T,z:L,radius:w.boundingRadius}))};v("fountain",0,0),a.chance(.55)&&v("statue",0,f*.28);for(const M of[-1,1])v("bench",M*d*.28,-f*.34,u.rotationY+Math.PI/2),v("planter",M*d*.36,f*.32);a.chance(.6)&&v("kiosk",-d*.34,f*.08),e.push({x:u.x,z:u.z,radius:g})}}addBuildings(t,e,n,i,r,a){const o=Math.floor(a*.24);for(let c=0;c<o;c+=1){const l=r.pick(n),h=this.roadsideCandidate(l,r,r.range(4.2,9.2),i);if(!h||this.overlapsOccupied(h.x,h.z,4.2,e))continue;const u=this.createObjectDefinition("building",t.length,h,r);this.overlapsOccupied(h.x,h.z,u.boundingRadius,e)||this.pointConflictsRoads(u.position.x,u.position.z,u.boundingRadius,n)||(t.push(u),e.push({x:h.x,z:h.z,radius:u.boundingRadius}))}}addRoadsideObjects(t,e,n,i,r,a){const o=Math.floor(a*.3),c=["post","tree","bench","hydrant","trash","cone","mailbox","bike","planter"];for(let l=0;l<o;l+=1){const h=r.pick(n),u=r.pick(c),d=this.roadsideCandidate(h,r,r.range(.4,1.3),i,!0);if(!d||this.overlapsOccupied(d.x,d.z,.8,e))continue;const f=this.createObjectDefinition(u,t.length,d,r);this.overlapsOccupied(d.x,d.z,f.boundingRadius,e)||(t.push(f),e.push({x:d.x,z:d.z,radius:f.boundingRadius}))}}addTraffic(t,e,n,i,r){const a=Math.floor(r*.09);for(let o=0;o<a;o+=1){const c=i.pick(n),l=i.range(0,Math.max(1,c.points.length-1)),h=this.routePoint(c,l),u=i.chance(.22)?"truck":"car",d=this.createObjectDefinition(u,t.length,{x:h.position.x,z:h.position.z,rotationY:h.rotationY},i);d.routeId=c.id,d.routeT=l,d.routeSpeed=i.range(3.5,7.5)*(u==="truck"?.72:1),t.push(d),e.push({x:d.position.x,z:d.position.z,radius:d.boundingRadius})}}addPedestrians(t,e,n,i,r){const a=Math.floor(r*.08);for(let o=0;o<a;o+=1){const c=i.pick(n),l=i.range(0,Math.max(1,c.points.length-1)),h=this.routePoint(c,l),u=this.createObjectDefinition("pedestrian",t.length,{x:h.position.x,z:h.position.z,rotationY:h.rotationY},i);u.pedestrianPathId=c.id,u.routeT=l,u.routeSpeed=i.range(.65,1.35),t.push(u),e.push({x:u.position.x,z:u.position.z,radius:u.boundingRadius})}}addLooseCityObjects(t,e,n,i,r,a,o){const c=Math.max(0,o-t.length),l=["crate","rock","structure","planter","kiosk","fountain","statue"];for(let h=0;h<c;h+=1){const u=this.looseCandidate(n,r,i,a);if(!u)continue;const d=r.pick(l),f=this.createObjectDefinition(d,t.length,u,r);this.overlapsOccupied(u.x,u.z,f.boundingRadius,e)||this.pointConflictsRoads(u.x,u.z,f.boundingRadius,n)||(t.push(f),e.push({x:f.position.x,z:f.position.z,radius:f.boundingRadius}))}}addPowerUps(t,e,n,i,r,a,o){const c={small:8,medium:14,large:28,huge:44},l=["magnet","shrink","haste","shield","stamina","mass"];for(let h=0;h<(o??c[a]);h+=1){const u=this.looseCandidate(n,r,i,a);if(!u||this.overlapsOccupied(u.x,u.z,1.6,e)||this.pointConflictsRoads(u.x,u.z,1.6,n))continue;const d=r.pick(l),f=Vg[d];t.push({id:`powerup-${h}`,type:d,label:f.label,position:{x:u.x,y:.55,z:u.z},radius:.75,color:f.color,durationSeconds:f.durationSeconds,respawnDelay:kg}),e.push({x:u.x,z:u.z,radius:1.6})}}roadsideCandidate(t,e,n,i,r=!1){const a=this.forwardVector(t.rotationY),o=this.sideVector(t.rotationY),c=e.pick([-1,1]),l=e.range(-t.length*.46,t.length*.46),h=r?t.width*.5+t.sidewalkWidth*e.range(.25,.8):t.width*.5+t.sidewalkWidth+n*.92+e.range(1.2,3.4),u=t.x+a.x*l+o.x*h*c,d=t.z+a.z*l+o.z*h*c;return this.isTooCloseToAnySpawn(u,d,i.slice(0,5),pi.small.spawnClearRadius)?null:{x:u,z:d,rotationY:t.rotationY}}looseCandidate(t,e,n,i){const r=pi[i];for(let a=0;a<48;a+=1){const o=e.range(-r.halfExtent+5,r.halfExtent-5),c=e.range(-r.halfExtent+5,r.halfExtent-5),l=this.nearestRoad(o,c,t);if(!(l.distance<l.road.width*.5+l.road.sidewalkWidth+1.2)&&!this.isTooCloseToAnySpawn(o,c,n.slice(0,5),r.spawnClearRadius))return{x:o,z:c,rotationY:e.pick([0,Math.PI/2,Math.PI,-Math.PI/2])}}return null}createObjectDefinition(t,e,n,i){const r={id:`${t}-${e}`,kind:t,position:{x:n.x,y:0,z:n.z},rotationY:n.rotationY,respawnDelay:i.range(8,18),category:this.categoryForKind(t),roadAligned:!0,isAd:!1};switch(t){case"crate":{const a=i.range(.55,1.15);return this.withSize(r,"Supply Crate",{x:a,y:a,z:a},"#b6783c",a*.66,3.8,6)}case"post":{const a=i.range(1.8,2.8);return this.withSize(r,"Sidewalk Post",{x:.3,y:a,z:.3},"#c9d2df",.28,1.2,4)}case"bench":return this.withSize(r,"Bench",{x:1.7,y:.55,z:.58},"#8b5e3c",.9,2.2,7);case"hydrant":return this.withSize(r,"Hydrant",{x:.38,y:.75,z:.38},"#d94848",.34,1.4,5);case"trash":return this.withSize(r,"Trash Bin",{x:.62,y:.88,z:.62},"#2f7e64",.48,2.3,7);case"cone":return this.withSize(r,"Traffic Cone",{x:.46,y:.72,z:.46},"#f97316",.34,1.1,5);case"mailbox":return this.withSize(r,"Mailbox",{x:.58,y:1.05,z:.42},"#4f7ca8",.42,1.9,7);case"bike":return this.withSize(r,"Bike Rack",{x:.65,y:.82,z:1.45},"#60a5fa",.72,2.8,10);case"planter":return this.withSize(r,"Planter",{x:i.range(.9,1.55),y:i.range(.75,1.15),z:i.range(.8,1.35)},"#4ade80",.78,4.2,12);case"tree":{const a=i.range(2.6,4.8),o=i.range(.85,1.55);return this.withSize(r,"Sidewalk Tree",{x:o,y:a,z:o},"#3fb36d",o*.72,5.8,10)}case"rock":{const a=i.range(.6,1.55);return this.withSize(r,"Landscape Rock",{x:a*1.25,y:a*.72,z:a},"#8b929c",a*.66,4.8,12)}case"car":{const a=["#45a7d8","#d95763","#ece077","#6fc28b","#b9c1d6"];return this.withSize(r,"City Car",{x:1.62,y:.78,z:3.05},i.pick(a),1.58,16,25)}case"truck":{const a=["#f0c850","#e56f40","#7aa9d8","#e2e8f0"];return this.withSize(r,"Delivery Truck",{x:2.12,y:1.28,z:4.35},i.pick(a),2.2,30,42)}case"pedestrian":{const a=["#f6c453","#fb7185","#60a5fa","#91e88c","#d8b4fe"];return this.withSize(r,"Pedestrian",{x:.45,y:1.55,z:.35},i.pick(a),.36,2.2,8)}case"structure":{const a=i.range(1.6,4.4),o=i.range(1.5,4.4),c=i.range(1.2,3.2);return this.withSize(r,"Street Structure",{x:a,y:c,z:o},"#7cc8b0",Math.hypot(a,o)*.43,28,65)}case"kiosk":return this.withSize(r,"News Kiosk",{x:2.05,y:2.2,z:1.65},"#5aa99f",1.28,20,45);case"fountain":return this.withSize(r,"Plaza Fountain",{x:2.35,y:1.25,z:2.35},"#9aa7a3",1.32,18,42);case"statue":return this.withSize(r,"Stone Statue",{x:1.15,y:2.35,z:1.15},"#9ca3af",.78,14,38);case"billboard":return this.withSize(r,"Billboard Ad",{x:4.7,y:3.2,z:.35},"#31394b",2.35,38,60);case"screen":return this.withSize(r,"Video Ad Screen",{x:4.4,y:2.9,z:.38},"#222a3a",2.24,40,65);case"building":default:{const a=i.range(4.2,10.5),o=i.range(4.2,10.5),c=i.range(4,15.5),l=["#77838e","#8f7f72","#67788a","#918d79","#6f8790","#9aa3a9","#75685f","#5f6f7a"],h=c>11?"Office Building":i.chance(.35)?"Corner Shop":"City Building";return this.withSize(r,h,{x:a,y:c,z:o},i.pick(l),Math.hypot(a,o)*.5,a*o*1.85,120)}}}categoryForKind(t){return t==="building"?"building":t==="car"||t==="truck"?"traffic":t==="post"||t==="hydrant"||t==="mailbox"||t==="cone"?"utility":t==="tree"||t==="rock"||t==="planter"?"nature":t==="billboard"||t==="screen"?"ad":t==="pedestrian"?"pedestrian":t==="bench"||t==="trash"||t==="bike"||t==="kiosk"||t==="fountain"||t==="statue"?"sidewalk":"decor"}withSize(t,e,n,i,r,a,o){return{...t,label:e,size:n,color:i,boundingRadius:r,mass:a,score:o,position:{...t.position,y:n.y*.5}}}addAdPlacements(t,e,n,i,r,a,o,c){const l=pi[c],h=Math.max(5,Math.floor(l.halfExtent/18)),u=t.filter(f=>f.kind==="building"),d=t.filter(f=>f.kind==="truck"||f.kind==="car");for(let f=0;f<h;f+=1){const g={x:o.range(-l.halfExtent*.7,l.halfExtent*.7),z:o.range(-l.halfExtent*.7,l.halfExtent*.7),rotationY:o.pick([0,Math.PI/2,Math.PI,-Math.PI/2])};if(this.overlapsOccupied(g.x,g.z,2.6,n)||this.pointConflictsRoads(g.x,g.z,2.6,i))continue;const _=o.chance(.45)?"screen":"billboard",m=this.createObjectDefinition(_,t.length,g,o);m.isAd=!0,t.push(m),n.push({x:g.x,z:g.z,radius:m.boundingRadius});const p={x:g.x,y:m.position.y+.28,z:g.z},v=_==="screen"?a.createDigitalVideoScreen(p,g.rotationY):a.createBillboardAd(p,g.rotationY);m.adSurfaceId=v.id,e.push(v)}for(const f of u.slice(0,Math.min(32,u.length))){if(!o.chance(.42))continue;const g=f.rotationY+o.pick([0,Math.PI]),_=Math.sin(g)*(f.size.x*.52+.05),m=Math.cos(g)*(f.size.z*.52+.05);e.push(a.createBuildingBannerAd({x:f.position.x+_,y:Math.max(2,f.position.y+f.size.y*.18),z:f.position.z+m},g,Math.min(6.4,Math.max(2.8,f.size.x*.75)),1.25))}for(const f of d.slice(0,Math.min(44,d.length)))o.chance(.34)&&(f.isAd=!0,e.push(a.createVehicleBranding(f.id,{x:f.position.x,y:f.position.y+f.size.y*.2,z:f.position.z},f.rotationY)))}nearestRoad(t,e,n){let i=n[0],r=Number.POSITIVE_INFINITY;if(!i)return{road:{id:"none",x:0,z:0,width:0,length:0,rotationY:0,lanes:1,sidewalkWidth:0},distance:Number.POSITIVE_INFINITY};for(const a of n){const o=this.forwardVector(a.rotationY),c=this.sideVector(a.rotationY),l=t-a.x,h=e-a.z,u=l*o.x+h*o.z,d=Math.abs(l*c.x+h*c.z);Math.abs(u)>a.length*.5||d<r&&(i=a,r=d)}return{road:i,distance:r}}pointConflictsRoads(t,e,n,i){for(const r of i){const a=this.forwardVector(r.rotationY),o=this.sideVector(r.rotationY),c=t-r.x,l=e-r.z,h=c*a.x+l*a.z;if(Math.abs(h)>r.length*.5+n)continue;const u=Math.abs(c*o.x+l*o.z),d=r.width*.5+r.sidewalkWidth+Math.max(.9,n*.86);if(u<d)return!0}return!1}routePoint(t,e){const n=Math.min(t.points.length-2,Math.max(0,Math.floor(e))),i=Math.max(0,Math.min(1,e-n)),r=t.points[n],a=t.points[n+1]??t.points[0];return{position:{x:r.x+(a.x-r.x)*i,z:r.z+(a.z-r.z)*i},rotationY:Math.atan2(a.x-r.x,a.z-r.z)}}overlapsOccupied(t,e,n,i){for(const r of i){const a=t-r.x,o=e-r.z,c=n+r.radius+.55;if(a*a+o*o<c*c)return!0}return!1}isTooCloseToAnySpawn(t,e,n,i){for(const r of n){const a=t-r.x,o=e-r.z;if(a*a+o*o<i*i)return!0}return!1}forwardVector(t){return{x:Math.sin(t),z:Math.cos(t)}}sideVector(t){return{x:Math.cos(t),z:-Math.sin(t)}}}class a_{constructor(t,e,n){I(this,"spawnCursor",0);this.world=t,this.playerManager=e,this.config=n}update(t){if(this.config.matchMode!==ue.Timed)return[];const e=[];for(const n of this.playerManager.all())n.alive||n.renderVisible||t<n.respawnAt||(n.mass=Math.max(0,n.mass*.35),n.radius=Ca(n.mass),n.respawn(this.findSafeSpawn(n)),e.push({type:"playerRespawned",player:n}));return e}findSafeSpawn(t){const e=this.world.mapData.spawnPoints;let n=this.world.getSpawnPoint(this.spawnCursor),i=Number.NEGATIVE_INFINITY;for(let r=0;r<Math.min(e.length,48);r+=1){this.spawnCursor=(this.spawnCursor+1)%e.length;const a=this.world.getSpawnPoint(this.spawnCursor);let o=Number.POSITIVE_INFINITY,c=Number.POSITIVE_INFINITY;for(const h of this.playerManager.alivePlayers()){if(h.id===t.id)continue;const u=a.distanceTo(h.position);c=Math.min(c,u),h.radius>t.radius*1.2&&(o=Math.min(o,u))}if(c<this.config.respawnSafeRadius)continue;const l=o*1.8+c*.6+Math.random()*4;l>i&&(n=a,i=l)}return this.world.clampToArena(n,t.radius),n}}class o_{constructor(t,e,n){this.world=t,this.playerManager=e,this.config=n}update(t,e){const n=[];this.world.rebuildObjectGrid(),this.tryStartObjectSwallows(),this.tryStartHoleSwallows(e,n);const i=this.world.updateSwallowing(t,this.playerManager);for(const r of i){const a=this.playerManager.get(r.targetPlayerId);if(!a||!a.renderVisible){r.object.scheduleRespawn(e);continue}a.addMass(r.object.mass),a.addScore(r.object.score),a.swallowedObjects+=1,r.object.scheduleRespawn(e),n.push({type:"objectSwallowed",player:a,object:r.object})}for(const r of this.playerManager.all()){if(!r.swallowAnimation)continue;const a=this.playerManager.get(r.swallowAnimation.attackerId)??null;r.updateSwallowAnimation(t,a)&&n.push({type:"holeSwallowCompleted",attacker:a,victim:r})}return n}tryStartObjectSwallows(){for(const t of this.playerManager.alivePlayers()){const e=this.world.queryObjects(t.position,Math.max(2.5,t.radius*1.35));for(const n of e){if(!n.active||!no(t.radius,n.effectiveBoundingRadius))continue;const i=n.position.x-t.position.x,r=n.position.z-t.position.z,a=Math.max(.72,t.radius*.95);i*i+r*r<=a*a&&n.startSwallow(t.id)}}}tryStartHoleSwallows(t,e){const n=this.playerManager.alivePlayers();for(const i of n)if(i.alive)for(const r of n){if(i.id===r.id||!r.alive||r.hasPowerUp("shield")||!Sl(i.radius,r.radius))continue;const a=r.position.x-i.position.x,o=r.position.z-i.position.z,c=Math.max(1.15,i.radius*.98-r.radius*.12);a*a+o*o>c*c||(r.markSwallowed(i.id,t),i.addMass(Math.max(6,r.mass*.28+r.radius*5)),i.addScore(150+r.score*.2+r.radius*45),i.eliminations+=1,e.push({type:"holeSwallowed",attacker:i,victim:r}),this.config.matchMode===ue.LastHoleStanding&&(r.respawnAt=Number.POSITIVE_INFINITY))}}}class c_{constructor(t){I(this,"id");I(this,"type");I(this,"label");I(this,"homePosition");I(this,"radius");I(this,"color");I(this,"durationSeconds");I(this,"respawnDelay");I(this,"position");I(this,"active",!0);I(this,"respawnAt",0);I(this,"rotation",0);I(this,"mesh",null);this.id=t.id,this.type=t.type,this.label=t.label,this.position=new C(t.position.x,t.position.y,t.position.z),this.homePosition=this.position.clone(),this.radius=t.radius,this.color=t.color,this.durationSeconds=t.durationSeconds,this.respawnDelay=t.respawnDelay}collect(t){this.active=!1,this.respawnAt=t+this.respawnDelay}respawn(){this.position.copy(this.homePosition),this.active=!0,this.rotation=0}}class l_{constructor(t){I(this,"buckets",new Map);this.cellSize=t}clear(){this.buckets.clear()}insert(t){const e=this.toCell(t.position.x-t.boundingRadius),n=this.toCell(t.position.x+t.boundingRadius),i=this.toCell(t.position.z-t.boundingRadius),r=this.toCell(t.position.z+t.boundingRadius);for(let a=e;a<=n;a+=1)for(let o=i;o<=r;o+=1){const c=this.key(a,o),l=this.buckets.get(c);l?l.push(t):this.buckets.set(c,[t])}}rebuild(t){this.clear();for(const e of t)this.insert(e)}query(t,e){const n=this.toCell(t.x-e),i=this.toCell(t.x+e),r=this.toCell(t.z-e),a=this.toCell(t.z+e),o=new Map;for(let c=n;c<=i;c+=1)for(let l=r;l<=a;l+=1){const h=this.buckets.get(this.key(c,l));if(h)for(const u of h)o.set(u.id,u)}return[...o.values()]}toCell(t){return Math.floor(t/this.cellSize)}key(t,e){return`${t}:${e}`}}class h_{constructor(t){I(this,"id");I(this,"kind");I(this,"label");I(this,"homePosition");I(this,"homeRotationY");I(this,"size");I(this,"color");I(this,"boundingRadius");I(this,"mass");I(this,"score");I(this,"respawnDelay");I(this,"category");I(this,"routeId");I(this,"pedestrianPathId");I(this,"routeT");I(this,"routeSpeed");I(this,"isAd");I(this,"adSurfaceId");I(this,"position");I(this,"rotation",new Je);I(this,"active",!0);I(this,"respawnAt",0);I(this,"swallowScale",1);I(this,"temporaryScale",1);I(this,"mesh",null);I(this,"swallowAnimation",null);this.id=t.id,this.kind=t.kind,this.label=t.label,this.position=new C(t.position.x,t.position.y,t.position.z),this.homePosition=this.position.clone(),this.homeRotationY=t.rotationY,this.rotation.set(0,t.rotationY,0),this.size=new C(t.size.x,t.size.y,t.size.z),this.color=t.color,this.boundingRadius=t.boundingRadius,this.mass=t.mass,this.score=t.score,this.respawnDelay=t.respawnDelay,this.category=t.category,this.routeId=t.routeId,this.pedestrianPathId=t.pedestrianPathId,this.routeT=t.routeT??0,this.routeSpeed=t.routeSpeed??0,this.isAd=!!t.isAd,this.adSurfaceId=t.adSurfaceId}get effectiveBoundingRadius(){return this.boundingRadius*this.temporaryScale}startSwallow(t){this.active=!1,this.swallowScale=1,this.swallowAnimation={targetPlayerId:t,elapsed:0,duration:Me.clamp(.58+this.boundingRadius*.1+this.mass*.002,.58,1.45),startPosition:this.position.clone(),velocity:new C((Math.random()-.5)*.35,.25+Math.random()*.45,(Math.random()-.5)*.35),angularVelocity:new C(1.8+Math.random()*2.4,2.2+Math.random()*3.2,1.3+Math.random()*2.1),swirlDirection:Math.random()<.5?-1:1,sinkDepth:2.4+this.boundingRadius*1.45}}updateSwallow(t,e){if(!this.swallowAnimation)return!1;const n=this.swallowAnimation;n.elapsed+=t;const i=Math.min(1,n.elapsed/n.duration),r=(e==null?void 0:e.position)??n.startPosition,a=(e==null?void 0:e.radius)??Math.max(1,this.boundingRadius),o=Math.max(1,Math.ceil(t/.016)),c=t/o;for(let g=0;g<o;g+=1){const _=new C(r.x-this.position.x,0,r.z-this.position.z),m=Math.max(.001,_.length()),p=Math.max(a*1.75+this.boundingRadius*.9,2.6),v=Me.clamp(1-m/p,0,1);_.normalize();const M=new C(-_.z,0,_.x).multiplyScalar(n.swirlDirection),E=(24+a*9+this.boundingRadius*3)*(.42+v*1.65),D=15+a*3.4+v*24;n.velocity.x+=(_.x*E+M.x*E*.18*(1-i))*c,n.velocity.z+=(_.z*E+M.z*E*.18*(1-i))*c,n.velocity.y-=D*c,n.velocity.multiplyScalar(Math.max(0,1-c*(2.1+v*1.7))),this.position.x+=n.velocity.x*c,this.position.y+=n.velocity.y*c,this.position.z+=n.velocity.z*c;const b=Math.max(0,(i-.45)/.55)*c*7;this.position.x=Me.lerp(this.position.x,r.x,b),this.position.z=Me.lerp(this.position.z,r.z,b)}const l=Math.max(n.sinkDepth,a*.8+this.boundingRadius*.85),h=r.y-l,u=Math.max(0,(i-.72)/.28);this.position.y=Me.lerp(this.position.y,h,u*.25),this.rotation.x+=n.angularVelocity.x*t*(1+i*5),this.rotation.y+=n.angularVelocity.y*t*(1+i*5),this.rotation.z+=n.angularVelocity.z*t*(1+i*5);const d=Me.clamp((n.startPosition.y-this.position.y)/Math.max(.001,l),0,1),f=Math.max(d,Math.max(0,(i-.68)/.32));return this.swallowScale=Math.max(.06,1-f*.92),i>=1?(this.swallowAnimation=null,this.swallowScale=1,!0):!1}scheduleRespawn(t){this.respawnAt=t+this.respawnDelay}respawn(){this.position.copy(this.homePosition),this.rotation.set(0,this.homeRotationY,0),this.active=!0,this.swallowAnimation=null,this.swallowScale=1,this.temporaryScale=1}}class yc{constructor(t){I(this,"halfExtent");I(this,"objects");I(this,"powerUps");I(this,"grid",new l_(12));this.mapData=t,this.halfExtent=t.halfExtent,this.objects=t.objects.map(e=>new h_(e)),this.powerUps=t.powerUps.map(e=>new c_(e)),this.rebuildObjectGrid()}rebuildObjectGrid(){this.grid.rebuild(this.objects.filter(t=>t.active))}queryObjects(t,e){return this.grid.query(t,e)}updateSwallowing(t,e){const n=[];for(const i of this.objects){if(!i.swallowAnimation)continue;const r=i.swallowAnimation.targetPlayerId,a=e.get(r);i.updateSwallow(t,a?{position:a.position,radius:a.radius}:null)&&n.push({object:i,targetPlayerId:r})}return n}updateDynamicObjects(t){for(const e of this.objects)if(!(!e.active||e.swallowAnimation)){if(e.routeId){const n=this.mapData.trafficRoutes.find(i=>i.id===e.routeId);if(n){const i=this.advanceRoute(n,e.routeT,e.routeSpeed*t);e.routeT=i.t,e.position.set(i.position.x,e.homePosition.y,i.position.z),e.rotation.y=i.rotationY}}if(e.pedestrianPathId){const n=this.mapData.pedestrianPaths.find(i=>i.id===e.pedestrianPathId);if(n){const i=this.advanceRoute(n,e.routeT,e.routeSpeed*t);e.routeT=i.t,e.position.set(i.position.x,e.homePosition.y+Math.sin(e.routeT*Math.PI*2)*.03,i.position.z),e.rotation.y=i.rotationY}}}}updateRespawns(t,e,n=8){const i=[];for(const r of this.objects)if(!(r.active||r.swallowAnimation||r.respawnAt<=0||t<r.respawnAt)){if(e&&this.wouldRespawnInsidePlayer(r,e,n)){r.respawnAt=t+1.25;continue}r.respawn(),i.push(r)}return i.length>0&&this.rebuildObjectGrid(),i}updatePowerUps(t,e){const n=[];for(const i of this.powerUps)i.rotation+=t*2.5,!i.active&&e>=i.respawnAt&&(i.respawn(),n.push(i));return n}queryPowerUps(t,e){const n=e*e;return this.powerUps.filter(i=>{if(!i.active)return!1;const r=i.position.x-t.x,a=i.position.z-t.z;return r*r+a*a<=n})}clampToArena(t,e){const n=this.halfExtent-e*1.1;t.x=Me.clamp(t.x,-n,n),t.z=Me.clamp(t.z,-n,n)}getSpawnPoint(t){const e=this.mapData.spawnPoints[t%this.mapData.spawnPoints.length];return new C(e.x,e.y,e.z)}wouldRespawnInsidePlayer(t,e,n){for(const i of e.alivePlayers()){const r=t.homePosition.x-i.position.x,a=t.homePosition.z-i.position.z,o=i.radius+t.boundingRadius+n;if(r*r+a*a<o*o)return!0}return!1}advanceRoute(t,e,n){if(t.points.length<2)return{t:0,position:t.points[0]??{x:0,z:0},rotationY:0};let i=Math.floor(e),r=e-i,a=n;for(let d=0;d<12&&a>0;d+=1){const f=t.points[i],g=t.points[(i+1)%t.points.length],_=Math.max(.001,Math.hypot(g.x-f.x,g.z-f.z)),m=(1-r)*_;a<=m?(r+=a/_,a=0):(a-=m,i+=1,r=0,i>=t.points.length-1&&(i=t.loop?0:t.points.length-2,t.loop||(a=0,r=1)))}const o=t.points[i],c=t.points[(i+1)%t.points.length],l=Me.lerp(o.x,c.x,r),h=Me.lerp(o.z,c.z,r),u=Math.atan2(c.x-o.x,c.z-o.z);return{t:i+r,position:{x:l,z:h},rotationY:u}}}class u_{constructor(t){I(this,"shell");I(this,"sceneLayer");I(this,"uiLayer");I(this,"deathNotice");I(this,"sceneManager");I(this,"inputManager");I(this,"audioManager",new Ag);I(this,"mapGenerator",new r_);I(this,"networkClient",new O0);I(this,"playerManager",new n_);I(this,"botManager",new t_);I(this,"mainMenu");I(this,"matchSetupMenu");I(this,"findGamesMenu");I(this,"hostMenu");I(this,"pauseMenu");I(this,"chatUI");I(this,"hud");I(this,"endScreen");I(this,"world",null);I(this,"menuWorld",null);I(this,"menuPreviewElapsed",0);I(this,"swallowSystem",null);I(this,"respawnSystem",null);I(this,"timer",null);I(this,"state","booting");I(this,"lastFrame",performance.now());I(this,"animationId",0);I(this,"playerName","");I(this,"currentConfig",null);I(this,"lastConfig",null);I(this,"chatEnabled",!0);I(this,"cameraZoom",1);I(this,"deathCameraEnabled",!0);I(this,"deathCameraTargetId",null);I(this,"deathCameraElapsed",0);I(this,"messageId",1);I(this,"sizeAnnouncements",new Map);I(this,"networkHooksBound",!1);I(this,"networkSendAccumulator",0);I(this,"appliedNetworkSwallows",new Set);I(this,"deathNoticeTimer",0);I(this,"loop",t=>{const e=Math.min(.05,(t-this.lastFrame)/1e3);if(this.lastFrame=t,this.state==="playing"){this.updateMatch(e);const n=this.world&&this.deathCameraEnabled&&this.deathCameraTargetId?this.playerManager.get(this.deathCameraTargetId):void 0;this.world&&n?(this.deathCameraElapsed+=e,this.sceneManager.updateDeathDive(this.world,this.playerManager,n,e,this.deathCameraElapsed)):this.sceneManager.update(this.world,this.playerManager,this.playerManager.getLocalPlayer(),e,this.cameraZoom)}else this.state==="menu"&&this.menuWorld?(this.menuPreviewElapsed+=e,this.menuWorld.updateDynamicObjects(e),this.sceneManager.updateMenuPreview(this.menuWorld,e,this.menuPreviewElapsed)):this.sceneManager.update(this.world,this.playerManager,this.playerManager.getLocalPlayer(),e,this.cameraZoom);this.sceneManager.render(),this.animationId=window.requestAnimationFrame(this.loop)});I(this,"handleZoomKeyDown",t=>{if(!(this.state!=="playing"||t.repeat||this.isTypingTarget(t.target))){if(t.code==="Equal"||t.code==="NumpadAdd"){t.preventDefault(),this.adjustCameraZoom(-.08);return}(t.code==="Minus"||t.code==="NumpadSubtract")&&(t.preventDefault(),this.adjustCameraZoom(.08))}});I(this,"handleZoomWheel",t=>{this.state!=="playing"||this.isTypingTarget(t.target)||(t.preventDefault(),this.adjustCameraZoom(t.deltaY<0?-.06:.06))});this.root=t}boot(){this.root.innerHTML="",this.shell=document.createElement("div"),this.shell.className="game-shell",this.sceneLayer=document.createElement("div"),this.sceneLayer.className="scene-layer",this.uiLayer=document.createElement("div"),this.uiLayer.className="ui-layer",this.deathNotice=document.createElement("div"),this.deathNotice.className="death-notice hidden",this.uiLayer.appendChild(this.deathNotice),this.shell.append(this.sceneLayer,this.uiLayer),this.root.appendChild(this.shell),this.bindUiButtonSounds(),this.bindCameraZoomControls(),this.sceneManager=new V0(this.sceneLayer),this.inputManager=new Hg({onEscape:()=>this.handleEscape(),onEnter:()=>this.handleEnter()}),this.mainMenu=new $0(this.uiLayer),this.matchSetupMenu=new K0(this.uiLayer),this.findGamesMenu=new W0(this.uiLayer),this.hostMenu=new q0(this.uiLayer),this.pauseMenu=new Z0(this.uiLayer,this.audioManager),this.chatUI=new H0(this.uiLayer),this.hud=new Y0(this.uiLayer),this.endScreen=new G0(this.uiLayer),this.showMainMenu(),this.lastFrame=performance.now(),this.animationId=window.requestAnimationFrame(this.loop)}showMainMenu(){this.state="menu",this.clearMatch(),this.loadMenuPreview(),this.audioManager.startMenuMusic(),this.hideMenus(),this.hud.hide(),this.chatUI.hide(),this.mainMenu.show({onStartSolo:t=>this.showSoloSetup(t),onFindGames:t=>void this.showFindGames(t),onHostMatch:t=>this.showHostMatch(t),onSettings:()=>this.showSettingsOverlay(!1)},this.playerName)}showSoloSetup(t){this.playerName=t,this.state="setup",this.audioManager.startMenuMusic(),this.hideMenus(),this.matchSetupMenu.show(t,{onStart:e=>this.startMatch(e),onBack:()=>this.showMainMenu()},{cameraZoom:this.cameraZoom,deathCameraEnabled:this.deathCameraEnabled})}async showFindGames(t){this.playerName=t,this.state="setup",this.audioManager.startMenuMusic(),this.hideMenus();let e;try{await this.networkClient.connect(),this.bindNetworkHooks(),e=await this.networkClient.listRooms()}catch{e=this.createMockRooms()}this.findGamesMenu.show(e,{onJoin:n=>{if("seed"in n){this.joinMultiplayerRoom(n,t);return}const i=Ks(t);i.mapSize=n.mapSize,i.matchMode=n.matchMode,i.botCount=n.botsEnabled?Math.max(0,n.maxPlayers-n.players-1)+6:0,i.maxPlayers=n.maxPlayers,i.roomName=n.roomName,i.fillBots=n.botsEnabled,this.startMatch(i)},onBack:()=>this.showMainMenu()})}showHostMatch(t){this.playerName=t,this.state="setup",this.audioManager.startMenuMusic(),this.hideMenus(),this.hostMenu.show(t,{onHost:e=>void this.hostMultiplayerMatch(e),onBack:()=>this.showMainMenu()},{cameraZoom:this.cameraZoom,deathCameraEnabled:this.deathCameraEnabled})}async hostMultiplayerMatch(t){try{await this.networkClient.connect(),this.bindNetworkHooks();const e={roomName:t.roomName||`${t.playerName}'s Arena`,maxPlayers:t.maxPlayers??16,fillBots:!!t.fillBots,mapSize:t.mapSize,matchMode:t.matchMode,durationSeconds:t.durationSeconds,enableChat:t.enableChat,enableAds:t.enableAds,objectDensityMultiplier:t.objectDensityMultiplier,powerUpCount:t.powerUpCount,respawnSafeRadius:t.respawnSafeRadius,botDifficultyMix:t.botDifficultyMix},n=await this.networkClient.createRoom(e);await this.joinMultiplayerRoom(n,t.playerName,t)}catch(e){console.error(e),window.alert("Could not reach the Void Arena multiplayer server. Run npm run dev to start client and server together.")}}async joinMultiplayerRoom(t,e,n=Ks(e)){try{await this.networkClient.connect(),this.bindNetworkHooks();const i=await this.networkClient.joinRoom(t.id,e);if(!i.ok){window.alert(i.reason||"Could not join room");return}const r={...n,playerName:e,mapSize:t.mapSize,matchMode:t.matchMode,durationSeconds:t.durationSeconds,enableAds:t.enableAds,enableChat:t.enableChat,multiplayer:!0,roomId:t.id,roomName:t.roomName,mapSeed:t.seed,objectDensityMultiplier:t.objectDensityMultiplier,powerUpCount:t.powerUpCount,respawnSafeRadius:t.respawnSafeRadius,botDifficultyMix:t.botDifficultyMix,botCount:0,fillBots:t.botsEnabled,maxPlayers:t.maxPlayers};this.startMatch(r)}catch(i){console.error(i),window.alert("Could not join the multiplayer room.")}}startMatch(t){const e={...t,botCount:Math.min(100,Math.max(0,t.botCount))};this.hideMenus(),this.endScreen.hide(),this.clearMatch(),this.currentConfig=e,this.lastConfig={...e},this.playerName=e.playerName,this.chatEnabled=e.enableChat,this.cameraZoom=e.cameraZoom,this.deathCameraEnabled=e.deathCameraEnabled,this.clearDeathCamera(),this.sizeAnnouncements.clear();const n=this.mapGenerator.generate({size:e.mapSize,enableAds:e.enableAds,seed:e.mapSeed,objectDensityMultiplier:e.objectDensityMultiplier,powerUpCount:e.powerUpCount});this.world=new yc(n),this.delayInitialPowerUps(20),this.sceneManager.setGraphicsQuality(e.graphicsQuality);const i=this.world.getSpawnPoint(0),r=e.multiplayer&&this.networkClient.socketId?this.networkClient.socketId:"local-player";this.playerManager.createLocalPlayer(this.currentConfig.playerName,i,r);for(let a=0;a<this.currentConfig.botCount;a+=1){const o=Cs[a%Cs.length],c=a>=Cs.length?` ${Math.floor(a/Cs.length)+1}`:"",l=j0(a,this.currentConfig.botDifficultyMix),h=wl[l],u=this.playerManager.createBot(`bot-${a}`,`${o}${c} [${h.shortLabel}]`,this.world.getSpawnPoint(a+1),a+1,l);this.botManager.addBotController(new Q0(u,l))}this.sceneManager.loadWorld(this.world),this.swallowSystem=new o_(this.world,this.playerManager,this.currentConfig),this.respawnSystem=new a_(this.world,this.playerManager,this.currentConfig),this.timer=this.currentConfig.matchMode===ue.Timed?new e_(this.currentConfig.durationSeconds):null,this.hud.show({onZoomIn:()=>this.adjustCameraZoom(-.08),onZoomOut:()=>this.adjustCameraZoom(.08)}),this.chatUI.show({onSend:a=>this.addPlayerChat(a)}),this.chatUI.clear(),this.chatUI.setEnabled(this.chatEnabled),this.addSystemMessage("Match started"),this.currentConfig.roomName&&this.addSystemMessage(`${this.currentConfig.multiplayer?"Multiplayer room":"Local room preview"}: ${this.currentConfig.roomName}`),this.audioManager.playMatchStart(),this.audioManager.startMusic(e.mapSize),this.state="playing",this.lastFrame=performance.now()}updateMatch(t){var a;if(!this.world||!this.currentConfig||!this.swallowSystem||!this.respawnSystem)return;const e=this.playerManager.getLocalPlayer(),n=performance.now()/1e3;for(const o of this.playerManager.all())o.updatePowerUps(n);if(this.world.updateDynamicObjects(t),this.world.rebuildObjectGrid(),e!=null&&e.alive&&!this.chatUI.isInputFocused()){const o=this.inputManager.getMovementVector(),c=o.lengthSq()>.001&&this.inputManager.wantsBoost();e.updateResources(t,c);const l=e.getSpeed(e.isBoosting);e.position.x+=o.x*l*t,e.position.z+=o.z*l*t,this.world.clampToArena(e.position,e.radius)}else e&&e.updateResources(t,!1);this.botManager.update(t,this.world,this.playerManager),this.applyPowerUpEffects(t,n),this.collectPowerUps(n);const i=this.swallowSystem.update(t,n),r=this.respawnSystem.update(n);this.world.updateRespawns(n,this.playerManager,this.currentConfig.respawnSafeRadius),this.world.updatePowerUps(t,n),(a=this.timer)==null||a.update(t),this.processSwallowEvents(i);for(const o of r)this.addSystemMessage(`${o.player.name} respawned`);this.updateHud(),this.updateNetwork(t),this.checkMatchEnd()}processSwallowEvents(t){var e;for(const n of t)switch(n.type){case"objectSwallowed":n.player.id===this.playerManager.localPlayerId&&this.audioManager.playObjectSwallow(n.object.kind,n.object.category,n.object.mass),this.maybeAnnounceSize(n.player.id);break;case"holeSwallowed":n.victim.id===this.playerManager.localPlayerId?(this.audioManager.playDeath(),this.showDeathNotice(n.attacker.name),this.startDeathCamera(n.attacker.id)):this.audioManager.playHoleSwallow(),this.addSystemMessage(`${n.victim.name} was swallowed by ${n.attacker.name}`),this.broadcastHoleSwallow(n.attacker.id,n.victim.id),this.maybeAnnounceSize(n.attacker.id);break;case"holeSwallowCompleted":((e=this.currentConfig)==null?void 0:e.matchMode)===ue.LastHoleStanding&&this.addSystemMessage(`${n.victim.name} was eliminated`);break}}delayInitialPowerUps(t){if(!this.world)return;const e=performance.now()/1e3;this.world.powerUps.forEach((n,i)=>{n.active=!1,n.respawnAt=e+t+i*.12})}collectPowerUps(t){if(this.world)for(const e of this.playerManager.alivePlayers()){const n=this.world.queryPowerUps(e.position,e.radius+1.4);for(const i of n)e.position.distanceTo(i.position)>e.radius+i.radius+.45||(i.collect(t),e.addPowerUp(i.type,i.durationSeconds,t),this.addSystemMessage(`${e.name} picked up ${i.label}`),e.id===this.playerManager.localPlayerId&&this.audioManager.playPowerUp(i.type))}}applyPowerUpEffects(t,e){if(!this.world)return;const n=this.playerManager.alivePlayers().filter(r=>r.hasPowerUp("shrink")),i=this.playerManager.alivePlayers().filter(r=>r.hasPowerUp("magnet"));for(const r of this.world.objects){if(!r.active||r.swallowAnimation)continue;let a=1;for(const o of n){const c=Math.max(8,o.radius*4.5);if(o.position.distanceToSquared(r.position)<=c*c){a=.58;break}}r.temporaryScale+=(a-r.temporaryScale)*Math.min(1,t*5)}for(const r of i){const a=Math.max(12,r.radius*5.6);for(const o of this.world.queryObjects(r.position,a)){if(!o.active||o.swallowAnimation||!no(r.radius*1.15,o.effectiveBoundingRadius))continue;const c=new C().subVectors(r.position,o.position);c.y=0;const l=Math.max(.1,c.length());if(l>a)continue;c.normalize();const h=Bg*(1-l/a)*t;o.position.x+=c.x*h,o.position.z+=c.z*h}}}maybeAnnounceSize(t){const e=this.playerManager.get(t);if(!e)return;const n=Math.floor(e.radius),i=this.sizeAnnouncements.get(e.id)??1;n>i&&n>=2&&(this.sizeAnnouncements.set(e.id,n),this.addSystemMessage(`${e.name} reached size ${n.toFixed(1)}`))}updateHud(){var n;const t=this.playerManager.getLocalPlayer();t!=null&&t.alive&&this.deathCameraTargetId&&this.clearDeathCamera();const e=((n=this.currentConfig)==null?void 0:n.matchMode)??ue.Timed;this.hud.update(t,this.playerManager.getLeaderboard(e),this.timer,this.playerManager.alivePlayers().length,this.cameraZoom)}checkMatchEnd(){var t;if(this.currentConfig){if(this.currentConfig.matchMode===ue.Timed&&((t=this.timer)!=null&&t.complete)){this.endMatch();return}this.currentConfig.matchMode===ue.LastHoleStanding&&this.playerManager.alivePlayers().length<=1&&this.endMatch()}}endMatch(){if(this.state==="ended"||!this.currentConfig)return;this.state="ended";const t=this.createMatchResult();this.addSystemMessage(`${t.winnerName} won the match`),this.audioManager.playMatchEnd(),this.pauseMenu.hide(),this.endScreen.show(t,{onPlayAgain:()=>{this.lastConfig&&this.startMatch(this.lastConfig)},onMainMenu:()=>this.showMainMenu()})}createMatchResult(){var a;const t=((a=this.currentConfig)==null?void 0:a.matchMode)??ue.Timed,e=this.playerManager.getLeaderboard(t),n=this.playerManager.getLocalPlayer(),i=e[0],r=Math.max(1,e.findIndex(o=>o.id===(n==null?void 0:n.id))+1);return{winnerName:(i==null?void 0:i.name)??"No winner",placement:r,finalScore:(n==null?void 0:n.score)??0,finalRadius:(n==null?void 0:n.radius)??1,objectsSwallowed:(n==null?void 0:n.swallowedObjects)??0,eliminations:(n==null?void 0:n.eliminations)??0}}bindNetworkHooks(){this.networkHooksBound||(this.networkClient.onPlayerStates(t=>this.applyRemotePlayerStates(t)),this.networkClient.onChat(t=>this.addChatMessage(t)),this.networkClient.onHoleSwallowed(t=>this.applyNetworkHoleSwallow(t)),this.networkHooksBound=!0)}broadcastHoleSwallow(t,e){var n;!((n=this.currentConfig)!=null&&n.multiplayer)||!this.currentConfig.roomId||!this.networkClient.connected||t!==this.playerManager.localPlayerId||this.networkClient.sendHoleSwallowed(this.currentConfig.roomId,t,e)}applyNetworkHoleSwallow(t){var a;if(!((a=this.currentConfig)!=null&&a.multiplayer)||t.attackerId===this.playerManager.localPlayerId)return;const e=`${t.attackerId}:${t.victimId}:${t.timestamp}`;if(this.appliedNetworkSwallows.has(e))return;this.appliedNetworkSwallows.add(e);const n=this.playerManager.get(t.attackerId),i=this.playerManager.get(t.victimId);if(!i||!i.alive)return;const r=performance.now()/1e3;i.markSwallowed(t.attackerId,r),n?(n.addMass(Math.max(6,i.mass*.28+i.radius*5)),n.addScore(150+i.score*.2+i.radius*45),n.eliminations+=1,this.addSystemMessage(`${i.name} was swallowed by ${n.name}`),i.id===this.playerManager.localPlayerId&&(this.audioManager.playDeath(),this.showDeathNotice(n.name),this.startDeathCamera(n.id))):i.id===this.playerManager.localPlayerId&&(this.audioManager.playDeath(),this.showDeathNotice("the void"),this.clearDeathCamera())}updateNetwork(t){var i;if(!((i=this.currentConfig)!=null&&i.multiplayer)||!this.currentConfig.roomId||!this.networkClient.connected||(this.networkSendAccumulator+=t,this.networkSendAccumulator<.08))return;this.networkSendAccumulator=0;const e=this.playerManager.getLocalPlayer();if(!e)return;const n={id:e.id,name:e.name,x:e.position.x,z:e.position.z,radius:e.radius,score:e.score,mass:e.mass,rimColor:e.rimColor,alive:e.alive,stamina:e.stamina,eliminations:e.eliminations,swallowedObjects:e.swallowedObjects};this.networkClient.sendPlayerState(this.currentConfig.roomId,n)}applyRemotePlayerStates(t){var i;if(!this.world||!((i=this.currentConfig)!=null&&i.multiplayer))return;const e=this.playerManager.localPlayerId,n=new Set;t.forEach((r,a)=>{if(r.id===e)return;n.add(r.id);let o=this.playerManager.get(r.id);o||(o=this.playerManager.createRemotePlayer(r.id,r.name,new C(r.x,0,r.z),a+3)),o.name=r.name,o.position.lerp(new C(r.x,0,r.z),.45),o.radius=r.radius,o.mass=r.mass,o.score=r.score,o.stamina=r.stamina,o.alive=r.alive,o.renderVisible=r.alive,o.eliminations=r.eliminations,o.swallowedObjects=r.swallowedObjects});for(const r of this.playerManager.all())r.id!==e&&!r.isBot&&!n.has(r.id)&&this.playerManager.remove(r.id)}showPause(){this.currentConfig&&(this.state="paused",this.inputManager.clear(),this.pauseMenu.show({onResume:()=>this.resumeMatch(),onBackToMenu:()=>this.showMainMenu(),onChatToggle:t=>{this.chatEnabled=t,this.chatUI.setEnabled(t),this.currentConfig&&(this.currentConfig.enableChat=t)},onDeathCameraToggle:t=>{this.deathCameraEnabled=t,this.currentConfig&&(this.currentConfig.deathCameraEnabled=t),t||this.clearDeathCamera()}},{chatEnabled:this.chatEnabled,inMatch:!0,deathCameraEnabled:this.deathCameraEnabled}))}resumeMatch(){this.pauseMenu.hide(),this.currentConfig?(this.state="playing",this.lastFrame=performance.now()):this.state="menu"}showSettingsOverlay(t){this.pauseMenu.show({onResume:()=>this.pauseMenu.hide(),onBackToMenu:()=>this.showMainMenu(),onChatToggle:e=>{this.chatEnabled=e,this.chatUI.setEnabled(e)},onDeathCameraToggle:e=>{this.deathCameraEnabled=e,this.currentConfig&&(this.currentConfig.deathCameraEnabled=e),e||this.clearDeathCamera()}},{chatEnabled:this.chatEnabled,inMatch:t,deathCameraEnabled:this.deathCameraEnabled})}handleEscape(){if(!this.chatUI.handleEscape()){if(this.state==="playing"){this.showPause();return}if(this.state==="paused"){this.resumeMatch();return}(this.state==="menu"||this.state==="setup")&&this.pauseMenu.hide()}}handleEnter(){this.state==="playing"&&this.chatEnabled&&this.chatUI.handleEnter()}addPlayerChat(t){var n;const e=this.playerManager.getLocalPlayer();if((n=this.currentConfig)!=null&&n.multiplayer&&this.currentConfig.roomId&&this.networkClient.connected){this.networkClient.sendChat(this.currentConfig.roomId,(e==null?void 0:e.name)??this.playerName,t);return}this.addChatMessage({id:this.createMessageId(),sender:(e==null?void 0:e.name)??this.playerName,text:t,system:!1,timestamp:Date.now()})}addSystemMessage(t){this.addChatMessage({id:this.createMessageId(),sender:"System",text:t,system:!0,timestamp:Date.now()})}addChatMessage(t){this.chatUI.addMessage(t)}createMessageId(){const t=`msg-${this.messageId}`;return this.messageId+=1,t}createMockRooms(){return[{id:"room-1",roomName:"Midnight Grid",mapSize:"medium",players:5,maxPlayers:16,botsEnabled:!0,matchMode:ue.Timed},{id:"room-2",roomName:"Rooftop Collapse",mapSize:"large",players:24,maxPlayers:32,botsEnabled:!1,matchMode:ue.LastHoleStanding},{id:"room-3",roomName:"Sponsor Square",mapSize:"huge",players:64,maxPlayers:100,botsEnabled:!0,matchMode:ue.Timed}]}clearMatch(){var e,n;const t=!!((e=this.currentConfig)!=null&&e.multiplayer);this.clearDeathCamera(),this.world=null,this.menuWorld=null,this.menuPreviewElapsed=0,this.swallowSystem=null,this.respawnSystem=null,this.timer=null,this.currentConfig=null,this.playerManager.clear(),this.botManager.clear(),this.appliedNetworkSwallows.clear(),(n=this.sceneManager)==null||n.clearWorld(),this.audioManager.stopMusic(),this.hideDeathNotice(),t&&(this.networkClient.disconnect(),this.networkHooksBound=!1)}hideMenus(){var t,e,n,i,r;(t=this.mainMenu)==null||t.hide(),(e=this.matchSetupMenu)==null||e.hide(),(n=this.findGamesMenu)==null||n.hide(),(i=this.hostMenu)==null||i.hide(),(r=this.pauseMenu)==null||r.hide()}adjustCameraZoom(t){this.cameraZoom=Me.clamp(this.cameraZoom+t,.72,1.42),this.currentConfig&&(this.currentConfig.cameraZoom=this.cameraZoom)}startDeathCamera(t){this.deathCameraEnabled&&(this.deathCameraTargetId=t,this.deathCameraElapsed=0)}clearDeathCamera(){this.deathCameraTargetId=null,this.deathCameraElapsed=0}loadMenuPreview(){const t=this.mapGenerator.generate({size:"medium",enableAds:!0,seed:"void-arena-menu-city",objectDensityMultiplier:.86,powerUpCount:0});this.menuWorld=new yc(t),this.sceneManager.setGraphicsQuality("balanced"),this.sceneManager.loadWorld(this.menuWorld)}showDeathNotice(t){window.clearTimeout(this.deathNoticeTimer);const e=[`Void ${t} got you`,`${t} pulled you into the void`,`You slipped into ${t}'s void`,`${t} swallowed your arena`,`The void belongs to ${t}`];this.deathNotice.textContent=e[Math.floor(Math.random()*e.length)],this.deathNotice.classList.remove("hidden"),this.deathNotice.classList.remove("show"),this.deathNotice.offsetWidth,this.deathNotice.classList.add("show"),this.deathNoticeTimer=window.setTimeout(()=>this.hideDeathNotice(),2400)}hideDeathNotice(){var t,e;window.clearTimeout(this.deathNoticeTimer),(t=this.deathNotice)==null||t.classList.remove("show"),(e=this.deathNotice)==null||e.classList.add("hidden")}bindCameraZoomControls(){window.addEventListener("keydown",this.handleZoomKeyDown),this.sceneLayer.addEventListener("wheel",this.handleZoomWheel,{passive:!1})}isTypingTarget(t){return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement||t instanceof HTMLElement&&t.isContentEditable}bindUiButtonSounds(){this.uiLayer.addEventListener("pointerover",t=>{const e=t.target;if(!(e instanceof Element))return;const n=e.closest("button");if(!n||!this.uiLayer.contains(n))return;const i=t.relatedTarget;i&&n.contains(i)||this.audioManager.playButtonHover()}),this.uiLayer.addEventListener("click",t=>{const e=t.target;if(!(e instanceof Element))return;const n=e.closest("button");!n||!this.uiLayer.contains(n)||n.disabled||this.audioManager.playButtonClick()},{capture:!0})}dispose(){var t;window.cancelAnimationFrame(this.animationId),window.removeEventListener("keydown",this.handleZoomKeyDown),(t=this.sceneLayer)==null||t.removeEventListener("wheel",this.handleZoomWheel),this.inputManager.dispose(),this.sceneManager.dispose(),this.audioManager.stopMusic()}}const El=document.querySelector("#app");if(!El)throw new Error("Missing #app root element");const d_=new u_(El);d_.boot();
