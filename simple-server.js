const http = require('http');

const gameHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>🎮 Crookmon Game</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f0f2f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        .card { border: 2px solid #333; border-radius: 8px; padding: 15px; margin: 10px; display: inline-block; cursor: pointer; min-width: 120px; background: white; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .btn { background: #007bff; color: white; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; margin: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 Crookmon Game</h1>
        <h2>✅ WORKING! Server Successfully Running!</h2>

        <h3>🃏 Click a card to battle:</h3>

        <div class="card" onclick="battle('Fire Dragon', 8, 6)">
            <div style="font-size: 40px;">🐉</div>
            <h4>Fire Dragon</h4>
            <div>⚔️ Attack: 8 | 🛡️ Defense: 6</div>
        </div>

        <div class="card" onclick="battle('Water Elemental', 6, 8)">
            <div style="font-size: 40px;">🌊</div>
            <h4>Water Elemental</h4>
            <div>⚔️ Attack: 6 | 🛡️ Defense: 8</div>
        </div>

        <div class="card" onclick="battle('Lightning Wolf', 7, 5)">
            <div style="font-size: 40px;">⚡</div>
            <h4>Lightning Wolf</h4>
            <div>⚔️ Attack: 7 | 🛡️ Defense: 5</div>
        </div>

        <div id="result" style="margin-top: 30px; font-size: 18px;"></div>
        <button class="btn" onclick="resetGame()">🔄 Reset Game</button>
    </div>

    <script>
        let playerHealth = 20;
        let aiHealth = 20;

        const aiCards = [
            {name: 'Shadow Assassin', attack: 10, defense: 3, emoji: '🥷'},
            {name: 'Earth Golem', attack: 5, defense: 9, emoji: '🗿'},
            {name: 'Wind Spirit', attack: 9, defense: 4, emoji: '💨'}
        ];

        function battle(playerCard, playerAttack, playerDefense) {
            const aiCard = aiCards[Math.floor(Math.random() * aiCards.length)];

            const playerDamage = Math.max(1, playerAttack - aiCard.defense);
            const aiDamage = Math.max(1, aiCard.attack - playerDefense);

            playerHealth -= aiDamage;
            aiHealth -= playerDamage;

            let result = '<h3>⚔️ Battle Results:</h3>';
            result += '<p>' + playerCard + ' attacks ' + aiCard.name + ' for ' + playerDamage + ' damage!</p>';
            result += '<p>' + aiCard.name + ' ' + aiCard.emoji + ' attacks back for ' + aiDamage + ' damage!</p>';
            result += '<p><strong>Your Health: ❤️ ' + Math.max(0, playerHealth) + ' | AI Health: ❤️ ' + Math.max(0, aiHealth) + '</strong></p>';

            if (playerHealth <= 0) {
                result += '<h2 style="color: red;">💀 You Lose!</h2>';
            } else if (aiHealth <= 0) {
                result += '<h2 style="color: green;">🎉 You Win!</h2>';
            } else {
                result += '<p>Choose another card to continue!</p>';
            }

            document.getElementById('result').innerHTML = result;
        }

        function resetGame() {
            playerHealth = 20;
            aiHealth = 20;
            document.getElementById('result').innerHTML = '';
        }
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(gameHTML);
});

server.listen(3000, () => {
  console.log('🎮 Crookmon Game server running at http://localhost:3000');
  console.log('✅ Server is working! Open your browser to play!');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
