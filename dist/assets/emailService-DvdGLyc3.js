import{c}from"./createLucideIcon-Chj0Lbi0.js";/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],y=c("circle-alert",a);/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],p=c("circle-check-big",i);/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],k=c("send",l);/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],f=c("upload",d),n="/api",u=async r=>{try{const e=new FormData(r),o=await fetch(`${n}/contact.php`,{method:"POST",body:e});if(!o.ok){const s=await o.text();throw new Error(`CONNECTION_ERROR: ${s}`)}const t=await o.json();if(console.log("تم إرسال النموذج بنجاح:",t),!t.ok)throw new Error(t.error||"Failed to send email");return{success:!0,result:t}}catch(e){return console.error("خطأ في إرسال النموذج:",e),{success:!1,error:e}}},m=async r=>{try{const e=new FormData(r),o=await fetch(`${n}/recruitment.php`,{method:"POST",body:e});if(!o.ok){const s=await o.text();throw new Error(`CONNECTION_ERROR: ${s}`)}const t=await o.json();if(console.log("تم إرسال طلب التوظيف بنجاح:",t),!t.ok)throw new Error(t.error||"Failed to send application");return{success:!0,result:t}}catch(e){return console.error("خطأ في إرسال طلب التوظيف:",e),{success:!1,error:e}}},w=async()=>{try{const e=await(await fetch(`${n}/csrf.php`,{method:"GET"})).json();return(e==null?void 0:e.csrf_token)||""}catch(r){return console.error("Failed to get CSRF token",r),""}};export{p as C,k as S,f as U,y as a,m as b,w as g,u as s};
