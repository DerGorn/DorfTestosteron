# DorfTestosteron
Dorfromantik mit mehr Testosteron. Nachdem das Grundprinzip schlecht kopiert wurde, ist ein Multiplayer geplant.

Die Spieler arbeiten zusammmen an einer wunderschönen Landschaft. Felder, Wälder, Eisenbahnstrecken und Flüsse sind neutrale Gebilde. Dörfer gehören dem Spieler, der sie platziert. Sie projizieren einen Einflussbereich, der die Kontrolle über neutrale Gebilde übernimmt. Dadurch stehen dem Dorf Ressourcen zur Verfügung, die das Wachstum ihres Einflusses vorantreibt. Treffen sich Einflussbereiche verschiedener Spieler, drängt das dominantere Dorf das andere zurück. Dadurch kann die Kontrolle über das Dorf erlangt werden.

## Update 1
Die grundlegenen Spielmechaniken wurden implementiert. Es können zufällige Teile erstellt und auf einem unendlichen Feld beliebig rotiert platziert werden. 

Der nächste Schritt ist die verbesserung der Zufallsgenerierung. Es soll die Häufigkeit und Größe von Gleisen und Gewässern verringert werden. Zudem soll die Verteilung so angepasst werden, dass alle anderen Geländearten ähnlichoft vorkommen.
Danach steht die Verbesserung der Grafik an. Es sollen die Teile schöner dargestellt werden (eventuell mit Texturen) und am Rand angedeutet werden, wo Teile Platziert werden können.
Anschließend ist die Verfeinerung der Platzierungsregeln geplant - Gleise und Gewässer können nicht an andere Gelände angrenzen. (Implement an outerLinks on Tile, that holds Information about the edges of the neighbours)