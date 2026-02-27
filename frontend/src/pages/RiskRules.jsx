import React, { useState } from 'react';
import { Settings, Save, AlertTriangle } from 'lucide-react';

export default function RiskRules() {
    const [rules, setRules] = useState([
        { id: 'rule-001', name: 'Missing IRN', active: true, impact: 'HIGH', weight: 80 },
        { id: 'rule-002', name: 'Seller GSTR-1 Not Filed', active: true, impact: 'CRITICAL', weight: 90 },
        { id: 'rule-003', name: 'Tax Amount Mismatch (>5%)', active: true, impact: 'MEDIUM', weight: 40 },
        { id: 'rule-004', name: 'Late GSTR-3B Filing', active: false, impact: 'INACTIVE', weight: 20 },
        { id: 'rule-005', name: 'Circular Trading Pattern Detected', active: true, impact: 'CRITICAL', weight: 100 },
    ]);

    const toggleRule = (idx) => {
        const newRules = [...rules];
        newRules[idx].active = !newRules[idx].active;
        if (!newRules[idx].active) {
            newRules[idx].impact = 'INACTIVE';
        } else {
            // Restore default impacts based on previous logic or just hardcoded for demo
            if (newRules[idx].id === 'rule-004') newRules[idx].impact = 'LOW';
            if (newRules[idx].id === 'rule-001') newRules[idx].impact = 'HIGH';
        }
        setRules(newRules);
    };

    const handleWeightChange = (idx, val) => {
        const newRules = [...rules];
        newRules[idx].weight = val;
        setRules(newRules);
    };

    const getImpactStyle = (impact) => {
        switch (impact) {
            case 'CRITICAL': return { color: '#f85149', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.2)' };
            case 'HIGH': return { color: '#f85149', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.2)' };
            case 'MEDIUM': return { color: '#d29922', background: 'rgba(210, 153, 34, 0.1)', border: '1px solid rgba(210, 153, 34, 0.2)' };
            case 'INACTIVE': return { color: '#8b949e', background: 'rgba(139, 148, 158, 0.1)', border: '1px solid rgba(139, 148, 158, 0.2)' };
            default: return { color: '#2ea043', background: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46, 160, 67, 0.2)' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Risk Scoring Engine Configuration</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="badge medium" style={{ padding: '6px 12px', background: 'rgba(210, 153, 34, 0.1)', color: 'var(--warning-color)', border: '1px solid rgba(210, 153, 34, 0.2)' }}>SYSTEM STATUS: MONITORING</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a371f7, #58a6ff)' }}></div>
                </div>
            </div>

            {/* Main Card */}
            <div className="glass-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Settings size={20} /> Risk Engine Ruleset
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Configure the weights that the Model Engine and Agent use for categorization processing.
                        </p>
                    </div>
                    <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', background: '#58a6ff', color: '#000', borderRadius: '4px' }}>
                        <Save size={16} /> Save Configuration
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ background: 'rgba(210, 153, 34, 0.05)', border: '1px solid rgba(210, 153, 34, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '2rem' }}>
                        <AlertTriangle color="var(--warning-color)" size={20} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Changes to the ruleset will dynamically alter Graph Analytics metrics natively. Wait 5s for queue propagation.
                        </span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                <th style={{ padding: '1rem 0.5rem', width: '80px' }}>Active</th>
                                <th style={{ padding: '1rem 0.5rem' }}>Rule Name & Condition</th>
                                <th style={{ padding: '1rem 0.5rem', width: '200px' }}>Calculated Impact</th>
                                <th style={{ padding: '1rem 0.5rem', width: '250px' }}>Risk Weight (0-100)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((r, idx) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={r.active}
                                            onChange={() => toggleRule(idx)}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <div style={{ fontWeight: 500, color: r.active ? '#fff' : 'var(--text-secondary)' }}>{r.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Rule ID: {r.id}</div>
                                    </td>
                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <span style={{ ...getImpactStyle(r.impact), padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                            {r.impact}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', height: '70px' }}>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={r.weight}
                                            onChange={(e) => handleWeightChange(idx, e.target.value)}
                                            disabled={!r.active}
                                            style={{ flex: 1, accentColor: r.active ? 'var(--accent-color)' : 'gray', opacity: r.active ? 1 : 0.4 }}
                                        />
                                        <span style={{ width: '30px', color: r.active ? '#fff' : 'var(--text-secondary)', fontWeight: 500 }}>{r.weight}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
