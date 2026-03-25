"use client"
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Image as ImageIcon, ArrowUp, Trash2, ArrowLeft, Loader2, Sparkles as Sparkle } from 'lucide-react'
import { useSession } from 'next-auth/react'

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

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function PromptPanel({ isDarkMode, prompt, setPrompt, images, setImages, isGenerating, onGenerate, results = [] }) {
    const router = useRouter()
    const { data: session } = useSession()
    const fileInputRef = useRef(null)
    const chatEndRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [results])

    const dark = isDarkMode
    const textPrimary = dark ? '#ffffff' : '#0f172a'
    const textSecondary = dark ? '#9ca3af' : '#64748b'
    const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
    const sidebarBg = dark ? '#0f0f0f' : '#f8fafc'

    // Same pill background as chat
    const pillBg = dark ? '#2a2a2d' : '#f1f5f9'
    const pillBorder = dark ? '#374151' : '#cbd5e1'

    // Prompt box frosted glass (same as chat bottom bar)
    const boxBg = dark ? 'rgba(26,26,28,0.92)' : 'rgba(255,255,255,0.92)'
    const boxBorder = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'

    // Send button same gradient as chat
    const isValidPrompt = prompt.trim().length >= 30
    const canSend = isValidPrompt && !isGenerating
    const sendBg = canSend
        ? 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)'
        : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
    const sendColor = canSend ? '#ffffff' : textSecondary

    const handleImageSelect = async (e) => {
        const files = Array.from(e.target.files)
        if (images.length + files.length > 3) {
            alert('Maksimal 3 foto')
            return
        }
        for (const file of files) {
            const formData = new FormData()
            formData.append('file', file)
            try {
                const res = await fetch('http://localhost:8000/upload-image', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()
                if (data.url) {
                    // Automatically mark the first image as reference if none exist
                    const isFirst = images.length === 0 && images.length + files.indexOf(file) === 0;
                    setImages(prev => [...prev, { 
                        url: data.url, 
                        preview: URL.createObjectURL(file),
                        isReference: isFirst 
                    }])
                }
            } catch (err) {
                console.error('Upload failed:', err)
            }
        }
        e.target.value = ''
    }

    const toggleReference = (idx) => {
        setImages(prev => prev.map((img, i) => ({
            ...img,
            isReference: i === idx
        })))
    }

    const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (canSend) onGenerate()
    }

    return (
        <aside style={{
            width: '380px',
            minWidth: '440px',
            display: 'flex',
            flexDirection: 'column',
            background: sidebarBg,
            borderRight: `1px solid ${borderColor}`,
            transition: 'all 0.3s ease',
            overflow: 'hidden'
        }}>
            {/* Top: Back Section (Persistent above greeting/chat) */}
            <div style={{ padding: '20px 20px 10px', flexShrink: 0 }}>
                <button
                    onClick={() => router.push('/explore')}
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: dark ? 'rgba(255,255,255,0.03)' : '#f1f5f9',
                        border: `1px solid ${borderColor}`,
                        color: textSecondary,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    title="Back to Explore"
                    onMouseEnter={e => {
                        e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
                        e.currentTarget.style.color = textPrimary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : '#f1f5f9';
                        e.currentTarget.style.color = textSecondary;
                    }}
                >
                    <ArrowLeft size={16} />
                </button>
            </div>

            {/* Chat Flow Area */}
            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px', 
                padding: '0 20px 20px' 
            }} className="no-scrollbar">
                {results.length === 0 ? (
                    /* Greeting */
                    <p style={{ fontSize: '17px', lineHeight: '1.65', color: textPrimary, marginTop: '10px' }}>
                        Hello, I'm Runway's creative assistant. I can create images and videos, ideate narratives, and more. What would you like to create?
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {results.map((res, idx) => {
                            const showDate = idx === 0 || formatDate(results[idx-1].date) !== formatDate(res.date);
                            const isAi = res.role === 'ai';
                            
                            return (
                                <div key={res.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {showDate && (
                                        <div style={{ 
                                            textAlign: 'center', 
                                            fontSize: '11px', 
                                            color: textSecondary, 
                                            margin: '10px 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {formatDate(res.date)}
                                        </div>
                                    )}
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '12px', 
                                        flexDirection: 'row',
                                        alignItems: 'flex-start'
                                    }}>
                                        {/* Avatar */}
                                        <div style={{ flexShrink: 0 }}>
                                            {isAi ? (
                                                <div style={{ 
                                                    width: '24px', height: '24px', borderRadius: '50%', 
                                                    background: 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white'
                                                }}>
                                                    <Sparkle size={10} fill="currentColor" />
                                                </div>
                                            ) : (
                                                session?.user?.image ? (
                                                    <img 
                                                        src={session.user.image} 
                                                        alt="Profile" 
                                                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        width: '24px', height: '24px', borderRadius: '50%', 
                                                        background: getAvatarColor(session?.user?.name || session?.user?.email),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', fontSize: '10px', fontWeight: 'bold'
                                                    }}>
                                                        {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Bubble */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {!isAi ? (
                                                <div style={{ 
                                                    fontSize: '13px', 
                                                    lineHeight: '1.6', 
                                                    color: textPrimary,
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    {typeof res.prompt === 'string' ? res.prompt : 
                                                     (res.prompt?.prompt || res.prompt?.content || String(res.prompt || ""))}
                                                </div>
                                            ) : (
                                                <div style={{ 
                                                    padding: '10px', 
                                                    borderRadius: '12px', 
                                                    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                                                    border: `1px solid ${borderColor}`,
                                                    fontSize: '12px',
                                                    color: '#10b981',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                                    {typeof res.prompt === 'string' ? res.prompt : "Video generated successfully"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: borderColor, margin: '0 20px' }} />

            {/* Bottom: Prompt Box (Chat UI style) */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {/* Frosted glass card — exactly like chat bottom bar */}
                <div
                    className="flex flex-col gap-2 p-2.5 rounded-xl shadow-xl border transition-all"
                    style={{
                        background: boxBg,
                        borderColor: isFocused ? (dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.18)') : boxBorder,
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Prompt box — textarea on top, actions on bottom */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        {/* Textarea (top) — auto-grows as user types */}
                        <textarea
                            value={prompt}
                            onChange={e => {
                                setPrompt(e.target.value)
                                // Auto-resize: reset height first, then set to scrollHeight
                                e.target.style.height = 'auto'
                                e.target.style.height = e.target.scrollHeight + 'px'
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) } }}
                            placeholder={images.some(img => img.isReference) ? "Describe the edit (e.g. 'change face to this')..." : "Describe your idea..."}
                            className="bg-transparent text-[13px] font-medium outline-none resize-none w-full overflow-hidden"
                            rows={1}
                            style={{ color: textPrimary, caretColor: textPrimary, lineHeight: '1.6' }}
                        />

                        {/* Bottom row: image pill + send button */}
                        <div className="flex items-center justify-between">
                            {/* Image upload pill */}
                            <div className="flex gap-1 items-center p-1 shrink-0">
                                {images.length < 3 && (
                                    <label
                                        className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                                        title="Upload Image"
                                        style={{
                                            borderColor: pillBorder,
                                            color: textSecondary
                                        }}
                                    >
                                        <ImageIcon size={18} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}

                                {images.map((imgObj, index) => (
                                    <div
                                        key={index}
                                        className="relative shrink-0 group cursor-pointer"
                                        title={imgObj.isReference ? "Reference Image (Click to unmark)" : "Click to set as Reference"}
                                        onClick={(e) => {
                                            if (e.shiftKey) removeImage(index)
                                            else toggleReference(index)
                                        }}
                                    >
                                        <img
                                            src={imgObj.preview || imgObj.url || imgObj}
                                            alt={`Preview ${index + 1}`}
                                            className="w-8 h-8 rounded-lg object-cover transition-all"
                                            style={{ 
                                                border: imgObj.isReference 
                                                    ? `2px solid #624bfa` 
                                                    : `2px solid ${pillBorder}`,
                                                boxShadow: imgObj.isReference ? '0 0 8px rgba(98, 75, 250, 0.4)' : 'none'
                                            }}
                                        />
                                        {imgObj.isReference && (
                                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#624bfa] rounded-full flex items-center justify-center border border-white">
                                                <Sparkle size={6} color="white" fill="white" />
                                            </div>
                                        )}
                                        <div 
                                            className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                                        >
                                            <Trash2 size={12} style={{ color: '#ef4444' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Send button */}
                            <button
                                type="submit"
                                className="w-10 h-8 shrink-0 rounded-md flex items-center justify-center transition-colors shadow-sm"
                                style={{
                                    background: sendBg,
                                    color: sendColor,
                                    opacity: isGenerating ? 0.6 : 1,
                                    cursor: canSend ? 'pointer' : 'not-allowed'
                                }}
                                disabled={!canSend}
                            >
                                {isGenerating
                                    ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                    : <ArrowUp size={14} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </aside>
    )
}
