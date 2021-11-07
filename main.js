// First let's load three.js
import * as THREE from './resources/threejs/r132/build/three.module.js';

function main(hue, saturation, luminance, numNodes, lineMagnitude, multiplier) {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    /* == CAMERA ===============================================================
     * Next up we need a camera. We'll create a PerspectiveCamera.
     */
    const fov = 40;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 50);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    /* == SCENE ================================================================
     * Next we make a Scene. A Scene in three.js is the root of a form of scene
     * graph. Anything you want three.js to draw needs to be added to the scene.
     */
    const scene = new THREE.Scene();

    /* == LIGHT ================================================================
     */
    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);
    }

    /* == PERIMETER NODES ======================================================
     */
    let zOffset = 0;
    function createPerimeterNodes() {
        const nodes = [];

        nodes.push([0, lineMagnitude, 0]);
        for (let i = 1; i < numNodes; i++) {
            // starting from a vector in the twelve o'clock position
            // u = | 0 |
            //     | m |
            //     | 0 | where m is magnitude
            // our rotated vector up = A * u, where:
            // A = | cos(theta) -sin(theta)  0 |
            //     | sin(theta)  cos(theta)  0 |
            //     | 0           0           1 |
            const theta = (Math.PI * 2) / numNodes;
            const A = [
                [Math.cos(theta), -Math.sin(theta), 0],
                [Math.sin(theta), Math.cos(theta), 0],
                [0, 0, 1]
            ]
            const u = nodes[i - 1]
            const up = [
                (u[0] * A[0][0] + u[1] * A[0][1] + u[2] * A[0][2]),
                (u[0] * A[1][0] + u[1] * A[1][1] + u[2] * A[1][2]),
                (u[0] * A[2][0] + u[1] * A[2][1] + u[2] * A[2][2])
            ]
            up[2] = Math.sin(zOffset) * lineMagnitude;
            zOffset += 1;
            nodes.push(up)
        }
        return nodes;
    }

    const perimeterNodes = createPerimeterNodes();

    /* == LINES =--=============================================================
     */
    const lines = [];

    function addObject(obj) {
        obj.name = `obj${lines.length}`;
        scene.add(obj);
        lines.push(obj);
    }

    function addLineGeometry(fromNode, toNode) {
        const points = [];
        points.push(new THREE.Vector3(...fromNode));
        points.push(new THREE.Vector3(...toNode));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial();
        material.color.setHSL(hue, saturation, luminance);
        const mesh = new THREE.Line(geometry, material);
        addObject(mesh);
    }

    /* == SCREEN RESIZE ========================================================
     */
    // Let's write a function that checks if the renderer's canvas is not
    // already the size it is being displayed as and if so set its size.
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        // don't use HD-DPI - faster but lower res
        //const width = canvas.clientWidth;
        //const height = canvas.clientHeight;
        // use HD-DPI - slower (especially for mobile) but higher res
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;

        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            // Once we know if we need to resize or not we then call
            // renderer.setSize and pass in the new width and height. It's
            // important to pass false at the end. render.setSize by default
            // sets the canvas's CSS size but doing so is not what we want. We
            // want the browser to continue to work how it does for all other
            // elements which is to use CSS to determine the display size of the
            // element. We don't want canvases used by three to be different
            // than other elements.
            renderer.setSize(width, height, false);
        }
        // Note that our function returns true if the canvas was resized. We can
        // use this to check if there are other things we should update.
        return needResize;
    }

    /* == ANIMATE ==============================================================
     * Let's animate it spinning and hopefully that will make it clear it's
     * being drawn in 3D.
     */
    // To animate it we'll render inside a render loop using
    // requestAnimationFrame. Here's our loop.
    let currentProduct = 0;
    let currentMultiplicand = 0;
    function render(time) {
        currentMultiplicand = (currentMultiplicand + 1) % numNodes;
        currentProduct = (currentMultiplicand * multiplier) % numNodes;
        addLineGeometry(
            perimeterNodes[currentMultiplicand],
            perimeterNodes[currentProduct]
        )
        if (lines.length > 2000) {
            const lineToRemove = scene.getObjectByName(lines[0].name);
            scene.remove(lineToRemove);
            lines.shift();
        }
        // Since the aspect is only going to change if the canvas's display size
        // changed we only set the camera's aspect if
        // resizeRendererToDisplaySize returns true.
        if (resizeRendererToDisplaySize(renderer)) {
            // Let's fix distortion of the cubes
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        lines.forEach((obj) => {
            //obj.rotation.y = Math.sin(time * 0.001) * (1 + Math.sin(0.1)) / 16;
            //obj.rotation.x = Math.cos(time * 0.001) * (1 + Math.sin(0.1)) / 16;
        });

        // We can then render the scene by calling the renderer's render
        // function and passing it the scene and the camera
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

{
    // initial conditions
    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    const lineMagnitude = 32;
    const numNodes = Math.floor(Math.random() * 2000) + 96;
    const multiplier = Math.floor(Math.random() * 2000) + 2;

    console.log({
        hue,
        saturation,
        luminance,
        lineMagnitude,
        numNodes,
        multiplier
    });

    main(
        hue,
        saturation,
        luminance,
        numNodes,
        lineMagnitude,
        multiplier
    );
}

