import { createScene } from './scene';

export function createCanvas(container) {
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas-3d';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  
  container.appendChild(canvas);
  const cleanup = createScene(container, canvas);
  
  return { canvas, cleanup };
}