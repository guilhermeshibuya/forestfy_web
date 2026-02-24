import type React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[2fr_1fr]">
      <section className='px-8 py-4 bg-[url("/forest-banner.jpg")] bg-no-repeat bg-cover bg-center h-screen w-full'>
        <div className="mx-auto pt-60 space-y-4">
          <h1 className="font-title-display text-7xl text-neutral-50">
            Forestfy
          </h1>
          <p className="text-neutral-200 max-w-[70ch]">
            Sistema para reconhecimento de espécies florestais de diferentes
            biomas, pensada para apoiar o trabalho dos fiscais, agilizando a
            verificação de espécies
          </p>
        </div>
      </section>
      <section className="pt-60 px-8">{children}</section>
    </div>
  )
}
