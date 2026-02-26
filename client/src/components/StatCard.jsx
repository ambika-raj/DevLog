const StatCard = ({ title, value, icon, color = '#00C9A7', subtitle }) => {
  return (
    <div style={{
      padding: '24px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      transition: 'all 0.3s ease',
      cursor: 'default',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}33`
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}15`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Glow dot */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '11px',
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', color: color
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        fontSize: '2rem', fontWeight: '800',
        color: '#e2e8f0', fontFamily: 'Syne, sans-serif',
        marginBottom: '4px', lineHeight: '1'
      }}>
        {value}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500', marginBottom: subtitle ? '4px' : '0' }}>
        {title}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: color, fontWeight: '500' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default StatCard