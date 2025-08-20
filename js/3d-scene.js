/**
 * 3D Scene for Hero Section
 * Creates an interactive 3D dental/orthodontics scene using Three.js
 */

class Hero3DScene {
    constructor() {
        this.container = document.getElementById('hero-3d');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;
        this.objects = [];
        this.lights = [];
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createObjects();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1F7A8C);
        this.scene.fog = new THREE.Fog(0x1F7A8C, 10, 50);
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // Point light for accent
        const pointLight = new THREE.PointLight(0x00C2FF, 0.8, 20);
        pointLight.position.set(-3, 3, 3);
        this.scene.add(pointLight);
        this.lights.push(pointLight);

        // Additional point light
        const pointLight2 = new THREE.PointLight(0xE1F5F7, 0.6, 15);
        pointLight2.position.set(3, 2, -2);
        this.scene.add(pointLight2);
        this.lights.push(pointLight2);
    }

    createObjects() {
        this.createTeeth();
        this.createAligners();
        this.createBrackets();
        this.createParticles();
        this.createFloatingElements();
    }

    createTeeth() {
        // Create a set of teeth using geometry
        const teethGroup = new THREE.Group();
        
        // Upper teeth
        for (let i = 0; i < 8; i++) {
            const tooth = this.createTooth();
            tooth.position.set((i - 3.5) * 0.8, 1.5, 0);
            tooth.rotation.y = (i - 3.5) * 0.1;
            teethGroup.add(tooth);
        }
        
        // Lower teeth
        for (let i = 0; i < 8; i++) {
            const tooth = this.createTooth();
            tooth.position.set((i - 3.5) * 0.8, -1.5, 0);
            tooth.rotation.y = (i - 3.5) * 0.1;
            teethGroup.add(tooth);
        }
        
        this.scene.add(teethGroup);
        this.objects.push(teethGroup);
    }

    createTooth() {
        const geometry = new THREE.CylinderGeometry(0.3, 0.25, 1.2, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0xF8FAFC,
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });
        
        const tooth = new THREE.Mesh(geometry, material);
        tooth.castShadow = true;
        tooth.receiveShadow = true;
        
        return tooth;
    }

    createAligners() {
        // Create transparent aligner shells
        const alignerGroup = new THREE.Group();
        
        for (let i = 0; i < 4; i++) {
            const aligner = this.createAligner();
            aligner.position.set((i - 1.5) * 2, 0, 0);
            aligner.rotation.y = i * 0.2;
            alignerGroup.add(aligner);
        }
        
        this.scene.add(alignerGroup);
        this.objects.push(alignerGroup);
    }

    createAligner() {
        const geometry = new THREE.SphereGeometry(1.5, 16, 12);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00C2FF,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const aligner = new THREE.Mesh(geometry, material);
        aligner.castShadow = true;
        
        return aligner;
    }

    createBrackets() {
        // Create bracket elements
        const bracketGroup = new THREE.Group();
        
        for (let i = 0; i < 6; i++) {
            const bracket = this.createBracket();
            bracket.position.set((i - 2.5) * 1.2, 0, 0);
            bracket.rotation.y = i * 0.3;
            bracketGroup.add(bracket);
        }
        
        this.scene.add(bracketGroup);
        this.objects.push(bracketGroup);
    }

    createBracket() {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshPhongMaterial({
            color: 0x1F7A8C,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const bracket = new THREE.Mesh(geometry, material);
        bracket.castShadow = true;
        
        return bracket;
    }

    createParticles() {
        // Create floating particles
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            colors[i * 3] = Math.random() * 0.5 + 0.5;
            colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
            colors[i * 3 + 2] = 1;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        this.objects.push(particleSystem);
    }

    createFloatingElements() {
        // Create floating geometric elements
        const elementsGroup = new THREE.Group();
        
        // Floating cubes
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshPhongMaterial({
                color: 0xE1F5F7,
                transparent: true,
                opacity: 0.7
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            elementsGroup.add(cube);
        }
        
        // Floating spheres
        for (let i = 0; i < 6; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 8, 6);
            const material = new THREE.MeshPhongMaterial({
                color: 0x00C2FF,
                transparent: true,
                opacity: 0.5
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
            
            elementsGroup.add(sphere);
        }
        
        this.scene.add(elementsGroup);
        this.objects.push(elementsGroup);
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle mouse movement for interactive effects
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Handle touch events for mobile
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }

    handleMouseMove(event) {
        if (!this.camera) return;
        
        const rect = this.container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Gentle camera movement based on mouse position
        this.camera.position.x = x * 0.5;
        this.camera.position.y = y * 0.3 + 2;
        this.camera.lookAt(0, 0, 0);
    }

    handleTouchMove(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseMove(mouseEvent);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        const time = Date.now() * 0.001;
        
        // Animate objects
        this.objects.forEach((object, index) => {
            if (object.type === 'Group') {
                object.rotation.y = time * 0.2 + index * 0.5;
                object.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
            } else if (object.type === 'Points') {
                object.rotation.y = time * 0.1;
            }
        });
        
        // Animate lights
        this.lights.forEach((light, index) => {
            if (light.type === 'PointLight') {
                light.position.x = Math.sin(time * 0.5 + index) * 3;
                light.position.z = Math.cos(time * 0.5 + index) * 3;
            }
        });
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    // Public methods for external control
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    destroy() {
        this.pause();
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        // Dispose of geometries and materials
        this.objects.forEach(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.lights = [];
    }

    // Method to change scene mood/colors
    setMood(mood) {
        const moods = {
            'default': {
                background: 0x1F7A8C,
                ambient: 0x404040,
                directional: 0xffffff,
                accent: 0x00C2FF
            },
            'warm': {
                background: 0x2A9D8F,
                ambient: 0x404040,
                directional: 0xfff4e6,
                accent: 0xF59E0B
            },
            'cool': {
                background: 0x0F4C75,
                ambient: 0x202040,
                directional: 0xe6f3ff,
                accent: 0x4DD0E1
            }
        };
        
        const selectedMood = moods[mood] || moods.default;
        
        if (this.scene) {
            this.scene.background.setHex(selectedMood.background);
        }
        
        if (this.lights[0]) {
            this.lights[0].color.setHex(selectedMood.ambient);
        }
        
        if (this.lights[1]) {
            this.lights[1].color.setHex(selectedMood.directional);
        }
        
        if (this.lights[2]) {
            this.lights[2].color.setHex(selectedMood.accent);
        }
    }
}

// Initialize 3D scene when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        new Hero3DScene();
    } else {
        console.warn('Three.js not loaded. 3D scene will not be available.');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hero3DScene;
}

