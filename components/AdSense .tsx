// components/AdSense.js or in any Page Component

const AdSense = () => {
    return (
      <div>
        {/* Google AdSense Ad Block */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6950420118424082"  // Your AdSense Client ID
          data-ad-slot="your-ad-slot-id"  // Your AdSense Slot ID
          data-ad-format="auto"
        ></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    )
  }
  
  export default AdSense
  