"use client"
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Download, Image as ImageIcon, ArrowLeft, UploadCloud, Trash2, Edit } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Sidebar from '@/components/chat/Sidebar'
import PostVideoModal from '@/components/explore/PostVideoModal'
import { useSession } from 'next-auth/react'

export default function UseTemplateLayout() {
    const { id } = useParams()
    const { isDarkMode, toggleTheme } = useApp()
    const { data: session } = useSession()
    const router = useRouter()

    const [template, setTemplate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState(null)

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedVideo, setGeneratedVideo] = useState(null)
    const [error, setError] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const fileInputRef = useRef(null)
    
    // Responsive state
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`http://localhost:8000/video-templates/${id}`)
            if (!res.ok) throw new Error('Template not found')
            const data = await res.json()
            setTemplate(data)
        } catch (err) {
            setFetchError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTemplate()
    }, [id])

    const handleDeleteTemplate = async () => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        try {
            const res = await fetch(`http://localhost:8000/video-templates/${id}`, {
                method: "DELETE",
                headers: { "X-User-Email": session?.user?.email || "" }
            });
            if (res.ok) {
                router.push("/explore");
            } else {
                const data = await res.json();
                throw new Error(data.detail || "Failed to delete template");
            }
        } catch (err) {
            console.error(err);
            alert("Delete failed: " + err.message);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
        e.target.value = '' // Reset input
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    const handleGenerate = async () => {
        if (!imageFile || isGenerating) return
        
        setIsGenerating(true)
        setGeneratedVideo(null)
        setError(null)
        
        try {
            // 1. Upload local image to Supabase
            const formData = new FormData()
            formData.append('file', imageFile)
            
            const uploadRes = await fetch("http://localhost:8000/upload-image", {
                method: "POST",
                headers: { "X-User-Email": session?.user?.email || '' },
                body: formData
            })
            
            if (!uploadRes.ok) throw new Error("Failed to upload character image")
            
            const uploadData = await uploadRes.json()
            const finalImageUrl = uploadData.url

            // 2. Call Generate API
            const res = await fetch('http://localhost:8000/generate-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Email': session?.user?.email
                },
                body: JSON.stringify({
                    prompt: "Animate character to match video", // Required by backend PromptRequest schema
                    input_video_url: template?.videoUrl,        // Source motion
                    image_url: finalImageUrl,                   // Target character
                    model: 'wan-video/wan-2.2-animate-replace', // Instruct backend to use Wan
                    duration: 5,
                    template_id: parseInt(id)
                })
            })
            
            const data = await res.json()
            if (res.ok && data.video_url) {
                setGeneratedVideo(data.video_url)
            } else {
                throw new Error(data.detail || data.error || 'Failed to generate video')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsGenerating(false)
        }
    }

    const dark = isDarkMode
    const bg = dark ? '#0a0a0a' : '#f8fafc'
    const panelBg = dark ? '#1a1a1c' : '#ffffff'
    const textPrimary = dark ? '#ffffff' : '#0f172a'
    const textSecondary = dark ? '#9ca3af' : '#64748b'
    const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', background: bg, alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (fetchError) {
        return (
            <div style={{ display: 'flex', height: '100vh', background: bg, color: textPrimary, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '18px', fontWeight: 600 }}>Template not found</p>
                <p style={{ color: textSecondary, fontSize: '14px' }}>{fetchError}</p>
                <button onClick={() => router.push('/explore')} style={{ marginTop: '16px', padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Back to Explore</button>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', height: '100vh', background: bg, overflow: 'hidden', color: textPrimary, flexDirection: windowWidth < 768 ? 'column' : 'row' }}>
            {windowWidth >= 768 && <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}

            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Header Navbar */}
                <div style={{ 
                    padding: windowWidth < 640 ? '16px' : '24px 32px', 
                    borderBottom: `1px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: windowWidth < 640 ? '8px' : '16px',
                    background: panelBg,
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => router.push('/explore')}
                        style={{
                            background: 'transparent', border: 'none', color: textSecondary, 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '14px', fontWeight: 500, transition: 'color 0.2s',
                            padding: '4px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = textPrimary}
                        onMouseLeave={e => e.currentTarget.style.color = textSecondary}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div style={{ height: '24px', width: '1px', background: borderColor }} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', minWidth: 0 }}>
                        <h1 style={{ fontSize: windowWidth < 640 ? '16px' : '18px', fontWeight: 600, margin: 0, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {template?.title || "Use Template"}
                        </h1>

                        {session?.user?.email && template?.userEmail === session?.user?.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    style={{
                                        background: 'transparent', border: 'none', color: textSecondary,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '13px', fontWeight: 500, padding: '6px 10px', borderRadius: '6px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = textPrimary; e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                    onMouseLeave={e => { e.currentTarget.style.color = textSecondary; e.currentTarget.style.background = 'transparent' }}
                                >
                                    <Edit size={16} />
                                    {windowWidth >= 640 && 'Edit'}
                                </button>
                                <button
                                    onClick={handleDeleteTemplate}
                                    style={{
                                        background: 'transparent', border: 'none', color: '#ef4444',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '13px', fontWeight: 500, padding: '6px 10px', borderRadius: '6px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.1)' : '#fef2f2' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                                >
                                    <Trash2 size={16} />
                                    {windowWidth >= 640 && 'Delete'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isEditModalOpen && (
                    <PostVideoModal 
                        isOpen={isEditModalOpen} 
                        onClose={() => setIsEditModalOpen(false)} 
                        isDarkMode={isDarkMode} 
                        editingVideo={template}
                        onSuccess={fetchTemplate}
                    />
                )}

                {/* Main Workspace - Responsive Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: windowWidth < 1024 ? '1fr' : 'minmax(300px, 1fr) minmax(400px, 1.2fr)', 
                    gap: windowWidth < 640 ? '16px' : '24px', 
                    padding: windowWidth < 640 ? '16px' : windowWidth < 1024 ? '24px' : '32px', 
                    maxWidth: '1600px', 
                    margin: '0 auto', 
                    width: '100%',
                    flex: 1
                }}>
                    
                    {/* LEFT COLUMN: Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Reference Video Panel */}
                        <div style={{ 
                            background: panelBg, 
                            borderRadius: '16px', 
                            padding: '20px', 
                            border: `1px solid ${borderColor}`,
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}>
                            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: textPrimary }}>
                                Reference Video
                            </h2>
                            <div style={{ 
                                width: '100%', 
                                aspectRatio: '16/9', 
                                background: '#000', 
                                borderRadius: '8px', 
                                overflow: 'hidden' 
                            }}>
                                <video 
                                    src={template?.videoUrl} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                    controls 
                                    playsInline 
                                    loop 
                                />
                            </div>
                            
                            {template?.description && (
                                <p style={{ fontSize: '14px', color: textPrimary, marginTop: '16px', lineHeight: 1.5, fontWeight: 500 }}>
                                    {template.description}
                                </p>
                            )}

                            <p style={{ fontSize: '13px', color: textSecondary, marginTop: template?.description ? '6px' : '12px', lineHeight: 1.5 }}>
                                The motion, lighting, and camera movement from this video will be applied to your character image.
                            </p>
                        </div>

                        {/* Character Upload Panel */}
                        <div style={{ 
                            background: panelBg, 
                            borderRadius: '16px', 
                            padding: '20px', 
                            border: `1px solid ${borderColor}`,
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: textPrimary }}>
                                Image
                            </h2>
                            
                            {!imagePreview ? (
                                <label style={{
                                    border: `2px dashed ${dark ? '#374151' : '#cbd5e1'}`,
                                    borderRadius: '12px', padding: '48px 20px', 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#624bfa';
                                    e.currentTarget.style.background = dark ? 'rgba(98,75,250,0.05)' : 'rgba(98,75,250,0.02)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = dark ? '#374151' : '#cbd5e1';
                                    e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)';
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: dark ? '#1e293b' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSecondary }}>
                                        <UploadCloud size={24} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontWeight: 500, margin: '0 0 4px', fontSize: '14px', color: textPrimary }}>Click or drag a photo here</p>
                                        <p style={{ fontSize: '12px', color: textSecondary, margin: 0 }}>PNG, JPG up to 5MB. Must contain 1 person.</p>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} ref={fileInputRef} />
                                </label>
                            ) : (
                                <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${borderColor}` }}>
                                    <img src={imagePreview} alt="Character Preview" style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', display: 'block', background: dark ? '#000' : '#f1f5f9' }} />
                                    
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={handleRemoveImage} 
                                            style={{ background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Run Action */}
                            <button
                                onClick={handleGenerate}
                                disabled={!imageFile || isGenerating}
                                style={{
                                    marginTop: '24px',
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: (!imageFile || isGenerating) ? (dark ? '#1e293b' : '#e2e8f0') : 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)',
                                    color: (!imageFile || isGenerating) ? textSecondary : '#fff',
                                    border: 'none',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: (!imageFile || isGenerating) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s',
                                    boxShadow: (!imageFile || isGenerating) ? 'none' : '0 4px 14px rgba(98,75,250,0.3)'
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        Running Wan2.2... (may take up to 2 mins)
                                    </>
                                ) : (
                                    <>
                                        Generate
                                    </>
                                )}
                            </button>
                            
                            {error && (
                                <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`, color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>Error:</span> {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Output Video */}
                    <div style={{ 
                        background: panelBg, 
                        borderRadius: '16px', 
                        padding: '24px', 
                        border: `1px solid ${borderColor}`,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '600px'
                    }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: textPrimary }}>
                            <span>Generated Result</span>
                            {generatedVideo && (
                                <span style={{ fontSize: '12px', fontWeight: 500, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                                    Completed
                                </span>
                            )}
                        </h2>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {!isGenerating && !generatedVideo && (
                                <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                                    <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '16px', color: textSecondary }} />
                                    <p style={{ margin: 0, fontSize: '14px', color: textSecondary }}>Upload a photo and click Generate to see the animated result here.</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ 
                                        width: '64px', height: '64px', borderRadius: '50%', 
                                        background: dark ? 'rgba(98,75,250,0.1)' : 'rgba(98,75,250,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Loader2 size={32} color="#624bfa" style={{ animation: 'spin 1.5s linear infinite' }} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: textPrimary }}>Processing Video...</h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: textSecondary }}>Extracting motion and applying character mapping via Wan2.2 Animate Replace.</p>
                                    </div>
                                </div>
                            )}

                            {generatedVideo && !isGenerating && (
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#000', border: `1px solid ${borderColor}`, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                        <video 
                                            src={generatedVideo} 
                                            controls 
                                            autoPlay
                                            loop 
                                            style={{ width: '100%', maxHeight: '600px', display: 'block' }} 
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={() => window.open(generatedVideo, '_blank')}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            background: '#3b82f6',
                                            color: '#fff',
                                            border: 'none',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                                    >
                                        <Download size={16} />
                                        Download Video
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
