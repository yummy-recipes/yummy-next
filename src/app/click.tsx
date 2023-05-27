'use client'

export default function Click({ children }: { children: React.ReactNode }) {
  return (
    <div onClick={() => console.log('SIEMA')}>{children}</div>
  )
}
