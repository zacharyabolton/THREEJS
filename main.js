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

    /* == BOX ==================================================================
     * Next up we create a BoxGeometry which contains the data for a box. Almost
     * anything we want to display in Three.js needs geometry which defines the
     * vertices that make up our 3D object.
     */
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    // We then create a basic material and set its color. Colors can be
    // specified using standard CSS style 6 digit hex color values.
    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
    // We then create a Mesh. A Mesh in three represents the combination of a
    // three things
    //
    // 1. A Geometry (the shape of the object)
    // 2. A Material (how to draw the object, shiny or flat, what color, what
    // texture(s) to apply. Etc.)
    // 3. The position, orientation, and scale of that object in the scene
    // relative to its parent. In the code below that parent is the scene.
    const cube = new THREE.Mesh(geometry, material);
    // And finally we add that mesh to the scene
    scene.add(cube);
    /* == RENDER ===============================================================
     * We can then render the scene by calling the renderer's render function
     * and passing it the scene and the camera
     */
    renderer.render(scene, camera);
}

main();

