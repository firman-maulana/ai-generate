import { useState, useRef, useEffect } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function PostVideoModal({ isOpen, onClose, isDarkMode = true, editingVideo = null, onSuccess }) {
    const [videoFile, setVideoFile] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const videoInputRef = useRef(null)
    const { data: session } = useSession()
    const [error, setError] = useState(null)
    const [durationText, setDurationText] = useState("00:00")

    // Populate data if in edit mode
    useEffect(() => {
        if (editingVideo && isOpen) {
            setTitle(editingVideo.title || "")
            setDescription(editingVideo.description || "")
            setDurationText(editingVideo.duration || "00:00")
            setVideoPreview(editingVideo.videoUrl || null)
            setVideoFile(null) // New file is not selected yet
        } else if (!editingVideo && isOpen) {
            // Reset for new post
            setTitle("")
            setDescription("")
            setDurationText("00:00")
            setVideoPreview(null)
            setVideoFile(null)
        }
    }, [editingVideo, isOpen])

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file)
            const url = URL.createObjectURL(file)
            setVideoPreview(url)

            // Extract duration
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src)
                const duration = video.duration
                
                if (duration > 10.5) {
                    setError("Video must be 10 seconds or shorter.")
                    setVideoFile(null)
                    setVideoPreview(null)
                    setDurationText("00:00")
                    return
                }
                
                setError(null) // clear previous duration errors
                const minutes = Math.floor(duration / 60)
                const seconds = Math.floor(duration % 60)
                const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                setDurationText(formatted)
            }
            video.src = url
        }
    }

    const handleSubmit = async () => {
        const isEdit = !!editingVideo
        
        // Validation:
        // If new post: must have videoFile and title
        // If edit: must have title (videoFile is optional)
        if (!title.trim() || !session?.user?.email) return
        if (!isEdit && !videoFile) return

        setIsUploading(true)
        setError(null)

        const formData = new FormData()
        if (videoFile) {
            formData.append("file", videoFile)
            formData.append("duration", durationText)
        }
        formData.append("title", title)
        formData.append("description", description)

        try {
            const url = isEdit 
                ? `http://localhost:8000/video-templates/${editingVideo.id}`
                : "http://localhost:8000/video-templates"
            
            const method = isEdit ? "PUT" : "POST"

            const response = await fetch(url, {
                method: method,
                headers: {
                    "X-User-Email": session.user.email
                },
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || `Failed to ${isEdit ? 'update' : 'post'} video`)
            }

            const data = await response.json()
            console.log(`✅ Video ${isEdit ? 'updated' : 'posted'}:`, data)
            
            if (onSuccess) {
                onSuccess()
            } else {
                window.location.reload() 
            }
            handleClose()
        } catch (err) {
            console.error(`❌ ${isEdit ? 'Update' : 'Post'} error:`, err)
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        setVideoFile(null)
        setVideoPreview(null)
        setTitle("")
        setDescription("")
        setDurationText("00:00")
        onClose()
    }

    if (!isOpen) return null

    const bgOverlay = "rgba(0, 0, 0, 0.8)"
    const bgModal = isDarkMode ? "#1a1a1c" : "#ffffff"
    const bgInput = isDarkMode ? "#0f0f10" : "#f8fafc"
    const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
    const textPrimary = isDarkMode ? "#ffffff" : "#0f172a"
    const textSecondary = isDarkMode ? "#9ca3af" : "#64748b"

    const isEdit = !!editingVideo

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: bgOverlay }}
            onClick={handleClose}
        >
            <div 
                className="relative w-full max-w-3xl rounded-2xl shadow-2xl"
                style={{ background: bgModal }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 className="text-lg font-semibold" style={{ color: textPrimary }}>
                        {isEdit ? "Edit your artwork" : "Post your artwork for everyone to see"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-opacity-10"
                        style={{ 
                            background: "transparent",
                            color: textSecondary 
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent"
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    <div className="flex gap-6">
                        {/* Left Column - Video Upload */}
                        <div className="w-64 flex-shrink-0">
                            <label className="block text-xs font-medium mb-2" style={{ color: textPrimary }}>
                               Video
                            </label>
                            <div 
                                className="relative rounded-xl overflow-hidden cursor-pointer transition-all"
                                style={{ 
                                    background: bgInput,
                                    border: `2px dashed ${borderColor}`,
                                    aspectRatio: "9/9",
                                    height: "360px"
                                }}
                                onClick={() => videoInputRef.current?.click()}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = textSecondary}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = borderColor}
                            >
                                {videoPreview ? (
                                    <video 
                                        src={videoPreview} 
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div 
                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                            style={{ background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}
                                        >
                                            <Upload size={24} style={{ color: textSecondary }} />
                                        </div>
                                        <p className="text-xs font-medium px-4 text-center mt-2" style={{ color: textPrimary }}>
                                            Click to upload video
                                        </p>
                                        <p className="text-xs text-center px-4" style={{ color: textSecondary }}>
                                            (Max 10 seconds)
                                        </p>
                                    </div>
                                )}
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-medium mb-2" style={{ color: textPrimary }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Give your artwork an eye-catching name"
                                    className="w-full px-3 py-2.5 rounded-lg outline-none text-sm transition-all"
                                    style={{ 
                                        background: bgInput,
                                        border: `1px solid ${borderColor}`,
                                        color: textPrimary
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = textSecondary}
                                    onBlur={(e) => e.target.style.borderColor = borderColor}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium mb-2" style={{ color: textPrimary }}>
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Introduce your creation in a few words"
                                    maxLength={500}
                                    className="w-full px-3 py-2.5 rounded-lg outline-none text-sm resize-none transition-all"
                                    style={{ 
                                        background: bgInput,
                                        border: `1px solid ${borderColor}`,
                                        color: textPrimary,
                                        height: "165px"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = textSecondary}
                                    onBlur={(e) => e.target.style.borderColor = borderColor}
                                />
                                <div className="text-xs text-right mt-1.5" style={{ color: textSecondary }}>
                                    {description.length}/500
                                </div>
                            </div>

                            {error && (
                                <div className="text-xs text-red-500 mt-2">
                                    {error}
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={(!isEdit && !videoFile) || !title.trim() || isUploading || !!error}
                                className="self-end px-6 py-2 rounded-lg font-semibold text-sm transition-all mt-4 flex items-center gap-2"
                                style={{
                                    background: ((isEdit || videoFile) && title.trim() && description.trim() && !error)
                                        ? "linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)"
                                        : isDarkMode ? "#374151" : "#cbd5e1",
                                    color: ((isEdit || videoFile) && title.trim() && description.trim() && !error)
                                        ? "#ffffff"
                                        : textSecondary,
                                    cursor: ((isEdit || videoFile) && title.trim() && description.trim() && !isUploading && !error)
                                        ? "pointer"
                                        : "not-allowed",
                                    opacity: ((isEdit || videoFile) && title.trim() && description.trim() && !isUploading && !error) ? 1 : 0.6
                                }}
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={16} /> : (isEdit ? "Update" : "Post")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
