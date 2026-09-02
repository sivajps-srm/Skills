"use client";
import {useEffect,useRef,useState} from "react";
import {asteronDeck,asteronDeckDownload} from "../lib/asteron-deck";

export default function SessionDeck({open,current,onClose}:{open:boolean;current:number;onClose:()=>void}){
  const [follow,setFollow]=useState(true);const [index,setIndex]=useState(current);const frame=useRef<HTMLElement>(null);
  useEffect(()=>{if(follow)setIndex(current)},[current,follow]);
  if(!open)return null;const slide=asteronDeck[index]??asteronDeck[0];
  return <div className="class-deck-backdrop" role="dialog" aria-modal="true" aria-label="Asteron Mobility classroom deck"><section className="class-deck-shell">
    <header><div><span>CLASSROOM DECK</span><b>{follow?"Following facilitator":"Independent browsing"}</b></div><div><a href={asteronDeckDownload} download>Download PowerPoint</a><button onClick={()=>frame.current?.requestFullscreen?.()}>Full screen</button><button onClick={onClose}>Close ×</button></div></header>
    <section className={`class-slide slide-${slide.layout??"statement"}`} ref={frame}>
      <div className="slide-section">{slide.section}</div><div className="slide-number">{String(index+1).padStart(2,"0")} / {asteronDeck.length}</div>
      <h1>{slide.title}</h1><p className="slide-lead">{slide.lead}</p>
      {slide.points&&<ul>{slide.points.map(point=><li key={point}>{point}</li>)}</ul>}
      {slide.callout&&<blockquote>{slide.callout}</blockquote>}{slide.prompt&&<div className="slide-prompt"><span>PAUSE & APPLY</span><b>{slide.prompt}</b></div>}
      <img className="slide-logo" src="/s4s-favicon.png" alt="S4S"/><small>Skills4Sales · Asteron Mobility</small>
    </section>
    <footer><button disabled={index===0} onClick={()=>{setFollow(false);setIndex(index-1)}}>← Previous</button><label><input type="checkbox" checked={follow} onChange={e=>{setFollow(e.target.checked);if(e.target.checked)setIndex(current)}}/> Follow facilitator</label><button disabled={index===asteronDeck.length-1} onClick={()=>{setFollow(false);setIndex(index+1)}}>Next →</button></footer>
  </section></div>
}
