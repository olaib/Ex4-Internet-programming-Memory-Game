[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=9500876&assignment_repo_type=AssignmentRepo)
# The classic memory game
<hr>

<h1>Ola Ibrahim</h1>
<p>Email: <a href="mailto:olaib@edu.hac.ac.il">olaib@edu.hac.ac.il</a>

## Execution
<p>
The submission is to check the validation of the forms before starting the game,<br>The following conditions must be fulfilled:
</p>
<ul>
<li>for name we used the HTML validation ,name with/without capital letter is same</li>
<li>for setting form ,the multiplication of cols X rows must be even</li>
</ul>
<>high scores button to show the table of leaderboard, if empty so there is a message showing that.</p>
<p>After finishing filling out the forms, the game will start after clicking on play button <br>
Images are randomly initialized, hidden after clicking on two hidden images, the timer that is the DELAY will be activated and when it ends, 
the images will return to being UNFLIPPED, but if there were twins then they will remain FLIPPED, if the player won, then the next step is a 
page that shows the player's results, an abandon button to leave the game and return to the main page of the forms .</p>

<h2>Algorithm for shuffling the cards: Fisher–Yates</h2>

<p><b>The Fisher–Yates</b> shuffle is an in-place shuffle. That is, given a pre-initialized array, it shuffles the elements of the array in place,
rather than producing a shuffled copy of the array. This can be an advantage if the array to be shuffled is large.</p>

## Assumptions
<p>
  The site use bootstrap CDN therefore assumes an internet connection is available.
  Using closure to define namespaces - module/
</p>

## installation
Node.js and npm are required to install and run the server.<br>
```bash
    npm install
```

## run
Nodemon is used to run the server, so any changes to the code will be reflected immediately.
    
```bash
   npm start
```

