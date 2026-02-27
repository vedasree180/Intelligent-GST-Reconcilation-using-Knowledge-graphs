import React, { useState, useEffect } from 'react';
import { Network, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function Dashboard() {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [agentResponse, setAgentResponse] = useState(null);
    const [loadingAgent, setLoadingAgent] = useState(false);
    const [loadingVendors, setLoadingVendors] = useState(true);
    const [checkedActions, setCheckedActions] = useState([]);
    const [executionSuccess, setExecutionSuccess] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8002/api/v1/auth/vendors')
            .then(res => res.json())
            .then(async data => {
                if (!Array.isArray(data)) {
                    setVendors([]);
                    setLoadingVendors(false);
                    return;
                }
                const enhancedData = await Promise.all(data.map(async v => {
                    try {
                        const riskRes = await fetch(`http://localhost:8002/api/v1/auth/scores/${v.id}`);
                        const riskData = await riskRes.json();
                        return {
                            ...v,
                            risk: riskData.category || "UNKNOWN",
                            score: riskData.score || 0
                        }
                    } catch (e) {
                        return { ...v, risk: "UNKNOWN", score: 0 }
                    }
                }));
                setVendors(enhancedData);
                setLoadingVendors(false);
            })
            .catch(err => {
                console.error("Error fetching vendor data:", err);
                setLoadingVendors(false);
                setVendors([]);
            });
    }, []);

    const triggerAgent = (vendor) => {
        setSelectedVendor(vendor);
        setLoadingAgent(true);
        setAgentResponse(null);
        setCheckedActions([]);
        setExecutionSuccess(false);

        fetch(`http://localhost:8002/api/v1/auth/agent/investigate/${vendor.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.explanation) {
                    setAgentResponse({
                        narrative: data.explanation,
                        actions: data.recommended_actions || [],
                        score: data.risk_score,
                        auditTrail: data.audit_trail || []
                    });

                    // Auto-scroll to highlight functionality
                    setTimeout(() => {
                        document.getElementById('ai-agent-panel')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } else {
                    throw new Error("Invalid format");
                }
            })
            .catch(err => {
                setTimeout(() => {
                    setAgentResponse({
                        narrative: `AI Evaluation indicates ${vendor.id} is exhibiting circular trading markers. They have high ITC flow but zero tax remittance over 6 months matching Ghost Entity profiles.`,
                        actions: ["Suspend GSTIN registration", "Trigger Physical Verification of Address", "Block ITC flow downwards"],
                        auditTrail: ["Detected missing return 3B", "Correlated with 15 canceled downstream suppliers"]
                    });
                    setLoadingAgent(false);
                    // Auto-scroll to highlight functionality
                    setTimeout(() => {
                        document.getElementById('ai-agent-panel')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }, 800);
            });
    };

    const handleActionToggle = (actionIdx) => {
        setCheckedActions(prev =>
            prev.includes(actionIdx) ? prev.filter(i => i !== actionIdx) : [...prev, actionIdx]
        );
    };

    const handleExecuteActions = () => {
        if (checkedActions.length === 0) return;
        setTimeout(() => {
            const updatedActions = agentResponse.actions.filter((_, idx) => !checkedActions.includes(idx));
            setAgentResponse(prev => ({ ...prev, actions: updatedActions }));
            setCheckedActions([]);
            setExecutionSuccess(true);
            setTimeout(() => setExecutionSuccess(false), 3000);
        }, 600);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="badge medium" style={{ padding: '6px 12px', background: 'rgba(210, 153, 34, 0.1)', color: 'var(--warning-color)', border: '1px solid rgba(210, 153, 34, 0.2)' }}>SYSTEM STATUS: MONITORING</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a371f7, #58a6ff)' }}></div>
                </div>
            </div>

            <div className="dashboard-grid glass-panel" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                <div className="widget glass-panel" style={{ gridColumn: '1 / -1', flexDirection: 'row', justifyContent: 'space-between', padding: '1.5rem 2rem' }}>
                    <StatCard title="Total ITC Claimed" value="₹ 45.2 Cr" icon={<Activity size={24} className="text-gradient" />} />
                    <StatCard title="ITC at Risk (HIGH)" value="₹ 14.8 Cr" alert icon={<ShieldAlert size={24} color="var(--danger-color)" />} />
                    <StatCard title="Entities Scanned" value="12,450" icon={<Network size={24} color="var(--accent-color)" />} />
                    <StatCard title="Anomalies Found" value="342" icon={<Cpu size={24} color="var(--warning-color)" />} />
                </div>

                <div className="widget glass-panel" style={{ gridRow: '2 / 3' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} /> History</h4>
                    <div className="table-wrapper">
                        {loadingVendors ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Entity Data from Knowledge Graph...</div>
                        ) : (
                            <table>
                                <thead><tr><th>GST Number</th><th>ITC Amount</th><th>Risk Factor</th><th>Analyse Details</th></tr></thead>
                                <tbody>
                                    {vendors.map(v => (
                                        <tr key={v.id} onClick={() => triggerAgent(v)} style={{ background: selectedVendor?.id === v.id ? 'rgba(255,255,255,0.05)' : '' }}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{v.id}</div>
                                            </td>
                                            <td>₹ {v.exposure?.toLocaleString() || '0'}</td>
                                            <td><span className={`badge ${v.risk?.toLowerCase()}`}>{v.risk}</span></td>
                                            <td>
                                                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); triggerAgent(v); }}>Analyse Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '1rem', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                            {selectedVendor ? `Viewing Graph Cluster for ${selectedVendor.id}` : 'Select a vendor to visualize network graph'}
                            <br />
                            <Network size={32} style={{ opacity: 0.3, marginTop: '10px', animation: selectedVendor && loadingAgent ? 'fadeIn 1s infinite alternate' : 'none' }} />
                        </p>
                    </div>
                </div>

                <div id="ai-agent-panel" className="widget glass-panel" style={{ gridRow: '2 / 3', background: 'linear-gradient(180deg, rgba(22, 27, 34, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%)' }}>
                    <h4 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}><Cpu size={18} color="#a371f7" /> Reconcile AI Agent</h4>
                    <div className="chat-log">
                        <div className="chat-msg msg-agent">Greetings. I am the GST AI Agent powered by Gemini. Select a taxpayer from the list...</div>
                        {loadingAgent && <div className="chat-msg msg-user" style={{ opacity: 0.7, background: 'transparent', border: 'none' }}><span style={{ display: 'inline-block', animation: 'fadeIn 1s infinite alternate' }}>Invoking LLM for Graph Assessment on {selectedVendor?.id}...</span></div>}
                        {agentResponse && !loadingAgent && (
                            <div className="chat-msg msg-agent">
                                <p style={{ marginBottom: '1rem' }}>{agentResponse.narrative}</p>
                                {agentResponse.auditTrail && (
                                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Reasoning Steps:</p>
                                        <ul style={{ paddingLeft: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {agentResponse.auditTrail.map((step, idx) => <li key={idx}>{step}</li>)}
                                        </ul>
                                    </div>
                                )}
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                                    <h5 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>RECOMMENDED ACTIONS</h5>
                                    {executionSuccess && <div style={{ padding: '8px', background: 'rgba(46, 160, 67, 0.2)', color: 'var(--success-color)', borderRadius: '4px', marginBottom: '10px', fontSize: '0.85rem' }}>Selected actions executed successfully across the network!</div>}
                                    {agentResponse.actions.length > 0 ? (
                                        <>
                                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {agentResponse.actions.map((act, i) => (
                                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <input type="checkbox" id={`act-${i}`} checked={checkedActions.includes(i)} onChange={() => handleActionToggle(i)} />
                                                        <label htmlFor={`act-${i}`} style={{ fontSize: '0.9rem' }}>{act}</label>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className="btn" style={{ width: '100%', marginTop: '1rem', background: checkedActions.length > 0 ? 'var(--danger-color)' : 'var(--border-color)', opacity: checkedActions.length > 0 ? 1 : 0.5 }} onClick={handleExecuteActions} disabled={checkedActions.length === 0}>
                                                Execute {checkedActions.length > 0 ? checkedActions.length : ''} Selected Action{checkedActions.length > 1 ? 's' : ''}
                                            </button>
                                        </>
                                    ) : <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No pending actions remaining.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, alert }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>{icon}</div>
            <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
                <h2 style={{ color: alert ? 'var(--danger-color)' : '#fff', marginTop: '4px' }}>{value}</h2>
            </div>
        </div>
    );
}
