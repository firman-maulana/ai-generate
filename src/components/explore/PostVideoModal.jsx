"use client"
import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"

export default function PostVideoModal({ isOpen, onClose, isDarkMode = true }) {
    const [videoFile, setVideoFile] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const videoInputRef = useRef(null)

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file)
            const url = URL.createObjectURL(file)
            setVideoPreview(url)
        }
    }

    const handleSubmit = () => {
        console.log({ videoFile, title, description })
        handleClose()
    }

    const handleClose = () => {
        setVideoFile(null)
        setVideoPreview(null)
        setTitle("")
        setDescription("")
        onClose()
    }

    if (!isOpen) return null

    const bgOverlay = "rgba(0, 0, 0, 0.8)"
    const bgModal = isDarkMode ? "#1a1a1c" : "#ffffff"
    const bgInput = isDarkMode ? "#0f0f10" : "#f8fafc"
    const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
    const textPrimary = isDarkMode ? "#ffffff" : "#0f172a"
    const textSecondary = isDarkMode ? "#9ca3af" : "#64748b"

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
                        Post your artwork for everyone to see
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
                                        <p className="text-xs font-medium px-4 text-center" style={{ color: textSecondary }}>
                                            Click to upload video
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

                            {/* Post Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!videoFile || !title.trim() || !description.trim()}
                                className="self-end w-20 py-1 rounded-lg font-semibold text-sm transition-all mt-4"
                                style={{
                                    background: (videoFile && title.trim() && description.trim())
                                        ? "linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)"
                                        : isDarkMode ? "#374151" : "#cbd5e1",
                                    color: (videoFile && title.trim() && description.trim())
                                        ? "#ffffff"
                                        : textSecondary,
                                    cursor: (videoFile && title.trim() && description.trim())
                                        ? "pointer"
                                        : "not-allowed",
                                    opacity: (videoFile && title.trim() && description.trim()) ? 1 : 0.6
                                }}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
