"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Compass, Sun, Moon, LogOut, User } from "lucide-react"

// Custom Sparkle Icon (Outline)
const SparkleIcon = ({ size = 24, filled = false, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {filled ? (
      <path 
        d="M13.338 2.262c-.556-1.095-2.12-1.095-2.676 0l-.945 1.864a12.727 12.727 0 0 1-5.591 5.59l-1.864.946c-1.095.556-1.095 2.12 0 2.676l1.864.945a12.727 12.727 0 0 1 5.59 5.591l.946 1.864c.556 1.095 2.12 1.095 2.676 0l.945-1.864a12.728 12.728 0 0 1 5.591-5.59l1.864-.946c1.095-.556 1.095-2.12 0-2.676l-1.864-.945a12.728 12.728 0 0 1-5.59-5.591l-.946-1.864Z" 
        fill="currentColor"
      />
    ) : (
      <path 
        d="m12 4.046-.5.985a14.727 14.727 0 0 1-6.47 6.47L4.047 12l.985.5a14.728 14.728 0 0 1 6.47 6.47l.5.984.499-.985a14.727 14.727 0 0 1 6.47-6.47l.984-.499-.985-.5a14.727 14.727 0 0 1-6.47-6.47l-.5-.983Zm1.338-1.784c-.556-1.095-2.12-1.095-2.676 0l-.945 1.864a12.727 12.727 0 0 1-5.591 5.59l-1.864.946c-1.095.556-1.095 2.12 0 2.676l1.864.945a12.727 12.727 0 0 1 5.59 5.591l.946 1.864c.556 1.095 2.12 1.095 2.676 0l.945-1.864a12.728 12.728 0 0 1 5.591-5.59l1.864-.946c1.095-.556 1.095-2.12 0-2.676l-1.864-.945a12.728 12.728 0 0 1-5.59-5.591l-.946-1.864Z" 
        clipRule="evenodd" 
        fillRule="evenodd" 
        fill="currentColor"
      />
    )}
  </svg>
)

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

export default function Sidebar({ isDarkMode, toggleTheme }) {
  const router = useRouter()
  const { data: session } = useSession()

  const handleExplore = () => {
    router.push("/explore")
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const getStyles = (isDark) => ({
    sidebar: {
      width: "80px",
      background: isDark ? "#0a0a0a" : "#ffffff",
      borderRight: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
      color: isDark ? "white" : "#0f172a",
      padding: "20px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100vh",
      overflow: "hidden",
      transition: "all 0.3s ease"
    },
    iconButton: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      border: "none",
      background: "transparent",
      color: isDark ? "white" : "#0f172a",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      fontSize: "24px"
    },
    iconButtonHover: {
      background: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.05)"
    },
    topSection: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "center"
    },
    bottomSection: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "center"
    },
    profileImage: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      objectFit: "cover"
    }
  })

  const styles = getStyles(isDarkMode)

  return (
    <div style={styles.sidebar}>
      <div style={styles.topSection}>
        {/* Explore */}
        <button 
          style={styles.iconButton}
          onClick={handleExplore}
          title="Explore"
          onMouseEnter={(e) => e.currentTarget.style.background = styles.iconButtonHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <Compass size={24} />
        </button>

        {/* Chat */}
        <button 
          style={styles.iconButton}
          onClick={() => router.push("/chat")}
          title="Chat"
          onMouseEnter={(e) => e.currentTarget.style.background = styles.iconButtonHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <SparkleIcon size={24} />
        </button>
      </div>

      <div style={styles.bottomSection}>
        {/* Profile */}
        <button
          style={styles.iconButton}
          title={session?.user?.name || session?.user?.email || "Profile"}
          onMouseEnter={(e) => e.currentTarget.style.background = styles.iconButtonHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              style={styles.profileImage}
            />
          ) : (
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: getAvatarColor(session?.user?.name || session?.user?.email) }}
            >
              {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          style={styles.iconButton}
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onMouseEnter={(e) => e.currentTarget.style.background = styles.iconButtonHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Sign Out */}
        <button 
          style={styles.iconButton}
          onClick={handleLogout}
          title="Sign Out"
          onMouseEnter={(e) => e.currentTarget.style.background = styles.iconButtonHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  )
}
