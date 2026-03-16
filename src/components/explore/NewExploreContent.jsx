"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, RectangleHorizontal, Clock, ArrowUp,
    Heart, X, Image as ImageIcon, Trash2, Download
} from "lucide-react"
import PostVideoModal from "./PostVideoModal"
import { useApp } from "@/contexts/AppContext"

export default function NewExploreContent({ isDarkMode = true }) {
    const [colCount, setColCount] = useState(5);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [promptText, setPromptText] = useState("");
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

    const videos = [
        {
            id: 1,
            title: "Raven Kingdom",
            user: "lepadphone",
            avatar: "https://i.pravatar.cc/150?u=1",
            likes: "3248",
            duration: "02:25",
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&h=800&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        {
            id: 2,
            title: "The True Love",
            user: "郭小...",
            avatar: "https://i.pravatar.cc/150?u=2",
            likes: "1494",
            duration: "01:01",
            thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600&h=1200&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        },
        {
            id: 3,
            title: "Time Prison",
            user: "Wildpusa",
            avatar: "https://i.pravatar.cc/150?u=3",
            likes: "724",
            duration: "01:47",
            thumbnail: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&h=600&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        },
        {
            id: 4,
            title: "The Plan B",
            user: "HS Chou",
            avatar: "https://i.pravatar.cc/150?u=4",
            likes: "1406",
            duration: "01:00",
            thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&h=900&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        },
        {
            id: 5,
            title: "Confession",
            user: "user3316...",
            avatar: "https://i.pravatar.cc/150?u=5",
            likes: "1469",
            duration: "00:47",
            thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&h=1000&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
        },
        {
            id: 6,
            title: "Monet's Garden",
            user: "龙...",
            avatar: "https://i.pravatar.cc/150?u=6",
            likes: "1268",
            duration: "00:57",
            thumbnail: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=600&h=700&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
        },
        {
            id: 7,
            title: "Starry Night",
            user: "painter",
            avatar: "https://i.pravatar.cc/150?u=7",
            likes: "2156",
            duration: "01:15",
            thumbnail: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=600&h=900&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
        },
        {
            id: 8,
            title: "Cyber City",
            user: "neon_vibes",
            avatar: "https://i.pravatar.cc/150?u=8",
            likes: "892",
            duration: "00:30",
            thumbnail: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=600&h=400&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        },
        {
            id: 9,
            title: "Deep Ocean",
            user: "diver_boy",
            avatar: "https://i.pravatar.cc/150?u=9",
            likes: "534",
            duration: "02:10",
            thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&h=1100&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
        },
        {
            id: 10,
            title: "Mountains",
            user: "hiker_x",
            avatar: "https://i.pravatar.cc/150?u=10",
            likes: "1892",
            duration: "01:45",
            thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&h=600&fit=crop",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        }
    ]

    const columns = Array.from({ length: colCount }, () => []);
    videos.forEach((video, index) => {
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
                        onClick={() => setIsPostModalOpen(true)}
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
                                    <img src={video.thumbnail} alt={video.user} className="w-full h-auto block object-cover transition-transform duration-500 hover:scale-105" />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                    {/* Top info (Duration) - Visible only on hover */}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        {video.duration}
                                    </div>

                                    {/* Bottom left - Username */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <img src={video.avatar} alt={video.user} className="w-6 h-6 rounded-full shadow-sm" />
                                        <span className="text-white text-xs font-medium">{video.user}</span>
                                    </div>

                                    {/* Bottom right - Likes */}
                                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <Heart size={14} className="text-white" />
                                        <span className="text-xs font-semibold">{video.likes}</span>
                                    </div>

                                    {/* Download Button - Top right */}
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                // Gunakan video URL yang sebenarnya, bukan thumbnail
                                                const videoUrl = video.videoUrl || video.thumbnail;
                                                
                                                // Fetch video sebagai blob
                                                const response = await fetch(videoUrl);
                                                const blob = await response.blob();
                                                
                                                // Buat URL dari blob
                                                const blobUrl = window.URL.createObjectURL(blob);
                                                
                                                // Download
                                                const link = document.createElement("a");
                                                link.href = blobUrl;
                                                link.download = `${video.title.replace(/\s+/g, '-')}.mp4`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                
                                                // Cleanup
                                                window.URL.revokeObjectURL(blobUrl);
                                            } catch (error) {
                                                console.error('Download failed:', error);
                                                alert('Failed to download video. Please try again.');
                                            }
                                        }}
                                        className="absolute top-3 left-3 bg-black/50 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                                        style={{ pointerEvents: "auto" }}
                                        title="Download Video"
                                    >
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="text-center py-16 text-sm font-medium" style={{ color: textSecondary }}>No more</div>
            </div>

            {/* Floating Bottom Prompt Box */}
            <div 
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-xl rounded-2xl p-2.5 w-[650px] flex items-center gap-3 shadow-2xl transition-all duration-300 z-20"
                style={{ background: bgFloating, border: `1px solid ${borderBox}` }}
                onMouseEnter={(e) => e.currentTarget.style.border = `1px solid ${borderDashedHover}`}
                onMouseLeave={(e) => e.currentTarget.style.border = `1px solid ${borderBox}`}
            >
                <div className="flex gap-1 items-center rounded-xl p-1 shrink-0" style={{ background: bgButton }}>
                    <div 
                        className="w-9 h-9 rounded-lg transition-colors flex flex-col items-center justify-center cursor-pointer border border-dashed"
                        style={{ background: bgButton, borderColor: borderDashed, color: iconColor }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = bgHover;
                            e.currentTarget.style.borderColor = borderDashedHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = bgButton;
                            e.currentTarget.style.borderColor = borderDashed;
                        }}
                    >
                        <Plus size={14} />
                    </div>
                    <span className="text-xs px-1" style={{ color: iconColor }}>=</span>
                    <div 
                        className="w-9 h-9 rounded-lg transition-colors flex flex-col items-center justify-center cursor-pointer border border-dashed"
                        style={{ background: bgButton, borderColor: borderDashed, color: iconColor }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = bgHover;
                            e.currentTarget.style.borderColor = borderDashedHover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = bgButton;
                            e.currentTarget.style.borderColor = borderDashed;
                        }}
                    >
                        <Plus size={14} />
                    </div>
                </div>
                <input
                    type="text"
                    value={floatingPromptText}
                    onChange={(e) => setFloatingPromptText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleExplorePromptSubmit(floatingPromptText);
                    }}
                    className="flex-1 bg-transparent text-[15px] font-medium outline-none px-2"
                    placeholder="Describe the video you're imagining"
                    style={{ color: textPrimary, caretColor: textPrimary }}
                />
                <button 
                    onClick={() => handleExplorePromptSubmit(floatingPromptText)}
                    className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    style={{ 
                        background: (floatingPromptText.trim().length >= 30 && !isGenerating)
                            ? 'linear-gradient(135deg, #624bfa 0%, #bd7ffa 100%)'
                            : bgHover, 
                        color: (floatingPromptText.trim().length >= 30 && !isGenerating) ? '#ffffff' : textSecondary,
                        cursor: (floatingPromptText.trim().length >= 30 && !isGenerating) ? 'pointer' : 'not-allowed',
                        opacity: isGenerating ? 0.6 : 1
                    }}
                    disabled={isGenerating || floatingPromptText.trim().length < 30}
                    onMouseEnter={(e) => {
                        if (floatingPromptText.trim().length >= 30 && !isGenerating) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <ArrowUp size={18} />
                </button>
            </div>

            {/* Scroll to Top Button */}
            <button 
                className="fixed bottom-8 right-8 w-11 h-11 rounded-2xl backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-2xl z-50 hover:scale-110"
                style={{ background: bgScrollButton, border: `1px solid ${borderBox}`, color: iconColor }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = bgButton;
                    e.currentTarget.style.color = textPrimary;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = bgScrollButton;
                    e.currentTarget.style.color = iconColor;
                }}
            >
                <ArrowUp size={20} />
            </button>

            {/* Post Video Modal */}
            <PostVideoModal 
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    )
}
