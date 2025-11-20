// WebGL-based morphing implementation

class WebGLMorph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.createContext('webgl') || this.canvas.createContext('experimental-webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    this.setupShaders();
    this.setupGeometry();
    this.setupNoiseTexture();
    this.resize();
  }
  
  setupShaders() {
    const gl = this.gl;
    
    // Vertex shader - simple passthrough
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;
    
    // Fragment shader - displacement effect
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec2 v_texCoord;
      uniform sampler2D u_noise;
      uniform vec2 u_resolution;
      uniform vec2 u_rectPos;      // Rectangle position (normalized)
      uniform vec2 u_rectSize;     // Rectangle size (normalized)
      uniform float u_displacement; // Displacement scale
      
      void main() {
        vec2 coord = v_texCoord;
        
        // Check if we're inside the rectangle
        vec2 relPos = (coord - u_rectPos) / u_rectSize;
        
        if (relPos.x >= 0.0 && relPos.x <= 1.0 && relPos.y >= 0.0 && relPos.y <= 1.0) {
          // Apply displacement
          vec4 noise = texture2D(u_noise, coord);
          vec2 displacement = (noise.rg - 0.5) * u_displacement / u_resolution;
          
          // Sample again with displacement
          relPos = (coord + displacement - u_rectPos) / u_rectSize;
          
          if (relPos.x >= 0.0 && relPos.x <= 1.0 && relPos.y >= 0.0 && relPos.y <= 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black
          } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Transparent
          }
        } else {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Transparent
        }
      }
    `;
    
    // Compile shaders
    const vertexShader = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    // Create program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(this.program));
      return;
    }
    
    // Get attribute/uniform locations
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      texCoord: gl.getAttribLocation(this.program, 'a_texCoord'),
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      rectPos: gl.getUniformLocation(this.program, 'u_rectPos'),
      rectSize: gl.getUniformLocation(this.program, 'u_rectSize'),
      displacement: gl.getUniformLocation(this.program, 'u_displacement'),
      noise: gl.getUniformLocation(this.program, 'u_noise')
    };
  }
  
  compileShader(source, type) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  setupGeometry() {
    const gl = this.gl;
    
    // Full-screen quad
    const positions = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1, 1,   1, -1,   1, 1
    ]);
    
    const texCoords = new Float32Array([
      0, 0,  1, 0,  0, 1,
      0, 1,  1, 0,  1, 1
    ]);
    
    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // TexCoord buffer
    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  }
  
  setupNoiseTexture() {
    const gl = this.gl;
    const size = 512;
    
    // Generate Perlin-like noise (simplified)
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        // Simple noise generation (could be improved with actual Perlin)
        const fx = x / size;
        const fy = y / size;
        const noise1 = Math.sin(fx * Math.PI * 2 * 0.001 * size) * Math.cos(fy * Math.PI * 2 * 0.001 * size);
        const noise2 = Math.sin(fx * Math.PI * 2 * 0.001 * size + Math.PI/4) * Math.cos(fy * Math.PI * 2 * 0.001 * size + Math.PI/4);
        
        data[i] = ((noise1 + 1) / 2) * 255;     // R channel
        data[i + 1] = ((noise2 + 1) / 2) * 255; // G channel
        data[i + 2] = 128;                       // B channel
        data[i + 3] = 255;                       // Alpha
      }
    }
    
    this.noiseTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  render(x, y, width, height, displacementScale) {
    const gl = this.gl;
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    
    // Set up position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
    
    // Set up texCoord attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(this.locations.texCoord);
    gl.vertexAttribPointer(this.locations.texCoord, 2, gl.FLOAT, false, 0, 0);
    
    // Set uniforms
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.locations.rectPos, x / this.canvas.width, y / this.canvas.height);
    gl.uniform2f(this.locations.rectSize, width / this.canvas.width, height / this.canvas.height);
    gl.uniform1f(this.locations.displacement, displacementScale);
    
    // Bind noise texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
    gl.uniform1i(this.locations.noise, 0);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// Export for use in main script
window.WebGLMorph = WebGLMorph;

