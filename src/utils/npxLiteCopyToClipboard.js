const copyData=
    `export default function App(){
     
        const paragraphStyle = {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
          fontWeight: "500",
          padding: "0.75rem",
          marginTop: "1.25rem",
          fontSize: "1rem",
        };
        
        const getButtonStyle = (backgroundColor) => ({
          backgroundColor,
          borderRadius: "0.4rem",
          padding: "1rem 4rem",
          fontSize: "1rem",
          fontWeight: "500",
        });
        
        return (
          <div>
            <p style={paragraphStyle}>How was your experience using our product? Please rate your experience below.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginTop: '1.25rem' }}>
              <button style={getButtonStyle('#ef4444')}>Bad </button>
              <button style={getButtonStyle('#f59e0b')}>Average </button>
              <button style={getButtonStyle('#10b981')}>Excellent </button>
            </div>
          </div>
        );
      }`
export default copyData