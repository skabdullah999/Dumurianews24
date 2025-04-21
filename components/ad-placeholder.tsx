interface AdPlaceholderProps {
  position: "top" | "bottom" | "sidebar"
  className?: string
}

export default function AdPlaceholder({ position, className = "" }: AdPlaceholderProps) {
  return (
    <div
      className={`bg-gray-200 border border-dashed border-gray-400 rounded-md flex items-center justify-center ${className}`}
      style={{
        height: position === "sidebar" ? "600px" : "120px",
        width: "100%",
      }}
    >
      <div className="text-center text-gray-500">
        <p className="font-medium">Adsterra Ad Space</p>
        <p className="text-sm">{position} position</p>
      </div>
    </div>
  )
}
