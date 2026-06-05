import CampaignForm from './CampaignForm'

function Locked() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-gray-500 text-sm">Agrega <code className="bg-white/10 px-1 rounded">?key=tu_clave</code> a la URL.</p>
    </div>
  )
}

export default async function CampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }> | { key?: string }
}) {
  const params      = searchParams instanceof Promise ? await searchParams : searchParams
  const expectedKey = process.env.DASHBOARD_KEY ?? 'magneto2025'
  if (params.key !== expectedKey) return <Locked/>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <header className="h-14 border-b border-white/[0.07] flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[#0a0a0a] text-xs" style={{ background: '#00d084' }}>V</div>
          <span className="font-black text-base tracking-tight" style={{ color: '#00d084' }}>VPlay</span>
        </div>
        <span className="text-gray-700">/</span>
        <a href={`/dashboard/revenue?key=${expectedKey}`} className="text-sm text-gray-400 hover:text-white transition-colors">Revenue</a>
        <span className="text-gray-700">/</span>
        <span className="text-sm font-semibold text-white">Nueva campaña</span>
        <div className="flex-1"/>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ff9500] flex items-center justify-center text-xs font-black">M</div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-[22px] font-black tracking-tight">Registrar campaña</h1>
            <p className="text-gray-500 text-sm mt-1">
              Agrega tu inversión publicitaria para ver el ROI real en el Revenue Dashboard.
            </p>
          </div>

          <CampaignForm dashKey={expectedKey}/>
        </div>
      </main>
    </div>
  )
}
