import { useEffect, useRef } from "react"

interface AdPlaceholderProps {
  position: "top" | "bottom" | "sidebar"
  className?: string
}

export default function AdPlaceholder({ position, className = "" }: AdPlaceholderProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (position === "bottom" && adRef.current) {
      const script1 = document.createElement("script")
      script1.type = "text/javascript"
      script1.innerHTML = `
        atOptions = {
          'key': '2ccfe20f4934f879f98c54fa781a1e26',
          'format': 'iframe',
          'height': 60,
          'width': 468,
          'params': {}
        };
      `
      const script2 = document.createElement("script")
      script2.type = "text/javascript"
      script2.src = "//www.highperformanceformat.com/2ccfe20f4934f879f98c54fa781a1e26/invoke.js"

      adRef.current.appendChild(script1)
      adRef.current.appendChild(script2)
    }
  }, [position])

  return (
    <div
      className={` border rounded-md flex items-center justify-center ${className}`}
      style={{
        height: position === "sidebar" ? "600px" : "120px",
        width: "100%",
      }}
    >
      {position === "bottom" ? (
        <div ref={adRef} className="w-full h-full flex items-center justify-center" />
      ) : (
        <div className="text-center text-gray-500">
          <p className="font-medium">Adsterra Ad Space</p>
          <p className="text-sm">{position} position</p>
        </div>
      )}
    </div>
  )
}
