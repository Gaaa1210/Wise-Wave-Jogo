const setup = (options, onReady) => {
    const settings = {
        width: options.width,
        height: options.height,
        backgroundColor: options.backgroundColor,
        antialias: true
    }

    let app;

    if (PIXI.utils.isWebGLSupported()) {
        console.log('yes');
        app = new PIXI.Application(settings);
    } else {
        settings.forceCanvas = true;
        console.log('no');
        app = new PIXILegacy.Application(settings);
    }

    // Append the app view to the target selector
    document.querySelector(options.targetSelector).appendChild(app.view);

    // Register GSAP plugins for PIXI
    PixiPlugin.registerPIXI(PIXI);
    gsap.registerPlugin(PixiPlugin);

    // Create a loader instance
    const loader = new PIXI.Loader();

    // Load the map resource
    loader.add('map', 'images/mapaoficial.png');

    // Ensure the resources are passed to the onReady function
    loader.load((loader, resources) => {
        onReady(app, resources);  // Pass 'app' and 'resources' to onReady
    });
}
