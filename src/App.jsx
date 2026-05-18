import { useEffect, useMemo, useState } from 'react'
import PokemonCard from './components/pokemonCard'
import PaymentForm from './components/paymentForm'

const POKEMON_API = 'https://pokeapi.co/api/v2/pokemon?limit=36'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPokemons() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(POKEMON_API)
        if (!response.ok) throw new Error('No se pudo obtener la lista de Pokémon')

        const data = await response.json()
        const details = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url)
            if (!detailResponse.ok) throw new Error('Error cargando detalles')
            return detailResponse.json()
          }),
        )

        setPokemons(details)
      } catch (err) {
        setError('Hubo un error cargando los Pokémon. Intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    loadPokemons()
  }, [])

  const filteredPokemons = useMemo(
    () => pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(search.toLowerCase())),
    [pokemons, search],
  )

  return (
    <div className="min-h-screen bg-yellow-100 text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-red-200/80 bg-yellow-200 p-6 shadow-xl shadow-red-200/60">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-red-700">Pokémon</p>
              <h1 className="text-4xl font-semibold tracking-tight text-red-950 sm:text-5xl">
                Galería de Pokémon
              </h1>
              <p className="max-w-2xl text-slate-700">
                Muestra una selección más amplia de Pokémon con colores inspirados en Pikachu y Charizard.
              </p>
            </div>

            <div className="w-full max-w-md rounded-[1.75rem] border border-red-200 bg-yellow-50 p-4 shadow-lg shadow-red-200/50">
              <label htmlFor="search" className="block text-sm font-medium text-red-700">
                Buscar Pokémon
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm shadow-red-100">
                <input
                  id="search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Escribe un nombre..."
                  className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-500"
                />
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-700">
                  {filteredPokemons.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-lg shadow-slate-200/60">
            Cargando Pokémon...
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPokemons.length > 0 ? (
                filteredPokemons.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-lg shadow-slate-200/60">
                  No se encontró ningún Pokémon para esa búsqueda.
                </div>
              )}
            </div>

            <section className="mt-12 overflow-hidden rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-950 via-red-900 to-orange-700 p-6 shadow-2xl shadow-red-900/30">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-yellow-300">Pokemon pagos</p>
                  <h2 className="text-3xl font-semibold text-white">Paga tu compra segura</h2>
                  <p className="max-w-2xl text-yellow-200">
                    ¡Realiza tu compra al instante!
                  </p>
                </div>
                <div className="rounded-3xl border border-yellow-300/30 bg-yellow-50/10 px-5 py-4 text-center text-sm text-yellow-100">
                  <p className="font-semibold text-white">Total del carrito</p>
                  <p className="mt-2 text-3xl text-yellow-300">$19.90</p>
                </div>
              </div>

              <PaymentForm />
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default App
