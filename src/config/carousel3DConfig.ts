import AlcoplastImg from '../assets/marcas/Alcoplast.svg';
import ArchitexImg from '../assets/marcas/Architex.svg';
import AvientImg from '../assets/marcas/Avient.svg';
import KiwoImg from '../assets/marcas/Kiwo.svg';
import PrintopImg from '../assets/marcas/Printop.svg';
import UlanoImg from '../assets/marcas/Ulano.svg';

export const BRANDS_CONFIG = {
  brands: ['Alcoplast', 'Architex', 'Avient', 'Kiwo', 'Printop', 'Ulano'],
  brandImagesMap: {
    Alcoplast: AlcoplastImg,
    Architex: ArchitexImg,
    Avient: AvientImg,
    Kiwo: KiwoImg,
    Printop: PrintopImg,
    Ulano: UlanoImg
  }
};

export const SCENE_CONFIG = {
  camera: {
    position: [0, 1, 13.5],
    fov: 60
  },
  ring: {
    radius: 7,
    rotationSpeed: 0.001,
    animationDuration: 30
  },
  stars: {
    count: 250,
    spread: 40,
    size: {
      min: 0.01,
      max: 0.05
    },
    colors: {
      primary: "#ffffff",
      accent: "#DAA520"
    }
  },
  lights: {
    ambient: {
      intensity: 0.6
    },
    point: {
      position: [10, 10, 10],
      intensity: 0.6
    }
  },
  controls: {
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: Math.PI / 1.8,
    dampingFactor: 0.05
  }
};