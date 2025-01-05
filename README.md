# Heapsort-Exam

Heapsort visualisering til eksamen

- **GitHub:** [https://github.com/Jaes98/heapsort-Exam](https://github.com/Jaes98/heapsort-Exam)
- **GitHub Pages:** [https://jaes98.github.io/heapsort-Exam/](https://jaes98.github.io/heapsort-Exam/)

## Beskrivelse af Visualiseringen

I vores visualisering af heapsort vises det originale array, som vi gerne vil sortere, i kasserne under titlen “Original Array”. Nedenunder vises arrayet som bjælker, hvor højden af hver bjælke repræsenterer værdien af tallet.

Når vi trykker på startknappen, begynder processen. Programmet starter med at **heapify**, hvilket betyder, at arrayet bliver bygget om til at repræsentere et binært max-heap træ. I et max-heap træ er forældre-noderne altid større end deres børne-noder.

Derefter begynder programmet at flytte den største værdi op i træet. I visualiseringen betyder det, at bjælken bevæger sig mod venstre på rækken, indtil den største værdi når den yderste venstre position. Undervejs sammenlignes hver node med dens forældre- og børne-noder for at sikre, at forældre-noden altid er den største. Hvis nødvendigt byttes noderne, og processen kaldes rekursivt på den berørte del af træet. Dette sikrer, at hele træet opretholder heap-egenskaberne efter hver ændring.

Når den største værdi har nået den venstre side af rækken, bliver den sat til den sidste position i arrayet. Programmet fortsætter derefter med at bygge max-heap træet uden at inkludere det nu sorterede tal. Denne proces gentages, og efter hver iteration bliver arrayet mere og mere sorteret, indtil alle elementer er korrekt placeret, og arrayet er helt sorteret.

## Installation

1. Klon dette repository:

   ```bash
   git clone https://github.com/Jaes98/heapsort-Exam.git
