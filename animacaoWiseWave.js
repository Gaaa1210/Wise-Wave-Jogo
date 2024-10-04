const options = {
    width: 1920,
    height: 1080,
    backgroundColor: 0xC274A,
    targetSelector: '#stage'
} 


// Função para criar confetes
const createConfetti = (app) => {
    const confettiContainer = new PIXI.Container();
    app.stage.addChild(confettiContainer);

    const colors = [0xFFC0CB, 0xFFFF00, 0x00FF00, 0x00FFFF, 0xFF00FF]; // Cores de confete
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = new PIXI.Graphics();
        confetti.beginFill(colors[Math.floor(Math.random() * colors.length)]);
        confetti.drawRect(0, 0, 10, 20);  // Pequenos confetes retangulares
        confetti.endFill();
        
        confetti.x = Math.random() * options.width;
        confetti.y = Math.random() * -options.height;  // Começa fora da tela (parte superior)

        confettiContainer.addChild(confetti);

        // Animação para cair suavemente
        gsap.to(confetti, {
            y: options.height + 50,  // Confetes caem até fora da tela
            rotation: Math.random() * 2,  // Confetes giram durante a queda
            duration: Math.random() * 2 + 1,  // Duração de queda aleatória para cada confete
            ease: "power1.out",  // Animação suave
            repeat: -1,
            onComplete: () => {
                confetti.y = Math.random() * -options.height;  // Reinicia o confete no topo
            }
        });
    }

    // Parar os confetes após 2 segundos
    setTimeout(() => {
        gsap.to(confettiContainer, {
            alpha: 0,  // Confetes desaparecem gradualmente
            duration: 2,
            onComplete: () => {
                confettiContainer.destroy();  // Remove os confetes do stage
            }
        });
    }, 2000);  // Parar após 2 segundos
}

// Função para criar os blocos de resposta com texto e interatividade
const createResponseBlock = (app, x, y, width, height, radius, text, isCorrect) => {
    const resp = new PIXI.Graphics();
    resp.beginFill(0x4189F2);
    resp.moveTo(x + radius, y); 
    resp.lineTo(width - radius, y);
    resp.arcTo(width, y, width, y + radius, radius); 
    resp.lineTo(width, height - radius);
    resp.arcTo(width, height, width - radius, height, radius);
    resp.lineTo(x + radius, height);
    resp.arcTo(x, height, x, height - radius, radius);
    resp.lineTo(x, y + radius);
    resp.arcTo(x, y, x + radius, y, radius);

    const respText = new PIXI.Text(text, { fontFamily: 'Arial', fontSize: 36, fill: 0xffffff });
    respText.x = (x + width) / 2 - 80;
    respText.y = y + (height - y) / 2 - 20;

    resp.interactive = true;
    resp.buttonMode = true;

    resp.on('pointerdown', () => {
        if (isCorrect) {
            gsap.to(resp, {
                duration: 0.2,
                tint: 0x00FF00,  // Torna o bloco verde
                onComplete: () => {
                    gsap.to(resp, { duration: 0.1, x: '+=10', yoyo: true, repeat: 5 });
                }
            });

            // Inicia a animação de confetes quando a resposta estiver correta
            createConfetti(app);

        } else {
            gsap.to(resp, {
                duration: 0.2,
                tint: 0xFF0000,
                onComplete: () => {
                    gsap.to(resp, { duration: 0.1, x: '+=10', yoyo: true, repeat: 5 });
                }
            });

            setTimeout(() => {
                gsap.to(resp, {
                    duration: 0.2,
                    tint: 0x4189F2,
                    onComplete: () => {
                        resp.clear();
                        resp.beginFill(0x4189F2);
                        resp.moveTo(x + radius, y); 
                        resp.lineTo(width - radius, y);
                        resp.arcTo(width, y, width, y + radius, radius); 
                        resp.lineTo(width, height - radius);
                        resp.arcTo(width, height, width - radius, height, radius);
                        resp.lineTo(x + radius, height);
                        resp.arcTo(x, height, x, height - radius, radius);
                        resp.lineTo(x, y + radius);
                        resp.arcTo(x, y, x + radius, y, radius);
                    }
                });
            }, 2000);  // Volta ao estado normal após 2 segundos
        }
    });

    app.stage.addChild(resp);
    app.stage.addChild(respText);
}

// Função para criar o botão de reinício
const createResetButton = (app, resources) => {
    const button = new PIXI.Graphics();
    button.beginFill(0x4F4F4F);  // Cor vermelha para o botão
    button.drawRoundedRect(1590, 935, 200, 55, 15);  // Desenhar botão com cantos arredondados
    button.endFill();

    const buttonText = new PIXI.Text('Reiniciar', { fontFamily: 'Arial', fontSize: 36, fill: 0xFFFFFF });
    buttonText.x = 1620;
    buttonText.y = 943;

    button.interactive = true;
    button.buttonMode = true;

    button.on('pointerdown', () => {
        restartGame(app, resources);  // Chama a função de reinício quando o botão é clicado
    });

    app.stage.addChild(button);
    app.stage.addChild(buttonText);
}

// Função para reiniciar o jogo
const restartGame = (app, resources) => {
    app.stage.removeChildren();  // Remove todos os elementos do stage
    setupGame(app, resources);   // Configura novamente o jogo
}

// Função principal para configurar o PIXI e criar blocos interativos
const setupGame = (app, resources) => {
    const map = new PIXI.Sprite(resources.map.texture);
    map.x = 700;
    map.y = 210;
    map.width = 500;
    map.height = 500;
    app.stage.addChild(map);

    const radius = 20;
    
    const questionText = new PIXI.Text('Qual é a capital?', { 
        fontFamily: 'Arial', 
        fontSize: 70, 
        fill: 0xFFFFFF,  // Cor do texto (branco)
        align: 'center' 
    });

    questionText.x = (options.width - questionText.width) / 2;  // Centraliza o texto horizontalmente
    questionText.y = 55;  // Define a posição vertical

    app.stage.addChild(questionText);

    const estado = new PIXI.Text('Mato Grosso', {
        fontFamily: 'Arial',
        fontSize: 45,
        fill: 0xFFFFFF,
        aling: 'center'
    });

    estado.x = (options.width - estado.width) / 2;  // Centraliza o texto horizontalmente
    estado.y = 140;  // Define a posição vercal
  app.stage.addChild(estado);

    createResponseBlock(app, 460, 700, 1520, 750, radius, 'Rio Branco', false);  // Ajustei para começar mais abaixo da imagem
    createResponseBlock(app, 460, 780, 1520, 830, radius, 'Macapá', false);  // Ajustei a distância entre os blocos
    createResponseBlock(app, 460, 860, 1520, 910, radius, 'Belo Horizonte', false);  // Ajustei a distância entre os blocos
    createResponseBlock(app, 460, 940, 1520, 990, radius, 'Cuiabá', true);   // Ajustei a distância entre os blocos

    // Cria o botão de reinício
    createResetButton(app, resources);
}

// Função para configurar o PIXI
setup(options, (app, resources) => {
    setupGame(app, resources);  // Chama a função para configurar o jogo
});

