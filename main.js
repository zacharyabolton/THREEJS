// First let's load three.js
import * as THREE from './resources/threejs/r132/build/three.module.js';

function main() {
    // We will ask three.js to draw into that canvas so we need to look it up.
    const canvas = document.querySelector('#c');
    // After we look up the canvas we create a WebGLRenderer. The renderer is
    // the thing responsible for actually taking all the data you provide and
    // rendering it to the canvas.
    const renderer = new THREE.WebGLRenderer({canvas});

    /* == CAMERA ===============================================================
     * Next up we need a camera. We'll create a PerspectiveCamera.
     */
    // fov is short for field of view. In this case 75 degrees in the vertical
    // dimension. Note that most angles in three.js are in radians but for some
    // reason the perspective camera takes degrees.
    const fov = 75;
    // aspect is the display aspect of the canvas: by default a canvas is
    // 300x150 pixels which makes the aspect 300/150 or 2.
    const aspect = 2;  // the canvas default
    // near and far represent the space in front of the camera that will be
    // rendered. Anything before that range or after that range will be clipped
    // (not drawn).
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // The camera defaults to looking down the -Z axis with +Y up. We'll put our
    // cube at the origin so we need to move the camera back a little from the
    // origin in order to see anything.
    camera.position.z = 2;

    /* == SCENE ================================================================
     * Next we make a Scene. A Scene in three.js is the root of a form of scene
     * graph. Anything you want three.js to draw needs to be added to the scene.
     */
    const scene = new THREE.Scene();

    /* == LIGHT ================================================================
     * Let's create a directional light.
     */
    {
        // Directional lights have a position and a target. Both default to
        // 0, 0, 0. In our case we're setting the light's position to
        // -1, 2, 4 so it's slightly on the left, above, and behind our camera.
        // The target is still 0, 0, 0 so it will shine toward the origin.
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    /* == BOX ==================================================================
     * Next up we create a BoxGeometry which contains the data for a box. Almost
     * anything we want to display in Three.js needs geometry which defines the
     * vertices that make up our 3D object.
     */
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // We'll make a function that creates a new material with the specified
    // color. Then it creates a mesh using the specified geometry and adds it to
    // the scene and sets its X position.
    function makeInstance(geometry, color, x) {
        // We create a basic material and set its color. Colors can be
        // specified using standard CSS style 6 digit hex color values.
        const material = new THREE.MeshPhongMaterial({color});
        // We then create a Mesh. A Mesh in three represents the combination of
        // three things
        //
        // 1. A Geometry (the shape of the object)
        // 2. A Material (how to draw the object, shiny or flat, what color,
        // what texture(s) to apply. Etc.)
        // 3. The position, orientation, and scale of that object in the scene
        // relative to its parent. In the code below that parent is the scene.
        const cube = new THREE.Mesh(geometry, material);
        // And finally we add that mesh to the scene
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }

    // Then we'll call it 3 times with 3 different colors and X positions saving
    // the Mesh instances in an array.
    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

    /* == ANIMATE ==============================================================
     * Let's animate it spinning and hopefully that will make it clear it's
     * being drawn in 3D.
     */
    // To animate it we'll render inside a render loop using
    // requestAnimationFrame. Here's our loop.
    function render(time) {
        time *= 0.001;  // convert time to seconds

        // Finally we'll spin all 3 cubes in our render function. We compute a
        // slightly different rotation for each one.
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        /* == RENDER ===========================================================
         * We can then render the scene by calling the renderer's render
         * function and passing it the scene and the camera
         */
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();

// TODO
// https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html
