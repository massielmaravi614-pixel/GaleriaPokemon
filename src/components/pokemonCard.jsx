function PokemonCard({ pokemon }) {
  const image =
    pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name)

  return (
    <article className="overflow-hidden rounded-[2rem] border border-red-200 bg-yellow-50 p-6 shadow-lg shadow-red-200/70 transition-transform duration-300 hover:-translate-y-1 hover:border-red-400/60">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-red-600">#{pokemon.id.toString().padStart(3, '0')}</p>
          <h2 className="mt-3 text-2xl font-semibold text-red-950 capitalize">{pokemon.name}</h2>
        </div>
        <div className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-700">
          {types.join(' / ')}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        {image ? (
          <img src={image} alt={pokemon.name} className="h-40 w-40 object-contain" />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
            Imagen no disponible
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 text-red-700">
        <p>
          <span className="font-semibold text-red-950">Altura:</span> {(pokemon.height / 10).toFixed(1)} m
        </p>
        <p>
          <span className="font-semibold text-red-950">Peso:</span> {(pokemon.weight / 10).toFixed(1)} kg
        </p>
      </div>
    </article>
  )
}

export default PokemonCard
