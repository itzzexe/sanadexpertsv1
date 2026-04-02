import{r as s,j as t}from"./client-DOmNpTln.js";import{c}from"./createLucideIcon-Chj0Lbi0.js";/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],n=c("arrow-up",a),d=()=>{const[r,e]=s.useState(!1);s.useEffect(()=>{const o=()=>{window.pageYOffset>500?e(!0):e(!1)};return window.addEventListener("scroll",o),()=>window.removeEventListener("scroll",o)},[]);const i=()=>{window.scrollTo({top:0,behavior:"smooth"})};return t.jsx("div",{className:`back-to-top ${r?"visible":""}`,onClick:i,children:t.jsx(n,{size:24})})};export{d as default};
