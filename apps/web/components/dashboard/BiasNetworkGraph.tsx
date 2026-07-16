"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Network, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  FileText, 
  Layers
} from "lucide-react";
import { AnalysisResult } from "../../types";

interface Node {
  id: string;
  label: string;
  group: "source" | "meta" | "tone" | "bias" | "quote" | "alternative";
  color: string;
  desc: string;
  size: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  originalQuote?: string;
  rephraseAlternative?: string;
}

interface Link {
  source: string;
  target: string;
}

interface BiasNetworkGraphProps {
  analysisResult: AnalysisResult | null;
  onApplyRephrase?: (quote: string, rephrasedText: string) => void;
}

const MOCK_DATA = {
  language: "English",
  scores: { sentiment: 65, objectivity: 80, biasIndex: 20 },
  tones: [
    { name: "Informative", score: 70, color: "from-blue-500 to-indigo-500" },
    { name: "Assertive", score: 30, color: "from-purple-500 to-pink-500" }
  ],
  biases: [
    { 
      type: "Sensationalism", 
      quote: "Obviously, this disaster is a complete conspiracy.", 
      description: "Employs dramatic phrasing to provoke emotional reactions rather than objective analysis.", 
      rephrase: "This event presents significant challenges." 
    }
  ]
};

const getTailwindColors = (fromColorClass: string) => {
  const match = fromColorClass.match(/from-([a-z]+)-(\d+)/);
  if (match) {
    const color = match[1];
    const weight = match[2];
    const borderWeight = Math.max(100, parseInt(weight) - 100).toString();
    return {
      fill: `fill-${color}-${weight}`,
      stroke: `stroke-${color}-${borderWeight}`,
      text: `text-${color}-400`
    };
  }
  return { fill: "fill-slate-500", stroke: "stroke-slate-400", text: "text-slate-400" };
};

