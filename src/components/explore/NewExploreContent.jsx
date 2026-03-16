"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, RectangleHorizontal, Clock, ArrowUp,
    Heart, X, Image as ImageIcon, Trash2, Download
} from "lucide-react"
import PostVideoModal from "./PostVideoModal"
import { useApp } from "@/contexts/AppContext"
import { useSession } from "next-auth/react"

export default function NewExploreContent({ isDarkMode = true }) {
    const [colCount, setColCount] = useState(5);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [promptText, setPromptText] = useState("");
    const [communityVideos, setCommunityVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();
    const imageInputRef = useRef(null);
    const [typedText, setTypedText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const promptBoxRef = useRef(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const router = useRouter();
    const [floatingPromptText, setFloatingPromptText] = useState("");
    const { isGenerating } = useApp();

    // New state for dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [selectedSettings, setSelectedSettings] = useState({})


    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.settings-dropdown')) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [activeDropdown])

    const handleExplorePromptSubmit = (text, images = []) => {
        if (!text || text.trim().length < 30 || isGenerating) return;
        localStorage.setItem('pendingPrompt', text);

        // Simpan flag bahwa ada gambar, bukan gambar itu sendiri (terlalu besar untuk localStorage)
        if (images.length > 0) {
            localStorage.setItem('pendingImagesFlag', 'true');
            // Simpan gambar ke sessionStorage yang lebih besar, atau gunakan IndexedDB
            // Untuk sementara, kita akan pass gambar via state saat navigate
            sessionStorage.setItem('pendingImages', JSON.stringify(images));
        } else {
            localStorage.removeItem('pendingImagesFlag');
            sessionStorage.removeItem('pendingImages');
        }
        router.push('/chat');
    };

    const texts = [
        "Start Creating With AI Video",
        "Turn Ideas Into Stunning Videos",
        "Generate Videos Instantly With AI"
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateCols = () => {
            if (window.innerWidth < 768) setColCount(2);
            else if (window.innerWidth < 1024) setColCount(3);
            else if (window.innerWidth < 1280) setColCount(4);
            else setColCount(5);
        };

        updateCols();
        window.addEventListener('resize', updateCols);
        return () => window.removeEventListener('resize', updateCols);
    }, []);

    useEffect(() => {
        const fetchVideoTemplates = async () => {
            try {
                const response = await fetch("http://localhost:8000/video-templates");
                if (response.ok) {
                    const data = await response.json();
                    setCommunityVideos(data);
                }
            } catch (err) {
                console.error("❌ Failed to fetch video templates:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideoTemplates();
    }, []);

    // Typing effect
    useEffect(() => {
        const currentText = texts[textIndex];
        const typingSpeed = isDeleting ? 50 : 100;
        const pauseTime = isDeleting ? 500 : 2000;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (typedText.length < currentText.length) {
                    setTypedText(currentText.slice(0, typedText.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                // Deleting
                if (typedText.length > 0) {
                    setTypedText(currentText.slice(0, typedText.length - 1));
                } else {
                    // Move to next text
                    setIsDeleting(false);
                    setTextIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [typedText, isDeleting, textIndex, texts]);

    const handleImageClick = () => {
        if (uploadedImages.length < 3) {
            imageInputRef.current?.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file && uploadedImages.length < 3) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImages(prev => [...prev, event.target?.result]);
            };
            reader.readAsDataURL(file);
            // Reset input untuk bisa upload file yang sama lagi
            e.target.value = '';
        }
    };

    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };


    // Combine hardcoded and community videos
    const allVideos = [...communityVideos];

    const columns = Array.from({ length: colCount }, () => []);
    allVideos.forEach((video, index) => {
        columns[index % colCount].push(video);
    });

    // Theme colors
    const bgMain = isDarkMode ? "#0a0a0a" : "#f8fafc";
    const bgBox = isDarkMode ? "#1a1a1c" : "#ffffff";
    const borderBox = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)";
    const textPrimary = isDarkMode ? "#ffffff" : "#0f172a";
    const textSecondary = isDarkMode ? "#9ca3af" : "#64748b";
    const textPlaceholder = isDarkMode ? "#6b7280" : "#94a3b8";
    const borderDashed = isDarkMode ? "#374151" : "#cbd5e1";
    const borderDashedHover = isDarkMode ? "#6b7280" : "#94a3b8";
    const bgHover = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const bgButton = isDarkMode ? "#2a2a2d" : "#f1f5f9";
    const iconColor = isDarkMode ? "#9ca3af" : "#64748b";
    const iconColorHover = isDarkMode ? "#6b7280" : "#475569";
    const bgFloating = isDarkMode ? "rgba(26,26,28,0.9)" : "rgba(255,255,255,0.9)";
    const bgScrollButton = isDarkMode ? "rgba(26,26,28,0.9)" : "rgba(255,255,255,0.9)";

    const getAvatarColor = (name) => {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3',
            '#F3FF33', '#FF3385', '#8533FF', '#33FFB8', '#FFB833'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="flex-1 overflow-y-auto pb-40 relative" style={{ background: bgMain }}>
            {/* Top Header */}
            <div className="flex justify-center items-center mt-20 mb-10">
                <h1 className="text-[22px] font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                    {typedText.split(' ').map((word, index, array) => {
                        // Gradient style
                        const gradientStyle = {
                            background: 'linear-gradient(90deg, #624bfa 60%, #bd7ffa 70%, #65dcfc 40%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        };

                        // Text 1: "AI Video"
                        if (word === 'AI' && array[index + 1] === 'Video') {
                            return (
                                <span key={index} style={gradientStyle}>
                                    AI Video
                                </span>
                            );
                        } else if (word === 'Video' && array[index - 1] === 'AI') {
                            return null;
                        }

                        // Text 2: "Stunning Videos"
                        if (word === 'Stunning' && array[index + 1] === 'Videos') {
                            return (
                                <span key={index} style={gradientStyle}>
                                    Stunning Videos
                                </span>
                            );
                        } else if (word === 'Videos' && array[index - 1] === 'Stunning') {
                            return null;
                        }

                        // Text 3: "Instantly" and "AI"
                        if (word === 'Instantly' || (word === 'AI' && array[index - 1] === 'With')) {
                            return (
                                <span key={index} style={gradientStyle}>
                                    {word}{' '}
                                </span>
                            );
                        }

                        return <span key={index}>{word} </span>;
                    })}
                </h1>
            </div>

            {/* Main Prompt Box */}
            <div ref={promptBoxRef} className="relative max-w-[800px] mx-auto px-8 mb-10" style={{ zIndex: 20 }}>
                <div className="rounded-2xl p-5 shadow-lg" style={{ background: bgBox, border: `1px solid ${borderBox}` }}>
                    <div className="flex flex-wrap gap-2 items-start mb-4">
                        {/* Tool Buttons */}
                        {uploadedImages.length < 3 && (
                            <label
                                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all shrink-0"
                                style={{ background: bgButton, color: iconColor }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = bgHover;
                                    e.currentTarget.style.color = iconColorHover;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = bgButton;
                                    e.currentTarget.style.color = iconColor;
                                }}
                                title="Upload Image"
                            >
                                <ImageIcon size={20} />
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {/* Image Previews */}
                        {uploadedImages.map((image, index) => (
                            <div
                                key={index}
                                className="relative shrink-0 group cursor-pointer"
                                onClick={() => removeImage(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="w-10 h-10 rounded-lg object-cover transition-all"
                                    style={{ border: `2px solid ${borderBox}` }}
                                />
                                <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Trash2 size={16} style={{ color: '#ef4444' }} />
                                </div>
                            </div>
                        ))}

                        {/* Textarea - will wrap next to images or below if text is long */}
                        <textarea
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            className="flex-1 min-w-[200px] bg-transparent resize-none outline-none min-h-[40px] max-h-[120px] text-lg font-medium py-2"
                            placeholder={uploadedImages.length > 0 ? "Describe how you want to animate these images..." : "Describe the video you're imagining"}
                            style={{ color: textPrimary, caretColor: textPrimary }}
                            onFocus={(e) => e.target.style.color = textPrimary}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleExplorePromptSubmit(promptText, uploadedImages);
                                }
                            }}
                            rows={1}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-6 relative">
                        <div className="flex items-center gap-2 flex-wrap">

                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <button
                                onClick={() => handleExplorePromptSubmit(promptText, uploadedImages)}
                                className="rounded-full flex items-center justify-center transition-all"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    background: (promptText.trim().length >= 30 && !isGenerating)
                                        ? 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)'
                                        : bgHover,
                                    color: (promptText.trim().length >= 30 && !isGenerating) ? '#ffffff' : textSecondary,
                                    cursor: (promptText.trim().length >= 30 && !isGenerating) ? 'pointer' : 'not-allowed',
                                    opacity: isGenerating ? 0.6 : 1
                                }}
                                disabled={isGenerating || promptText.trim().length < 30}
                                onMouseEnter={(e) => {
                                    if (promptText.trim().length < 30 || isGenerating) {
                                        e.currentTarget.style.background = bgButton;
                                        e.currentTarget.style.color = textPrimary;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (promptText.trim().length < 30 || isGenerating) {
                                        e.currentTarget.style.background = bgHover;
                                        e.currentTarget.style.color = textSecondary;
                                    }
                                }}
                            >
                                <ArrowUp size={19} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Grid */}
            <div className="w-full mx-auto pb-8">
                <div className="flex items-center justify-between mb-8 px-4 lg:px-8 max-w-[1200px] mx-auto">
                    <div className="flex gap-4">
                        <button className="font-semibold text-base px-2" style={{ color: textPrimary }}>Collection of videos</button>
                    </div>
                    <button
                        className="flex items-center gap-2 font-semibold text-base transition-colors px-2 outline-none border-none"
                        style={{ color: textPrimary }}
                        onClick={() => {
                            if (!session) {
                                router.push("/signin");
                            } else {
                                setIsPostModalOpen(true);
                            }
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#00e5ff"}
                        onMouseLeave={(e) => e.currentTarget.style.color = textPrimary}
                    >
                        <Plus size={18} /> Post video
                    </button>
                </div>

                <div className="max-w-[1600px] mx-auto flex gap-4 px-4 w-full">
                    {columns.map((colVideos, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-4 flex-1 min-w-0">
                            {colVideos.map((video) => (
                                <div key={video.id} className="group relative overflow-hidden cursor-pointer transition-all duration-300 shadow-sm outline-none bg-black rounded-lg">
                                    <video
                                        src={video.videoUrl}
                                        className="w-full h-auto block object-contain"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.muted = false;
                                            e.currentTarget.play();
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.muted = true;
                                            e.currentTarget.currentTime = 0;
                                        }}
                                        muted
                                        loop
                                        playsInline
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                    {/* Top right - Duration */}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        {video.duration}
                                    </div>

                                    {/* Bottom bar */}
                                    <div className="absolute bottom-3 left-0 w-full flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">

                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-4 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                                                style={{ background: getAvatarColor(video.user) }}
                                            >
                                                {video.user.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white text-sm font-medium">{video.user}</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-white">
                                            <Heart size={14} className="fill-white" />
                                            <span className="text-sm font-semibold">{video.likes || 0}</span>
                                        </div>

                                    </div>

                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Post Video Modal */}
            <PostVideoModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    )
}
