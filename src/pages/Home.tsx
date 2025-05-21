import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { ChevronDown, UtensilsCrossed, Calendar, Star } from 'lucide-react';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create a group for all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create particles 
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 500;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorOptions = [
      new THREE.Color(0x9c2a2a), // Primary
      new THREE.Color(0xe09f3e), // Secondary
      new THREE.Color(0x335c67), // Accent
    ];
    
    for (let i = 0; i < count * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
      
      // Color
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i] = randomColor.r;
      colors[i + 1] = randomColor.g;
      colors[i + 2] = randomColor.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      alphaMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'),
      vertexColors: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);
    
    // Camera position
    camera.position.z = 6;
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the entire group
      group.rotation.y += 0.001;
      group.rotation.x += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
      ></canvas>
      
      <div className="min-h-screen relative">
        {/* Hero Section */}
        <section className="min-h-screen bg-gradient-to-b from-gray-900/70 to-gray-900/40 flex items-center justify-center text-white px-4 py-24">
          <div className="container mx-auto text-center max-w-3xl">
            <motion.h1
              className="text-5xl md:text-6xl font-serif font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Fine Dining <span className="text-secondary">Redefined</span>
            </motion.h1>
            
            <motion.p
              className="text-xl mb-8 text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience culinary excellence at Flavens, where passion meets 
              tradition in every dish we serve.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/menu" className="btn btn-primary min-w-36">
                View Menu
              </Link>
              
              <Link to="/reservation" className="btn btn-outline border-white text-white hover:bg-white hover:text-gray-900 min-w-36">
                Reserve a Table
              </Link>
            </motion.div>
            
            <motion.a
              href="#about"
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ y: 5 }}
            >
              <ChevronDown size={36} strokeWidth={1} />
            </motion.a>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-20 bg-white px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Story</h2>
              <div className="h-1 w-24 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Chef preparing food" 
                  className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                />
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-bold mb-4">
                  Culinary Passion Since 2010
                </h3>
                
                <p className="mb-4">
                  Flavens was born from a simple yet profound vision: to create extraordinary 
                  dining experiences that celebrate the richness of traditional cuisine 
                  while embracing modern culinary innovations.
                </p>
                
                <p className="mb-6">
                  Our team of passionate chefs, led by renowned Chef Michaela Laurent, 
                  sources only the finest seasonal ingredients to craft dishes that tell 
                  a story with every bite.
                </p>
                
                <Link to="/menu" className="btn btn-primary">
                  Explore Our Menu
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose Us</h2>
              <div className="h-1 w-24 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center p-8">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                  <UtensilsCrossed className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Exquisite Cuisine</h3>
                <p className="text-gray-600">
                  Our menu features a carefully curated selection of dishes prepared with the finest ingredients.
                </p>
              </div>
              
              <div className="card text-center p-8">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                  <Calendar className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Reservations</h3>
                <p className="text-gray-600">
                  Book your table online in seconds and receive instant confirmation.
                </p>
              </div>
              
              <div className="card text-center p-8">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                  <Star className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Experience</h3>
                <p className="text-gray-600">
                  Elegant ambiance and exceptional service for a memorable dining experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-hero-pattern bg-cover bg-center text-white px-4 relative">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto max-w-3xl relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready for an Unforgettable Dining Experience?
            </h2>
            
            <p className="text-xl mb-8 text-gray-200">
              Join us at Flavens and embark on a culinary journey that will 
              tantalize your taste buds and create lasting memories.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/reservation" className="btn btn-primary min-w-36">
                Reserve Now
              </Link>
              
              <Link to="/menu" className="btn btn-outline border-white text-white hover:bg-white hover:text-gray-900 min-w-36">
                View Menu
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;