export default function BiasNetworkGraph({ analysisResult, onApplyRephrase }: BiasNetworkGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const prevNodesRef = useRef<Node[]>([]);
  const ticksLeftRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggedNodeIdRef = useRef<string | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize nodes and links when analysisResult changes
  useEffect(() => {
    const isMock = !analysisResult;
    const data = analysisResult || MOCK_DATA;

    const newNodes: Node[] = [];
    const newLinks: Link[] = [];

    // 1. Source Node
    newNodes.push({
      id: "source-doc",
      label: isMock ? "Mock Canvas" : "Analysis Document",
      group: "source",
      color: "fill-indigo-600 stroke-indigo-500",
      desc: isMock 
        ? "Mock document canvas showcasing system mapping capabilities." 
        : "The raw source text submitted for cognitive evaluation.",
      size: 16
    });

    // 2. Language / Meta Node
    newNodes.push({
      id: "meta-lang",
      label: `Language: ${data.language}`,
      group: "meta",
      color: "fill-cyan-600 stroke-cyan-500",
      desc: `The analysis engine resolved the source document primary locale as ${data.language}.`,
      size: 11
    });
    newLinks.push({ source: "source-doc", target: "meta-lang" });

    // 3. Tones Nodes
    data.tones.forEach((t) => {
      const colors = getTailwindColors(t.color);
      newNodes.push({
        id: `tone-${t.name}`,
        label: `${t.name} (${t.score}%)`,
        group: "tone",
        color: `${colors.fill} ${colors.stroke}`,
        desc: `Visualizes the calculated score of the ${t.name} communication tone. Core metric: ${t.score}%.`,
        size: 10 + t.score * 0.06
      });
      newLinks.push({ source: "source-doc", target: `tone-${t.name}` });
    });

    // 4. Biases, Quotes, and Alternatives
    data.biases.forEach((b, idx) => {
      const isObjective = b.type === "Objective Statement" || b.type === "Objective Statement (விஷயசார்பற்ற அறிக்கை)" || b.type === "Objective Statement (විෂයමූලික ප්‍රකාශය)";
      const biasId = `bias-${idx}`;
      
      newNodes.push({
        id: biasId,
        label: b.type,
        group: "bias",
        color: isObjective ? "fill-emerald-600 stroke-emerald-500" : "fill-pink-600 stroke-pink-500",
        desc: b.description,
        size: 12
      });
      newLinks.push({ source: "source-doc", target: biasId });

      if (!isObjective && b.quote) {
        const quoteId = `quote-${idx}`;
        newNodes.push({
          id: quoteId,
          label: b.quote.length > 25 ? `${b.quote.slice(0, 22)}...` : b.quote,
          group: "quote",
          color: "fill-purple-600 stroke-purple-500",
          desc: `Flagged biased text sequence fragment: "${b.quote}"`,
          size: 9,
          originalQuote: b.quote,
          rephraseAlternative: b.rephrase
        });
        newLinks.push({ source: biasId, target: quoteId });

        if (b.rephrase && b.rephrase !== b.quote) {
          const altId = `alt-${idx}`;
          newNodes.push({
            id: altId,
            label: b.rephrase.length > 25 ? `${b.rephrase.slice(0, 22)}...` : b.rephrase,
            group: "alternative",
            color: "fill-emerald-600 stroke-emerald-500",
            desc: `Suggested neutral alternative rephrasing: "${b.rephrase}"`,
            size: 10,
            originalQuote: b.quote,
            rephraseAlternative: b.rephrase
          });
          newLinks.push({ source: quoteId, target: altId });
        }
      }
    });

    // Map coordinates from previous nodes to preserve location states during updates
    const width = 540;
    const height = 240;
    const cx = width / 2;
    const cy = height / 2;

    const mappedNodes = newNodes.map((node) => {
      const prev = prevNodesRef.current.find((p) => p.id === node.id);
      if (prev) {
        return {
          ...node,
          x: prev.x,
          y: prev.y,
          vx: prev.vx,
          vy: prev.vy
        };
      } else {
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 50;
        return {
          ...node,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: 0,
          vy: 0
        };
      }
    });

    setNodes(mappedNodes);
    setLinks(newLinks);
    prevNodesRef.current = mappedNodes;
    setSelectedNode((prev) => {
      if (!prev) return null;
      const updated = mappedNodes.find((n) => n.id === prev.id);
      return updated || null;
    });

    // Reset ticks and kick off simulation
    ticksLeftRef.current = 150;
  }, [analysisResult]);

  const runSimulationTick = useCallback(() => {
    if (ticksLeftRef.current <= 0) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    setNodes((currentNodes) => {
      if (currentNodes.length === 0) return currentNodes;

      const nextNodes = currentNodes.map((n) => ({ ...n }));
      const width = 540;
      const height = 240;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Repulsion between all nodes
      for (let i = 0; i < nextNodes.length; i++) {
        const u = nextNodes[i];
        for (let j = i + 1; j < nextNodes.length; j++) {
          const v = nextNodes[j];
          const dx = (v.x ?? cx) - (u.x ?? cx);
          const dy = (v.y ?? cy) - (u.y ?? cy);
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) {
            dist = 1;
          }
          
          const strength = 1400;
          const force = strength / (dist * dist);
          const fx = force * (dx / dist);
          const fy = force * (dy / dist);

          u.vx = (u.vx ?? 0) - fx;
          u.vy = (u.vy ?? 0) - fy;
          v.vx = (v.vx ?? 0) + fx;
          v.vy = (v.vy ?? 0) + fy;
        }
      }

      // 2. Attraction along connected links
      links.forEach((link) => {
        const u = nextNodes.find((n) => n.id === link.source);
        const v = nextNodes.find((n) => n.id === link.target);
        if (!u || !v) return;

        const dx = (v.x ?? cx) - (u.x ?? cx);
        const dy = (v.y ?? cy) - (u.y ?? cy);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const targetLen = 50;
        const k = 0.07;
        const force = k * (dist - targetLen);
        const fx = force * (dx / dist);
        const fy = force * (dy / dist);

        u.vx = (u.vx ?? 0) + fx;
        u.vy = (u.vy ?? 0) + fy;
        v.vx = (v.vx ?? 0) - fx;
        v.vy = (v.vy ?? 0) - fy;
      });

      // 3. Central gravity alignment force
      nextNodes.forEach((u) => {
        const dx = cx - (u.x ?? cx);
        const dy = cy - (u.y ?? cy);
        const gravityStrength = 0.025;
        
        u.vx = (u.vx ?? 0) + dx * gravityStrength;
        u.vy = (u.vy ?? 0) + dy * gravityStrength;
      });

      // 4. Update coordinates & apply damping
      nextNodes.forEach((u) => {
        if (u.id === draggedNodeIdRef.current && mousePosRef.current) {
          u.x = mousePosRef.current.x;
          u.y = mousePosRef.current.y;
          u.vx = 0;
          u.vy = 0;
        } else {
          u.vx = (u.vx ?? 0) * 0.78;
          u.vy = (u.vy ?? 0) * 0.78;
          u.x = (u.x ?? cx) + u.vx;
          u.y = (u.y ?? cy) + u.vy;
        }

        // Clamp coordinates within container viewport
        const padding = 15;
        u.x = Math.max(padding, Math.min(width - padding, u.x));
        u.y = Math.max(padding, Math.min(height - padding, u.y));
      });

      prevNodesRef.current = nextNodes;
      return nextNodes;
    });

    ticksLeftRef.current -= 1;
    animationFrameIdRef.current = requestAnimationFrame(runSimulationTick);
  }, [links]);

  // Handle trigger for frame animation loop updates
  useEffect(() => {
    ticksLeftRef.current = 150;
    if (!animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(runSimulationTick);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [runSimulationTick]);

  const updateMousePosition = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 540;
    const y = ((e.clientY - rect.top) / rect.height) * 240;
    mousePosRef.current = { x, y };
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    draggedNodeIdRef.current = node.id;
    updateMousePosition(e);
    
    ticksLeftRef.current = 180;
    if (!animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(runSimulationTick);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeIdRef.current) {
      updateMousePosition(e);
      ticksLeftRef.current = Math.max(ticksLeftRef.current, 10);
      if (!animationFrameIdRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(runSimulationTick);
      }
    }
  };

  const handleMouseUpOrLeave = () => {
    draggedNodeIdRef.current = null;
    mousePosRef.current = null;
  };

  const handleApplyAlternative = () => {
    if (selectedNode && onApplyRephrase && selectedNode.originalQuote && selectedNode.rephraseAlternative) {
      onApplyRephrase(selectedNode.originalQuote, selectedNode.rephraseAlternative);
      setSelectedNode(null);
    }
  };

  const renderSidebarDetails = () => {
    if (!selectedNode) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-8">
          <ShieldCheck className="h-8 w-8 text-slate-700 animate-bounce" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Cognitive Map Scope Active
          </p>
          <span className="text-[8.5px] text-slate-600 font-medium px-4 leading-normal max-w-xs">
            Select nodes in the visualizer graph to map correlation structures and inspect objective rephrasing suggestions.
          </span>
        </div>
      );
    }

    switch (selectedNode.group) {
      case "tone":
        const tonePercent = selectedNode.label.match(/\((\d+)%\)/)?.[1] || "0";
        return (
          <div className="space-y-3.5 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Linguistic Vector</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 uppercase">
                Tone Score
              </span>
            </div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>{selectedNode.label}</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{selectedNode.desc}</p>
            
            <div className="pt-2">
              <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase mb-1">
                <span>Concentration</span>
                <span>{tonePercent}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${tonePercent}%` }}
                />
              </div>
            </div>
          </div>
        );

      case "bias":
        return (
          <div className="space-y-3.5 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Heuristic Classifier</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-pink-950/40 border border-pink-500/20 text-pink-400 uppercase">
                Bias Flag
              </span>
            </div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
              <span>{selectedNode.label}</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{selectedNode.desc}</p>
            <div className="p-2 border border-slate-900 bg-slate-950/60 rounded-lg text-[9px] text-slate-500 font-medium leading-normal">
              🛡️ Classification algorithms evaluate matches to compute total Bias Risk ratings.
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="space-y-3.5 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Linguistic Sample</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-500/20 text-purple-400 uppercase">
                Flagged Fragment
              </span>
            </div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
              <span>Context Block</span>
            </h4>
            <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl">
              <p className="text-[10px] text-slate-300 italic font-mono leading-relaxed">
                "{selectedNode.originalQuote}"
              </p>
            </div>
            <p className="text-[9.5px] text-slate-500 leading-normal font-semibold">
              Select the green recommendation node attached in the graph layout to deploy neutral adjustments.
            </p>
          </div>
        );

      case "alternative":
        return (
          <div className="space-y-3.5 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">System Directives</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 uppercase">
                Rephrase suggestion
              </span>
            </div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-bounce" />
              <span>Suggested Alternative</span>
            </h4>
            <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl">
              <p className="text-[10px] text-emerald-400 italic font-mono leading-relaxed">
                "{selectedNode.rephraseAlternative}"
              </p>
            </div>
            
            {onApplyRephrase && selectedNode.originalQuote && selectedNode.rephraseAlternative ? (
              <button
                onClick={handleApplyAlternative}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 border border-emerald-400/30 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition duration-200 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center space-x-1"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Apply Rephrase</span>
              </button>
            ) : (
              <div className="text-[9px] text-slate-500 text-center uppercase tracking-wider py-1 font-bold">
                Integration Callback Unavailable
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-3.5 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Core Metrics</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 uppercase">
                System Node
              </span>
            </div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span>{selectedNode.label}</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{selectedNode.desc}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900/60 backdrop-blur-md rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <Network className="h-4 w-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
            Cognitive Map Visualization
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {!analysisResult && (
            <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-pink-950/40 border border-pink-500/20 text-pink-400 animate-pulse">
              Preview Mode
            </span>
          )}
          <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
            2D Physics Layout
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-900/80 bg-slate-950/50 min-h-[240px]">
          <svg
            ref={svgRef}
            className="w-full h-[240px] select-none"
            viewBox="0 0 540 240"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <defs>
              {/* Technical background Grid pattern */}
              <pattern id="bias-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="1" />
              </pattern>
              
              {/* Subtle glows filter */}
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#bias-grid)" />

            {/* Connection Lines */}
            {links.map((link, idx) => {
              const from = nodes.find((n) => n.id === link.source);
              const to = nodes.find((n) => n.id === link.target);
              if (!from || !to) return null;
              
              let strokeClass = "stroke-slate-800";
              let strokeDash = undefined;
              
              if (from.group === "source" && to.group === "bias") {
                strokeClass = to.color.includes("emerald") 
                  ? "stroke-emerald-500/25" 
                  : "stroke-pink-500/25 animate-pulse";
                strokeDash = "3,3";
              } else if (from.group === "bias" && to.group === "quote") {
                strokeClass = "stroke-purple-500/35";
              } else if (from.group === "quote" && to.group === "alternative") {
                strokeClass = "stroke-emerald-500/40";
                strokeDash = "2,2";
              } else if (from.group === "source" && to.group === "tone") {
                strokeClass = "stroke-indigo-500/20";
              } else if (from.group === "source" && to.group === "meta") {
                strokeClass = "stroke-cyan-500/25";
                strokeDash = "4,4";
              }

              return (
                <line
                  key={`link-${idx}`}
                  x1={from.x ?? 270}
                  y1={from.y ?? 120}
                  x2={to.x ?? 270}
                  y2={to.y ?? 120}
                  className={`${strokeClass} stroke-[1.5] transition-all duration-300`}
                  strokeDasharray={strokeDash}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const nx = node.x ?? 270;
              const ny = node.y ?? 120;
              
              return (
                <g
                  key={`node-${node.id}`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(node)}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                >
                  <circle
                    cx={nx}
                    cy={ny}
                    r={node.size + (isSelected ? 6 : 4.5)}
                    className={`fill-none transition-all duration-300 opacity-0 group-hover:opacity-40 ${
                      isSelected ? "opacity-60 stroke-[1.5]" : "stroke-1"
                    } ${
                      node.group === "bias" && !node.color.includes("emerald")
                        ? "stroke-pink-500"
                        : node.group === "alternative" || node.color.includes("emerald")
                        ? "stroke-emerald-500"
                        : "stroke-indigo-400"
                    }`}
                    style={{ filter: "url(#glow-effect)" }}
                  />
                  
                  <circle
                    cx={nx}
                    cy={ny}
                    r={node.size}
                    className={`${node.color} stroke-[2] transition-transform duration-300 ${
                      isSelected ? "scale-110" : "hover:scale-105"
                    }`}
                  />

                  {node.group === "source" && (
                    <circle cx={nx} cy={ny} r={4.5} className="fill-slate-950" />
                  )}

                  {node.group !== "quote" && node.group !== "alternative" && (
                    <text
                      x={nx}
                      y={ny + node.size + 11}
                      textAnchor="middle"
                      className="text-[8px] font-bold fill-slate-500 group-hover:fill-slate-200 select-none pointer-events-none transition-colors"
                    >
                      {node.label.length > 15 ? `${node.label.slice(0, 12)}...` : node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 min-h-[240px] flex flex-col justify-between">
          {renderSidebarDetails()}
          
          {selectedNode && (
            <button 
              onClick={() => setSelectedNode(null)} 
              className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[9px] font-bold rounded-lg transition"
            >
              Reset Vector Scope
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

