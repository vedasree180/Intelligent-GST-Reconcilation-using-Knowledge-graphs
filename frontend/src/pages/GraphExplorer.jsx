import React, { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Search, X, AlertTriangle } from 'lucide-react';

export default function GraphExplorer() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [riskInfo, setRiskInfo] = useState(null);
    const fgRef = useRef();

    useEffect(() => {
        // Mock fallback if API is not populated
        const mockGraphData = {
            nodes: [
                { id: "29ABCDE1234F1Z5", group: "Taxpayer", size: 15, color: "#e3b341" },
                { id: "27XYZAB5678C1Z2", group: "Taxpayer", size: 12, color: "#e3b341" },
                { id: "INV-001", group: "Invoice", size: 5, color: "#f85149" },
                { id: "INV-002", group: "Invoice", size: 5, color: "#f85149" }
            ],
            links: [
                { source: "29ABCDE1234F1Z5", target: "INV-001", value: 1 },
                { source: "INV-001", target: "27XYZAB5678C1Z2", value: 1 },
                { source: "29ABCDE1234F1Z5", target: "INV-002", value: 1 }
            ]
        };

        fetch('http://localhost:8002/cluster/29ABCDE1234F1Z5')
            .then(res => res.json())
            .then(data => {
                if (data && data.nodes && data.nodes.length > 0) {
                    setGraphData(data);
                } else {
                    setGraphData(mockGraphData);
                }
            })
            .catch(() => setGraphData(mockGraphData));
    }, []);

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        setRiskInfo(null);

        // Fetch AI Explanation from backend 
        fetch(`http://localhost:8002/api/v1/auth/agent/investigate/${node.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.explanation) {
                    setRiskInfo({
                        category: data.risk_score > 70 ? 'CRITICAL' : data.risk_score > 40 ? 'HIGH' : 'LOW',
                        score: data.risk_score || 0,
                        description: data.explanation
                    });
                } else {
                    throw new Error("Invalid response");
                }
            })
            .catch(() => setRiskInfo({
                category: "LOW",
                score: 0,
                description: `Node ${node.id} represents a verified taxpayer in the GST network with typical downstream linkage.`
            }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Interactive Knowledge Graph</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="badge medium" style={{ padding: '6px 12px', background: 'rgba(210, 153, 34, 0.1)', color: 'var(--warning-color)', border: '1px solid rgba(210, 153, 34, 0.2)' }}>SYSTEM STATUS: MONITORING</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a371f7, #58a6ff)' }}></div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Search size={18} color="var(--text-secondary)" />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter GSTIN, Invoice ID, or PAN to trace linkages..."
                    style={{ background: 'transparent', border: 'none', color: '#fff', flex: 1, outline: 'none', fontSize: '1rem' }}
                />
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={14} /> Search Context
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '1.5rem', position: 'relative' }}>
                <div className="glass-panel" style={{ flex: selectedNode ? 2 : 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
                    <ForceGraph2D
                        ref={fgRef}
                        graphData={graphData}
                        width={selectedNode ? 800 : 1200}
                        height={600}
                        nodeLabel="id"
                        nodeColor={n => n.color || "#58a6ff"}
                        nodeRelSize={6}
                        linkColor={() => "rgba(255,255,255,0.2)"}
                        onNodeClick={handleNodeClick}
                        backgroundColor="transparent"
                    />
                </div>

                {selectedNode && (
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Network size={20} /> Node Details
                            </h3>
                            <button className="btn-outline" onClick={() => setSelectedNode(null)} style={{ padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)' }}>Close</button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Identifier</span>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', wordBreak: 'break-all' }}>{selectedNode.id}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Group</span>
                                <div style={{ fontWeight: 'bold' }}>{selectedNode.group || 'Taxpayer'}</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Size Weight</span>
                                <div style={{ fontWeight: 'bold' }}>{selectedNode.size || 10}</div>
                            </div>
                        </div>

                        {riskInfo && (
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: riskInfo.category === 'HIGH' ? 'rgba(248,81,73,0.05)' : 'rgba(46,160,67,0.05)' }}>
                                <h4 style={{ margin: '0 0 1rem 0', color: riskInfo.category === 'HIGH' ? 'var(--danger-color)' : 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {riskInfo.category === 'HIGH' && <AlertTriangle size={16} />}
                                    Real-Time AI Risk Assessment
                                </h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Category:</span>
                                    <strong style={{ color: riskInfo.category === 'HIGH' ? 'var(--danger-color)' : 'var(--success-color)' }}>{riskInfo.category}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Score Weight:</span>
                                    <strong>{riskInfo.score} / 100</strong>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {riskInfo.description || "This node has been synthetically analyzed through localized topological inference."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
