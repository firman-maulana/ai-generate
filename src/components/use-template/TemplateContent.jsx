import { Loader2, Download, Edit2, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function TemplateContent({ template, isDarkMode, isGenerating, generatedVideo, error, onEdit, onDelete }) {
    const { data: session } = useSession()
    const dark = isDarkMode
    const textPrimary = dark ? '#ffffff' : '#0f172a'
    const textSecondary = dark ? '#9ca3af' : '#64748b'
    const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'

    const isOwner = session?.user?.email === template?.userEmail

    const getAvatarColor = (name) => {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3',
            '#F3FF33', '#FF3385', '#8533FF', '#33FFB8', '#FFB833'
        ];
        let hash = 0;
        const str = name || "Anonymous";
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '48px', position: 'relative' }}>
            {/* 'Use template' label at the very top left of the whole main area */}
            <h1 style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '25px', 
                fontSize: '18px', 
                color: textPrimary, 
                fontWeight: 400,
                margin: 0
            }}>
                Use template
            </h1>

            {/* Creator Attribution + Management at the top right */}
            <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px' 
            }}>
                {/* Creator Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                        style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: 'white',
                            background: getAvatarColor(template?.user) 
                        }}
                    >
                        {(template?.user || "A").charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: textPrimary }}>
                        {template?.user || 'Anonymous'}
                    </span>
                </div>

                {/* Edit/Delete Buttons (Only for Owner) */}
                {isOwner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: `1px solid ${borderColor}`, paddingLeft: '16px' }}>
                        <button
                            onClick={onEdit}
                            title="Edit Template"
                            style={{
                                background: 'transparent', border: 'none', color: textSecondary, 
                                cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#3b82f6'
                                e.currentTarget.style.background = dark ? 'rgba(59,130,246,0.1)' : '#eff6ff'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = textSecondary
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            title="Delete Template"
                            style={{
                                background: 'transparent', border: 'none', color: textSecondary, 
                                cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#ef4444'
                                e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.1)' : '#fef2f2'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = textSecondary
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div style={{ width: '100%', maxWidth: '900px', padding: '48px 28px 0' }}>

                {/* Header — title/desc centered */}
                <div style={{ marginBottom: '17px', width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '7px', marginTop: '25px', color: textPrimary }}>
                            {template?.title}
                        </h1>
                        <p style={{ fontSize: '16px', color: textSecondary, lineHeight: 1.7, maxWidth: '700px', margin: '0 auto' }}>
                            {template?.description}
                        </p>
                    </div>
                </div>

                {/* Video Player — no fixed aspect ratio, removed shadow, reduced rounded corners */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#000',
                    border: `1px solid ${borderColor}`
                }}>
                    {isGenerating && (
                        <div style={{
                            position: 'absolute', inset: 0, zIndex: 10,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)'
                        }}>
                            <Loader2 size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                                Processing Frames
                            </p>
                        </div>
                    )}
                    <video
                        src={generatedVideo || template?.videoUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        controls
                        loop
                        playsInline
                    />
                </div>

                {/* Error */}
                {error && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`, borderRadius: '12px', color: '#ef4444', fontSize: '14px' }}>
                        {typeof error === 'object' ? JSON.stringify(error) : String(error)}
                    </div>
                )}

                {/* Download Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => {
                            const url = generatedVideo || template?.videoUrl
                            if (url) window.open(url, '_blank')
                        }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 36px', borderRadius: '12px',
                            background: '#3b82f6', color: '#fff', border: 'none',
                            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 24px rgba(59,130,246,0.35)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                    >
                        <Download size={18} />
                        Download
                    </button>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </main>
    )
}
