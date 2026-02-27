import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Database, Upload } from 'lucide-react';

export default function DataIngestion() {
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('GSTR-1');
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [log, setLog] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setLog('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');
        setLog('Initiating secure transfer to AI ingestion engine...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', docType);

        try {
            const res = await fetch('http://localhost:8002/api/v1/auth/data', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Ingestion pipeline rejected the file format.');

            const data = await res.json();
            setStatus('success');
            setLog(`Success! Digested ${data.processed || data.total_records} records into the unified Knowledge Graph.`);
        } catch (err) {
            setStatus('error');
            setLog(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Data Ingestion & Processing</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="badge medium" style={{ padding: '6px 12px', background: 'rgba(210, 153, 34, 0.1)', color: 'var(--warning-color)', border: '1px solid rgba(210, 153, 34, 0.2)' }}>SYSTEM STATUS: MONITORING</span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a371f7, #58a6ff)' }}></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Database size={22} /> Ingestion Target
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Upload or paste batch GST network representations (e.g., GSTR-1, GSTR-2B or e-Way Bills) via JSON or CSV file. The files stream to the <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px', color: '#c9d1d9' }}>ingestion_service</code> and construct the Knowledge Graph dynamically.
                        </p>
                    </div>

                    <div style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Select Document Type</label>
                            <select
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--border-color)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    appearance: 'auto'
                                }}
                            >
                                <option value="GSTR-1">GSTR-1</option>
                                <option value="GSTR-2B">GSTR-2B</option>
                                <option value="GSTR-3B">GSTR-3B</option>
                                <option value="PURCHASE_REGISTER">Purchase Register</option>
                            </select>
                        </div>
                        <div
                            className="drop-zone"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.onchange = (e) => {
                                    if (e.target.files.length > 0) {
                                        setFile(e.target.files[0]);
                                        setStatus('idle');
                                        setLog('');
                                    }
                                };
                                input.click();
                            }}
                            style={{
                                border: '1px dashed var(--border-color)',
                                borderRadius: '12px',
                                padding: '4rem 2rem',
                                textAlign: 'center',
                                background: 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                ...(file ? { borderColor: 'var(--accent-color)', background: 'rgba(88, 166, 255, 0.05)' } : {})
                            }}
                        >
                            <FileText size={48} style={{ color: file ? 'var(--accent-color)' : 'var(--text-secondary)', marginBottom: '1rem' }} />

                            {file ? (
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{file.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                        Ready for ingestion. Click to change.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.1rem' }}>Drag & drop GST data files or Click to Browse</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Supports JSON and CSV formats</p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                className="btn"
                                disabled={!file || status === 'uploading'}
                                onClick={handleUpload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: (!file || status === 'uploading') ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6',
                                    color: '#fff',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: (!file || status === 'uploading') ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Upload size={18} /> {status === 'uploading' ? 'Processing Transfer...' : 'Traverse & Build Graph'}
                            </button>
                        </div>
                    </div>

                    {status !== 'idle' && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-color)', padding: '1.5rem 2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                                {status === 'error' ? <AlertCircle color="var(--danger-color)" size={18} /> : <CheckCircle2 color="var(--success-color)" size={18} />}
                                <strong style={{ color: status === 'error' ? 'var(--danger-color)' : 'var(--success-color)' }}>{status === 'error' ? 'Ingestion Failed' : 'System Logs'}</strong>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                {log}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
