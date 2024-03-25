"use client"
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import React, { useEffect, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, SimulationNodeDatum } from 'd3-force';
import { LinePath, Circle } from '@visx/shape';

export const StationGraph = ({ data, width, height }: { data: OptimizedProfitTable, width: number, height: number}) => {
  interface Node {
    id: string;
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
  }

  interface Link {
    source: Node;
    target: Node;
    profit: number;
  }
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);


  interface MySimulationNode extends SimulationNodeDatum {
    id: string;
  }

  useEffect(() => {
    const simulationNodes = Object.keys(data).map(id => ({
      id,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const simulationLinks = Object.keys(data).flatMap(sourceId => {
      const target = data[sourceId][0];
      return {
        source: simulationNodes.find(d => d.id === sourceId) as MySimulationNode,
        target: simulationNodes.find(d => d.id === target.targetStationId) as MySimulationNode,
        profit: target.totalProfit,
      }
    });

    const simulation = forceSimulation<MySimulationNode, any>(simulationNodes)
      .force('link', forceLink(simulationLinks).id((d: any) => d.id as string))
      .force('charge', forceManyBody())
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        setNodes(simulation.nodes().map(d => ({ ...d })));
        setLinks(simulationLinks.map(d => ({ ...d })));
      });

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  useEffect(() => {
    console.log(nodes, links);
  }, [nodes, links]);

  return (
    <svg width={width} height={height}>
      {links.map((link, i) => (
        <line
          key={i}
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
          stroke="black"
          // strokeDasharray={link.dashed ? '8,4' : undefined}
        />
      ))}
      {nodes.map((node, i) => (
        <circle key={i} cx={node.x} cy={node.y} r={5} fill={"red"} />
      ))}
    </svg>
  );
};

export default StationGraph;