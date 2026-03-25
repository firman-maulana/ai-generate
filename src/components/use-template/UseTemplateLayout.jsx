"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Sidebar from '@/components/chat/Sidebar'
import PromptPanel from './PromptPanel'
import TemplateContent from './TemplateContent'
import PostVideoModal from '@/components/explore/PostVideoModal'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function UseTemplateLayout() {
    const { id } = useParams()
    const { isDarkMode, toggleTheme } = useApp()
    const { data: session } = useSession()

    const [template, setTemplate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState(null)

    const [prompt, setPrompt] = useState('')
    const [images, setImages] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedVideo, setGeneratedVideo] = useState(null)
    const [error, setError] = useState(null)
    const [results, setResults] = useState([])

    // Management state
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)
    const router = useRouter()

    useEffect(() => {
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

        const fetchResults = async () => {
            if (!session?.user?.email) return
            try {
                const res = await fetch(`http://localhost:8000/result-videos/${id}`, {
                    headers: { 'X-User-Email': session.user.email }
                })
                if (res.ok) {
                    const data = await res.json()
                    setResults(data)
                    const latestAi = [...data].reverse().find(r => r.role === 'ai' && r.video_url)
                    if (latestAi) setGeneratedVideo(latestAi.video_url)
                }
            } catch (err) {
                console.error("Failed to fetch results:", err)
            }
        }

        fetchTemplate()
        fetchResults()
    }, [id, session])

    const handleGenerate = async () => {
        if (!prompt.trim() || isGenerating) return
        setIsGenerating(true)
        setGeneratedVideo(null)
        setError(null)
        try {
            const referenceImage = images.find(img => img.isReference)?.url || null;
            const otherImages = images.filter(img => !img.isReference).map(img => img.url || img);

            const res = await fetch('http://localhost:8000/generate-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Email': session?.user?.email
                },
                body: JSON.stringify({
                    prompt,
                    input_video_url: template?.videoUrl,
                    image_url: otherImages[0] || null,
                    reference_image_url: referenceImage,
                    model: 'runway',
                    duration: 5
                })
            })
            const data = await res.json()
            if (res.ok) {
                setGeneratedVideo(data.video_url)
                setPrompt('')
                setImages([])
                // Refresh results
                const resHist = await fetch(`http://localhost:8000/result-videos/${id}`, {
                    headers: { 'X-User-Email': session?.user?.email }
                })
                if (resHist.ok) {
                    const histData = await resHist.json()
                    setResults(histData)
                }
            } else {
                throw new Error(data.detail || 'Gagal menghasilkan video')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDeleteVideo = async () => {
        if (!window.confirm("Are you sure you want to delete this video?")) return
        try {
            const response = await fetch(`http://localhost:8000/video-templates/${template.id}`, {
                method: "DELETE",
                headers: {
                    "X-User-Email": session?.user?.email
                }
            })
            if (response.ok) {
                router.push('/explore')
            } else {
                alert("Failed to delete video")
            }
        } catch (err) {
            console.error("❌ Delete error:", err)
        }
    }

    const handleEditVideo = () => {
        setEditingVideo(template)
        setIsPostModalOpen(true)
    }

    const refreshTemplate = async () => {
        try {
            const res = await fetch(`http://localhost:8000/video-templates/${id}`)
            if (res.ok) {
                const data = await res.json()
                setTemplate(data)
            }
        } catch (err) {
            console.error("Failed to refresh template:", err)
        }
    }

    const dark = isDarkMode
    const bg = dark ? '#0a0a0a' : '#ffffff'
    const textPrimary = dark ? '#ffffff' : '#0f172a'

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
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>{fetchError}</p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', height: '100vh', background: bg, overflow: 'hidden', color: textPrimary }}>
            {/* Sidebar (shared with Chat & Explore) */}
            <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* Prompt Panel */}
            <PromptPanel
                isDarkMode={isDarkMode}
                prompt={prompt}
                setPrompt={setPrompt}
                images={images}
                setImages={setImages}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
                results={results}
            />

            {/* Main Content: Title, Video, Download */}
            <TemplateContent
                template={template}
                isDarkMode={isDarkMode}
                isGenerating={isGenerating}
                generatedVideo={generatedVideo}
                error={error}
                onEdit={handleEditVideo}
                onDelete={handleDeleteVideo}
            />

            {/* Edit Video Modal */}
            <PostVideoModal
                isOpen={isPostModalOpen}
                onClose={() => {
                    setIsPostModalOpen(false)
                    setEditingVideo(null)
                }}
                isDarkMode={isDarkMode}
                editingVideo={editingVideo}
                onSuccess={refreshTemplate}
            />
        </div>
    )
}
