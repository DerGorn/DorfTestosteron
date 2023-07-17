# DorfTestosteron
Dorfromantik mit mehr Testosteron. Nachdem das Grundprinzip schlecht kopiert wurde, ist ein Multiplayer geplant.

Die Spieler arbeiten zusammmen an einer wunderschönen Landschaft. Felder, Wälder, Eisenbahnstrecken und Flüsse sind neutrale Gebilde. Dörfer gehören dem Spieler, der sie platziert. Sie projizieren einen Einflussbereich, der die Kontrolle über neutrale Gebilde übernimmt. Dadurch stehen dem Dorf Ressourcen zur Verfügung, die das Wachstum ihres Einflusses vorantreibt. Treffen sich Einflussbereiche verschiedener Spieler, drängt das dominantere Dorf das andere zurück. Dadurch kann die Kontrolle über das Dorf erlangt werden.

## Update 1
Die grundlegenen Spielmechaniken wurden implementiert. Es können zufällige Teile erstellt und auf einem unendlichen Feld beliebig rotiert platziert werden. 

Der nächste Schritt ist die verbesserung der Zufallsgenerierung. Es soll die Häufigkeit und Größe von Gleisen und Gewässern verringert werden. Zudem soll die Verteilung so angepasst werden, dass alle anderen Geländearten ähnlichoft vorkommen.
Danach steht die Verbesserung der Grafik an. Es sollen die Teile schöner dargestellt werden (eventuell mit Texturen) und am Rand angedeutet werden, wo Teile Platziert werden können.
Anschließend ist die Verfeinerung der Platzierungsregeln geplant - Gleise und Gewässer können nicht an andere Gelände angrenzen. (Implement an outerLinks on Tile, that holds Information about the edges of the neighbours)

## Update 2
Alle Punkte wurden mehr oder weniger ausführlich angegangen. Die Zufallsgenerierung bevorzugt nun alles was kein Gleis oder Gewässer ist. Mithilfe von Parametern kann nach weiteren Tests die genaue Häufigkeit angepasst werden. Auch ist die Anzahl Gleise/Gewässer auf einem Teil durchschnittlich kleiner als bei den anderen Gebieten.
Die Grafik wurde nicht allzu stark überarbeitet. Es wurden nur leere Teile entweder angedeutet oder rot gemalt, wenn dort das nächste Teil nicht platziert werden darf. Weiter Grafik arbeiten stehen noch auf dem Plan.
Die Platzierungsregeln für Gleise und Gewässer wurde implementiert. Sie können nur noch an entsprechendes gleiches Gelände angrenzend platziert werden.

Auf dem Plan stehen weiterhin Grafik arbeiten. Zusätzlich gilt es nun die Motivatoren aus dem Original zu kopieren. 
Das heißt ein Punkte System, wobei beim platzieren eines Teils jede passende Seite 10 Punkte bringt. Teile bei denen alle Seiten übereinstimmen bringen 60 extra Punkte, auch wenn sie bereits auf dem Spielfeld liegen.
Ein weiterer Punkt ist der Stapel mit einer begrenzten Anzahl an neuen Teilen, die platziert werden können. Um trotzdem einen endlosen Spaß zu ermöglichen gibt es Missionen, die Zufällig auf einem Teil erscheinen. Ihr Abschluss bringt neue Teile für den Stapel, Punkte und kann eine Fahne auf dem Teil erscheinen lassen.
Gebiete mit einer Fahne bringen Belohnungen, wenn das Gebiet abgeschlossen ist. Sprich keine Kante, des Gebiets mit der Fahne ohne Nachbarn ist. Die Belohnung sind wieder Punkte und neue Teile für den Stapel.