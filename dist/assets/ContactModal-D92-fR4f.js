import{c as t}from"./createLucideIcon-Chj0Lbi0.js";import{j as a}from"./client-DOmNpTln.js";import{u as d}from"./main-Dysz4GhO.js";import{A as m}from"./index-CujJp_v3.js";import{m as n}from"./proxy-ADomnJGd.js";import{X as h}from"./x-BxX7hk5F.js";/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],P=t("mail",x);/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],w=t("map-pin",j);/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],N=t("message-circle",y);/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],f=t("phone",k),z=({isOpen:i,onClose:c,phoneNumber:s})=>{const{t:o}=d();if(!i)return null;const e=s.replace(/\s+/g,""),l=`https://wa.me/${e.replace("+","")}`,r=`tel:${e}`;return a.jsx(m,{children:a.jsx(n.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"contact-modal-overlay",onClick:c,children:a.jsxs(n.div,{initial:{scale:.9,opacity:0,y:20},animate:{scale:1,opacity:1,y:0},exit:{scale:.9,opacity:0,y:20},className:"contact-modal-content glass-card",onClick:p=>p.stopPropagation(),children:[a.jsx("button",{className:"contact-modal-close",onClick:c,children:a.jsx(h,{size:20})}),a.jsx("h3",{className:"contact-modal-title",children:o("whatsapp.title")}),a.jsx("p",{className:"contact-modal-phone",dir:"ltr",children:s}),a.jsxs("div",{className:"contact-modal-options",children:[a.jsxs("a",{href:r,className:"contact-option-card call",onClick:c,children:[a.jsx("div",{className:"option-icon",children:a.jsx(f,{size:24})}),a.jsx("span",{children:o("contact.phone")})]}),a.jsxs("a",{href:l,target:"_blank",rel:"noopener noreferrer",className:"contact-option-card whatsapp",onClick:c,children:[a.jsx("div",{className:"option-icon",children:a.jsx(N,{size:24})}),a.jsx("span",{children:"WhatsApp"})]})]})]})})})};export{z as C,w as M,f as P,P as a};
