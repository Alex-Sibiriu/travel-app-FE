function HomeDescription() {
	return (
		<div className="text-justify max-w-[1200px] shadow-md shadow-zinc-800 h-fit font-bold bg-gradient-to-b from-orange-600 to-orange-400 p-8 rounded-2xl text-white">
			<div className="text-center pb-8">
				<h1 className="text-3xl pb-4">Travel App</h1>
				<p>
					Questo diario di viaggio è il compagno ideale per organizzare ogni tua
					avventura, una giornata alla volta. Qui puoi pianificare i tuoi
					viaggi, suddividerli in tappe giornaliere e tenere traccia dei tuoi
					progressi rispetto alla tabella di marcia.
				</p>
			</div>

			<article className="py-4 w-full lg:w-4/6 lg:ml-auto">
				<h2 className="italic pb-1 text-xl lg:text-end">Pianifica</h2>
				<p className="lg:text-end">
					Pianificare il tuo viaggio non è mai stato così semplice e divertente.
					Con il nostro diario di viaggio, puoi creare un itinerario
					dettagliato, aggiungi tutte le destinazioni che sogni di visitare, dai
					luoghi iconici ai tesori nascosti. Personalizza ogni giornata secondo
					i tuoi desideri e prepara tutto in anticipo per un'esperienza di
					viaggio senza stress e ricca di emozioni.
				</p>
			</article>

			<article className="py-4 w-full lg:w-4/6">
				<h2 className="text-xl pb-1 italic">Esplora</h2>
				<p>
					L'esplorazione è il cuore del viaggio. Durante il tuo viaggio, usa il
					diario per aggiornare le tue esperienze e scoperte in tempo reale.
					Scatta foto mozzafiato, prendi appunti dettagliati e conserva i
					ricordi di ogni tappa del tuo percorso.
				</p>
			</article>

			<article className="py-4 w-full lg:w-4/6 ml-auto">
				<h2 className="italic pb-1 text-xl lg:text-end">Monitora</h2>
				<p className="lg:text-end">
					Tieni sotto controllo il tuo viaggio in ogni momento. Con il nostro
					strumento di monitoraggio, puoi verificare i tuoi progressi rispetto
					al piano iniziale e apportare modifiche all’itinerario se necessario.
					Hai cambiato idea su una destinazione o hai scoperto un luogo nuovo
					che vuoi visitare? Nessun problema! Adatta il tuo percorso in base
					alle tue esigenze e alle tue nuove scoperte.
				</p>
			</article>
		</div>
	);
}

export default HomeDescription;
