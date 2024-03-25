"use client"
import React from 'react'
import mermaid from "mermaid";

export default function Mermaid({text}: {text: string}) {
  React.useEffect(() => {
    mermaid.contentLoaded()
  }, [])

  return (
    <div >
      <pre className="mermaid" id="graphDiv" >
        {text}
      </pre>
    </div>
  );
}