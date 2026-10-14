import React from 'react'

const creditBlocks = [
  {
    label: 'Name credit for COESSING acronym',
    value: 'Anne Canavati, Erich Eberhard, Mark Finlay, Jessica Hicks, Liz Oliphant, Jayson Toweh',
  },
  {
    label: 'Design of original COESSING logo',
    value: 'Jessica Hicks',
  },
  {
    label: 'Design of current COESSING logo',
    value: 'Bosede Lydia Ogunwuyi',
  },
  {
    label: 'Social Media Team 2022–2025',
    value: 'Bosede Lydia Ogunwuyi, Stella Aseye Adika, Oluwabukola Babalola, Precious Akpan, Samuel Akpan, and Michael Ugom',
  },
  {
    label: 'Science Communication Team 2025–Current',
    value: 'Richmond Kennedy Quarcoo, Erudite Jones, Gabriel Quaynor, Michael Tsatsu Axolu, Bosede Lydia Ogunwuyi, Stella Aseye Adika',
  },
]

const Credits = () => {
  return (
    <div className="w-full py-12">
      <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creditBlocks.map((block) => (
          <div key={block.label} className="border border-white/20 bg-white/5 backdrop-blur-sm p-5">
            <p className="uppercase tracking-wide text-xs text-white/50 mb-2">{block.label}</p>
            <p className="text-white/90 leading-relaxed">{block.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
