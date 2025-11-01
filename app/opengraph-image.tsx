import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'OG Meta Previewer - Preview your social media cards'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          OG Meta Previewer
        </div>
        <div
          style={{
            fontSize: 40,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          Preview how your URLs appear across social platforms
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
